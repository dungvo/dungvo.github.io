#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
STACK="${1:-food-assistant}"
REGION="${2:-ap-southeast-1}"
[[ "$STACK" =~ ^[a-z][a-z0-9-]{0,30}$ ]] || { echo 'Tên stack cần từ 1 đến 31 ký tự thường, số hoặc dấu gạch ngang.' >&2; exit 1; }
command -v aws >/dev/null || { echo 'Cần cài AWS CLI v2 và đăng nhập.' >&2; exit 1; }

awsc() { aws --region "$REGION" --no-cli-pager "$@"; }
ACCOUNT="$(awsc sts get-caller-identity --query Account --output text)"
ARTIFACT="food-build-${ACCOUNT}-${REGION}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
if awsc cloudformation describe-stacks --stack-name "$STACK" > /dev/null 2>"$TMP/stack-error"; then
  EXISTS=1
elif grep -q 'does not exist' "$TMP/stack-error"; then
  EXISTS=0
else
  cat "$TMP/stack-error" >&2
  exit 1
fi

node --input-type=module - "$ROOT" "$TMP" "$EXISTS" <<'JS'
import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { parseEnv } from 'node:util';
const [root, temp, exists] = process.argv.slice(2);
const path = join(root, '.env.aws');
const text = existsSync(path) ? readFileSync(path, 'utf8') : '';
const config = parseEnv(text);
if (existsSync(path)) chmodSync(path, 0o600);
if (!config.FOOD_TOKEN && exists === '0') {
  config.FOOD_TOKEN = randomBytes(32).toString('hex');
  const next = text.replace(/^\s*FOOD_TOKEN\s*=.*$/m, '').trim();
  writeFileSync(path, (next ? next + '\n' : '') + 'FOOD_TOKEN=' + config.FOOD_TOKEN + '\n', { mode: 0o600 });
  chmodSync(path, 0o600);
}
const parameters = [];
for (const [key, field] of [['FoodToken', 'FOOD_TOKEN'], ['GroqApiKey', 'GROQ_API_KEY'], ['FfmpegLayerArn', 'FOOD_FFMPEG_LAYER_ARN']]) {
  if (config[field] || field !== 'FOOD_TOKEN' && Object.hasOwn(config, field)) parameters.push({ ParameterKey: key, ParameterValue: config[field] });
}
writeFileSync(join(temp, 'parameters.json'), JSON.stringify(parameters), { mode: 0o600 });
JS

if ! awsc s3api head-bucket --bucket "$ARTIFACT" --expected-bucket-owner "$ACCOUNT" > /dev/null 2>"$TMP/s3-error"; then
  if ! grep -Eq '404|Not Found|NoSuchBucket' "$TMP/s3-error"; then
    cat "$TMP/s3-error" >&2
    exit 1
  fi
  if [ "$REGION" = us-east-1 ]; then
    awsc s3api create-bucket --bucket "$ARTIFACT" >/dev/null
  else
    awsc s3api create-bucket --bucket "$ARTIFACT" --create-bucket-configuration "LocationConstraint=$REGION" >/dev/null
  fi
  awsc s3api put-public-access-block --bucket "$ARTIFACT" --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
fi

bash "$HERE/package.sh"
awsc cloudformation package --template-file "$HERE/template.yml" --s3-bucket "$ARTIFACT" --s3-prefix "$STACK" --output-template-file "$TMP/packaged.yml"
awsc cloudformation deploy --template-file "$TMP/packaged.yml" --stack-name "$STACK" --capabilities CAPABILITY_IAM \
  --parameter-overrides "file://$TMP/parameters.json" --no-fail-on-empty-changeset

output() { awsc cloudformation describe-stacks --stack-name "$STACK" --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue | [0]" --output text; }
SITE_BUCKET="$(output SiteBucketName)"
awsc s3 sync "$HERE/build/site/" "s3://$SITE_BUCKET/" --exclude manifest.webmanifest --only-show-errors
awsc s3 cp "$HERE/build/site/manifest.webmanifest" "s3://$SITE_BUCKET/manifest.webmanifest" \
  --content-type application/manifest+json --only-show-errors
awsc cloudfront create-invalidation --distribution-id "$(output CloudFrontId)" --paths '/*' >/dev/null
echo "Food Assistant: $(output SiteUrl)"
echo "Địa chỉ API: $(output ApiUrl)"
echo 'Mã quán được đặt trong .env.aws trên máy triển khai. Giữ tệp này riêng.'
