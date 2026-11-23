import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  throw new Error('dist/index.html no existe. Ejecuta primero npm run build.');
}

const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.readdirSync(assetsDir);
const cssFile = assetFiles.find((f) => f.endsWith('.css'));
const jsFile = assetFiles.find((f) => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  throw new Error('No se encontraron los archivos CSS/JS compilados en dist/assets.');
}

const rawHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const rawCss = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8').replace(/<\/style/gi, '<\\/style');
const rawJs = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8').replace(/<\/script/gi, '<\\/script');

const embeddedImagePaths = [
  {
    key: 'assets/aistudio/Gemini_Generated_Image_eb7x8web7x8web7x_3a088f0f.jpg',
    mime: 'image/jpeg',
  },
  {
    key: 'assets/aistudio/Gemini_Generated_Image_m64qb7m64qb7m64q_2e2a64ac.jpg',
    mime: 'image/jpeg',
  },
  {
    key: 'assets/aistudio/Ilustraci_n_editorial_sobre_la_UF_chilena_b75f89aa.png',
    mime: 'image/png',
  },
];

const inlineAssets = {};
for (const item of embeddedImagePaths) {
  const filePath = path.join(publicDir, item.key);
  if (fs.existsSync(filePath)) {
    const b64 = fs.readFileSync(filePath).toString('base64');
    inlineAssets[item.key] = `data:${item.mime};base64,${b64}`;
  }
}

let standaloneHtml = rawHtml
  // Remove external Vite stylesheet and module script tags
  .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, '')
  .replace(/<script[^>]*type=["']module["'][^>]*src=["'][^"']+["'][^>]*><\/script>\s*/gi, '');

// Inject inline CSS into <head>
standaloneHtml = standaloneHtml.replace(
  '</head>',
  `  <style>\n${rawCss}\n  </style>\n</head>`
);

// Inject inline asset map and bundled app script before </body>
const assetsScript = `<script>window.__DESCIFRA_ASSETS__=${JSON.stringify(inlineAssets)};</script>`;
const appScript = `<script>(function(){\n${rawJs}\n})();</script>`;

standaloneHtml = standaloneHtml.replace(
  '</body>',
  `  ${assetsScript}\n  ${appScript}\n</body>`
);

const outputPublicPath = path.join(publicDir, 'descifra-standalone.txt');
fs.writeFileSync(outputPublicPath, standaloneHtml, 'utf8');

const docsDir = path.join(rootDir, 'docs');
if (fs.existsSync(docsDir)) {
  fs.writeFileSync(path.join(docsDir, 'descifra-standalone.txt'), standaloneHtml, 'utf8');
}

const sizeMb = (Buffer.byteLength(standaloneHtml, 'utf8') / (1024 * 1024)).toFixed(2);
console.log(`Standalone index.html generado en public/descifra-standalone.txt (${sizeMb} MB)`);
