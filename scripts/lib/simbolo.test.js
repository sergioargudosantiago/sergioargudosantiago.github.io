'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { VARIANTES, piezas, simboloG, simboloSVG, simboloCabecera } = require('./simbolo');

const cuenta = (s, re) => (s.match(re) || []).length;

test('el símbolo tiene siete piezas: cinco rectángulos y dos puntas', () => {
    const s = piezas({});
    assert.strictEqual(cuenta(s, /<rect /g), 5);
    assert.strictEqual(cuenta(s, /<polygon /g), 2);
    assert.ok(!s.includes('fill='), 'sin colores no se escribe fill');
});

test('las cinco variantes de la spec existen con sus colores', () => {
    assert.deepStrictEqual(Object.keys(VARIANTES).sort(), ['amarillo', 'claro', 'color', 'negro', 'oscuro']);
    assert.deepStrictEqual(VARIANTES.color, { fondo: '#3B4533', salida: '#E0C46B', saldo: '#FFFFFF', entrada: '#C2D9C2', opacidadSaldo: 1 });
    assert.strictEqual(VARIANTES.negro.fondo, '#0d0d0d');
    assert.strictEqual(VARIANTES.negro.salida, '#FFFBDB');
    for (const v of ['claro', 'oscuro', 'negro', 'amarillo']) assert.strictEqual(VARIANTES[v].opacidadSaldo, 0.55);
});

test('la barra central lleva opacidad solo en las variantes de una tinta', () => {
    assert.strictEqual(cuenta(simboloG('claro', 0, 0, 120), /opacity="0.55"/g), 1);
    assert.strictEqual(cuenta(simboloG('color', 0, 0, 120), /opacity=/g), 0);
});

test('simboloG escala a lado/120 y coloca en x, y', () => {
    assert.match(simboloG('oscuro', 10, 20, 60), /<g transform="translate\(10, 20\) scale\(0.5\)">/);
});

test('variante desconocida lanza error', () => {
    assert.throws(() => simboloG('azul', 0, 0, 10), /Variante desconocida: azul/);
});

test('simboloSVG y simboloCabecera devuelven svg válidos sin barco', () => {
    const a = simboloSVG('color', 92);
    assert.match(a, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="92" height="92" viewBox="0 0 120 120">/);
    const c = simboloCabecera();
    assert.match(c, /^<svg viewBox="0 0 120 120" aria-hidden="true" fill="currentColor">/);
    assert.strictEqual(cuenta(c, /opacity="0.55"/g), 1);
    assert.ok(!c.includes('8,54 152,54'));
});
