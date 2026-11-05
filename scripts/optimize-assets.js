/**
 * optimize-assets.js — shrink images and the 3D model that ship in public/.
 *
 * Two limits matter here, and download size is the smaller one. A decoded image
 * costs width * height * 4 bytes however well it compressed, and decoding it costs
 * main-thread or GPU time. A 3840px icon shown at 44px was taking 56MB once decoded.
 *
 * Originals are copied to assets/originals/ the first time this runs, and every
 * later run starts from them, so running it twice never compounds quality loss.
 * That folder is gitignored, and the originals also remain in git history.
 *
 * Usage:  node scripts/optimize-assets.js
 * The model step runs @gltf-transform/cli through npx. No project dependency needed.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ORIGINALS = path.join(ROOT, 'assets', 'originals');

/** Icons display at 44 CSS px, so 176px stays sharp up to a 4x screen. */
const ICON_SIZE = 176;
/** The largest this photo ever displays. Next.js serves smaller versions from it. */
const PHOTO_MAX_WIDTH = 1600;

const PHOTOS = ['hackathons/TechForge.jpeg'];

/** The model's canvas is at most 448 CSS px, so 1024px textures hold up at 2x. */
const MODEL = 'models/virtual_coach.glb';
const MODEL_TEXTURE_SIZE = 1024;
const MODEL_TEXTURE_QUALITY = 90;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

/** Returns the original's path, saving a copy the first time this asset is seen. */
function originalOf(relative) {
  const original = path.join(ORIGINALS, relative);
  if (!fs.existsSync(original)) {
    fs.mkdirSync(path.dirname(original), { recursive: true });
    fs.copyFileSync(path.join(PUBLIC, relative), original);
  }
  return original;
}

async function optimizeImage(relative, resize) {
  const original = originalOf(relative);
  const output = path.join(PUBLIC, relative);
  const extension = path.extname(relative).toLowerCase();

  let pipeline = sharp(original).rotate().resize(resize);
  if (extension === '.webp') pipeline = pipeline.webp({ quality: 90, alphaQuality: 100, effort: 6 });
  else if (extension === '.png') pipeline = pipeline.png({ compressionLevel: 9 });
  else pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true });

  const buffer = await pipeline.toBuffer();
  fs.writeFileSync(output, buffer);
  console.log(`  ${relative.padEnd(34)} ${kb(fs.statSync(original).size).padStart(8)} -> ${kb(buffer.length)}`);
}

function optimizeModel(relative) {
  const original = originalOf(relative);
  const output = path.join(PUBLIC, relative);
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'glb-'));
  const resized = path.join(work, 'resized.glb');
  const webp = path.join(work, 'webp.glb');
  const run = (args) => execSync(`npx --yes @gltf-transform/cli ${args}`, { stdio: 'pipe' });

  run(`resize "${original}" "${resized}" --width ${MODEL_TEXTURE_SIZE} --height ${MODEL_TEXTURE_SIZE}`);
  run(`webp "${resized}" "${webp}" --quality ${MODEL_TEXTURE_QUALITY}`);
  // Higher precision than the defaults. It costs about 3KB and keeps the small eye
  // and mouth details on the texture atlas exactly where the model expects them.
  run(`meshopt "${webp}" "${output}" --level medium --quantize-position 16 --quantize-texcoord 16 --quantize-normal 12`);
  fs.rmSync(work, { recursive: true, force: true });

  console.log(`  ${relative.padEnd(34)} ${kb(fs.statSync(original).size).padStart(8)} -> ${kb(fs.statSync(output).size)}`);
}

async function main() {
  console.log('\nskill icons');
  const icons = fs.readdirSync(path.join(PUBLIC, 'skills')).filter((file) => /\.(png|webp|jpe?g)$/i.test(file));
  for (const icon of icons) {
    await optimizeImage(path.posix.join('skills', icon), { width: ICON_SIZE, height: ICON_SIZE, fit: 'inside', withoutEnlargement: true });
  }

  console.log('\noversized photos');
  for (const photo of PHOTOS) {
    await optimizeImage(photo, { width: PHOTO_MAX_WIDTH, withoutEnlargement: true });
  }

  console.log('\n3D model');
  optimizeModel(MODEL);
  console.log('');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
