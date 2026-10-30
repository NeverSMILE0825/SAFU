import { cp, mkdir, rm, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'src');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(src, dist, { recursive: true });
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
await writeFile(resolve(dist, 'index.html'), html.replace('</head>', '  <!-- SAFU production build: self-hosted static files, no runtime dependencies -->\n</head>'));
console.log('\n✓ SAFU production website built in dist/');
console.log('✓ Static HTML, CSS, JS modules, images, favicon, metadata');
console.log('✓ Deploy the dist/ directory to Netlify, Vercel, Cloudflare Pages, or any static host.\n');
