const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { validarPaleta, contraste, cssPaleta } = require('./paleta');
const PALETA = require(path.join(__dirname, '..', '..', 'data', 'paleta.json'));
const copia = x => JSON.parse(JSON.stringify(x));

test('contraste WCAG: blanco sobre negro es 21', () => {
    assert.strictEqual(Math.round(contraste('#FFFFFF', '#000000')), 21);
});

test('la paleta publicada no tiene errores', () => {
    assert.deepStrictEqual(validarPaleta(PALETA), []);
});

test('un tono con contraste < 3:1 se rechaza', () => {
    const p = copia(PALETA);
    p.sectores[0].claro = '#f0f0a0';
    assert.ok(validarPaleta(p).some(e => e.includes('alimentacion') && e.includes('3:1')));
});

test('un hex mal formado se rechaza', () => {
    const p = copia(PALETA);
    p.flujos[0].oscuro = '#12345';
    assert.ok(validarPaleta(p).some(e => e.includes('exportaciones') && e.includes('hex')));
});

test('falta una familia o se repite un id', () => {
    const p = copia(PALETA);
    delete p.balanza;
    p.paises[1].id = 'francia';
    const err = validarPaleta(p);
    assert.ok(err.some(e => e.includes('balanza')));
    assert.ok(err.some(e => e.includes('francia') && e.includes('repetido')));
});

test('insertar el bloque dos veces no cambia el CSS, también con CRLF', () => {
    const { insertarBloque } = require('./paleta');
    const bloque = cssPaleta(PALETA);
    for (const fin of ['\n', '\r\n']) {
        const base = ['a { color: red; }', '', ''].join(fin);
        const una = insertarBloque(base, bloque);
        const crlf = una.replace(/\r?\n/g, fin);
        assert.strictEqual(insertarBloque(crlf, bloque).replace(/\r\n/g, '\n'), una.replace(/\r\n/g, '\n'));
    }
});

test('el CSS lleva marcas, :root y html.dark', () => {
    const css = cssPaleta(PALETA);
    assert.ok(css.startsWith('/* paleta:inicio'));
    assert.ok(css.trimEnd().endsWith('/* paleta:fin */'));
    assert.ok(css.includes(':root {') && css.includes('html.dark {'));
    assert.ok(css.includes('--p-flujos-exportaciones: #2B6CA3;'));
    assert.ok(css.includes('--p-flujos-exportaciones: #4a8fcc;'));
});
