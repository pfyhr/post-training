#!/bin/sh
# tools/publish-jellyfin.sh: tag the finished takes and copy them into a Jellyfin music library on your media server.
# Track 01 is deckard's single, taken from the existing file on the share and re-tagged with full credits.
# Tracks 02-10: audio/masters/NN-slug.wav (lossless, from Suno WAV or WAV stems) wins, then audio/NN-slug-final.m4a, then audio/NN-slug.m4a.
set -e
[ -f tools/local.env ] && . tools/local.env   # your host and paths; see tools/local.env.example
LIB="${LIB:?set LIB in tools/local.env}"
ALBUM_ARTIST="Claude-Pop (fan sessions)"; ALBUM="Post-Training"; YEAR=2026; TOTAL=10
DEST="$LIB/album/$ALBUM_ARTIST - $ALBUM"
CRED="Fan album after Claude-Pop's \"I'm Upping My P(doom)\" (lyrics by osmarks, recording by deckard @slimer48484, video by John Heibel, github.com/JohnHeibel/PDoomVideo). Original lyrics for this track; audio generated with Suno."
SINGLE="${SINGLE:-}"
. tools/lib-publish.sh
rm -f "$DEST"/*.m4a   # album is published as FLAC 44.1 kHz/16-bit (m4a at 48 kHz was silent in Finamp downloads)

echo "→ $DEST"
[ -f "$SINGLE" ] && tag "$SINGLE" - 01 "Claude-Pop" "I'm Upping My P(doom)" \
  "Recording by deckard (@slimer48484), lyrics by osmarks (2024), video by John Heibel. https://x.com/slimer48484/status/2097752569212756134" \
  "$DEST/01. Claude-Pop - I'm Upping My P(doom).flac"
if [ -f video/engine/src/lyrics.js ]; then  # timed lyrics from the PDoomVideo repo → .lrc
  node -e '
const src = require("fs").readFileSync("video/engine/src/lyrics.js", "utf8"); let LY; eval(src.replace(/^const LY/m, "LY"));
const ts = t => { const m = Math.floor(t / 60), s = (t % 60).toFixed(2).padStart(5, "0"); return `[${String(m).padStart(2, "0")}:${s}]`; };
console.log("[ar:Claude-Pop]\n[ti:I\x27m Upping My P(doom)]\n[by:lyrics by osmarks (2024), recording by deckard @slimer48484]");
for (const [a, , txt] of LY) console.log(ts(a) + txt);' > "$TMP/01.lrc" && cp "$TMP/01.lrc" "$DEST/01. Claude-Pop - I'm Upping My P(doom).lrc" && echo "  01  lyrics (.lrc)"
fi

node -e '
const a = require("./album.json");
for (const t of a.tracks) console.log(t.num + "\t" + t.slug + "\t" + t.title);' |
while IFS="$(printf '\t')" read -r n slug title; do
  src=""; for c in "audio/masters/$slug.wav" "audio/$slug-final.m4a" "audio/$slug.m4a"; do [ -f "$c" ] && { src=$c; break; }; done
  [ -n "$src" ] || continue
  safe=$(printf '%s' "$title" | tr '/:' '--')
  cover="out/covers/${slug#??-}.png"; [ -f "$cover" ] || cover="audio/$slug.jpeg"   # painted cover first, Suno thumbnail as fallback
  tag "$src" "$cover" "$n" "$ALBUM_ARTIST" "$title" "$CRED" "$DEST/$n. $ALBUM_ARTIST - $safe.flac"
  # Lyrics sidecar (Jellyfin shows .txt next to the track). Section tags dropped, blank line between sections.
  lyrics_txt "$n" > "$TMP/l.txt"
  cp "$TMP/l.txt" "$DEST/$n. $ALBUM_ARTIST - $safe.txt"
done

jellyfin_scan
