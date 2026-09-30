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
  // Saturation is baked in here rather than applied as a CSS filter: a filter
  // on an image that also transforms on scroll forced a repaint every frame.
  { in: '7.jpg', out: 'konoha-dusk.webp', crop: { left: 0, top: 758, width: 736, height: 390 }, modulate: { saturation: 1.3, brightness: 1.12 } },
  // Kurama over Naruto - Skills banner.
  // The source has an 8px light border down its left edge; crop past it.
  { in: '8.jpg', out: 'kurama.webp', crop: { left: 10, top: 40, width: 726, height: 620 } },
];

for (const job of JOBS) {
  let img = sharp(`${SRC}/${job.in}`);
  if (job.crop) img = img.extract(job.crop);
  if (job.modulate) img = img.modulate(job.modulate);
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

// A wider, softer ring for the glow around the travelling light. The loader
// used to get that glow from a CSS drop-shadow filter on the rotating layer,
// which re-blurred the whole thing every frame; a pre-blurred mask costs
// nothing at runtime.
const glowGrown = await sharp(alpha, { raw: { width, height, channels: 1 } })
  .blur(16)
  .threshold(6)
  .extractChannel(0)
  .raw()
  .toBuffer();
const glowRing = Buffer.alloc(width * height);
for (let p = 0; p < width * height; p++) {
  glowRing[p] = glowGrown[p] > 0 && alpha[p] < 60 ? 255 : 0;
}
const softGlow = await sharp(glowRing, { raw: { width, height, channels: 1 } })
  .blur(7)
  .extractChannel(0)
  .raw()
  .toBuffer();
const glowRgba = Buffer.alloc(width * height * 4);
for (let p = 0; p < width * height; p++) {
  glowRgba[p * 4] = 255;
  glowRgba[p * 4 + 1] = 255;
  glowRgba[p * 4 + 2] = 255;
  glowRgba[p * 4 + 3] = softGlow[p];
}
await sharp(glowRgba, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile('public/naruto/sage-outline-glow.png');

// The head itself, re-encoded smaller for the loader.
const headInfo = await sharp(head).webp({ quality: 88, alphaQuality: 90 }).toFile('public/naruto/sage-head.webp');
console.log(`outline masks -> public/naruto/sage-outline{,-glow}.png  ${width}x${height}`);
console.log(`head -> public/naruto/sage-head.webp  ${(headInfo.size / 1024).toFixed(0)} KB`);

// Favicons: Sage Naruto's head in a Konoha-orange ring on ink, replacing the
// Lovable default. Small sizes zoom in on the face so it still reads at 16-32px.
const badge = async (size, zoom, rounded, faceY = 0.3) => {
  const ring = Math.max(2, Math.round(size * 0.05));
  const inner = size - ring * 2;
  const headPx = Math.round(inner * zoom);
  const headBuf = await sharp(head)
    .resize(headPx, headPx)
    .extract({
      left: Math.round((headPx - inner) / 2),
      top: Math.round((headPx - inner) * faceY),
      width: inner,
      height: inner,
    })
    .png()
    .toBuffer();
  const r = size / 2;
  const svg = rounded
    ? `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#f47b20"/><circle cx="${r}" cy="${r}" r="${r - ring}" fill="#0b0c10"/></svg>`
    : `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#0b0c10"/><rect x="${ring / 2}" y="${ring / 2}" width="${size - ring}" height="${size - ring}" rx="${size * 0.22}" fill="none" stroke="#f47b20" stroke-width="${ring}"/></svg>`;
  const clip = Buffer.from(
    `<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="#fff"/></svg>`,
  );
  const clippedHead = await sharp(headBuf).composite([{ input: clip, blend: 'dest-in' }]).png().toBuffer();
  return sharp(Buffer.from(svg)).composite([{ input: clippedHead, left: ring, top: ring }]).png();
};

await (await badge(32, 1.3, true, 0.55)).toFile('public/favicon-32.png');
await (await badge(192, 1.2, true)).toFile('public/favicon-192.png');
await (await badge(512, 1.2, true)).png({ palette: true, quality: 90 }).toFile('public/favicon-512.png');
// iOS masks its own corners and ignores transparency, so this one is opaque.
await (await badge(180, 1.2, false)).flatten({ background: '#0b0c10' }).toFile('public/apple-touch-icon.png');
console.log('favicons -> public/favicon-{32,192,512}.png, apple-touch-icon.png');

// Link-preview image (1200x630), replacing the Lovable preview screenshot.
const ogArt = await sharp(`${SRC}/7.jpg`)
  .extract({ left: 0, top: 772, width: 736, height: 376 })
  .resize(1200, 630, { fit: 'cover', position: 'bottom' })
  .modulate({ saturation: 1.3, brightness: 1.08 })
  .toBuffer();
const ogText = Buffer.from(`<svg width="1200" height="630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#07070b" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="#07070b" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#07070b" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="name" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#ffb347"/><stop offset="0.45" stop-color="#f47b20"/><stop offset="1" stop-color="#c8321f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text x="72" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="10" fill="#ffb347">SAGE LEVEL DEVELOPER</text>
  <text x="66" y="380" font-family="Georgia, 'Times New Roman', serif" font-size="150" fill="url(#name)">MATTHEW</text>
  <text x="72" y="450" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#ffffff" fill-opacity="0.8">Full-Stack &amp; AI Engineer - that's my Ninja way</text>
</svg>`);
await sharp(ogArt).composite([{ input: ogText }]).jpeg({ quality: 86 }).toFile('public/og-image.jpg');
console.log('share image -> public/og-image.jpg');
