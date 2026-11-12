"""Create responsive, lossless WebP copies; retain original screenshots for zoom.

Development dependency: Pillow. Run from any directory with Python 3.
"""
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'optimized'

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    for folder, prefix in [('screenshots', 'tynrent'), ('offerdesk', 'offerdesk')]:
        for source in sorted((ROOT / 'assets' / folder).glob('*.png')):
            with Image.open(source) as image:
                for width in (640, 1280):
                    target_width = min(width, image.width)
                    size = (target_width, round(image.height * target_width / image.width))
                    output = OUT / f'{prefix}-{source.stem}-{width}.webp'
                    image.convert('RGB').resize(size, Image.Resampling.LANCZOS).save(output, 'WEBP', lossless=True, method=6)
                    results.append({'source':str(source.relative_to(ROOT)), 'output':str(output.relative_to(ROOT)), 'width':size[0], 'height':size[1], 'originalBytes':source.stat().st_size, 'bytes':output.stat().st_size})
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
