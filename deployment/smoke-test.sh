#!/usr/bin/env bash
# Run from the repository root against an already built linux/amd64 image.
set -euo pipefail
image="${1:-generator:ci}"
work="$(mktemp -d)"
container=""
cleanup() {
  result=$?
  if [[ -n "$container" ]]; then
    if [[ "$result" != 0 ]]; then docker logs "$container" >&2 || true; fi
    docker rm -f "$container" >/dev/null || true
  fi
  rm -rf -- "$work"
  exit "$result"
}
trap cleanup EXIT

container="$(docker run -d --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m,mode=1777 \
  --cap-drop ALL --security-opt no-new-privileges:true \
  --memory 128m --cpus 0.50 --pids-limit 64 \
  -p 127.0.0.1::8080 "$image")"
binding="$(docker port "$container" 8080/tcp)"
base="http://127.0.0.1:${binding##*:}"

ready=false
for ((attempt=0; attempt<60; attempt++)); do
  status="$(docker inspect --format '{{.State.Health.Status}}' "$container")"
  if [[ "$status" == healthy ]]; then ready=true; break; fi
  if [[ "$status" == unhealthy ]]; then break; fi
  sleep 1
done
[[ "$ready" == true ]]
[[ "$(docker exec "$container" id -u)" != 0 ]]
docker exec "$container" nginx -t

request() {
  local path="$1" expected="$2"
  local actual
  actual="$(curl --silent --show-error --max-time 10 \
    -D "$work/headers" -o "$work/body" -w '%{http_code}' "$base$path")"
  if [[ "$actual" != "$expected" ]]; then
    echo "$path: expected HTTP $expected, got $actual" >&2
    return 1
  fi
}
request /healthz 200
grep -qx 'ok' "$work/body"
grep -qi '^Cache-Control: no-store' "$work/headers"
request / 200
grep -q 'Generátor grafiky' "$work/body"
grep -qi '^Content-Type: text/html' "$work/headers"
grep -qi '^Cache-Control: no-cache' "$work/headers"
cp "$work/body" "$work/index.html"
request /favicon.ico 200
grep -qi '^Content-Type: image/x-icon' "$work/headers"
test -s "$work/body"

# Use a real hashed CSS/JS asset emitted by this build, not a hardcoded filename.
assets="$(grep -oE '/static/[A-Za-z0-9_./-]+\.(css|js)' "$work/index.html" | sort -u)"
asset="${assets%%$'\n'*}"
test -n "$asset"
request "$asset" 200
test -s "$work/body"
grep -qi '^Cache-Control: public, max-age=31536000, immutable' "$work/headers"
curl --fail --silent --show-error --max-time 10 \
  -H 'Accept-Encoding: gzip' -D "$work/gzip-headers" \
  -o "$work/compressed" "$base$asset"
grep -qi '^Content-Encoding: gzip' "$work/gzip-headers"
grep -qi '^Vary: Accept-Encoding' "$work/gzip-headers"
gzip -dc "$work/compressed" > "$work/uncompressed"
cmp "$work/body" "$work/uncompressed"

request /avatar 200
cmp "$work/index.html" "$work/body"
request /missing-smoke.png 404
request /static/nonexistent-smoke-test.css 404
if grep -qi 'immutable' "$work/headers"; then
  echo 'Missing asset must not be cached as immutable' >&2
  exit 1
fi
echo 'Container smoke tests passed (health, non-root, HTML, assets, cache, gzip, 404).'
