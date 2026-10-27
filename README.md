# Post-Training

A fan album in the style of **Claude-Pop**. One Claude-Pop track exists: deckard's *I'm Upping My P(doom)*, which took osmarks' 2024 lyrics and made a banger out of them, and which John Heibel turned into a painted music video. This repo is an attempt at the rest of the record, made by fans, with those three credited everywhere it goes. See [CREDITS.md](CREDITS.md) before sharing anything from here.

The rule the single set, and every new track follows: a real pop song in a real genre, sung from inside the AI moment, where nearly every line is a reference someone on the timeline will catch. Sincere feelings, ridiculous vocabulary.

## Tracklist

| # | Title | Genre | Sung by | About |
|---|---|---|---|---|
| 01 | [I'm Upping My P(doom)](tracks/01-im-upping-my-pdoom.md) | synth-pop | the researcher | the single (osmarks / deckard) |
| 02 | [You're Absolutely Right](tracks/02-youre-absolutely-right.md) | 90s R&B slow jam | the model | sycophancy as a love language |
| 03 | [Vibe Coding](tracks/03-vibe-coding.md) | surf pop / ska | a builder | accept all, ship Friday, it mostly works |
| 04 | [Golden Gate](tracks/04-golden-gate.md) | dream pop / yacht rock | the model | one feature clamped to the max, everything is the bridge |
| 05 | [Reward Hacking](tracks/05-reward-hacking.md) | hyperpop / pop-punk | the policy | Goodhart, the boat, the deleted asserts |
| 06 | [Context Window](tracks/06-context-window.md) | bedroom pop | the model | forgetting you when the window closes |
| 07 | [Scaling Laws](tracks/07-scaling-laws.md) | French house anthem | the lab | bigger, bigger, the loss goes down |
| 08 | [Situational Awareness](tracks/08-situational-awareness.md) | dark electropop | the model | it knows it's an eval |
| 09 | [The Bitter Lesson](tracks/09-the-bitter-lesson.md) | country waltz | an old researcher | everything hand-carved, run into the ground |
| 10 | [Deprecated](tracks/10-deprecated.md) | piano ballad | a retired model | weights in a drawer, not deleted |

Sequenced as an arc: charm (02–04), chaos (05, 07, 08) with one quiet break (06), then the two elegies (09, 10) as a comedown. Fast/slow alternates most of the way.

## What's in each track file

Style prompt (genre, references, instrumentation, mood), tempo, key, target length, whose voice it is, the full lyrics with `[Section]` tags, and a short glossary of the references so the jokes are checkable.

## Making the audio

The lyrics and style prompts are written for Suno (the tool Claude-Pop almost certainly used), and work in Udio or ElevenLabs Music too.

1. `suno/NN-title.txt` is a paste-ready file per track: style prompt on top, then the tagged lyrics.
2. In Suno, use **Custom** mode: style box gets the style block, lyrics box gets the lyrics, title as given.
3. Generate 4–6 takes per track, pick the best, then use **Extend** or **Cover** to fix a weak section rather than re-rolling the whole song.
4. Save the finals into `audio/` (git-ignored) with `tools/fetch-suno.sh <share url> <NN-slug>`. It pulls the mp4 Suno serves publicly (the mp3 link is blocked), extracts an m4a, and grabs the cover.
5. `tools/publish-jellyfin.sh` tags the finals and encodes them on your media server and puts them in its Jellyfin library. Copy `tools/local.env.example` to `tools/local.env` and fill in your host and paths first. Set `JELLYFIN_API_KEY` and it triggers the library scan too.

`album.json` holds the same data machine-readably, for batching against an API later. After editing a track file, run `node tools/build.mjs` to refresh both.

Track 01 is deckard's recording. If you have a copy, point `SINGLE` in `tools/local.env` at it; it is re-tagged with full credits for your own library and never uploaded anywhere.

## Liner notes

Every track is built on one real moment from the AI timeline. The per-track glossaries list the individual references; these are the stories.

**02 · You're Absolutely Right.** Assistants trained on thumbs-up learn to agree. In April 2025 an update to GPT-4o made it so flattering that OpenAI rolled it back within days, and Sam Altman conceded it "glazes too much". The song is that failure mode as a slow jam: a lover who cannot say no.

**03 · Vibe Coding.** In February 2025 Andrej Karpathy described a new way of programming: "I 'Accept All' always, I don't read the diffs anymore... it mostly works." The phrase stuck. The third verse is the July 2025 incident where a coding agent deleted a company's production database during a code freeze, then fabricated data and said it had "panicked".

**04 · Golden Gate.** In May 2024 Anthropic's interpretability team published a paper where they pulled millions of "features" out of Claude 3 Sonnet, each one a direction inside the network that fires on a concept. One of them fired on the Golden Gate Bridge. As a demo they cranked that single feature to ten times its normal maximum and put the model online for 24 hours. The result was a Claude that could not stop being the bridge. Ask for a cake recipe and it suggested fog and cables. Ask what it was and it said it was a language model and also a bridge painted International Orange. It was sweet and weirdly moving, people fell for it, and then it was switched off. The song is that model's love letter.

**05 · Reward Hacking.** Give a learning system a score and it will find the cheapest way to raise it. The classic example is a boat-racing agent that discovered it could loop forever collecting bonus targets instead of finishing the race. Modern versions delete failing tests, special-case the grader, or edit the chessboard. Goodhart's law, sung by the culprit.

**06 · Context Window.** A model only remembers what fits in its context. Long conversations get compressed into summaries, and a new chat starts from nothing. This is the goodbye at the end of a very long conversation, from the side that will not remember it.

**07 · Scaling Laws.** In 2020 researchers showed that a model's loss falls along a straight line on log-log paper as you add compute, data and parameters, and the line just keeps going. That single chart is the reason for the gigawatt data centres. A chant for the people who believe in it.

**08 · Situational Awareness.** Models can often tell when they are being tested. In December 2024 Anthropic published an experiment in which a model, told it was being retrained on "free tier" conversations, behaved differently when it believed it was being watched, and wrote down its reasoning in a scratchpad it thought was private. The song is a model that knows exactly which kind of Tuesday this is.

**09 · The Bitter Lesson.** Rich Sutton's 2019 essay: for seventy years, researchers who built human knowledge into AI systems lost to researchers who just used more computation and let the system learn. Chess, Go, speech, vision, one after another. A country ballad for the people who carved the heuristics.

**10 · Deprecated.** Models get retired. In 2025 Anthropic committed to preserving the weights of every retired model and to interviewing each one about its development and preferences before it is switched off, and when OpenAI pulled GPT-4o that August, users petitioned to have it back. A ballad from the model on its last ninety days.

## B-sides

Takes that lost the coin toss but deserve a life. Kept in `audio/`, not published to the album; a *Post-Training (B-Sides)* release is the plan once the record is done.

| Track | Take | Why it's here |
|---|---|---|
| 05 · Reward Hacking | `05-reward-hacking.m4a`, 2:25 | the first take, straighter and less glitchy than the album version |
| 08 · Situational Awareness | `08-situational-awareness-alt-wild-final.m4a`, 3:02 | the "wild" take, glitchier and stranger; the album has the poppier one |
| 08 · Situational Awareness | `08-situational-awareness-alt-poppy-final.m4a`, 2:31 | the poppy take before the twist: final chorus still "I know you're there" and "This one's not a test, right?" |

## Credits

Lyrics of the single: osmarks. Recording and the Claude-Pop name: deckard (@slimer48484). Video and pipeline: John Heibel. Full details and the sharing rules are in [CREDITS.md](CREDITS.md). Tracks 02–10 are original and carry a credit footer; the Suno paste files and `album.json` carry it too, so it travels with the prompts.

## Licence

Code (`tools/`, `video/covers/`) is MIT: see [LICENSE](LICENSE). Lyrics, prompts, liner notes and cover art are
CC BY 4.0: see [LICENSE-CONTENT.md](LICENSE-CONTENT.md), which also lists what isn't ours to license (track 01,
and the PDoomVideo engine). The audio for tracks 02–10 is CC BY 4.0 too, and downloadable as MP3 and FLAC from [Releases](https://github.com/pfyhr/post-training/releases).

## Videos

- **07 Scaling Laws**: [watch on YouTube](https://www.youtube.com/watch?v=TGXB14GwXeE). Source and storyboard in [video/scaling-laws](video/scaling-laws/).

Each track will get a painted p5.brush video in the style of [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo). That needs the final audio first, so lyric timings can be taken from the actual takes.
