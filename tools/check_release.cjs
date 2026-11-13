const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require.resolve('../assets/site.js'), 'utf8').split('// Screenshot lightbox')[0];
const checkouts = {
  tynrent:'https://tynware.lemonsqueezy.com/checkout/buy/d7242365-b524-43a5-a0d8-208abb348a5b',
  offerdesk:'https://tynware.lemonsqueezy.com/checkout/buy/ce31c7b5-5441-444c-aa6c-4547dd0c6dfd'
};
const downloads = {
  tynrent:'https://downloads.tynware.com/tynrent/1.0.0/TynRent_Setup_1.0.0.exe',
  offerdesk:'https://downloads.tynware.com/offerdesk/1.0.0/OfferDesk-1.0.0-Setup.exe'
};
function run(products) {
  const callbacks=[];
  const link=()=>({hidden:false,href:'#',classList:{add(){},remove(){}},setAttribute(){},removeAttribute(name){if(name==='href')this.href=undefined;},addEventListener(){}});
  const links={'[data-download]':[link()],'[data-checkout]':[link()],'[data-offerdesk-download]':[link()],'[data-offerdesk-checkout]':[link()]};
  const release=[['[data-download]','[data-checkout]'],['[data-offerdesk-download]','[data-offerdesk-checkout]']].map(keys=>({hidden:false,querySelectorAll:()=>keys.flatMap(key=>links[key])}));
  const document={addEventListener:(_event,callback)=>callbacks.push(callback),querySelectorAll:selector=>links[selector]||({'[data-release-actions]':release}[selector]||[])};
  vm.runInNewContext(source,{window:{TYNWARE_CONFIG:{products}},document});
  callbacks.forEach(callback=>callback());
  return links;
}
let state=run({});
assert.equal(state['[data-download]'][0].hidden,false);
assert.equal(state['[data-download]'][0].href,undefined);
assert.equal(state['[data-checkout]'][0].href,undefined);
state=run({tynrent:{downloadUrl:downloads.tynrent,downloadApproved:true},offerdesk:{checkoutUrl:checkouts.offerdesk}});
assert.equal(state['[data-download]'][0].href,downloads.tynrent);
assert.equal(state['[data-checkout]'][0].href,undefined);
assert.equal(state['[data-offerdesk-checkout]'][0].href,checkouts.offerdesk);
assert.equal(state['[data-offerdesk-download]'][0].href,undefined);
state=run({tynrent:{downloadUrl:downloads.tynrent,downloadApproved:false,checkoutUrl:checkouts.offerdesk},offerdesk:{downloadUrl:downloads.tynrent,downloadApproved:true,checkoutUrl:'https://evil.example/'}});
assert.ok(Object.values(state).flat().every(link=>link.href===undefined));
state=run(Object.fromEntries(Object.keys(downloads).map(product=>[product,{downloadUrl:downloads[product],downloadApproved:true,checkoutUrl:checkouts[product]}])));
assert.equal(state['[data-download]'][0].href,downloads.tynrent);
assert.equal(state['[data-offerdesk-download]'][0].href,downloads.offerdesk);
assert.equal(state['[data-checkout]'][0].href,checkouts.tynrent);
assert.equal(state['[data-offerdesk-checkout]'][0].href,checkouts.offerdesk);
console.log('Release checks passed: approved downloads, independent availability, fail-closed and cross-product rejection.');
