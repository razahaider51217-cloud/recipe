/* Smoke test for js/cart.js using a tiny fake DOM built from the real
   checkout.html / index.html markup. Run: node test-sarab-cart.js          */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, 'sarab');
const checkoutHtml = fs.readFileSync(path.join(ROOT, 'checkout.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

let failures = 0;
function ok(cond, msg) {
   if (cond) console.log('ok    ' + msg);
   else { failures++; console.log('FAIL  ' + msg); }
}

/* ---------- tiny DOM ---------- */
function makeEl(tag) {
   const el = {
      tagName: (tag || 'div').toUpperCase(),
      id: '',
      innerHTML: '',
      textContent: '',
      value: '',
      disabled: false,
      style: {},
      children: [],
      attrs: {},
      listeners: {},
      classList: (function () {
         const s = new Set();
         return {
            add: function (c) { s.add(c); },
            remove: function (c) { s.delete(c); },
            contains: function (c) { return s.has(c); },
            toggle: function (c, f) { if (f === true) s.add(c); else if (f === false) s.delete(c); }
         };
      })(),
      setAttribute: function (k, v) { this.attrs[k] = String(v); if (k === 'id') this.id = String(v); },
      getAttribute: function (k) { return this.attrs[k] === undefined ? null : this.attrs[k]; },
      hasAttribute: function (k) { return this.attrs[k] !== undefined; },
      appendChild: function (c) { this.children.push(c); return c; },
      insertBefore: function (c) { this.children.push(c); return c; },
      removeChild: function () { },
      addEventListener: function (t, f) { this.listeners[t] = f; },
      dispatch: function (t, ev) {
         if (this.listeners[t]) this.listeners[t](ev || { preventDefault: function () { }, stopPropagation: function () { }, target: this });
      },
      focus: function () { },
      scrollIntoView: function () { },
      closest: function () { return null; },
      querySelector: function (sel) {
         this._q = this._q || {};
         if (!this._q[sel]) {
            const child = makeEl('div');
            const m = /#([A-Za-z0-9_-]+)/.exec(sel);
            if (m) child.id = m[1];
            this._q[sel] = child;
         }
         return this._q[sel];
      },
      querySelectorAll: function () { return []; }
   };
   return el;
}

/* every id in a page becomes a stub element */
function idsFrom(html) {
   const map = {};
   const re = /id="([^"]+)"/g;
   let m;
   while ((m = re.exec(html)) !== null) {
      if (!map[m[1]]) { map[m[1]] = makeEl('div'); map[m[1]].id = m[1]; }
   }
   return map;
}
const els = Object.assign({}, idsFrom(indexHtml), idsFrom(checkoutHtml));

/* the checkout form needs selector support for its named fields */
els.checkoutForm = (function () {
   const form = makeEl('form');
   form.id = 'checkoutForm';
   form.querySelector = function (sel) {
      if (sel.indexOf('name="payment"') !== -1) return { value: 'cash' };
      const m = /name="([^"]+)"/.exec(sel);
      if (m) return { value: 'x', name: m[1] };
      return null;
   };
   form.querySelectorAll = function (sel) {
      if (sel.indexOf('ordertype') !== -1) return [{ value: 'delivery', addEventListener: function () { } }];
      if (sel.indexOf('payment') !== -1) return [{ value: 'cash', addEventListener: function () { } }];
      return [];
   };
   return form;
})();

['ckName', 'ckPhone', 'ckEmail', 'ckAddress', 'ckCity', 'ckZip', 'ckWhen', 'ckNotes', 'ckPromo'].forEach(function (id) {
   if (!els[id]) els[id] = makeEl('input');
   els[id].value = '';
});
els.ckBranch.value = 'new-york';
els.ckWhen.value = 'ASAP';

const store = {};
const document = {
   readyState: 'complete',
   currentScript: { src: 'https://sarabfood.com/js/cart.js' },
   body: makeEl('body'),
   getElementById: function (id) { return els[id] || null; },
   createElement: function (t) { return makeEl(t); },
   querySelector: function () { return null; },
   querySelectorAll: function () { return []; },
   addEventListener: function () { }
};

const window = {
   localStorage: {
      getItem: function (k) { return store[k] === undefined ? null : store[k]; },
      setItem: function (k, v) { store[k] = String(v); }
   },
   location: { href: 'https://sarabfood.com/checkout.html', pathname: '/checkout.html', hash: '' },
   addEventListener: function () { },
   confirm: function () { return true; },
   setTimeout: function () { return 0; },
   clearTimeout: function () { },
   gtag: function () { window.__events = window.__events || []; window.__events.push(Array.prototype.slice.call(arguments)); },
   SARAB_BRANCHES: [
      { id: 'new-york', city: 'New York', state: 'NY', name: 'Sarab New York', address: '1420 Madison Avenue, New York, NY 10029', phone: '+1 (212) 555-0134', tel: '+12125550134', hours: 'Wed-Sun', mapUrl: '#' },
      { id: 'miami', city: 'Miami Beach', state: 'FL', name: 'Sarab Miami', address: '861 Ocean Drive, Miami Beach, FL 33139', phone: '+1 (305) 555-0164', tel: '+13055550164', hours: 'Daily', mapUrl: '#' }
   ]
};

const sandbox = {
   window: window,
   document: document,
   localStorage: window.localStorage,
   setTimeout: window.setTimeout,
   clearTimeout: window.clearTimeout,
   console: console,
   navigator: { userAgent: 'node' },
   location: window.location,
   encodeURIComponent: encodeURIComponent,
   Math: Math, Date: Date, JSON: JSON, Number: Number, String: String,
   Array: Array, isNaN: isNaN, parseFloat: parseFloat, parseInt: parseInt
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'cart.js'), 'utf8'), sandbox, { filename: 'cart.js' });

const Cart = sandbox.window.SarabCart;
ok(!!Cart, 'cart.js exposes window.SarabCart');
/* ---------- cart behaviour ---------- */
Cart.add({ id: 'classic-smash-burger', title: 'Classic Smash Burger', cat: 'Burgers', price: 14.99, img: 'img/menu/1.jpg' }, 2);
Cart.add({ id: 'margherita-royale', title: 'Margherita Royale', cat: 'Pizza', price: 16.99, img: 'img/menu/2.jpg' }, 1);
ok(Cart.count() === 3, 'adding 2 + 1 items gives a count of 3 (got ' + Cart.count() + ')');
ok(Math.abs(Cart.subtotal() - (14.99 * 2 + 16.99)) < 0.001, 'subtotal is $' + Cart.subtotal().toFixed(2));

Cart.setQty('margherita-royale', 3);
ok(Cart.count() === 5, 'quantity update recalculates the count (got ' + Cart.count() + ')');
Cart.setQty('classic-smash-burger', 0);
ok(!Cart.find('classic-smash-burger'), 'setting quantity to 0 removes the line');
Cart.remove('margherita-royale');
ok(Cart.count() === 0, 'remove empties the cart');

/* ---------- pricing rules ---------- */
Cart.add({ id: 'cheap-burger', title: 'Cheap Burger', cat: 'Burgers', price: 10, img: 'img/menu/1.jpg' }, 2);
let t = Cart.totals('', 'delivery');
ok(Math.abs(t.subtotal - 20) < 0.001, 'subtotal for 2 x $10 = $20');
ok(Math.abs(t.delivery - 3.99) < 0.001, 'delivery fee $3.99 applies under $25');
ok(Math.abs(t.tax - 1.775) < 0.01, 'tax at 8.875% = $' + t.tax.toFixed(2));
ok(Math.abs(t.total - (20 + 3.99 + t.tax)) < 0.001, 'total = subtotal + delivery + tax = $' + t.total.toFixed(2));

Cart.add({ id: 'family-bundle', title: 'Family Bundle', cat: 'Deals', price: 9.99, img: 'img/menu/3.jpg' }, 1);
t = Cart.totals('', 'delivery');
ok(t.delivery === 0, 'delivery becomes free over $25 (subtotal $' + t.subtotal.toFixed(2) + ')');
t = Cart.totals('SARAB10', 'delivery');
ok(Math.abs(t.discount - t.subtotal * 0.1) < 0.01, 'SARAB10 takes 10% off (-$' + t.discount.toFixed(2) + ')');
ok(Cart.promo('cheap5') !== null, 'promo codes are case insensitive (CHEAP5)');
ok(Cart.promo('NOPE') === null, 'invalid promo codes are rejected');
ok(Cart.totals('', 'pickup').delivery === 0, 'pickup has no delivery fee');

/* persistence */
ok(!!store['sarab_cart_v1'], 'cart is persisted to localStorage');
ok(store['sarab_cart_v1'].indexOf('family-bundle') !== -1, 'the saved cart contains the added item');

/* ---------- checkout flow (form filled in) ---------- */
const form = els.checkoutForm;
els.ckName.value = 'Jane Smith';
els.ckPhone.value = '(212) 555-0188';
els.ckEmail.value = 'jane@example.com';
els.ckAddress.value = '123 West 42nd Street, Apt 5';
els.ckCity.value = 'New York';
els.ckZip.value = '10036';
form.dispatch('submit');
ok(Cart.count() === 0, 'placing the order clears the cart');
ok(!!store['sarab_last_order_v1'], 'the order is saved to sarab_last_order_v1');
const order = JSON.parse(store['sarab_last_order_v1']);
ok(/^SAR-\d{6}$/.test(order.ref), 'order reference generated: ' + order.ref);
ok(order.branch && order.branch.id === 'new-york', 'order records the chosen branch (' + ((order.branch || {}).city) + ')');
ok(order.totals && typeof order.totals.total === 'number', 'order stores the totals ($' + order.totals.total.toFixed(2) + ')');
ok(order.mailto && order.mailto.indexOf('mailto:orders@sarabfood.com') === 0, 'the order can be emailed to the kitchen');
ok(order.emailBody.indexOf('TOTAL:') !== -1 && order.emailBody.indexOf('Family Bundle') !== -1, 'the email body lists the items and the total');
ok((window.__events || []).some(function (e) { return e[1] === 'purchase'; }), 'a GA4 purchase event is sent');
ok((window.__events || []).some(function (e) { return e[1] === 'add_to_cart'; }), 'GA4 add_to_cart events are sent from the menu');
ok((window.__events || []).some(function (e) { return e[1] === 'conversion'; }), 'a Google Ads conversion is fired for the order');
ok(JSON.stringify(order.items).indexOf('"qty":2') !== -1, 'the order keeps the correct quantities');
ok(els.ckDone.style.display === '', 'the confirmation panel is shown');

/* ---------- validation blocks bad input ---------- */
['ckName', 'ckPhone', 'ckAddress', 'ckCity', 'ckZip'].forEach(function (id) { els[id].value = ''; });
Cart.add({ id: 'cheap-burger', title: 'Cheap Burger', cat: 'Burgers', price: 10, img: 'img/menu/1.jpg' }, 1);
form.dispatch('submit');
ok(Cart.count() === 1, 'invalid orders are rejected and the cart is kept');
ok(els.ckError.style.display === '', 'validation errors are displayed to the guest');

/* ---------- booking engine ---------- */
const bookingSandbox = Object.assign({}, sandbox);
bookingSandbox.window = Object.assign({}, window, { location: { hash: '#booking' } });
bookingSandbox.document = Object.assign({}, document, {
   querySelectorAll: function () { return []; },
   readyState: 'complete'
});
vm.createContext(bookingSandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'booking.js'), 'utf8'), bookingSandbox, { filename: 'booking.js' });
ok(typeof bookingSandbox.window.gtag === 'function', 'booking.js loads without throwing');

console.log('\n================ RESULT ================');
console.log(failures === 0 ? 'PASS - cart and checkout behave correctly' : 'FAILED - ' + failures + ' problem(s)');
process.exit(failures === 0 ? 0 : 1);
