import fs from 'fs';
import path from 'path';

const modelsDir = 'models';
const publicModelsDir = path.join('public', 'models');

if (!fs.existsSync(publicModelsDir)) {
  fs.mkdirSync(publicModelsDir, { recursive: true });
}

const files = [
  { src: path.join(modelsDir, 'ichiraku_ramen_-_naruto.glb'), dest: 'ichiraku_ramen.glb' },
  { src: path.join(modelsDir, 'naruto_baryon.glb'), dest: 'naruto_baryon.glb' },
  { src: path.join(modelsDir, 'naruto_shippuden.glb'), dest: 'naruto_shippuden.glb' },
  { src: path.join(modelsDir, 'naruto_uzumaki_running_animation.glb'), dest: 'naruto_running.glb' },
  { src: 'naruto_shippuden.glb', dest: 'naruto_shippuden_root.glb' } // just in case
];

files.forEach(file => {
  const srcPath = path.resolve(file.src);
  const destPath = path.resolve(publicModelsDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Moving ${srcPath} to ${destPath}`);
    fs.copyFileSync(srcPath, destPath);
    // fs.unlinkSync(srcPath); // Keep originals for now
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
});
