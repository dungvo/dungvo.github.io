#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
BUILD="$HERE/build"

mkdir -p "$BUILD/lambda/server" "$BUILD/site"
cp "$HERE/entry.mjs" "$BUILD/lambda/entry.mjs"
cp "$ROOT"/{domain,language,menu,voice}.js "$BUILD/lambda/"
cp "$ROOT"/server/{api,audio,dynamo,groq,lambda-http,usage}.mjs "$BUILD/lambda/server/"
printf '%s\n' '{"private":true,"type":"module"}' > "$BUILD/lambda/package.json"

cp "$ROOT"/{index.html,manifest.webmanifest,styles.css,sw.js} "$BUILD/site/"
cp "$ROOT"/{app,domain,icons,language,menu,storage,view,voice}.js "$BUILD/site/"
mkdir -p "$BUILD/site/assets"
cp "$ROOT"/assets/* "$BUILD/site/assets/"
echo "Đã chuẩn bị Lambda và frontend trong aws/build."
