'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Los navegadores guardan los iconos en caché: cada enlace a un icono lleva ?v=N
// para que, al cambiar la marca, se descargue el nuevo.
const RAIZ = path.resolve(__dirname, '..', '..');
const FICHEROS = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'))
    .concat(['scripts/build-articulos.js']);

test('todos los enlaces a iconos llevan versión', () => {
    for (const f of FICHEROS) {
        const c = fs.readFileSync(path.join(RAIZ, f), 'utf8');
        for (const icono of ['SAS-icono-claro.png', 'favicon.ico', 'apple-touch-icon.png']) {
            const enlaces = c.match(new RegExp(`href="[^"]*${icono.replace('.', '\\.')}[^"]*"`, 'g')) || [];
            for (const e of enlaces) assert.match(e, /\?v=\d+"/, `${f}: ${e}`);
        }
    }
});
