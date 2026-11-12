"""Check metadata, canonical URLs, JSON-LD, anchors and local asset references."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json,re,sys
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
errors=[]

class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.h1=0;self.title=False;self.description=False;self.canonicals=[];self.references=[];self.ids=set()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
        if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
        if tag=='link' and a.get('rel')=='canonical':self.canonicals.append(a.get('href'))
        if 'id' in a:self.ids.add(a['id'])
        for key in ['href','src','poster','data-lightbox-src']:
            if a.get(key):self.references.append(a[key])
        for part in a.get('srcset','').split(','):
            if part.strip():self.references.append(part.strip().split()[0])

def resolve(path):
    target=ROOT/unquote(path).lstrip('/')
    if target.is_dir():return target/'index.html'
    if target.is_file():return target
    if not target.suffix:return target.with_suffix('.html')
    return target

pages={}
for file in ROOT.rglob('*.html'):
    if '.git' in file.parts:continue
    text=file.read_text(encoding='utf-8');p=Page();p.feed(text);pages[file]=p
    label=str(file.relative_to(ROOT))
    if file.name!='404.html':
        expected='/'+file.relative_to(ROOT).as_posix()
        expected=expected[:-10] if expected.endswith('index.html') else expected.removesuffix('.html')
        if p.canonicals!=['https://tynware.com'+expected]:errors.append(f'{label}: canonical does not match final route {expected}')
        if not p.description:errors.append(f'{label}: missing description')
    if p.h1!=1:errors.append(f'{label}: expected one H1, found {p.h1}')
    if not p.title:errors.append(f'{label}: missing title')
    for match in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S):
        try:json.loads(match[1])
        except ValueError:errors.append(f'{label}: invalid JSON-LD')
    for ref in p.references:
        url=urlparse(ref)
        if url.scheme in ('mailto','tel','data') or (url.netloc and url.netloc!='tynware.com'):continue
        target=resolve(url.path) if url.path else file
        if not target.exists():errors.append(f'{label}: missing {ref}')
        elif url.fragment and target.suffix=='.html':
            other=Page();other.feed(target.read_text(encoding='utf-8'))
            if url.fragment not in other.ids:errors.append(f'{label}: missing anchor {ref}')

urls=[node.text for node in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc')]
for url in urls:
    target=resolve(urlparse(url).path)
    if target not in pages or pages[target].canonicals!=[url]:errors.append(f'sitemap: noncanonical or missing URL {url}')
if len(urls)!=len(set(urls)):errors.append('sitemap: duplicate URLs')
config=(ROOT/'assets/site-config.js').read_text(encoding='utf-8')
if not re.search(r'downloadUrl:\s*""',config) or not re.search(r'checkoutUrl:\s*""',config):errors.append('Prelaunch URL state changed unexpectedly')
for error in errors:print('ERROR:',error)
print(f'Checked {len(pages)} HTML pages and {len(urls)} sitemap entries; {len(errors)} errors.')
sys.exit(bool(errors))
