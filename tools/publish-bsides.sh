#!/bin/sh
# tools/publish-bsides.sh: publish the alternate takes as "Post-Training (B-Sides)" in the Jellyfin library.
# One line per track in the list below: number | source audio | cover | title | lyrics (album track num [pretwist]).
set -e
[ -f tools/local.env ] && . tools/local.env   # your host and paths; see tools/local.env.example
LIB="${LIB:?set LIB in tools/local.env}"
ALBUM_ARTIST="Claude-Pop (fan sessions)"; ALBUM="Post-Training (B-Sides)"; YEAR=2026
DEST="$LIB/album/$ALBUM_ARTIST - $ALBUM"
CRED="B-side of a fan album after Claude-Pop's \"I'm Upping My P(doom)\" (lyrics by osmarks, recording by deckard @slimer48484, video by John Heibel, github.com/JohnHeibel/PDoomVideo). Original lyrics; audio generated with Suno."
TRACKS='01|audio/05-reward-hacking-take1.m4a|out/covers/reward-hacking-boat.png|Reward Hacking (first take)|05
02|audio/08-situational-awareness-alt-wild-final.m4a|out/covers/situational-awareness.png|Situational Awareness (wild)|08 pretwist
03|audio/08-situational-awareness-alt-poppy-final.m4a|out/covers/situational-awareness.png|Situational Awareness (before the twist)|08 pretwist'
TOTAL=$(printf '%s\n' "$TRACKS" | wc -l | tr -d ' ')
. tools/lib-publish.sh
echo "→ $DEST"
printf '%s\n' "$TRACKS" | while IFS='|' read -r n src cover title lyr; do
  safe=$(printf '%s' "$title" | tr '/:' '--')
  tag "$src" "$cover" "$n" "$ALBUM_ARTIST" "$title" "$CRED" "$DEST/$n. $ALBUM_ARTIST - $safe.flac"
  lyrics_txt $lyr > "$TMP/l.txt"; cp "$TMP/l.txt" "$DEST/$n. $ALBUM_ARTIST - $safe.txt"
done
jellyfin_scan
