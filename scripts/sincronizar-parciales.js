#!/usr/bin/env node
'use strict';

/**
 * Copia la cabecera, el pie y los recursos comunes (src/parciales/) en las
 * páginas sueltas de la raíz.
 *
 *   node scripts/sincronizar-parciales.js        (o: npm run parciales)
 *
 * Las páginas de artículos no se tocan aquí: las regenera build-articulos.js
 * con los mismos parciales. Tras cambiar un parcial, ejecutar los dos.
 */

const fs = require('fs');
const path = require('path');
const { aplicar } = require('./lib/parciales.js');

const RAIZ = path.resolve(__dirname, '..');

// Página -> sección que se marca como actual en la navegación.
const PAGINAS = {
    'index.html': 'inicio',
    'temario.html': 'temario',
    'comercio-exterior.html': 'comercio',
    'metodologia.html': 'comercio',
    'enlaces.html': 'enlaces',
    'sobre-mi.html': 'sobre-mi'
};

const sueltas = fs.readdirSync(RAIZ).filter(f => f.endsWith('.html'));
const sinSeccion = sueltas.filter(f => !(f in PAGINAS));
if (sinSeccion.length) {
    console.error(`Páginas sin sección asignada en PAGINAS: ${sinSeccion.join(', ')}`);
    process.exit(1);
}

let cambiadas = 0;
for (const [pagina, seccion] of Object.entries(PAGINAS)) {
    const ruta = path.join(RAIZ, pagina);
    const antes = fs.readFileSync(ruta, 'utf8');
    let despues;
    try {
        despues = aplicar(antes, { raiz: '', seccion });
    } catch (e) {
        console.error(`${pagina}: ${e.message}`);
        process.exit(1);
    }
    if (despues !== antes) {
        fs.writeFileSync(ruta, despues, 'utf8');
        cambiadas++;
        console.log(`  · ${pagina}`);
    }
}
console.log(`${cambiadas} página(s) actualizada(s).`);
