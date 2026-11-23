#!/usr/bin/env python3
"""Fetch vetted CC0 Moss Knight Godot character pack; PNG/TRES/TSCN only."""
from __future__ import annotations
import hashlib,io,json,pathlib,urllib.request,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/"moss-knight"
URL="https://spritecanvas.com/free/moss-knight-character-pack.zip"
ALLOWED={".png",".tres",".tscn",".json",".txt",".md"}
def main():
    req=urllib.request.Request(URL,headers={"User-Agent":"LightQuestCC0AssetInstaller/1.0"})
    with urllib.request.urlopen(req,timeout=40) as r:blob=r.read()
    if len(blob)>20_000_000 or not blob.startswith(b"PK"):raise RuntimeError("Invalid asset archive")
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        members=z.infolist()
        if len(members)>250:raise RuntimeError("Unexpectedly large archive")
        for m in members:
            pp=pathlib.PurePosixPath(m.filename)
            if m.is_dir():continue
            if not pp.parts or pp.parts[0]!="moss-knight" or ".." in pp.parts or pp.is_absolute():raise RuntimeError("Unsafe path: "+m.filename)
            if pp.suffix.lower() not in ALLOWED or m.file_size>5_000_000:raise RuntimeError("Unexpected resource: "+m.filename)
            destination=ROOT.joinpath(*pp.parts)
            destination.parent.mkdir(parents=True,exist_ok=True)
            destination.write_bytes(z.read(m.filename))
        license_txt=(DEST/"LICENSE.txt").read_text(encoding="utf-8")
        if "CC0" not in license_txt:raise RuntimeError("Asset license is not CC0")
        required=["godot/character.tscn","godot/character.tres","animations/idle_east/atlas.png","animations/walk_east/atlas.png","animations/jump_east/atlas.png","animations/attack_east/atlas.png"]
        for name in required:
            if not (DEST/name).is_file():raise RuntimeError("Missing animation: "+name)
        (DEST/"PROVENANCE.json").write_text(json.dumps({"publisher":"SpriteCanvas","source":URL,"license":"CC0 1.0","archive_sha256":hashlib.sha256(blob).hexdigest(),"usage":"Prototype animated playable character Moss Knight"},indent=2))
        print("MOSS KNIGHT READY:",len(members),"members",len(blob),"archive bytes")
if __name__=="__main__":main()
