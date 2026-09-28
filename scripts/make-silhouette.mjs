/**
 * Turns a JPG with a flat-ish background into a PNG cutout with real alpha.
 *
 * The loading screen traces a light around the character's outline, which needs
 * an actual silhouette rather than a rectangle. A global brightness threshold
 * punches holes through his dark undershirt, so this flood-fills inward from
 * the borders instead: background is only what is reachable from the edge, and
 * each step compares against the neighbour it came from, which follows a smooth
 * gradient without leaking across the subject's edge.
 */
import sharp from 'sharp';

const [, , inPath, outPath, stepTolRaw, edgeFeatherRaw, cropRaw] = process.argv;
const STEP_TOL = Number(stepTolRaw ?? 26); // per-step colour distance
const FEATHER = Number(edgeFeatherRaw ?? 1.2);

// Optional "left,top,width,height". Cropping to a region the background fully
// surrounds is what keeps the fill from leaking through dark clothing that
// touches the frame edge.
const crop = cropRaw ? cropRaw.split(',').map(Number) : null;

const src = crop
  ? sharp(inPath).extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] })
  : sharp(inPath);
const { data: cropped, info } = await src.png().toBuffer({ resolveWithObject: true });
const width = info.width;
const height = info.height;
const { data } = await sharp(cropped).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const idx = (x, y) => (y * width + x) * 4;
const isBg = new Uint8Array(width * height);
const queue = [];

const push = (x, y, fromR, fromG, fromB) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (isBg[p]) return;
  const i = idx(x, y);
  const d =
    Math.abs(data[i] - fromR) + Math.abs(data[i + 1] - fromG) + Math.abs(data[i + 2] - fromB);
  if (d > STEP_TOL) return;
  isBg[p] = 1;
  queue.push(x, y);
};

// Seed from every border pixel.
for (let x = 0; x < width; x++) {
  push(x, 0, data[idx(x, 0)], data[idx(x, 0) + 1], data[idx(x, 0) + 2]);
  push(x, height - 1, data[idx(x, height - 1)], data[idx(x, height - 1) + 1], data[idx(x, height - 1) + 2]);
}
for (let y = 0; y < height; y++) {
  push(0, y, data[idx(0, y)], data[idx(0, y) + 1], data[idx(0, y) + 2]);
  push(width - 1, y, data[idx(width - 1, y)], data[idx(width - 1, y) + 1], data[idx(width - 1, y) + 2]);
}

while (queue.length) {
  const y = queue.pop();
  const x = queue.pop();
  const i = idx(x, y);
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  push(x + 1, y, r, g, b);
  push(x - 1, y, r, g, b);
  push(x, y + 1, r, g, b);
  push(x, y - 1, r, g, b);
}

// Build an 8-bit mask, blur it slightly so the cut edge is not stair-stepped,
// then attach it as the alpha channel of the original pixels.
const mask = Buffer.alloc(width * height);
for (let p = 0; p < width * height; p++) mask[p] = isBg[p] ? 0 : 255;

// extractChannel keeps the result single-channel: sharp otherwise widens a
// blurred greyscale buffer to 3 channels, and indexing that as 1 channel
// scrambles every row.
const softMask = await sharp(mask, { raw: { width, height, channels: 1 } })
  .blur(FEATHER)
  .extractChannel(0)
  .raw()
  .toBuffer();

for (let p = 0; p < width * height; p++) data[p * 4 + 3] = softMask[p];

await sharp(data, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

const kept = mask.reduce((n, v) => n + (v ? 1 : 0), 0);
console.log(
  `${inPath} -> ${outPath}  ${width}x${height}  subject ${(kept / (width * height) * 100).toFixed(1)}% of frame`,
);
