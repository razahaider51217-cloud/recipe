/* Functional test for the Heroku web process:
     - starts sarab/server.js in-process on a random port and checks every route
     - then spawns the real command (node server.js with PORT=...) like Heroku
   Run: node test-sarab-server.js                                              */
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const zlib = require('zlib');

const SRV = path.join(__dirname, 'sarab', 'server.js');
let failures = 0;
function ok(cond, msg) {
   if (cond) console.log('ok    ' + msg);
   else { failures++; console.log('FAIL  ' + msg); }
}

function get(port, urlPath, opts) {
   opts = opts || {};
   return new Promise(function (resolve, reject) {
      const req = http.request({
         host: '127.0.0.1',
         port: port,
         path: urlPath,
         method: opts.method || 'GET',
         headers: opts.headers || {}
      }, function (res) {
         const chunks = [];
         res.on('data', function (c) { chunks.push(c); });
         res.on('end', function () {
            let body = Buffer.concat(chunks);
            if (res.headers['content-encoding'] === 'gzip' && body.length) {
               try { body = zlib.gunzipSync(body); } catch (e) { /* leave raw */ }
            }
            resolve({ status: res.statusCode, headers: res.headers, body: body.toString('utf8'), bytes: body.length });
         });
      });
      req.on('error', reject);
      req.end();
   });
}

(async function () {
   const mod = require(SRV);
   const server = mod.server;
   await new Promise(function (res) { server.listen(0, '127.0.0.1', res); });
   const port = server.address().port;
   console.log('in-process server on 127.0.0.1:' + port + '\n');

   /* ---------- the pages Heroku needs to serve ---------- */
   const home = await get(port, '/');
   ok(home.status === 200, '/ returns 200 (got ' + home.status + ')');
   ok(/text\/html/.test(home.headers['content-type']), '/ is served as HTML (' + home.headers['content-type'] + ')');
   ok(home.body.indexOf('Sarab') !== -1, '/ serves the Sarab homepage (' + home.bytes + ' bytes)');
   ok(!home.headers['content-encoding'] || home.headers['content-encoding'] === 'gzip', '/ uses gzip when accepted');

   const pages = ['/index.html', '/recipes.html', '/locations.html', '/checkout.html',
      '/privacy-policy.html', '/terms.html', '/404.html'];
   for (const p of pages) {
      const r = await get(port, p);
      ok(r.status === 200 && /text\/html/.test(r.headers['content-type']), p + ' -> ' + r.status + ' ' + r.headers['content-type']);
   }

   /* ---------- pretty URLs ---------- */
   const pretty = await get(port, '/locations');
   ok(pretty.status === 200 && pretty.body.indexOf('Find Your Nearest Sarab') !== -1, '/locations (no .html) resolves to locations.html');
   const prettyRecipe = await get(port, '/recipes/cheap-smash-burger-recipe');
   ok(prettyRecipe.status === 200 && prettyRecipe.body.indexOf('Smash Burger') !== -1, '/recipes/<slug> without .html works');

   /* ---------- assets need the right MIME type (this is what broke before) ---------- */
   const assets = [
      ['/css/style.css', /text\/css/],
      ['/js/cart.js', /application\/javascript/],
      ['/js/main.js', /application\/javascript/],
      ['/img/menu/1.jpg', /image\/jpeg/],
      ['/img/favicon.svg', /image\/svg\+xml/],
      ['/webfonts/fa-solid-900.woff2', /font\/woff2/],
      ['/robots.txt', /text\/plain/],
      ['/sitemap.xml', /application\/xml/],
      ['/package.json', /application\/json/],
      ['/.nojekyll', /text\/plain/]
   ];
   for (const [p, re] of assets) {
      const r = await get(port, p);
      ok(r.status === 200 && re.test(r.headers['content-type']), p + ' -> ' + r.status + ' ' + r.headers['content-type']);
   }
   /* ---------- caching + conditional requests ---------- */
   ok(!!home.headers.etag, 'responses carry an ETag');
   const cached = await get(port, '/', { headers: { 'If-None-Match': home.headers.etag } });
   ok(cached.status === 304, 'If-None-Match returns 304 (got ' + cached.status + ')');
   const img = await get(port, '/img/menu/1.jpg');
   ok(/max-age=\d{4,}/.test(img.headers['cache-control'] || ''), 'images are cached (' + img.headers['cache-control'] + ')');
   ok(/max-age=0/.test(home.headers['cache-control'] || ''), 'HTML revalidates every load (' + home.headers['cache-control'] + ')');

   /* ---------- gzip ---------- */
   const zipped = await get(port, '/css/style.css', { headers: { 'Accept-Encoding': 'gzip' } });
   ok(zipped.headers['content-encoding'] === 'gzip', 'CSS is gzipped for clients that accept it');
   ok(zipped.body.indexOf('.brcard') !== -1, 'the gzipped body decompresses to the real CSS');

   /* ---------- errors, headers, methods ---------- */
   const missing = await get(port, '/does-not-exist');
   ok(missing.status === 404, 'missing pages return 404 (got ' + missing.status + ')');
   ok(missing.body.indexOf('This Dish Is') !== -1 || missing.body.indexOf('404') !== -1, '404 serves the custom 404.html page');
   const traversal = await get(port, '/../package.json');
   ok(traversal.status === 404, 'path traversal is blocked (got ' + traversal.status + ')');
   const dotgit = await get(port, '/.git/config');
   ok(dotgit.status === 404, '.git is not exposed (got ' + dotgit.status + ')');
   ok(home.headers['x-content-type-options'] === 'nosniff', 'security headers are set (nosniff)');
   const head = await get(port, '/', { method: 'HEAD' });
   ok(head.status === 200 && head.bytes === 0, 'HEAD returns headers only');
   const post = await get(port, '/', { method: 'POST' });
   ok(post.status === 405, 'POST is rejected with 405 (got ' + post.status + ')');
   const health = await get(port, '/healthz');
   ok(health.status === 200 && health.body.indexOf('"status":"ok"') !== -1, '/healthz reports ok');

   await new Promise(function (res) { server.close(res); });

   /* ---------- the exact command Heroku runs ---------- */
   const PORT = 4788;
   const child = spawn(process.execPath, ['server.js'], {
      cwd: path.join(__dirname, 'sarab'),
      env: Object.assign({}, process.env, { PORT: String(PORT) }),
      stdio: ['ignore', 'pipe', 'pipe']
   });
   let out = '';
   child.stdout.on('data', function (d) { out += d.toString(); });
   child.stderr.on('data', function (d) { out += d.toString(); });

   const live = await new Promise(function (resolve) {
      let settled = false;
      const done = function (v) { if (!settled) { settled = true; resolve(v); } };
      child.stdout.on('data', function (d) {
         out += d.toString();
         if (out.indexOf('Listening on') !== -1) done(true);
      });
      setTimeout(function () { done(false); }, 5000);
   });
   ok(live, 'node server.js boots as the web process (Procfile command)');
   ok(out.indexOf('Listening on') !== -1, 'it logs the port it bound: ' + (out.trim().split('\n')[0] || '(no output)'));

   const spawnedHome = await get(PORT, '/');
   ok(spawnedHome.status === 200 && spawnedHome.body.indexOf('Sarab') !== -1, 'the spawned server answers on $PORT=' + PORT);
   const spawnedAsset = await get(PORT, '/js/cart.js');
   ok(spawnedAsset.status === 200 && /application\/javascript/.test(spawnedAsset.headers['content-type']), 'assets are served from the Heroku process too');
   child.kill('SIGTERM');

   console.log('\n================ RESULT ================');
   console.log(failures === 0 ? 'PASS - the site serves correctly on Heroku' : 'FAILED - ' + failures + ' problem(s)');
   process.exit(failures === 0 ? 0 : 1);
})().catch(function (e) {
   console.error('TEST ERROR:', e && e.stack || e);
   process.exit(1);
});
