const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { partirEnunciado, sinPuntoFinal } = require('./enunciado');
const PROGRAMA = require(path.join(__dirname, '..', '..', 'temas', 'programa.json'));

test('un enunciado de una frase no se parte', () => {
    assert.deepStrictEqual(partirEnunciado('Sector de cítricos.'), { titulo: 'Sector de cítricos.', resto: '' });
});

test('corta en el primer punto seguido de mayúscula', () => {
    assert.deepStrictEqual(
        partirEnunciado('El comercio internacional. Marco general y principales magnitudes.'),
        { titulo: 'El comercio internacional.', resto: 'Marco general y principales magnitudes.' });
});

test('corta en los dos puntos de una serie numerada', () => {
    assert.strictEqual(
        partirEnunciado('Sector de bienes de equipo (I): Maquinaria para la industria. Motores.').titulo,
        'Sector de bienes de equipo (I):');
});

test('no corta dentro de un paréntesis ni ante minúscula', () => {
    const t = 'Otros sectores agroalimentarios no incluidos en temas anteriores (Condimentos y especias. Platos preparados).';
    assert.strictEqual(partirEnunciado(t).resto, '');
    assert.strictEqual(
        partirEnunciado('El régimen aduanero del comercio exterior: la política aduanera comunitaria. El código aduanero.').titulo,
        'El régimen aduanero del comercio exterior: la política aduanera comunitaria.');
});

test('sinPuntoFinal quita el punto o los dos puntos del final', () => {
    assert.strictEqual(sinPuntoFinal('La OCDE:'), 'La OCDE');
    assert.strictEqual(sinPuntoFinal('Sector lácteo.'), 'Sector lácteo');
});

test('el programa del BOE tiene los 159 temas y ninguno pierde texto al partirlo', () => {
    const esperados = { 1: 55, 3: 58, 5: 46 };
    for (const [ej, n] of Object.entries(esperados)) {
        const temas = PROGRAMA.ejercicios[ej].temas;
        assert.strictEqual(Object.keys(temas).length, n, `ejercicio ${ej}`);
        for (const [num, texto] of Object.entries(temas)) {
            const { titulo, resto } = partirEnunciado(texto);
            assert.strictEqual(resto ? `${titulo} ${resto}` : titulo, texto, `ejercicio ${ej}, tema ${num}`);
        }
    }
});

test('las partes del programa cubren todos los temas sin huecos', () => {
    for (const [ej, p] of Object.entries(PROGRAMA.ejercicios)) {
        let siguiente = 1;
        for (const parte of p.partes) {
            assert.strictEqual(parte.desde, siguiente, `ejercicio ${ej}, parte ${parte.letra}`);
            siguiente = parte.hasta + 1;
        }
        assert.strictEqual(siguiente - 1, Object.keys(p.temas).length, `ejercicio ${ej}`);
    }
});
