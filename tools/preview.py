"""Local preview matching Cloudflare Pages' extensionless HTML routes.

Run: python tools/preview.py [port]. Binds to localhost only.
"""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit
import sys

ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def translate_path(self,path):
        target=Path(super().translate_path(path))
        if not target.exists() and not target.suffix and target.with_suffix('.html').is_file():target=target.with_suffix('.html')
        return str(target)
    def redirect_html(self):
        url=urlsplit(self.path)
        if url.path.endswith('.html') and not url.path.endswith('/404.html'):
            destination=url.path[:-10] if url.path.endswith('/index.html') else url.path[:-5]
            if url.query:destination+='?'+url.query
            self.send_response(308);self.send_header('Location',destination);self.end_headers();return True
        return False
    def do_GET(self):
        if not self.redirect_html():super().do_GET()
    def do_HEAD(self):
        if not self.redirect_html():super().do_HEAD()
    def list_directory(self,path):self.send_error(404);return None
    def end_headers(self):
        self.send_header('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'")
        self.send_header('Cache-Control','no-store')
        super().end_headers()

if __name__=='__main__':
    port=int(sys.argv[1]) if len(sys.argv)>1 else 8765
    print(f'Preview: http://127.0.0.1:{port}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()
