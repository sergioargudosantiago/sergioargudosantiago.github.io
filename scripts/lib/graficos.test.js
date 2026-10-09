const test = require('node:test');
const assert = require('node:assert');
const G = require('../../js/graficos.js');

test('marcas cubren el rango e incluyen el cero con negativos', () => {
    const m = G.marcas(-48966, 12000);
    assert.ok(m[0] <= -48966 && m[m.length - 1] >= 12000);
    assert.ok(m.includes(0));
    assert.ok(m.length >= 3 && m.length <= 8);
});

test('marcas con rango nulo no se cuelgan', () => {
    assert.deepStrictEqual(G.marcas(0, 0), [0, 1]);
});

test('formato es-ES sin decimales (cuatro cifras sin separador, como pide la RAE)', () => {
    assert.strictEqual(G.formato(49524.4), '49.524');
    assert.strictEqual(G.formato(-12345), '-12.345');
    assert.strictEqual(G.formato(-1234), '-1234');
});

test('variacionPct con base nula o cero devuelve null', () => {
    assert.strictEqual(G.variacionPct(0, 100), null);
    assert.strictEqual(G.variacionPct(null, 100), null);
    assert.strictEqual(G.variacionPct(100, null), null);
    assert.strictEqual(Math.round(G.variacionPct(100, 125)), 25);
});

test('formatoPct: signo explícito, un decimal, guion si null', () => {
    assert.strictEqual(G.formatoPct(12.345), '+12,3 %');
    assert.strictEqual(G.formatoPct(-3), '−3,0 %');
    assert.strictEqual(G.formatoPct(null), '–');
});

test('sumaMovil de 12 empieza en el mes 12', () => {
    const s = G.sumaMovil(Array.from({ length: 14 }, (_, i) => i + 1), 12);
    assert.strictEqual(s.length, 3);
    assert.strictEqual(s[0], 78);
    assert.strictEqual(s[2], 102);
});

test('pasoEtiquetas deja al menos 42 px por etiqueta', () => {
    assert.strictEqual(G.pasoEtiquetas(11, 800), 1);
    assert.ok(G.pasoEtiquetas(11, 300) >= 2);
    assert.ok(G.pasoEtiquetas(88, 330) >= 12);
});

test('anchoDibujable: contenedor oculto no se dibuja', () => {
    assert.strictEqual(G.anchoDibujable(0), false);
    assert.strictEqual(G.anchoDibujable(320), true);
});

test('conAlfa convierte hex a rgba', () => {
    assert.strictEqual(G.conAlfa('#2B6CA3', 0.14), 'rgba(43,108,163,0.14)');
});
