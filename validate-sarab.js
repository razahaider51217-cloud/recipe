/* Validation for the production Sarab site. Run: node validate-sarab.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'sarab');
const pages = ['index.html', 'privacy-policy.html', 'terms.html', '404.html', 'recipes.html', 'locations.html', 'checkout.html'];
const recipeFiles = fs.readdirSync(path.join(ROOT, 'recipes')).filter(function (f) {
   return f.endsWith('.html');
});
recipeFiles.forEach(function (f) { pages.push('recipes/' + f); });
console.log('Validating ' + pages.length + ' pages (' + recipeFiles.length + ' recipe pages)');
let errors = 0;
const warn = [];

function check(cond, msg) {
   if (!cond) { errors++; console.log('FAIL  ' + msg); }
   else { console.log('ok    ' + msg); }
}

pages.forEach(function (page) {
   const file = path.join(ROOT, page);
   if (!fs.existsSync(file)) { errors++; console.log('FAIL  missing page: ' + page); return; }
   const html = fs.readFileSync(file, 'utf8');
   console.log('\n=== ' + page + ' (' + html.split('\n').length + ' lines, ' + html.length + ' bytes) ===');

   /* local assets exist */
   const refs = new Set();
   const re = /(?:src|href)="([^"]+)"/g;
   let m;
   while ((m = re.exec(html)) !== null) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
      refs.add(url.split('#')[0].split('?')[0]);
   }
   let bad = 0;
   refs.forEach(function (ref) {
      const target = path.join(path.dirname(file), ref);
      if (!fs.existsSync(target)) { bad++; console.log('FAIL  broken local ref in ' + page + ': ' + ref); }
   });
   errors += bad;
   console.log('ok    ' + refs.size + ' local references checked (' + bad + ' broken)');

   /* tag balance for the tags we touched */
   ['div', 'section', 'footer', 'body', 'html', 'head', 'script', 'iframe'].forEach(function (tag) {
      const open = (html.match(new RegExp('<' + tag + '(?=[\\s>])', 'g')) || []).length;
      const close = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
      if (open !== close) {
         errors++;
         console.log('FAIL  <' + tag + '> unbalanced in ' + page + ': ' + open + ' open vs ' + close + ' close');
      }
   });
   console.log('ok    tag balance verified (div/section/footer/body/html/head/script/iframe)');

   /* leftover demo / template content */
   const leftovers = [
      'HTML Template', 'Flavor Street', '123-4567', '42 Flavor', '918) 555', '917) 555',
      'lorem ipsum', 'Lorem Ipsum', 'Your Company', 'example.com/github.io'
   ];
   leftovers.forEach(function (s) {
      if (html.toLowerCase().indexOf(s.toLowerCase()) !== -1) {
         errors++;
         console.log('FAIL  demo leftover "' + s + '" still in ' + page);
      }
   });
   console.log('ok    no demo leftovers');
});

/* JSON-LD must parse */
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const blocks = idx.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
check(blocks.length >= 2, 'index.html contains ' + blocks.length + ' JSON-LD blocks (expected >= 2)');
blocks.forEach(function (b, i) {
   const json = b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
   try {
      const obj = JSON.parse(json);
      console.log('ok    JSON-LD block ' + (i + 1) + ' parses as ' + obj['@type']);
   } catch (e) {
      errors++;
      console.log('FAIL  JSON-LD block ' + (i + 1) + ' is invalid JSON: ' + e.message);
   }
});

/* keyword coverage */
const kws = ['cheap recipes', 'cheap dinner recipes', 'budget friendly meals', 'easy weeknight',
   'budget meal prep', 'affordable family meals', 'cheap eats'];
kws.forEach(function (k) {
   const found = idx.toLowerCase().indexOf(k.toLowerCase()) !== -1;
   if (!found) warn.push('keyword not present in index.html: ' + k);
   console.log((found ? 'ok  ' : 'WARN') + '  keyword coverage: ' + k);
});

/* required SEO files */
['robots.txt', 'sitemap.xml', '.nojekyll', 'img/favicon.svg', 'js/consent.js',
 'privacy-policy.html', 'terms.html', '404.html'].forEach(function (f) {
   check(fs.existsSync(path.join(ROOT, f)), 'file present: ' + f);
});

/* unified NAP consistency */
const phones = (idx.match(/\+1 \(212\) 555-0134/g) || []).length;
const addr = (idx.match(/1420 Madison Avenue/g) || []).length;
check(phones >= 5, 'unified phone number appears ' + phones + ' times');
check(addr >= 4, 'unified address appears ' + addr + ' times');
check(idx.indexOf('G-XXXXXXXXXX') !== -1 && idx.indexOf('AW-XXXXXXXXXX') !== -1,
   'GA4 + Google Ads placeholders present');

/* ---- recipe specific checks ---- */
const recipeDir = path.join(ROOT, 'recipes');
recipeFiles.forEach(function (f) {
   const html = fs.readFileSync(path.join(recipeDir, f), 'utf8');
   const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
   check(blocks.length >= 2, f + ': has Recipe + Breadcrumb JSON-LD');
   let recipe = null;
   blocks.forEach(function (b) {
      const json = b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const obj = JSON.parse(json);
      if (obj['@type'] === 'Recipe') recipe = obj;
   });
   if (!recipe) { errors++; console.log('FAIL  ' + f + ': no Recipe schema found'); return; }
   check(!!recipe.name && Array.isArray(recipe.image) && recipe.image.length > 0, f + ': Recipe name + image present');
   check((recipe.recipeIngredient || []).length >= 5, f + ': ' + (recipe.recipeIngredient || []).length + ' ingredients in schema');
   check((recipe.recipeInstructions || []).length >= 5, f + ': ' + (recipe.recipeInstructions || []).length + ' instruction steps in schema');
   check(!!recipe.nutrition && !!recipe.nutrition.calories, f + ': nutrition calories present');
   check(!!recipe.totalTime && !!recipe.prepTime && !!recipe.cookTime, f + ': prep/cook/total time present');
   check(recipe.estimatedCost && !isNaN(parseFloat(recipe.estimatedCost.value)), f + ': estimated cost = $' + (recipe.estimatedCost || {}).value + ' per serving');
   check(html.indexOf('tel:+12125550134') !== -1, f + ': call CTA with unified phone number');
   check(html.indexOf('1420 Madison Avenue') !== -1, f + ': NAP address in footer');
});

/* ---- cross linking ---- */
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
check(home.indexOf('href="recipes.html"') !== -1, 'homepage links to the recipe hub');
let linked = 0;
recipeFiles.forEach(function (f) {
   if (home.indexOf('recipes/' + f) !== -1) linked++;
});
check(linked >= 3, 'homepage links to ' + linked + ' individual recipes');

const hub = fs.readFileSync(path.join(ROOT, 'recipes.html'), 'utf8');
let hubLinked = 0;
recipeFiles.forEach(function (f) {
   if (hub.indexOf('recipes/' + f) !== -1) hubLinked++;
});
check(hubLinked === recipeFiles.length, 'recipe hub links to all ' + hubLinked + ' recipes');

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
let inSitemap = 0;
recipeFiles.forEach(function (f) {
   if (sitemap.indexOf('recipes/' + f) !== -1) inSitemap++;
});
check(inSitemap === recipeFiles.length, 'sitemap lists all ' + inSitemap + ' recipe URLs');
check(sitemap.indexOf('/recipes.html') !== -1, 'sitemap lists the recipe hub');

/* ---- cart / checkout / branches wiring ---- */
const checkout = fs.readFileSync(path.join(ROOT, 'checkout.html'), 'utf8');
const locations = fs.readFileSync(path.join(ROOT, 'locations.html'), 'utf8');
const cartJs = fs.readFileSync(path.join(ROOT, 'js', 'cart.js'), 'utf8');
const bookingJs = fs.readFileSync(path.join(ROOT, 'js', 'booking.js'), 'utf8');
const branchesJs = fs.readFileSync(path.join(ROOT, 'js', 'branches.js'), 'utf8');

/* cart engine */
['window.SarabCart', 'add: function', 'setQty: function', 'remove: function', 'totals: function',
 'initCheckout', 'addFromPopup', 'localStorage'].forEach(function (k) {
   check(cartJs.indexOf(k) !== -1, 'cart.js implements ' + k);
});
check(cartJs.indexOf("document.getElementById('cartCount')") === -1, 'cart.js does not depend on the removed #cartCount element');
check(checkout.indexOf('id="checkoutForm"') !== -1, 'checkout.html has the checkout form');
['ckBranch', 'ckItems', 'ckSub', 'ckDel', 'ckTax', 'ckTotal', 'ckPromo', 'ckPromoBtn', 'ckPlace', 'ckDone',
 'ckMailLink', 'ckCallLink', 'ckName', 'ckPhone', 'ckAddress', 'ckCity', 'ckZip', 'ckWhen', 'ckPromoMsg',
 'ckError', 'ckDoneSummary', 'ckRef', 'ckEta', 'ckPayNote', 'ckDeliveryFields'].forEach(function (id) {
   check(checkout.indexOf('id="' + id + '"') !== -1, 'checkout.html element #' + id);
});
check((checkout.match(/name="ordertype"/g) || []).length === 3, 'checkout.html has 3 order types (delivery/pickup/dine-in)');
check((checkout.match(/name="payment"/g) || []).length === 3, 'checkout.html has 3 payment methods');
check(checkout.indexOf('js/cart.js') !== -1 && checkout.indexOf('js/branches.js') !== -1, 'checkout.html loads cart.js + branches.js');

/* homepage wiring */
check(home.indexOf('id="navCartBtn"') !== -1, 'homepage has a navbar cart button');
check(cartJs.indexOf('injectCardButtons') !== -1 && cartJs.indexOf('mcart') !== -1,
   'cart.js injects an add-to-cart button into every menu card');
check((home.match(/class="mcard"/g) || []).length === 6, 'homepage has ' + (home.match(/class="mcard"/g) || []).length + ' menu cards for the cart to wire up');
check(home.indexOf('js/cart.js') !== -1 && home.indexOf('js/booking.js') !== -1 && home.indexOf('js/branches.js') !== -1,
   'homepage loads cart.js, booking.js and branches.js');
check(home.indexOf('data-booking-form') !== -1 && home.indexOf('id="bookingForm"') !== -1, 'homepage has the branch aware booking form');
check(home.indexOf('id="bkBranch"') !== -1 && home.indexOf('name="branch"') !== -1, 'homepage booking form has a branch selector');
check(home.indexOf('id="bkDone"') !== -1 && home.indexOf('id="bkMailLink"') !== -1, 'homepage booking form has a confirmation panel');
check(home.indexOf('id="branches"') !== -1, 'homepage has the branches section');
check((home.match(/data-book-branch="/g) || []).length === 8, 'homepage offers booking at ' + (home.match(/data-book-branch="/g) || []).length + ' branches');
check(home.indexOf('href="checkout.html"') !== -1 && home.indexOf('href="locations.html"') !== -1, 'homepage links to checkout + locations');
check((home.match(/<option value="[a-z-]+">/g) || []).length >= 8, 'homepage reservation select is populated with the branches');

/* branch data + booking engine */
const branchCount = (branchesJs.match(/"id":/g) || []).length;
check(branchCount === 8, 'branches.js exports ' + branchCount + ' branches');
['USA', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami Beach', 'Atlanta', 'Seattle', 'Austin'].forEach(function (city) {
   check(locations.indexOf(city) !== -1, 'locations.html lists ' + city);
});
check((locations.match(/class="brcard/g) || []).length === 8, 'locations.html has ' + (locations.match(/class="brcard/g) || []).length + ' branch cards');
check((locations.match(/data-book-branch="/g) || []).length >= 8, 'every branch card can book a table');
check(locations.indexOf('id="booking"') !== -1 && locations.indexOf('data-booking-form') !== -1, 'locations.html has the booking section');
check((locations.match(/tel:\+1/g) || []).length >= 8, 'locations.html has click to call links per branch');
check((locations.match(/google\.com\/maps/g) || []).length >= 8, 'locations.html has directions/map links per branch');
['findBranch', 'makeRef', 'generate_lead', 'mailto:', 'data-book-branch', 'data-booking-form'].forEach(function (k) {
   check(bookingJs.indexOf(k) !== -1, 'booking.js implements ' + k);
});
const locBlocks = locations.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
let restaurantCount = 0;
locBlocks.forEach(function (b) {
   const obj = JSON.parse(b.replace(/<script[^>]*>/, '').replace(/<\/script>/, ''));
   (obj['@graph'] || []).forEach(function (n) { if (n['@type'] === 'Restaurant') restaurantCount++; });
});
check(restaurantCount === 8, 'locations.html exposes ' + restaurantCount + ' Restaurant entities in JSON-LD');

/* ---- Node host / Heroku readiness ---- */
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
check(!!(pkg.scripts && pkg.scripts.start), 'package.json defines scripts.start ("' + ((pkg.scripts || {}).start) + '")');
check(/^\d+\.x$/.test((pkg.engines || {}).node || ''), 'engines.node pinned to one LTS major (' + ((pkg.engines || {}).node) + ')');
check(!!pkg.main, 'package.json main entry present (' + pkg.main + ')');
check(String(pkg.name).indexOf('scareware') === -1, 'package.json no longer carries the old project name');
check(fs.existsSync(path.join(ROOT, 'Procfile')), 'Procfile exists');
check(fs.readFileSync(path.join(ROOT, 'Procfile'), 'utf8').trim() === 'web: node server.js',
   'Procfile declares the Heroku web process');
check(fs.existsSync(path.join(ROOT, 'server.js')), 'server.js exists');
const srv = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
check(srv.indexOf('process.env.PORT') !== -1, 'server.js listens on the $PORT Heroku provides');
check(srv.indexOf('0.0.0.0') !== -1, 'server.js binds to 0.0.0.0 (required by dynos)');
check(srv.indexOf("require('http')") !== -1 && srv.indexOf("require('./") === -1, 'server.js is dependency free');
check(srv.indexOf('404.html') !== -1, 'server.js falls back to the custom 404 page');
check(fs.existsSync(path.join(ROOT, 'README.md')), 'README.md documents local run + deployment');

console.log('\n================ RESULT ================');
console.log(errors === 0 ? 'PASS - ' + errors + ' errors' : 'FAILED - ' + errors + ' errors');
if (warn.length) warn.forEach(function (w) { console.log('warn: ' + w); });
process.exit(errors === 0 ? 0 : 1);
