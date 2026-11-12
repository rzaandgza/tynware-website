const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require.resolve('../assets/site.js'), 'utf8').split('// Screenshot lightbox')[0];
function run(products) {
  const callbacks = [];
  const link = () => ({hidden:true,href:'#',classList:{add(){},remove(){}},setAttribute(){},removeAttribute(){}});
  const links = { '[data-download]':[link()], '[data-checkout]':[link()], '[data-offerdesk-download]':[link()], '[data-offerdesk-checkout]':[link()] };
  const prelaunch = ['tynrent','offerdesk'].map(name=>({dataset:{prelaunchActions:name},hidden:false}));
  const release = [['[data-download]','[data-checkout]'],['[data-offerdesk-download]','[data-offerdesk-checkout]']].map(keys=>({hidden:true,querySelectorAll:()=>keys.flatMap(key=>links[key])}));
  const document = {addEventListener:(event,callback)=>callbacks.push(callback), querySelectorAll:selector=>links[selector] || ({'[data-prelaunch-actions]':prelaunch,'[data-release-actions]':release}[selector] || [])};
  vm.runInNewContext(source,{window:{TYNWARE_CONFIG:{products}},document});
  callbacks.forEach(callback=>callback());
  return {links,prelaunch,release};
}
let state=run({tynrent:{},offerdesk:{}});
assert.ok(state.prelaunch.every(group=>!group.hidden));
assert.ok(state.release.every(group=>group.hidden));
assert.ok(Object.values(state.links).flat().every(link=>link.hidden && link.href==='#'));
state=run({tynrent:{downloadUrl:'https://example.invalid/signed-tynrent.exe'},offerdesk:{}});
assert.equal(state.prelaunch[0].hidden,true);
assert.equal(state.prelaunch[1].hidden,false);
assert.equal(state.links['[data-download]'][0].href,'https://example.invalid/signed-tynrent.exe');
assert.equal(state.links['[data-checkout]'][0].hidden,true);
state=run({tynrent:{},offerdesk:{checkoutUrl:'https://example.invalid/offerdesk-checkout'}});
assert.equal(state.release[0].hidden,true);
assert.equal(state.release[1].hidden,false);
assert.equal(state.links['[data-offerdesk-checkout]'][0].href,'https://example.invalid/offerdesk-checkout');
console.log('Release checks passed: prelaunch, independent products and partial availability.');
