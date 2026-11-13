// Run with node tools/test-commerce.cjs. No network calls or purchases.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const config = fs.readFileSync(path.join(root, 'assets/site-config.js'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
const bootstrap = script.slice(0, script.indexOf('document.addEventListener'));
const urls = {
  tynrent: 'https://tynware.lemonsqueezy.com/checkout/buy/d7242365-b524-43a5-a0d8-208abb348a5b',
  offerdesk: 'https://tynware.lemonsqueezy.com/checkout/buy/ce31c7b5-5441-444c-aa6c-4547dd0c6dfd'
};
const context = vm.createContext({window: {}});
vm.runInContext(config + '\n' + bootstrap, context);
let checks = 0;
function check(value, expected) { assert.equal(value, expected); checks++; }
for (const product of Object.keys(urls)) {
  const productConfig = context.window.TYNWARE_CONFIG.products[product];
  check(productConfig.version, '1.0.0');
  check(productConfig.checkoutUrl, urls[product]);
  check(vm.runInContext(`checkoutFor('${product}')`, context), urls[product]);
  const filename = product === 'tynrent' ? 'TynRent_Setup_1.0.0.exe' : 'OfferDesk-1.0.0-Setup.exe';
  const download = `https://downloads.tynware.com/${product}/1.0.0/${filename}`;
  check(vm.runInContext(`downloadFor('${product}')`, context), download);
  check(productConfig.downloadApproved, true);
  check(productConfig.downloadUrl, download);
  const other = product === 'tynrent' ? 'offerdesk' : 'tynrent';
  for (const invalid of [urls[other], urls[product] + '?cart=private', urls[product] + '#fragment', 'https://evil.example/']) {
    productConfig.checkoutUrl = invalid;
    check(vm.runInContext(`checkoutFor('${product}')`, context), '');
  }
  productConfig.checkoutUrl = urls[product];
  productConfig.downloadUrl = download;
  productConfig.downloadApproved = false;
  check(vm.runInContext(`downloadFor('${product}')`, context), '');
  productConfig.downloadApproved = true;
  check(vm.runInContext(`downloadFor('${product}')`, context), download);
  for (const invalid of [urls[product], 'http://downloads.tynware.com/a.exe', 'https://evil.example/a.exe', download + '?cart=x', download.replace(product + '/', other + '/')]) {
    productConfig.downloadUrl = invalid;
    check(vm.runInContext(`downloadFor('${product}')`, context), '');
  }
  productConfig.downloadUrl = '';
  productConfig.downloadApproved = false;
  const html = fs.readFileSync(path.join(root, product, 'index.html'), 'utf8');
  check((html.match(/>Download Free 14-Day Trial<\/a>/g) || []).length, 2);
  check((html.match(/>Buy License<\/a>/g) || []).length, 2);
  check(html.includes(`href="${download}" download="${filename}"`), true);
  check(html.includes('id="installation"'), true);
  check(html.includes('TYNWARE SOFT S.R.L.'), true);
  check(/coming soon|being prepared|await final|release enquiry/i.test(html), false);
  for (const text of ['payment card', '14 days of full access', 'backup', 'export', 'same installed application', 'No reinstall', 'Lemon Squeezy']) {
    assert.ok(html.includes(text), `${product}: missing ${text}`); checks++;
  }
}
check(context.window.TYNWARE_CONFIG.products.tynrent.priceEUR, 57);
check(context.window.TYNWARE_CONFIG.products.offerdesk.priceEUR, 113);
console.log(`PASS: ${checks} commerce checks; exact product checkout mapping and public download gates.`);
