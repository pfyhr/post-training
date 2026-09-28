#!/bin/sh
# tools/fetch-suno.sh <suno share url> <NN-slug>
# Downloads a Suno song you made into audio/: the mp4 (master, as Suno serves it), an m4a audio extract, and the cover.
# Suno's direct .mp3 links return 403, but the .mp4 for the same id is public. Needs only curl + macOS afconvert.
set -e
url="$1"; slug="$2"
[ -n "$url" ] && [ -n "$slug" ] || { echo "usage: $0 <suno share url> <NN-slug>"; exit 1; }
final=$(curl -sL -A 'Mozilla/5.0' -o /dev/null -w '%{url_effective}' "$url")
id=$(printf '%s' "$final" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
[ -n "$id" ] || { echo "could not find a song id in $final"; exit 1; }
page=$(curl -sL -A 'Mozilla/5.0' "https://suno.com/song/$id")
if printf '%s' "$page" | grep -q 'is_public\\\?":false'; then
  echo "song $id is private on Suno, so its media is not downloadable. Either set it to Public on suno.com (share menu)"
  echo "and rerun, or download the mp3 from Suno's Download menu and save it as audio/$slug.mp3"; exit 2
fi
mkdir -p audio
if ! curl -sfL -A 'Mozilla/5.0' -H "Referer: https://suno.com/song/$id" -o "audio/$slug.mp4" "https://cdn1.suno.ai/$id.mp4"; then
  rm -f "audio/$slug.mp4"
  echo "song $id is public but its mp4 is not on the CDN yet (Suno renders it shortly after publishing). Try again in a minute."; exit 3
fi
curl -sfL -A 'Mozilla/5.0' -o "audio/$slug.jpeg" "https://cdn2.suno.ai/image_large_$id.jpeg" || true
if command -v ffmpeg >/dev/null; then ffmpeg -hide_banner -loglevel error -i "audio/$slug.mp4" -vn -c:a copy -y "audio/$slug.m4a"   # lossless
else afconvert -f m4af -d aac -b 192000 "audio/$slug.mp4" "audio/$slug.m4a"; fi
echo "$id  $slug  $(afinfo "audio/$slug.m4a" | grep -oE 'estimated duration: [0-9.]+' )"
