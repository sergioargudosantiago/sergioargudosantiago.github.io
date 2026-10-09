'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { medidasPng, crearIco } = require('./ico');

// PNG mínimo: firma + cabecera IHDR con ancho y alto. Basta para leer medidas.
function pngFalso(ancho, alto) {
    const b = Buffer.alloc(33);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
    b.writeUInt32BE(13, 8);
    b.write('IHDR', 12, 'ascii');
    b.writeUInt32BE(ancho, 16);
    b.writeUInt32BE(alto, 20);
    return b;
}

test('medidasPng lee ancho y alto', () => {
    assert.deepStrictEqual(medidasPng(pngFalso(32, 16)), { ancho: 32, alto: 16 });
});

test('medidasPng rechaza lo que no es PNG', () => {
    assert.throws(() => medidasPng(Buffer.from('GIF89a........................')), /No es un PNG/);
});

test('crearIco escribe cabecera, directorio y datos', () => {
    const a = pngFalso(16, 16), b = pngFalso(256, 256);
    const ico = crearIco([a, b]);
    assert.strictEqual(ico.readUInt16LE(0), 0);
    assert.strictEqual(ico.readUInt16LE(2), 1);
    assert.strictEqual(ico.readUInt16LE(4), 2);
    // Primera entrada: 16 × 16, 32 bits, tamaño y desplazamiento
    assert.strictEqual(ico.readUInt8(6), 16);
    assert.strictEqual(ico.readUInt8(7), 16);
    assert.strictEqual(ico.readUInt16LE(6 + 6), 32);
    assert.strictEqual(ico.readUInt32LE(6 + 8), a.length);
    assert.strictEqual(ico.readUInt32LE(6 + 12), 6 + 16 * 2);
    // Segunda entrada: 256 se escribe como 0
    assert.strictEqual(ico.readUInt8(22), 0);
    assert.strictEqual(ico.readUInt32LE(22 + 12), 6 + 32 + a.length);
    assert.strictEqual(ico.length, 6 + 32 + a.length + b.length);
    assert.ok(ico.subarray(38, 38 + a.length).equals(a));
});
