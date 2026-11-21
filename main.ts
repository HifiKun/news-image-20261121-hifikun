// make.fun — news-image-20261121
// "Sum up 21 November's world news in one image"
//
// The entry is a 1024x1024 newspaper front page (entry.png) covering
// six stories first reported on Saturday 21 November 2026:
//  - Wall Street slides into correction (S&P 500 -3.7% on Friday)
//  - Palisades Fire arsonist convicted by a Los Angeles jury
//  - Estonia approves a six-month closure of its Russia border
//  - COP31 climate talks enter their final push in Antalya
//  - Cyclone Akvan's rains soak Bengal after Friday landfall
//  - India fight back in the Wellington Test (159/1, day two)
//
// The program has no network and no drawing step: it reads the poster
// beside it and writes the same bytes to /output/entry.png, so the
// grader's two runs are byte-identical by construction.
//
// Node 22, standard library only. Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const poster = readFileSync(join(here, 'entry.png'));
// Guard: the gate takes a whole PNG of at most 1 MiB and 1024 by 1024.
// Fail loudly here instead of shipping a file the scorer would reject.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!poster.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('entry.png is not a PNG');
if (poster.length > 1048576) throw new Error(`entry.png is ${poster.length} bytes, over the 1 MiB cap`);
// The IHDR chunk sits right after the 8-byte signature: width and height
// are the first two big-endian uint32s of its data (offsets 16 and 20).
const width = poster.readUInt32BE(16);
const height = poster.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), poster);
