'use strict';

/**
 * Cabecera, pie y recursos comunes a todas las páginas.
 *
 * La fuente está en src/parciales/*.html. En cada página van entre marcas
 * <!-- nombre:inicio --> y <!-- nombre:fin -->; scripts/sincronizar-parciales.js
 * rellena las páginas sueltas y scripts/build-articulos.js las de artículos.
 *
 * En los parciales, {{raiz}} es el prefijo hasta la raíz del sitio ('' o '../')
 * y data-seccion="x" marca el enlace que lleva aria-current en la sección x.
 */

const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..', '..', 'src', 'parciales');
const NOMBRES = ['recursos', 'cabecera', 'pie'];

function leer(nombre) {
    return fs.readFileSync(path.join(DIR, `${nombre}.html`), 'utf8').replace(/\s+$/, '');
}

/** El parcial ya resuelto, con sus marcas alrededor. */
function bloque(nombre, { raiz = '', seccion = null } = {}) {
    let html = leer(nombre).split('{{raiz}}').join(raiz);
    if (seccion) {
        html = html.split(`data-seccion="${seccion}"`).join(`data-seccion="${seccion}" aria-current="page"`);
    }
    return `<!-- ${nombre}:inicio -->\n${html}\n    <!-- ${nombre}:fin -->`;
}

/**
 * Sustituye en `html` todos los bloques marcados. Lanza si a la página le
 * falta alguna marca: mejor un error que una página que se queda atrás.
 */
function aplicar(html, opciones) {
    for (const nombre of NOMBRES) {
        const re = new RegExp(`<!-- ${nombre}:inicio -->[\\s\\S]*?<!-- ${nombre}:fin -->`);
        if (!re.test(html)) throw new Error(`falta el bloque <!-- ${nombre}:inicio --> … <!-- ${nombre}:fin -->`);
        const nuevo = bloque(nombre, opciones);
        html = html.replace(re, () => nuevo);
    }
    return html;
}

module.exports = { bloque, aplicar };
