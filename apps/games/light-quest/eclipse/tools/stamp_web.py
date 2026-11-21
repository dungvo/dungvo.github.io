"""Give every Godot content pack a unique URL so returning players receive the new game."""
import hashlib
import json
import os
import pathlib
import re

folder = pathlib.Path('build/web')
sha = os.environ['GITHUB_SHA']
assert re.fullmatch(r'[0-9a-f]{40}', sha)
html_path = folder / 'index.html'
html = html_path.read_text()
match = re.search(r'const GODOT_CONFIG = (\{.*?\});', html)
assert match, 'Godot 4.4.1 Web shell config'
config = json.loads(match.group(1))
pack = f'sky-{sha[:12]}.pck'
(folder / 'index.pck').rename(folder / pack)
config['mainPack'] = pack
config['fileSizes'][pack] = config['fileSizes'].pop('index.pck')
html = html[:match.start(1)] + json.dumps(config, separators=(',', ':')) + html[match.end(1):]
html_path.write_text(html)
info = {'engine': '4.4.1.stable.official.49a5bc7b6', 'source_sha': sha,
        'release': 'horizon-journey-v6', 'main_pack': pack,
        'files': {p.name: hashlib.sha256(p.read_bytes()).hexdigest()
                  for p in folder.iterdir() if p.is_file() and p.name != 'build-info.json'}}
(folder / 'build-info.json').write_text(json.dumps(info, indent=2) + '\n')
print(f'Export sealed: {pack}')
