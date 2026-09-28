import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { metalRough, textureCompress, dedup, prune, weld } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'fs';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
});

const JOBS = [
  { file: 'naruto_shippuden.glb',                 specGloss: true,  tex: 1024 },
  { file: 'naruto_uzumaki_running_animation.glb', specGloss: false, tex: 1024 },
  { file: 'ichiraku_ramen_-_naruto.glb',          specGloss: false, tex: 1024 },
  { file: 'naruto_baryon.glb',                    specGloss: false, tex: null },
];

for (const job of JOBS) {
  const src = 'public/models/' + job.file;
  const before = fs.statSync(src).size;
  console.log('\n>>> ' + job.file + '  (' + (before / 1048576).toFixed(2) + ' MB)');

  const doc = await io.read(src);
  const transforms = [];
  if (job.specGloss) transforms.push(metalRough());
  transforms.push(dedup(), prune());
  if (job.tex) transforms.push(textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [job.tex, job.tex] }));
  transforms.push(weld());
  await doc.transform(...transforms);

  // Sketchfab writes metallic=1/roughness=1 as a default when the source had no
  // metal map. Fully metallic with no env map renders black, so clamp those
  // materials to a stylised non-metal surface.
  let clamped = 0;
  for (const m of doc.getRoot().listMaterials()) {
    if (m.getMetallicFactor() > 0.5 && !m.getMetallicRoughnessTexture()) {
      m.setMetallicFactor(0).setRoughnessFactor(0.75);
      clamped++;
    }
  }
  if (clamped) console.log('    clamped ' + clamped + ' fully-metallic material(s) -> metal=0');

  doc.createExtension(KHRDracoMeshCompression)
    .setRequired(true)
    .setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });

  const out = src.replace('.glb', '.opt.glb');
  await io.write(out, doc);
  const after = fs.statSync(out).size;
  console.log('    ' + (before / 1048576).toFixed(2) + ' MB -> ' + (after / 1048576).toFixed(2)
    + ' MB  (' + (100 - after / before * 100).toFixed(1) + '% smaller)');

  const r = doc.getRoot();
  console.log('    skins=' + r.listSkins().length + ' animations=' + r.listAnimations().length
    + ' meshes=' + r.listMeshes().length + ' materials=' + r.listMaterials().length);
  console.log('    ' + r.listMaterials().slice(0, 3).map(m =>
    m.getName() + '[tex=' + (m.getBaseColorTexture() ? 'Y' : 'n')
    + ' metal=' + m.getMetallicFactor().toFixed(2)
    + ' rough=' + m.getRoughnessFactor().toFixed(2) + ']').join(' '));
}
