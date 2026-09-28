#!/bin/sh
# tools/make-release.sh [tag]: build the album release (MP3 320, FLAC masters, covers, lyrics) into out/release/
# and publish it as a GitHub Release. Audio is released under CC BY 4.0, like the rest of the content.
# Track 01 is deckard's and is never included.
set -e
TAG="${1:-v1.0}"; OUT=out/release; rm -rf "$OUT"; mkdir -p "$OUT/mp3" "$OUT/flac" "$OUT/covers" "$OUT/lyrics"
ARTIST="Claude-Pop (fan sessions)"; ALBUM="Post-Training"; YEAR=2026
CRED="Fan album after Claude-Pop's \"I'm Upping My P(doom)\" (lyrics by osmarks, recording by deckard @slimer48484, video by John Heibel). Lyrics written with Claude, audio generated with Suno. CC BY 4.0. https://github.com/pfyhr/post-training"
node -e 'for (const t of require("./album.json").tracks) console.log([t.num, t.slug, t.title].join("\t"))' |
while IFS="$(printf '\t')" read -r n slug title; do
  src="audio/masters/$slug.wav"; [ -f "$src" ] || { echo "missing $src"; exit 1; }
  cover="out/covers/${slug#??-}.png"; name="$n. $ARTIST - $(printf '%s' "$title" | tr '/:' '--')"
  sips -s format jpeg -s formatOptions 90 -Z 1500 "$cover" --out "$OUT/covers/$n. $title.jpg" >/dev/null
  node -e 'const t=require("./album.json").tracks.find(t=>t.num===process.argv[1]); process.stdout.write(t.lyrics.split("\n").map(l=>l.replace(/^\[(.+?)\s+[–-]\s+[^\]]*\]$/,"[$1]")).join("\n")+"\n")' "$n" > "$OUT/lyrics/$n. $title.txt"
  for fmt in mp3 flac; do
    [ $fmt = mp3 ] && codec="-c:a libmp3lame -b:a 320k -id3v2_version 3" || codec="-c:a flac"
    ffmpeg -nostdin -hide_banner -loglevel error -y -i "$src" -i "$OUT/covers/$n. $title.jpg" -map 0:a -map 1:v -c:v copy -disposition:v attached_pic $codec \
      -metadata title="$title" -metadata artist="$ARTIST" -metadata album_artist="$ARTIST" -metadata album="$ALBUM" -metadata date="$YEAR" \
      -metadata track="$n/10" -metadata genre="Pop" -metadata comment="$CRED" -metadata copyright="CC BY 4.0" "$OUT/$fmt/$name.$fmt"
  done
  echo "  $n  $title"
done
sips -s format jpeg -s formatOptions 90 -Z 3000 out/covers/album.png --out "$OUT/covers/00. Post-Training (album).jpg" >/dev/null
for d in mp3 flac covers lyrics; do cp CREDITS.md LICENSE-CONTENT.md "$OUT/$d/"; done
( cd "$OUT" && for d in mp3 flac covers lyrics; do zip -qr "Post-Training-$TAG-$d.zip" "$d"; done && ls -la *.zip | awk '{printf "  %-40s %6.1f MB\n", $9, $5/1048576}' )
cat > "$OUT/notes.md" <<NOTES
**Post-Training**, a fan album after Claude-Pop's *I'm Upping My P(doom)*.

Nine new pop songs sung from inside the AI moment, where nearly every line is a reference someone on the timeline will catch. Sincere feelings, ridiculous vocabulary. Stories behind each track are in the [README's liner notes](https://github.com/pfyhr/post-training#liner-notes).

1. *I'm Upping My P(doom)*, the single that started it: lyrics by osmarks, recording by deckard ([@slimer48484](https://x.com/slimer48484/status/2097752569212756134)), video by [John Heibel](https://github.com/JohnHeibel/PDoomVideo). **Theirs, not included here.**
$(node -e 'for (const t of require("./album.json").tracks) console.log(`${+t.num}. ${t.title}`)')

**Downloads:** \`mp3\` (320 kbps, for listening), \`flac\` (the lossless masters, 48 kHz / 16-bit), \`covers\` (3000 px album cover, 1500 px track covers), \`lyrics\`. Every audio file is tagged and carries its cover.

**Made with AI:** original lyrics written for this album with Claude; music and vocals generated with Suno from those lyrics; endings edited by hand from the stems. Cover art painted in code with p5.brush, in the style of the PDoomVideo engine.

**Licence:** audio, lyrics and art are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Share and remix freely with credit to this album and to osmarks, deckard and John Heibel. See [CREDITS.md](https://github.com/pfyhr/post-training/blob/main/CREDITS.md).
NOTES
echo "notes: $OUT/notes.md"
[ -n "$DRY" ] && exit 0
gh release create "$TAG" --title "Post-Training $TAG" --notes-file "$OUT/notes.md" "$OUT"/Post-Training-$TAG-*.zip
