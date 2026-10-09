'use strict';

/** Lectura de medidas de PNG y escritura de ICO con PNG incrustados (sin dependencias). */

const FIRMA_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function medidasPng(buf) {
    if (buf.length < 24 || !buf.subarray(0, 8).equals(FIRMA_PNG)) throw new Error('No es un PNG');
    return { ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) };
}

function crearIco(pngs) {
    const cabecera = Buffer.alloc(6);
    cabecera.writeUInt16LE(0, 0);
    cabecera.writeUInt16LE(1, 2);
    cabecera.writeUInt16LE(pngs.length, 4);
    const entradas = [];
    let desplazamiento = 6 + 16 * pngs.length;
    for (const png of pngs) {
        const { ancho, alto } = medidasPng(png);
        const e = Buffer.alloc(16);
        e.writeUInt8(ancho >= 256 ? 0 : ancho, 0);
        e.writeUInt8(alto >= 256 ? 0 : alto, 1);
        e.writeUInt16LE(1, 4);
        e.writeUInt16LE(32, 6);
        e.writeUInt32LE(png.length, 8);
        e.writeUInt32LE(desplazamiento, 12);
        desplazamiento += png.length;
        entradas.push(e);
    }
    return Buffer.concat([cabecera, ...entradas, ...pngs]);
}

module.exports = { medidasPng, crearIco };
