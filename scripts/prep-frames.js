/**
 * prep-frames.js — turn the 4K background film into a scroll-scrubbable frame set.
 *
 * Why frames and not a <video>: scrubbing a video by `currentTime` is not
 * frame-accurate. Inter-frame codecs have to decode from the last keyframe on
 * every seek, so a scroll-driven scrub stutters and drifts. Making the video
 * all-intra fixes the seeking and destroys the file size. A frame sequence is
 * what Apple's product pages use, and it is the only approach that holds 60fps
 * while the scrub direction changes every few pixels.
 *
 * Sizing is set by two limits, and neither one is bandwidth:
 *
 *  1. MEMORY. A decoded frame costs width * height * 4 bytes regardless of how
 *     well it compressed. At 2200px that is 10.8MB each, so a 200-frame set
 *     would ask the browser to juggle 2GB of decoded bitmaps. At 1600px it is
 *     5.7MB, which the image cache can evict its way through comfortably.
 *
 *  2. WHAT THE FRAME IS FOR. This is an abstract fluid backdrop sitting behind
 *     glass panels and body copy — it is never read for detail. Resolution
 *     beyond the display's own is spent on pixels nobody looks at, whereas
 *     FRAME COUNT is what makes the scrub feel liquid instead of steppy.
 *
 * Measured on this footage: 1600px at quality 86 lands ~50KB/frame, so the
 * desktop set is ~10MB — smaller than a single stock hero video, and it caches.
 *
 * Usage:  node scripts/prep-frames.js
 */

const { execFileSync } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Source lives outside public/ — public/ is served AND deployed, and a 377MB
// upload on every build is not a thing anyone wants.
const SRC = path.join(ROOT, 'assets', 'video', 'background.mp4');
const OUT = path.join(ROOT, 'public', 'bg-frames');

/**
 * Two tiers, chosen at runtime by viewport width.
 *
 * Mobile is not just "smaller": a phone is portrait, so a 16:9 plate gets
 * cropped to roughly its middle third. Fewer frames there too — a phone scrolls
 * a shorter page and has less memory to spend.
 */
const TIERS = [
  { name: 'desktop', width: 1600, frames: 200, quality: 86 },
  { name: 'mobile', width: 960, frames: 100, quality: 80 },
];

const sh = (cmd, args) =>
  execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26 });

function probe() {
  const out = sh('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=0',
    SRC,
  ]);
  const get = (k) => {
    const m = new RegExp(`^${k}=(.+)$`, 'm').exec(out);
    return m ? m[1].trim() : null;
  };
  return {
    width: +get('width'),
    height: +get('height'),
    duration: +get('duration'),
  };
}

function dirSizeKb(dir) {
  return fs.readdirSync(dir)
    .reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0) / 1024;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`\n  Source not found: ${path.relative(ROOT, SRC)}`);
    console.error('  Put background.mp4 there (it is gitignored) and re-run.\n');
    process.exit(1);
  }

  const meta = probe();
  const aspect = meta.width / meta.height;
  console.log(
    `\nsource  ${meta.width}x${meta.height}  ${meta.duration.toFixed(2)}s  aspect ${aspect.toFixed(3)}\n`
  );

  const manifest = { aspect: +aspect.toFixed(5), tiers: {} };

  for (const tier of TIERS) {
    const dir = path.join(OUT, tier.name);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    // Spread the requested frames evenly across the whole clip rather than
    // taking the first N — the loop has to read as one continuous move.
    const fps = tier.frames / meta.duration;
    const height = Math.round(tier.width / aspect / 2) * 2;

    sh('ffmpeg', [
      '-v', 'error',
      '-i', SRC,
      '-vf', `fps=${fps.toFixed(6)},scale=${tier.width}:-2:flags=lanczos`,
      '-c:v', 'libwebp',
      '-quality', String(tier.quality),
      '-compression_level', '6',
      '-y',
      path.join(dir, '%04d.webp'),
    ]);

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).sort();
    const kb = dirSizeKb(dir);

    manifest.tiers[tier.name] = {
      count: files.length,
      width: tier.width,
      height,
      // Decoded cost of the whole set, which is the number that actually
      // constrains this — see the note at the top.
      decodedMb: +((files.length * tier.width * height * 4) / 1e6).toFixed(0),
    };

    console.log(
      `✓ ${tier.name.padEnd(8)} ${String(files.length).padStart(3)} frames  ` +
      `${tier.width}x${height}  ${(kb / 1024).toFixed(1)}MB total  ` +
      `${(kb / files.length).toFixed(0)}KB/frame`
    );
  }

  fs.writeFileSync(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
  console.log(`\nwrote → public/bg-frames/\n`);
}

/**
 * The still plate the film hands over to.
 *
 * The source is 1376px, which a 1080p screen at 2x DPR magnifies ~2.8x to fill
 * — and a GPU bilinear stretch at that ratio is exactly what "looks blurry"
 * means. Upscaling here with Lanczos and re-sharpening invents no detail, but
 * it preserves edge acutance that the bilinear path throws away.
 */
async function tail() {
  const src = path.join(ROOT, 'assets', 'background.png');
  if (!fs.existsSync(src)) {
    console.log('no assets/background.png — skipping tail plate\n');
    return;
  }
  const meta = await sharp(src).metadata();
  const width = 2400;
  const out = path.join(OUT, 'tail.webp');

  await sharp(src)
    .resize(width, null, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 90 })
    .toFile(out);

  const kb = fs.statSync(out).size / 1024;
  console.log(
    `✓ tail     ${meta.width}x${meta.height} → ${width}px  ${(kb / 1024).toFixed(1)}MB\n`
  );
}

main();
tail();
