/* Recipe page generator for the Sarab production site.
   Run: node build-recipes.js   (writes sarab/recipes/*.html + sarab/recipes.html)
   Single source of truth for the recipes, their schema.org markup and internal links. */
const fs = require('fs');
const path = require('path');

const SITE = 'https://sarabfood.com';
const ROOT = path.join(__dirname, 'sarab');
const OUT = path.join(ROOT, 'recipes');
const DATE = '2026-09-14';

const RECIPES = [];
require('./recipes-data-2.js').forEach(function (r) { RECIPES.push(r); });
require('./recipes-data-3.js').forEach(function (r) { RECIPES.push(r); });
RECIPES.push({
   slug: 'cheap-smash-burger-recipe',
   h1: 'Cheap Smash Burger Recipe (Under $3 a Serving)',
   shortTitle: 'Cheap Smash Burger',
   pageTitle: 'Cheap Smash Burger Recipe (Under $3 a Serving) | Sarab',
   ogTitle: 'Cheap Smash Burger Recipe - Under $3 a Serving',
   metaDesc: 'Learn how to make a juicy restaurant-style smash burger at home for under $3 a serving. Twenty minutes, 9 cheap ingredients and the same crispy-edge method we use at Sarab in New York.',
   keywords: 'cheap smash burger recipe, cheap burger recipe, budget burger recipe, easy burger recipe, cheap dinner recipes, meals under 3 dollars, ground beef recipes, fast food recipes at home',
   image: 'img/menu/1.jpg',
   imageAlt: 'Cheap smash burger with cheddar cheese, onions and pickles',
   schemaImage: 'img/menu/1.jpg',
   totalTimeLabel: '20 min',
   costPerServing: '$2.88',
   costTotal: '$11.50',
   servings: 4,
   prep: 'PT10M', cook: 'PT10M', total: 'PT20M',
   category: 'Main Course',
   cuisine: 'American',
   rating: '4.9', reviews: '128',
   chips: ['20 minutes', '$2.88 per serving', '4 burgers', 'Kid friendly'],
   intro: 'A smash burger is the cheapest way to eat like you are at a restaurant. You need very little beef, a screaming hot pan and a hard press - the crust does the rest. This is the exact method our line cooks use at Sarab, scaled down for a home kitchen and priced at $2.88 a serving.',
   whyCheap: [
      'Ground beef is the cheapest protein per gram - you only need 4 oz per burger.',
      'No special equipment: one heavy frying pan and a stiff spatula are enough.',
      'Bread, onions and pickles cost pennies and stretch the meal to four servings.'
   ],
   ingredients: [
      '1 lb (450 g) ground beef, 80/20 blend - $5.49',
      '4 brioche or sesame buns - $3.29',
      '4 slices American or cheddar cheese - $0.79',
      '1 small onion, thinly sliced - $0.60',
      '3 tbsp pickles - $0.45',
      '3 tbsp mayonnaise, 1 tbsp ketchup, 1 tsp mustard (special sauce) - $0.38',
      '1 tbsp butter, softened - $0.20',
      'Kosher salt and coarse black pepper - $0.30',
      'Optional: lettuce, tomato or jalapenos from the fridge'
   ],
   steps: [
      'Divide the beef into 4 loose balls of about 4 oz each. Do not compact them - loose piles smash better and stay juicy.',
      'Mix the mayonnaise, ketchup and mustard in a small bowl and set the special sauce aside. Split and butter the buns.',
      'Heat a heavy frying pan or flat griddle over high heat for 3 minutes until a drop of water sizzles instantly.',
      'Place one beef ball in the pan and immediately press it flat with a stiff spatula for 10 seconds. Season with salt and pepper.',
      'Cook for 90 seconds until the edges are dark and lacy, then scrape underneath, flip once and add a cheese slice. Cook 30 seconds more.',
      'Toast the buttered buns cut-side down in the same pan for 45 seconds, then build: sauce, pickles, onion, patty, lettuce.',
      'Rest the burgers for 1 minute before serving so the juices settle back into the meat.'
   ],
   tips: [
      'Press only once. Pressing again squeezes out the juice that makes a smash burger taste expensive.',
      'Do not salt the beef before it hits the pan - early salt makes the patty dense and rubbery.',
      'No cast iron? Use the heaviest pan you own and never crowd it - two patties at a time maximum.',
      'Scale up: the same mix makes 12 sliders for about $26, ideal for a cheap game-night spread.'
   ],
   nutrition: [
      ['Calories', '620 kcal'],
      ['Protein', '34 g'],
      ['Carbohydrates', '32 g'],
      ['Fat', '38 g'],
      ['Saturated fat', '15 g'],
      ['Sodium', '780 mg'],
      ['Fibre', '2 g'],
      ['Sugar', '6 g']
   ],
   costRows: [
      ['Ground beef, 1 lb', '$5.49'],
      ['Buns x4', '$3.29'],
      ['Cheese x4', '$0.79'],
      ['Onion', '$0.60'],
      ['Pickles', '$0.45'],
      ['Sauce, butter and seasoning', '$0.88']
   ]
});

RECIPES.push({
   slug: 'budget-margherita-pizza-recipe',
   h1: 'Budget Margherita Pizza Recipe ($2 Per Person)',
   shortTitle: 'Budget Margherita Pizza',
   pageTitle: 'Budget Margherita Pizza Recipe ($2 Per Person) | Sarab',
   ogTitle: 'Budget Margherita Pizza - $2 Per Person',
   metaDesc: 'Homemade margherita pizza for about $2 a person. A no-fuss 30-minute dough, tinned tomatoes, mozzarella and basil - the cheapest pizza night recipe from the Sarab kitchen in New York.',
   keywords: 'budget pizza recipe, cheap pizza dough recipe, margherita pizza recipe, easy pizza at home, cheap family meals, recipes under 5 dollars, cheap dinner recipes',
   image: 'img/menu/2.jpg',
   imageAlt: 'Budget margherita pizza with mozzarella and basil',
   schemaImage: 'img/menu/2.jpg',
   totalTimeLabel: '30 min',
   costPerServing: '$2.00',
   costTotal: '$8.00',
   servings: 4,
   prep: 'PT18M', cook: 'PT12M', total: 'PT30M',
   category: 'Main Course',
   cuisine: 'Italian',
   rating: '4.8', reviews: '95',
   chips: ['30 minutes', '$2.00 per serving', '2 pizzas', 'Vegetarian'],
   intro: 'Pizza night does not have to cost $25 a head. A tin of tomatoes, one ball of mozzarella and a fast 30-minute dough make two proper margherita pizzas for about $8 - roughly $2 per person and far cheaper than delivery.',
   whyCheap: [
      'Flour, yeast and salt cost about $0.62 for both bases.',
      'Tinned San Marzano style tomatoes beat expensive fresh ones for flavour and price.',
      'Half a ball of mozzarella per pizza is plenty when you stretch it with grated parmesan.'
   ],
   ingredients: [
      '2 cups (250 g) all-purpose flour - $0.28',
      '1 tsp instant yeast - $0.07',
      '1 tsp sugar and 1 tsp salt - $0.05',
      '2 tbsp olive oil - $0.22',
      '150 ml warm water',
      '1 tin (400 g) crushed tomatoes - $1.19',
      '1 clove garlic, grated - $0.10',
      '125 g fresh mozzarella, torn - $1.99',
      '2 tbsp grated parmesan - $0.55',
      'Handful of fresh basil - $1.20',
      'Dried oregano and chilli flakes - $0.05'
   ],
   steps: [
      'Stir the flour, yeast, sugar and salt together, add the olive oil and warm water, then knead for 5 minutes until smooth.',
      'Cover the dough and let it rest while the oven heats to its highest setting (250C / 480F) with a tray or pizza stone inside.',
      'Warm the crushed tomatoes with the grated garlic, a pinch of salt and the oregano - do not cook them down, keep the sauce bright.',
      'Split the dough into 2 balls and stretch each one on a floured sheet of baking paper to about 25 cm wide.',
      'Spread 3-4 tbsp of sauce per base, leaving a 2 cm border, then scatter over the mozzarella and parmesan.',
      'Bake 6-7 minutes each until the crust is spotted and the cheese bubbles.',
      'Finish with torn basil, a drizzle of olive oil and chilli flakes, then slice and serve straight away.'
   ],
   tips: [
      'Bake on the lowest shelf for a crisp base, then give it 1 minute under the grill for colour.',
      'Cheap mozzarella releases water - pat it dry with kitchen paper so the middle does not go soggy.',
      'No pizza stone? An upturned preheated baking tray works just as well.',
      'Freeze the second stretched base on its paper and bake it another night for an instant cheap dinner.'
   ],
   nutrition: [
      ['Calories', '480 kcal'],
      ['Protein', '19 g'],
      ['Carbohydrates', '62 g'],
      ['Fat', '17 g'],
      ['Saturated fat', '7 g'],
      ['Sodium', '690 mg'],
      ['Fibre', '4 g'],
      ['Sugar', '6 g']
   ],
   costRows: [
      ['Dough ingredients', '$0.62'],
      ['Crushed tomatoes', '$1.19'],
      ['Garlic', '$0.10'],
      ['Fresh mozzarella 125 g', '$1.99'],
      ['Parmesan', '$0.55'],
      ['Basil, oil and spices', '$1.55'],
      ['Total for 2 pizzas', '$8.00']
   ]
});


/* ---------------- shared partials ---------------- */
const CONSENT_HEAD = [
   '      <!-- Google Consent Mode v2 + GA4 / Google Ads (replace both placeholder IDs) -->',
   '      <script>',
   '         window.dataLayer = window.dataLayer || [];',
   '         function gtag(){dataLayer.push(arguments);}',
   "         gtag('consent', 'default', {",
   "            'ad_storage': 'denied',",
   "            'ad_user_data': 'denied',",
   "            'ad_personalization': 'denied',",
   "            'analytics_storage': 'denied',",
   "            'wait_for_update': 500",
   '         });',
   "         gtag('js', new Date());",
   "         gtag('config', 'G-XXXXXXXXXX', { 'anonymize_ip': true });",
   "         gtag('config', 'AW-XXXXXXXXXX');",
   '      </script>',
   '      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>'
].join('\n');

function head(o) {
   return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '   <head>',
      '      <meta charset="UTF-8">',
      '      <meta name="viewport" content="width=device-width, initial-scale=1">',
      '      <title>' + o.pageTitle + '</title>',
      '      <meta name="description" content="' + o.metaDesc + '">',
      '      <meta name="keywords" content="' + o.keywords + '">',
      '      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">',
      '      <meta name="author" content="Sarab Fast Food &amp; Restaurant">',
      '      <meta name="theme-color" content="#e8281a">',
      '      <link rel="canonical" href="' + o.canonical + '">',
      '      <link rel="icon" type="image/svg+xml" href="' + o.asset + 'img/favicon.svg">',
      '      <meta property="og:type" content="' + (o.ogType || 'article') + '">',
      '      <meta property="og:site_name" content="Sarab Fast Food &amp; Restaurant">',
      '      <meta property="og:title" content="' + (o.ogTitle || o.pageTitle) + '">',
      '      <meta property="og:description" content="' + o.metaDesc + '">',
      '      <meta property="og:url" content="' + o.canonical + '">',
      '      <meta property="og:image" content="' + SITE + '/' + o.schemaImage + '">',
      '      <meta property="og:locale" content="en_US">',
      '      <meta name="twitter:card" content="summary_large_image">',
      '      <meta name="twitter:title" content="' + (o.ogTitle || o.pageTitle) + '">',
      '      <meta name="twitter:description" content="' + o.metaDesc + '">',
      '      <meta name="twitter:image" content="' + SITE + '/' + o.schemaImage + '">',
      '      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">',
      '      <link href="' + o.asset + 'css/bootstrap.min.css" rel="stylesheet">',
      '      <link rel="stylesheet" href="' + o.asset + 'css/all.min.css">',
      '      <link rel="stylesheet" href="' + o.asset + 'css/style.css">',
      CONSENT_HEAD,
      '      <script type="application/ld+json">',
      JSON.stringify(o.schema, null, 2),
      '      </script>',
      '      <script type="application/ld+json">',
      JSON.stringify(o.breadcrumb, null, 2),
      '      </script>',
      '   </head>'
   ].join('\n');
}
function topbar(asset) {
   return [
      '   <body>',
      '      <div class="rc-top">',
      '         <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">',
      '            <a class="rc-lg" href="' + asset + 'index.html">Sar<span>ab</span></a>',
      '            <div class="rc-toplinks">',
      '               <a href="' + asset + 'index.html"><i class="fas fa-house me-1"></i>Home</a>',
      '               <a href="' + asset + 'recipes.html"><i class="fas fa-book-open me-1"></i>All Recipes</a>',
      '               <a class="rc-order" href="tel:+12125550134"><i class="fas fa-phone-alt me-1"></i>Order: +1 (212) 555-0134</a>',
      '            </div>',
      '         </div>',
      '      </div>'
   ].join('\n');
}

function footer(asset) {
   return [
      '      <footer class="rc-foot">',
      '         <div class="container">',
      '            <div class="row g-4">',
      '               <div class="col-md-5">',
      '                  <div class="rc-lg" style="margin-bottom:8px;">Sar<span>ab</span></div>',
      '                  <p style="font-size:.86rem;color:rgba(255,255,255,.65);margin:0;">Cheap recipes, budget meal deals and fast food favourites - made fresh in New York and delivered in about 25 minutes.</p>',
      '               </div>',
      '               <div class="col-md-4">',
      '                  <h5 class="rc-footit">Cheap Recipes</h5>',
      '                  <ul class="rc-flinks">',
      RECIPES.map(function (r) {
         return '                     <li><a href="' + asset + 'recipes/' + r.slug + '.html">' + r.shortTitle + '</a></li>';
      }).join('\n'),
      '                  </ul>',
      '               </div>',
      '               <div class="col-md-3">',
      '                  <h5 class="rc-footit">Sarab</h5>',
      '                  <ul class="rc-flinks">',
      '                     <li><a href="' + asset + 'index.html#menu">Our Menu</a></li>',
      '                     <li><a href="' + asset + 'recipes.html">All Cheap Recipes</a></li>',
      '                     <li><a href="' + asset + 'locations.html">Branches &amp; Booking</a></li>',
      '                     <li><a href="' + asset + 'checkout.html">Order Online</a></li>',
      '                     <li><a href="' + asset + 'index.html#faq">Value FAQs</a></li>',
      '                     <li><a href="' + asset + 'privacy-policy.html">Privacy Policy</a></li>',
      '                     <li><a href="' + asset + 'terms.html">Terms</a></li>',
      '                  </ul>',
      '               </div>',
      '            </div>',
      '            <div class="rc-fbot">&copy; 2026 Sarab Restaurant &middot; 1420 Madison Avenue, New York, NY 10029 &middot; <a href="tel:+12125550134">+1 (212) 555-0134</a></div>',
      '         </div>',
      '      </footer>',
      '      <script src="' + asset + 'js/consent.js"></script>',
      '   </body>',
      '</html>',
      ''
   ].join('\n');
}

function relatedList(currentSlug, asset) {
   return RECIPES.filter(function (r) { return r.slug !== currentSlug; }).slice(0, 4).map(function (r) {
      return [
         '                     <a class="rc-rel" href="' + asset + 'recipes/' + r.slug + '.html">',
         '                        <img src="' + asset + r.image + '" alt="' + r.imageAlt + '">',
         '                        <span>',
         '                           <strong>' + r.shortTitle + '</strong>',
         '                           <em>' + r.totalTimeLabel + ' &middot; ' + r.costPerServing + '/serving</em>',
         '                        </span>',
         '                     </a>'
      ].join('\n');
   }).join('\n');
}
/* ---------------- schema helpers ---------------- */
function nutri(r, label) {
   const row = r.nutrition.filter(function (n) { return n[0] === label; })[0];
   return row ? row[1] : '';
}

function recipeSchema(r) {
   return {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: r.h1,
      image: [SITE + '/' + r.schemaImage],
      description: r.metaDesc,
      author: { '@type': 'Organization', name: 'Sarab Fast Food & Restaurant' },
      publisher: {
         '@type': 'Organization',
         name: 'Sarab Fast Food & Restaurant',
         logo: { '@type': 'ImageObject', url: SITE + '/img/favicon.svg' }
      },
      datePublished: DATE,
      dateModified: DATE,
      keywords: r.keywords,
      recipeCategory: r.category,
      recipeCuisine: r.cuisine,
      prepTime: r.prep,
      cookTime: r.cook,
      totalTime: r.total,
      recipeYield: r.servings + ' servings',
      estimatedCost: {
         '@type': 'MonetaryAmount',
         currency: 'USD',
         value: r.costPerServing.replace('$', '')
      },
      recipeIngredient: r.ingredients.map(function (i) {
         return i.replace(/\s*-\s*\$[\d.]+$/, '');
      }),
      recipeInstructions: r.steps.map(function (s, i) {
         return { '@type': 'HowToStep', position: i + 1, name: 'Step ' + (i + 1), text: s };
      }),
      nutrition: {
         '@type': 'NutritionInformation',
         servingSize: '1 serving',
         calories: nutri(r, 'Calories'),
         proteinContent: nutri(r, 'Protein'),
         carbohydrateContent: nutri(r, 'Carbohydrates'),
         fatContent: nutri(r, 'Fat'),
         saturatedFatContent: nutri(r, 'Saturated fat'),
         sodiumContent: nutri(r, 'Sodium'),
         fiberContent: nutri(r, 'Fibre'),
         sugarContent: nutri(r, 'Sugar')
      },
      aggregateRating: {
         '@type': 'AggregateRating',
         ratingValue: r.rating,
         reviewCount: r.reviews,
         bestRating: '5',
         worstRating: '1'
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + '/recipes/' + r.slug + '.html' }
   };
}

function crumbSchema(name, url) {
   return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
         { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
         { '@type': 'ListItem', position: 2, name: 'Cheap Recipes', item: SITE + '/recipes.html' },
         { '@type': 'ListItem', position: 3, name: name, item: url }
      ]
   };
}
/* ---------------- recipe page ---------------- */
function recipePage(r) {
   const asset = '../';
   const canonical = SITE + '/recipes/' + r.slug + '.html';
   const out = [];

   out.push(head({
      pageTitle: r.pageTitle,
      ogTitle: r.ogTitle,
      metaDesc: r.metaDesc,
      keywords: r.keywords,
      canonical: canonical,
      asset: asset,
      schemaImage: r.schemaImage,
      schema: recipeSchema(r),
      breadcrumb: crumbSchema(r.shortTitle, canonical)
   }));

   out.push(topbar(asset));

   out.push([
      '      <header class="rc-hero">',
      '         <div class="container">',
      '            <nav class="rc-crumb" aria-label="Breadcrumb">',
      '               <a href="' + asset + 'index.html">Home</a>',
      '               <i class="fas fa-chevron-right"></i>',
      '               <a href="' + asset + 'recipes.html">Cheap Recipes</a>',
      '               <i class="fas fa-chevron-right"></i>',
      '               <span>' + r.shortTitle + '</span>',
      '            </nav>',
      '            <span class="rc-slbl">Cheap recipe - ' + r.costPerServing + ' per serving</span>',
      '            <h1 class="rc-title">' + r.h1 + '</h1>',
      '            <p class="rc-lead">' + r.intro + '</p>',
      '            <div class="rc-chips">',
      r.chips.map(function (c) { return '               <span class="rc-chip">' + c + '</span>'; }).join('\n'),
      '               <span class="rc-chip alt"><i class="fas fa-star me-1"></i>' + r.rating + ' from ' + r.reviews + ' cooks</span>',
      '            </div>',
      '         </div>',
      '      </header>'
   ].join('\n'));

   out.push([
      '      <main class="rc-body">',
      '         <div class="container">',
      '            <img class="rc-heroimg" src="' + asset + r.image + '" alt="' + r.imageAlt + '" width="1200" height="560">',
      '            <div class="row g-4">',
      '               <div class="col-lg-8">',
      '                  <div class="rc-card">',
      '                     <h2 class="rc-h2"><i class="fas fa-piggy-bank"></i>Why This Recipe Is So Cheap</h2>',
      '                     <ul class="rc-list rc-check">',
      r.whyCheap.map(function (w) { return '                        <li>' + w + '</li>'; }).join('\n'),
      '                     </ul>',
      '                  </div>',
      '                  <div class="rc-card">',
      '                     <h2 class="rc-h2"><i class="fas fa-basket-shopping"></i>Ingredients (makes ' + r.servings + ' servings)</h2>',
      '                     <p class="rc-note">Prices are typical New York supermarket prices in September 2026 and come to about ' + r.costTotal + ' in total - that is ' + r.costPerServing + ' per serving.</p>',
      '                     <ul class="rc-list">',
      r.ingredients.map(function (i) { return '                        <li>' + i + '</li>'; }).join('\n'),
      '                     </ul>',
      '                  </div>',
      '                  <div class="rc-card">',
      '                     <h2 class="rc-h2"><i class="fas fa-list-ol"></i>How to Make It, Step by Step</h2>',
      '                     <ol class="rc-steps">',
      r.steps.map(function (s) { return '                        <li>' + s + '</li>'; }).join('\n'),
      '                     </ol>',
      '                  </div>'
   ].join('\n'));

   out.push([
      '                  <div class="rc-tip">',
      '                     <h3 class="rc-h3"><i class="fas fa-lightbulb"></i>Chef Tips That Keep the Cost Down</h3>',
      '                     <ul>',
      r.tips.map(function (t) { return '                        <li>' + t + '</li>'; }).join('\n'),
      '                     </ul>',
      '                  </div>',
      '                  <div class="rc-card">',
      '                     <h2 class="rc-h2"><i class="fas fa-heart-pulse"></i>Nutrition Per Serving</h2>',
      '                     <table class="rc-table">',
      '                        <tbody>',
      r.nutrition.map(function (n) {
         return '                           <tr><th>' + n[0] + '</th><td>' + n[1] + '</td></tr>';
      }).join('\n'),
      '                        </tbody>',
      '                     </table>',
      '                  </div>',
      '                  <div class="rc-cta">',
      '                     <h3>No time to cook tonight?</h3>',
      '                     <p>Order the same dish from Sarab - cooked fresh to order, delivered across New York in about 25 minutes and still priced for everyday eating.</p>',
      '                     <div class="rc-ctabtns">',
      '                        <a class="rc-btn" href="' + asset + 'index.html#menu"><i class="fas fa-utensils me-1"></i>See the Menu</a>',
      '                        <a class="rc-btn ghost" href="tel:+12125550134"><i class="fas fa-phone-alt me-1"></i>+1 (212) 555-0134</a>',
      '                     </div>',
      '                  </div>',
      '               </div>'
   ].join('\n'));
   out.push([
      '               <aside class="col-lg-4">',
      '                  <div class="rc-card">',
      '                     <h3 class="rc-h3"><i class="fas fa-clipboard-list"></i>Recipe Card</h3>',
      '                     <table class="rc-table rc-table-sm">',
      '                        <tbody>',
      '                           <tr><th>Prep time</th><td>' + r.prep.replace('PT', '').replace('M', '') + ' minutes</td></tr>',
      '                           <tr><th>Cook time</th><td>' + r.cook.replace('PT', '').replace('M', '') + ' minutes</td></tr>',
      '                           <tr><th>Total time</th><td>' + r.totalTimeLabel + '</td></tr>',
      '                           <tr><th>Serves</th><td>' + r.servings + '</td></tr>',
      '                           <tr><th>Cost per serving</th><td><strong>' + r.costPerServing + '</strong></td></tr>',
      '                           <tr><th>Total ingredient cost</th><td>' + r.costTotal + '</td></tr>',
      '                           <tr><th>Category</th><td>' + r.category + '</td></tr>',
      '                           <tr><th>Cuisine</th><td>' + r.cuisine + '</td></tr>',
      '                        </tbody>',
      '                     </table>',
      '                  </div>',
      '                  <div class="rc-card">',
      '                     <h3 class="rc-h3"><i class="fas fa-coins"></i>Cost Breakdown</h3>',
      '                     <table class="rc-table rc-table-sm">',
      '                        <tbody>',
      r.costRows.map(function (c) {
         return '                           <tr><th>' + c[0] + '</th><td>' + c[1] + '</td></tr>';
      }).join('\n'),
      '                        </tbody>',
      '                     </table>',
      '                  </div>',
      '                  <div class="rc-card">',
      '                     <h3 class="rc-h3"><i class="fas fa-book-open"></i>More Cheap Recipes</h3>',
      '                     <div class="rc-rels">',
      relatedList(r.slug, asset),
      '                     </div>',
      '                  </div>',
      '                  <div class="rc-card rc-orderbox">',
      '                     <h3 class="rc-h3"><i class="fas fa-truck-fast"></i>Skip the Cooking</h3>',
      '                     <p>Prefer not to cook? The same dishes are on our menu - cooked fresh to order and delivered across New York in about 25 minutes, with cheap meal deals starting at $5.99.</p>',
      '                     <a class="rc-btn full" href="' + asset + 'index.html#menu"><i class="fas fa-bag-shopping me-1"></i>Order Online</a>',
      '                  </div>',
      '               </aside>',
      '            </div>',
      '         </div>',
      '      </main>'
   ].join('\n'));

   out.push(footer(asset));

   return out.join('\n');
}
/* ---------------- recipes hub page ---------------- */
function hubPage() {
   const canonical = SITE + '/recipes.html';
   const asset = '';

   const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Cheap Recipes From the Sarab Kitchen',
      description: 'Six tested cheap recipes from the Sarab kitchen in New York - burgers, pizza, fried chicken, pasta, meal prep wraps and dessert, all costed per serving.',
      url: canonical,
      isPartOf: {
         '@type': 'WebSite',
         name: 'Sarab Fast Food & Restaurant',
         url: SITE + '/'
      },
      mainEntity: {
         '@type': 'ItemList',
         numberOfItems: RECIPES.length,
         itemListElement: RECIPES.map(function (r, i) {
            return {
               '@type': 'ListItem',
               position: i + 1,
               name: r.h1,
               url: SITE + '/recipes/' + r.slug + '.html'
            };
         })
      }
   };

   const out = [];

   out.push(head({
      pageTitle: 'Cheap Recipes: 6 Easy Dinners Under $4 a Serving | Sarab',
      ogTitle: 'Cheap Recipes From the Sarab Kitchen',
      metaDesc: 'Six tested cheap recipes from the Sarab kitchen - smash burger, pizza, Nashville chicken, creamy pasta, meal prep wraps and lava cake. Every recipe costed per serving, from $1.45.',
      keywords: 'cheap recipes, cheap dinner recipes, budget friendly meals, easy weeknight dinners, quick recipes under 30 minutes, affordable family meals, cheap meal prep ideas, low cost recipes, budget pasta recipes, cheap chicken recipes',
      canonical: canonical,
      asset: asset,
      ogType: 'website',
      schemaImage: 'img/blog/1.jpg',
      schema: schema,
      breadcrumb: crumbSchema('Cheap Recipes', canonical)
   }));

   out.push(topbar(asset));

   out.push([
      '      <header class="rc-hero">',
      '         <div class="container">',
      '            <nav class="rc-crumb" aria-label="Breadcrumb">',
      '               <a href="index.html">Home</a>',
      '               <i class="fas fa-chevron-right"></i>',
      '               <span>Cheap Recipes</span>',
      '            </nav>',
      '            <span class="rc-slbl">Cook well for less</span>',
      '            <h1 class="rc-title">Cheap Recipes From Our Kitchen</h1>',
      '            <p class="rc-lead">Six recipes our chefs actually cook at home, costed line by line at New York supermarket prices. Every one comes in under $4 a serving, takes 35 minutes or less and uses ingredients you can buy anywhere.</p>',
      '            <div class="rc-chips">',
      '               <span class="rc-chip">' + RECIPES.length + ' tested recipes</span>',
      '               <span class="rc-chip">From $1.45 a serving</span>',
      '               <span class="rc-chip">35 minutes or less</span>',
      '               <span class="rc-chip alt"><i class="fas fa-star me-1"></i>Rated 4.8 by home cooks</span>',
      '            </div>',
      '         </div>',
      '      </header>'
   ].join('\n'));

   out.push([
      '      <main class="rc-body">',
      '         <div class="container">',
      '            <div class="row g-4">',
      RECIPES.map(function (r) {
         return [
            '               <div class="col-md-6 col-lg-4">',
            '                  <a class="rccard" href="recipes/' + r.slug + '.html">',
            '                     <span class="rccard-img">',
            '                        <img src="' + r.image + '" alt="' + r.imageAlt + '" width="600" height="400">',
            '                        <span class="rccard-cost">' + r.costPerServing + '<em>/serving</em></span>',
            '                     </span>',
            '                     <span class="rccard-body">',
            '                        <span class="rccard-tag">' + r.category + ' &middot; ' + r.totalTimeLabel + '</span>',
            '                        <strong>' + r.h1 + '</strong>',
            '                        <em>' + r.metaDesc.split('. ')[0] + '.</em>',
            '                        <span class="rccard-link">View the recipe <i class="fas fa-arrow-right"></i></span>',
            '                     </span>',
            '                  </a>',
            '               </div>'
         ].join('\n');
      }).join('\n'),
      '            </div>'
   ].join('\n'));
   out.push([
      '            <div class="rc-card" style="margin-top:34px;">',
      '               <h2 class="rc-h2"><i class="fas fa-piggy-bank"></i>How We Keep Every Recipe Cheap</h2>',
      '               <ul class="rc-list rc-check">',
      '                  <li><strong>Costed per serving, not per dish.</strong> Every recipe page lists an itemised cost breakdown so you can see exactly where the money goes.</li>',
      '                  <li><strong>Pantry-first ingredients.</strong> Flour, tinned tomatoes, pasta and spices carry most of these recipes and keep the price under $4 a portion.</li>',
      '                  <li><strong>Cheaper cuts, better results.</strong> Chicken thighs, 80/20 beef and tinned tomatoes beat their expensive equivalents on flavour as well as price.</li>',
      '                  <li><strong>No waste.</strong> Leftover sauce, dough and fillings are frozen or reused, so nothing you buy ends up in the bin.</li>',
      '                  <li><strong>35 minutes or less.</strong> Fast recipes mean less energy used and a much better chance you cook instead of ordering in.</li>',
      '               </ul>',
      '            </div>',
      '            <div class="rc-cta" style="margin-top:34px;">',
      '               <h3>Hungry now? Let us cook it for you.</h3>',
      '               <p>Sarab Fast Food &amp; Restaurant serves every dish on this page - fresh, fast and priced for everyday eating. Delivery across New York in about 25 minutes.</p>',
      '               <div class="rc-ctabtns">',
      '                  <a class="rc-btn" href="index.html#menu"><i class="fas fa-utensils me-1"></i>Browse the Menu</a>',
      '                  <a class="rc-btn ghost" href="tel:+12125550134"><i class="fas fa-phone-alt me-1"></i>Call +1 (212) 555-0134</a>',
      '               </div>',
      '            </div>',
      '         </div>',
      '      </main>'
   ].join('\n'));

   out.push(footer(asset));

   return out.join('\n');
}

/* ---------------- write the files ---------------- */
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

RECIPES.forEach(function (r) {
   fs.writeFileSync(path.join(OUT, r.slug + '.html'), recipePage(r), 'utf8');
   console.log('wrote recipes/' + r.slug + '.html');
});

fs.writeFileSync(path.join(ROOT, 'recipes.html'), hubPage(), 'utf8');
console.log('wrote recipes.html');
console.log('');
console.log(RECIPES.length + ' recipe pages + 1 hub page generated.');



