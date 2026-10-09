/**
 * Valida data/paleta.json y escribe sus colores como variables --p-* en
 * css/sitio.css, entre las marcas «paleta:inicio» y «paleta:fin».
 * Uso: npm run paleta. Con cualquier error no escribe y sale con código 1.
 */
const fs = require('fs');
const path = require('path');
const { validarPaleta, cssPaleta, FAMILIAS } = require('./lib/paleta');

const RAIZ = path.join(__dirname, '..');
const paleta = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'paleta.json'), 'utf8'));
const errores = validarPaleta(paleta);
if (errores.length) {
    errores.forEach(e => console.error(`✖ ${e}`));
    process.exit(1);
}

const rutaCss = path.join(RAIZ, 'css', 'sitio.css');
const css = fs.readFileSync(rutaCss, 'utf8');
const bloque = cssPaleta(paleta);
const re = /\/\* paleta:inicio[\s\S]*?\/\* paleta:fin \*\/\n?/;
const nuevo = re.test(css) ? css.replace(re, bloque) : css.trimEnd() + '\n\n' + bloque;
fs.writeFileSync(rutaCss, nuevo, 'utf8');
console.log(`Paleta válida: ${FAMILIAS.map(f => `${paleta[f].length} ${f}`).join(', ')}. Escrita en css/sitio.css.`);
