#!/usr/bin/env python3
"""Install free CC0 Kenney Pixel Platformer assets from Kenney's own hosting.

Run: python3 tools/install_cc0_assets.py
No third-party package dependency. Do not mistake this generic pack for final art.
"""
from __future__ import annotations
import io
import json
import hashlib
import pathlib
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "kenney"
URL = "https://opengameart.org/sites/default/files/kenney_pixel-platformer.zip"

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(URL, headers={"User-Agent": "LightQuest-Eclipse-CC0-Asset-Installer/1.0"})
    with urllib.request.urlopen(req, timeout=35) as response:
        archive = response.read()
    if len(archive) > 30_000_000:
        raise RuntimeError("Unusually large package; refusing")
    if not archive.startswith(b"PK"):
        raise RuntimeError("Download did not return ZIP bytes (possibly blocked/HTML)")
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        images = sorted(
            x for x in z.namelist()
            if x.lower().endswith(".png")
            and not x.startswith("__MACOSX")
            and not pathlib.PurePosixPath(x).is_absolute()
            and ".." not in pathlib.PurePosixPath(x).parts
        )
        candidates = [x for x in images if "character" in x.lower() and "packed" not in x.lower() and "sheet" not in x.lower()]
        # Individual sprites preferred over atlas, to avoid assigning an unknown atlas frame.
        candidate = next((x for x in candidates if x.lower().split("/")[-1].startswith("character")), None)
        if not candidate:
            candidate = next((x for x in candidates if "character" in pathlib.PurePosixPath(x).name.lower()), None)
        if not candidate:
            raise RuntimeError("No individual character PNG found; inspect source pack before integration")
        data = z.read(candidate)
        if not data.startswith(b"\x89PNG\r\n\x1a\n"):
            raise RuntimeError("Downloaded sprite is not a PNG")
        (DEST / "character.png").write_bytes(data)
        # Keep the archive's CC0 license if present.
        license_files = [x for x in z.namelist() if pathlib.PurePosixPath(x).name.lower() in ("license.txt", "license.md")]
        if license_files:
            (DEST / "LICENSE-ORIGINAL.txt").write_bytes(z.read(license_files[0]))
        manifest = {
            "origin": URL,
            "publisher": "Kenney (author upload via OpenGameArt)",
            "license": "CC0 1.0 (verify original LICENSE-ORIGINAL.txt)",
            "source_sprite": candidate,
            "sprite_sha256": hashlib.sha256(data).hexdigest(),
            "archive_sha256": hashlib.sha256(archive).hexdigest(),
            "archive_bytes": len(archive),
            "usage": "Prototype player placeholder sprite; replace with reviewed animation atlas"
        }
        (DEST / "manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
        print("Installed:",candidate,"=>",str(DEST / "character.png"))
        print("SHA256:",manifest["sprite_sha256"])

if __name__ == "__main__":
    main()
