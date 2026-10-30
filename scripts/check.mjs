import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname,'..');
const targets = ['src/index.html','src/styles.css','src/main.js','src/config.js',...['safu-mascot','story-collage','gallery-01','gallery-02','gallery-03','gallery-04','featured-vault','hero-scene'].map(x=>`src/assets/${x}.webp`)];
for (const path of targets) { await access(resolve(root,path)); console.log('✓',path); }
const h = await readFile(resolve(root,'src/index.html'),'utf8');
for (const id of ['story','memes','mission','how-to','lightbox','heroContract']) if (!h.includes(`id="${id}"`)) throw Error(`Missing section ${id}`);
console.log(`\n✓ ${targets.length} source files and all primary sections verified`);
