'use strict';

/**
 * Símbolo de la marca: la «S de intercambio» (S de Sergio, de Santiago y de SOIVRE).
 * Rejilla de 120 × 120. La mitad de arriba sale (exportación), la barra central es
 * el saldo y la mitad de abajo entra (importación).
 */

const PIEZAS = {
    salida: [
        ['rect', { x: 8, y: 12, width: 80, height: 20 }],
        ['polygon', { points: '86,2 114,22 86,42' }],
        ['rect', { x: 8, y: 12, width: 20, height: 48 }],
    ],
    saldo: [
        ['rect', { x: 8, y: 50, width: 104, height: 20 }],
    ],
    entrada: [
        ['rect', { x: 92, y: 50, width: 20, height: 58 }],
        ['rect', { x: 32, y: 88, width: 80, height: 20 }],
        ['polygon', { points: '34,78 6,98 34,118' }],
    ],
};

const VARIANTES = {
    color: { fondo: '#3B4533', salida: '#E0C46B', saldo: '#FFFFFF', entrada: '#C2D9C2', opacidadSaldo: 1 },
    claro: { fondo: '#C2D9C2', salida: '#3B4533', saldo: '#3B4533', entrada: '#3B4533', opacidadSaldo: 0.55 },
    oscuro: { fondo: '#3B4533', salida: '#C2D9C2', saldo: '#C2D9C2', entrada: '#C2D9C2', opacidadSaldo: 0.55 },
    negro: { fondo: '#0d0d0d', salida: '#FFFBDB', saldo: '#FFFBDB', entrada: '#FFFBDB', opacidadSaldo: 0.55 },
    amarillo: { fondo: '#FFFBDB', salida: '#0d0d0d', saldo: '#0d0d0d', entrada: '#0d0d0d', opacidadSaldo: 0.55 },
};

function atributos(o) {
    return Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');
}

function piezas(colores) {
    return Object.entries(PIEZAS).map(([grupo, lista]) => lista.map(([etiqueta, a]) => {
        const extra = {};
        if (colores[grupo]) extra.fill = colores[grupo];
        if (grupo === 'saldo' && colores.opacidadSaldo !== undefined && colores.opacidadSaldo < 1) extra.opacity = colores.opacidadSaldo;
        return `<${etiqueta} ${atributos({ ...a, ...extra })}/>`;
    }).join('')).join('');
}

function variante(nombre) {
    const v = VARIANTES[nombre];
    if (!v) throw new Error(`Variante desconocida: ${nombre}`);
    return v;
}

function simboloG(nombre, x, y, lado) {
    const v = variante(nombre);
    return `<g transform="translate(${x}, ${y}) scale(${+(lado / 120).toFixed(4)})">${piezas(v)}</g>`;
}

function simboloSVG(nombre, lado) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 120 120">${piezas(variante(nombre))}</svg>`;
}

function simboloCabecera() {
    return `<svg viewBox="0 0 120 120" aria-hidden="true" fill="currentColor">${piezas({ opacidadSaldo: 0.55 })}</svg>`;
}

module.exports = { PIEZAS, VARIANTES, piezas, simboloG, simboloSVG, simboloCabecera };
