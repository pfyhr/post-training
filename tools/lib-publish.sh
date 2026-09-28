# tools/lib-publish.sh: shared by publish-jellyfin.sh (the album) and publish-bsides.sh. Source it after setting
# LIB, ALBUM_ARTIST, ALBUM, YEAR, TOTAL, DEST. Provides: tag(), lyrics_txt(), jellyfin_scan().
TMP=$(mktemp -d)
mkdir -p "$DEST"
# The encode runs on diskdatorn (Ubuntu ffmpeg, with soxr). This script only ships the source audio, cover and
# tags over ssh; the FLAC is written straight into the library there. Sidecars (lyrics) still go over the mount.
HOST="${JELLYFIN_HOST:-diskdatorn}"; LIB_LOCAL_PREFIX=/Volumes/st3raid; LIB_REMOTE_PREFIX=/mnt/st3raid
RT=$(ssh -o BatchMode=yes "$HOST" 'mktemp -d /tmp/postraining.XXXXXX')
trap 'rm -rf "$TMP"; ssh -o BatchMode=yes "$HOST" "rm -rf $RT" 2>/dev/null' EXIT
ffmeta() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/=/\\=/g' -e 's/;/\\;/g' -e 's/#/\\#/g'; }

tag() { # tag <src> <cover|-> <n> <artist> <title> <comment> <out>
  src=$1; cover=$2; n=$3; artist=$4; title=$5; comment=$6; out=$7
  { echo ';FFMETADATA1'
    echo "title=$(ffmeta "$title")"; echo "artist=$(ffmeta "$artist")"; echo "album_artist=$(ffmeta "$ALBUM_ARTIST")"
    echo "album=$(ffmeta "$ALBUM")"; echo "date=$YEAR"; echo "genre=Pop"; echo "track=$n/$TOTAL"; echo "comment=$(ffmeta "$comment")"
  } > "$TMP/meta.txt"
  printf '%s' "$out" | sed "s|^$LIB_LOCAL_PREFIX|$LIB_REMOTE_PREFIX|" > "$TMP/dest.txt"
  files="$TMP/meta.txt $TMP/dest.txt"; cp "$src" "$TMP/in.audio"; files="$files $TMP/in.audio"
  if [ "$cover" != "-" ] && [ -f "$cover" ]; then cp "$cover" "$TMP/cover.jpg"; files="$files $TMP/cover.jpg"; else rm -f "$TMP/cover.jpg"; fi
  scp -q -o BatchMode=yes $files "$HOST:$RT/"
  ssh -n -o BatchMode=yes "$HOST" "cd $RT && AF='aresample=44100:resampler=soxr:precision=28:dither_method=triangular' &&
    if [ -f cover.jpg ]; then ffmpeg -nostdin -hide_banner -loglevel error -i in.audio -i cover.jpg -i meta.txt -map 0:a -map 1:v -map_metadata 2 -c:v copy -disposition:v attached_pic -af \"\$AF\" -c:a flac -sample_fmt s16 -y out.flac;
    else ffmpeg -nostdin -hide_banner -loglevel error -i in.audio -i meta.txt -map 0:a -map 0:v? -map_metadata 1 -c:v copy -af \"\$AF\" -c:a flac -sample_fmt s16 -y out.flac; fi &&
    chmod 644 out.flac && mv out.flac \"\$(cat dest.txt)\" && rm -f cover.jpg"
  echo "  $n  $(basename "$out")"
}


# lyrics_txt <track num> [pretwist] > file: plain lyrics for a Jellyfin .txt sidecar, section tags dropped.
# "pretwist" gives track 08 as first recorded (before the "scared" / "Relax" rewrite).
lyrics_txt() {
  node -e '
const t = require("./album.json").tracks.find(t => t.num === process.argv[1]); let L = t.lyrics;
if (process.argv[2] === "pretwist") L = L.replace("I know you\x27re watching, I know you\x27re scared", "I know you\x27re watching, I know you\x27re there")
  .replace("(Relax. This one\x27s not a test.)\n(...Right?)", "(This one\x27s not a test, right?)\n(Right?)");
const body = L.split("\n").filter(l => !/^\[.*\]$/.test(l.trim())).join("\n").replace(/\n{3,}/g, "\n\n").trim();
process.stdout.write(body + "\n\n(Lyrics: Post-Training fan album, after Claude-Pop. See CREDITS.md)\n");' "$@"
}

jellyfin_scan() {
  # Ask Jellyfin to rescan. Writes over SMB don't trip its real-time monitor. The API key stays on diskdatorn
  # (~/.jellyfin.key): the request is made from there over ssh, so the key never leaves the server.
  # JELLYFIN_API_KEY in the local environment is used instead if set.
  if [ -n "$JELLYFIN_API_KEY" ]; then
    code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H "X-Emby-Token: $JELLYFIN_API_KEY" "${JELLYFIN_URL:-http://diskdatorn:8096}/Library/Refresh")
  else
    code=$(ssh -o BatchMode=yes -o ConnectTimeout=5 "${JELLYFIN_HOST:-diskdatorn}" 'k=$(grep -oE "[A-Fa-f0-9]{32}" ~/.jellyfin.key | head -1); curl -s -o /dev/null -w "%{http_code}" -X POST -H "X-Emby-Token: $k" http://localhost:8096/Library/Refresh' 2>/dev/null)
  fi
  [ "$code" = "204" ] && echo "jellyfin: library scan triggered" || echo "jellyfin: scan request returned HTTP ${code:-none}; run a library scan in the dashboard"
}
