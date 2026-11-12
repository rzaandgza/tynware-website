// Run with node --test tools/test_measurement.cjs. No third-party dependencies or network.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/measurement.js'), 'utf8');
const key = 'tynware.analytics-consent.v1';

function setup({host = 'tynware.com', id = 'G-TEST123456', saved, brokenStorage = false, path = '/tynrent/', domains = []} = {}) {
  const handlers = {}, windowHandlers = {}, scripts = [], nodes = [], cookies = [], storage = new Map();
  if (saved) storage.set(key, typeof saved === 'string' ? saved : JSON.stringify(saved));
  const node = () => ({
    hidden: false, attrs: {}, listeners: {}, children: {}, classList: {contains: () => false},
    setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(k, fn) { this.listeners[k] = fn; },
    querySelector(s) { return this.children[s] ||= node(); },
    append(n) { nodes.push(n); }, focus() {},
    click() { this.listeners.click?.(); }
  });
  const footer = node();
  const document = {
    readyState: 'complete', title: 'TynRent', referrer: 'https://www.google.com/search?q=private',
    querySelector(s) { return s === 'link[rel="canonical"]' ? {href: 'https://tynware.com' + path} : footer; },
    createElement() { return node(); }, head: {append: n => scripts.push(n)}, body: node(),
    addEventListener(k, fn) { handlers[k] = fn; },
    get cookie() { return '_ga=visitor; _ga_TEST123456=session; unrelated=value'; },
    set cookie(v) { cookies.push(v); }
  };
  const location = {hostname: host, origin: 'https://' + host, pathname: path, search:'?email=private&license_key=secret', hash:'#secret', reload() { location.reloads++; }, reloads:0};
  const window = {TYNWARE_MEASUREMENT: {measurementId:id, productionHosts:['tynware.com','www.tynware.com'], checkoutDomains:domains}, addEventListener(k, fn) { windowHandlers[k] = fn; }};
  const localStorage = {
    getItem(k) { if (brokenStorage) throw Error('blocked'); return storage.get(k) || null; },
    setItem(k,v) { if (brokenStorage) throw Error('blocked'); storage.set(k,v); }
  };
  vm.runInNewContext(source, {window, document, location, localStorage, URL, Date});
  const panel = nodes.find(n => n.className === 'analytics-choice');
  const settings = nodes.find(n => n.className === 'analytics-settings');
  const commands = () => Array.from(window.dataLayer || [], args => Array.from(args));
  const events = () => commands().filter(args => args[0] === 'event');
  function choose(choice) { panel.querySelector('[data-analytics-' + (choice === 'granted' ? 'accept' : 'reject') + ']').click(); }
  function click(attrs, href = 'https://tynware.com/file', opts = {}) {
    const link = {href, hasAttribute:k => k in attrs, getAttribute:k => k === 'href' ? href : attrs[k] ?? null,
      closest: () => Boolean(opts.hidden), classList: {contains: () => Boolean(opts.disabled)}};
    const event = {button:0, defaultPrevented:false, target:{closest:()=>link}, ...opts};
    handlers.click?.(event);
  }
  return {window, location, scripts, storage, cookies, panel, settings, commands, events, choose, click, windowHandlers};
}

test('no Google request, cookie or queued event before consent or after rejection', () => {
  const s = setup();
  assert.equal(s.panel.hidden, false);
  s.click({'data-download':''});
  assert.equal(s.scripts.length,0); assert.equal(s.events().length,0); assert.equal(s.cookies.length,0);
  s.choose('denied');
  assert.equal(s.panel.hidden,true); assert.equal(s.scripts.length,0);
  assert.equal(JSON.parse(s.storage.get(key)).choice,'denied');
  assert.ok(s.cookies.every(c => !c.startsWith('unrelated=')));
});
test('acceptance starts once; page data excludes query, hash and referrer paths', () => {
  const s=setup(); s.choose('granted'); s.choose('granted');
  assert.equal(s.scripts.length,1);
  assert.deepEqual(s.events().map(e=>e[1]),['page_view','view_item']);
  const data = JSON.stringify(s.commands());
  assert.ok(!/private|secret|license_key|email=/.test(data));
  assert.ok(data.includes('https://www.google.com/'));
  assert.ok(data.includes('"ad_storage":"denied"'));
  assert.ok(data.includes('"allow_google_signals":false'));
});
test('correct products; disabled links excluded; sample and installer downloads stay separate', () => {
  const s=setup(); s.choose('granted');
  s.click({'data-download':''},'https://files.example.com/trial.exe?token=secret');
  s.click({'data-offerdesk-download':''});
  s.click({'data-offerdesk-checkout':''},'https://store.lemonsqueezy.com/buy/id?checkout[email]=private');
  s.click({'data-checkout':'','aria-disabled':'true'});
  s.click({'data-checkout':''},undefined,{hidden:true});
  s.click({'data-checkout':''},undefined,{disabled:true});
  s.click({'data-checkout':''},undefined,{defaultPrevented:true});
  s.click({'data-checkout':''},'#');
  s.click({},'https://tynware.com/assets/examples/tynrent-event-rental-sample.pdf');
  s.click({},'https://tynware.com/resources/tynrent/equipment-rental-spreadsheet-template/Tynware_Equipment_Rental_Spreadsheet_Template.xlsx');
  s.click({},'https://tynware.com/offerdesk/');
  assert.deepEqual(s.events().slice(2).map(e=>[e[1],e[2].product_id]),[
    ['download_click','tynrent'],['download_click','offerdesk'],['checkout_click','offerdesk'],['resource_download','tynrent'],['resource_download','tynrent'],['product_click','offerdesk']
  ]);
  assert.ok(!/token|private|secret|purchase/.test(JSON.stringify(s.events())));
});
test('withdrawal disables events and unloads the tag; cross-tab withdrawal also stops it', () => {
  const s=setup(); s.choose('granted'); s.choose('denied');
  const count=s.events().length; s.click({'data-download':''});
  assert.equal(s.events().length,count); assert.equal(s.location.reloads,1);
  const other=setup(); other.choose('granted'); other.storage.clear();
  other.windowHandlers.storage({key:null});
  assert.equal(other.location.reloads,1); assert.equal(other.window['ga-disable-G-TEST123456'],true);
});
test('saved valid consent is honored; expired, malformed or unavailable storage fails closed', () => {
  const s=setup({saved:{choice:'granted',expires:Date.now()+60000}});
  assert.equal(s.scripts.length,1); assert.equal(s.panel.hidden,true);
  for (const options of [{saved:'bad JSON'},{saved:{choice:'granted',expires:Date.now()-1}},{brokenStorage:true}]) {
    const s=setup(options); assert.equal(s.scripts.length,0); assert.equal(s.panel.hidden,false);
    s.choose('denied'); assert.equal(s.scripts.length,0);
  }
});
test('preview/local hosts and missing IDs never start analytics or show a banner', () => {
  for (const options of [{host:'127.0.0.1'},{host:'branch.tynware-website.pages.dev'},{host:'tynware.com.attacker.example'},{id:''},{id:'G-<script>'}]) {
    const s=setup(options); assert.equal(s.scripts.length,0); assert.equal(s.panel,undefined);
  }
});
test('cross-domain decoration is restricted to configured exact Lemon Squeezy store hosts', () => {
  const s=setup({domains:['tynware.lemonsqueezy.com','*.lemonsqueezy.com','attacker.example']}); s.choose('granted');
  const linker=s.commands().find(c=>c[0]==='set' && c[1]==='linker');
  assert.deepEqual(Array.from(linker[2].domains),['tynware.lemonsqueezy.com']);
  assert.equal(linker[2].accept_incoming,false);
});
