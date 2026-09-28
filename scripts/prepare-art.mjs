/**
 * Prepares the Naruto artwork used around the site: crops each piece to the
 * part that suits its slot, re-encodes to WebP, and derives an outline mask
 * from the loading-screen silhouette so a light can travel around its edge.
 *
 * Run after scripts/make-silhouette.mjs has produced src/assets/naruto/sage-head.png.
 */
import sharp from 'sharp';

const SRC = 'src/assets/naruto';

const JOBS = [
  // Genin Naruto on a manga collage - the start of the journey (About).
  { in: '2.jpg', out: 'genin-manga.webp', crop: { left: 0, top: 60, width: 736, height: 1060 } },
  // "that's my Ninja way" under the mountain - the destination (About).
  { in: '4.jpg', out: 'ninja-way.webp' },
  // Sage Mode on crimson - the 404 page.
  { in: '5.jpg', out: 'sage-crimson.webp', crop: { left: 0, top: 420, width: 736, height: 888 } },
  // Back turned between manga pages - AI Gallery header.
  { in: '6.jpg', out: 'manga-walk.webp', crop: { left: 0, top: 280, width: 736, height: 1028 } },
  // Village and Hokage rock at dusk, below the baked-in quote - quote band.
  { in: '7.jpg', out: 'konoha-dusk.webp', crop: { left: 0, top: 758, width: 736, height: 390 } },
  // Kurama over Naruto - Skills banner.
  // The source has an 8px light border down its left edge; crop past it.
  { in: '8.jpg', out: 'kurama.webp', crop: { left: 10, top: 40, width: 726, height: 620 } },
];

for (const job of JOBS) {
  let img = sharp(`${SRC}/${job.in}`);
  if (job.crop) img = img.extract(job.crop);
  const info = await img.webp({ quality: 84, effort: 5 }).toFile(`${SRC}/${job.out}`);
  console.log(`${job.in} -> ${job.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// Outline ring = silhouette grown outward minus the silhouette itself. Used as
// a CSS mask over a rotating conic gradient, so the light runs round his
// outline rather than round a circle.
// Master cutout from make-silhouette.mjs; kept out of public/ so it does not ship.
const head = 'src/assets/naruto/sage-head.png';
const { width, height } = await sharp(head).metadata();
const alpha = await sharp(head).extractChannel('alpha').raw().toBuffer();

const grown = await sharp(alpha, { raw: { width, height, channels: 1 } })
  .blur(7)
  .threshold(18)
  .extractChannel(0)
  .raw()
  .toBuffer();

const ring = Buffer.alloc(width * height);
for (let p = 0; p < width * height; p++) {
  ring[p] = grown[p] > 0 && alpha[p] < 140 ? 255 : 0;
}

const softRing = await sharp(ring, { raw: { width, height, channels: 1 } })
  .blur(1.4)
  .extractChannel(0)
  .raw()
  .toBuffer();

const rgba = Buffer.alloc(width * height * 4);
for (let p = 0; p < width * height; p++) {
  rgba[p * 4] = 255;
  rgba[p * 4 + 1] = 255;
  rgba[p * 4 + 2] = 255;
  rgba[p * 4 + 3] = softRing[p];
}
await sharp(rgba, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile('public/naruto/sage-outline.png');

// The head itself, re-encoded smaller for the loader.
const headInfo = await sharp(head).webp({ quality: 88, alphaQuality: 90 }).toFile('public/naruto/sage-head.webp');
console.log(`outline mask -> public/naruto/sage-outline.png  ${width}x${height}`);
console.log(`head -> public/naruto/sage-head.webp  ${(headInfo.size / 1024).toFixed(0)} KB`);
