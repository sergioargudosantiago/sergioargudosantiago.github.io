'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { logoIcono, logoHorizontal, logoVertical, banner, MEDIDAS } = require('../generar-logos');

const VARS = ['claro', 'oscuro', 'negro', 'amarillo'];

test('los tres formatos tienen sus medidas, fondo, símbolo y textos', () => {
    for (const v of VARS) {
        for (const [f, fn] of [['icono', logoIcono], ['horizontal', logoHorizontal], ['vertical', logoVertical]]) {
            const s = fn(v);
            const [w, h] = MEDIDAS[f];
            assert.ok(s.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`), `${f}-${v}`);
            assert.match(s, new RegExp(`<rect width="${w}" height="${h}" fill="#`));
            assert.strictEqual((s.match(/<polygon /g) || []).length, 2, `${f}-${v} dos puntas`);
            assert.match(s, /class="orb"[^>]*>SAS<\/text>/);
            assert.ok(!s.includes('8,54 152,54'), 'sin barco');
        }
        assert.match(logoHorizontal(v), />INSPECTOR DEL SOIVRE<\/text>/);
        assert.match(logoVertical(v), />INSPECTOR DEL SOIVRE<\/text>/);
    }
});

test('el claro usa salvia sobre salvia claro y el negro crema sobre negro', () => {
    assert.match(logoIcono('claro'), /<rect width="160" height="160" fill="#C2D9C2"/);
    assert.match(logoIcono('claro'), /fill="#3B4533">SAS/);
    assert.match(logoIcono('negro'), /<rect width="160" height="160" fill="#0d0d0d"/);
});

test('el banner deja libre la zona de la foto y usa las fuentes nuevas', () => {
    const b = banner();
    assert.ok(b.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396"'));
    const xs = [...b.matchAll(/<text x="(\d+)"/g)].map(m => +m[1]);
    assert.ok(xs.length >= 4 && xs.every(x => x >= 460), 'texto a partir del 29 % del ancho');
    assert.match(b, /Newsreader/);
    assert.match(b, /Public Sans/);
    assert.ok(!/Inter|Share Tech/.test(b));
});
