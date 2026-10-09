/**
 * Paleta maestra (data/paleta.json): validación y bloque CSS.
 * Lo usan scripts/generar-paleta.js y sus tests.
 */
const FAMILIAS = ['flujos', 'sectores', 'paises', 'balanza'];
const HEX = /^#[0-9a-fA-F]{6}$/;

function luminancia(hex) {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
    const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
}

function validarPaleta(p) {
    const errores = [];
    for (const f of FAMILIAS) {
        if (!Array.isArray(p[f]) || !p[f].length) { errores.push(`falta la familia «${f}»`); continue; }
        const vistos = new Set();
        for (const c of p[f]) {
            if (vistos.has(c.id)) errores.push(`${f}: id «${c.id}» repetido`);
            vistos.add(c.id);
            for (const modo of ['claro', 'oscuro']) {
                if (!HEX.test(c[modo] || '')) { errores.push(`${f}.${c.id}: hex ${modo} mal formado («${c[modo]}»)`); continue; }
                for (const fondo of p.superficies[modo]) {
                    const r = contraste(c[modo], fondo);
                    if (r < 3) errores.push(`${f}.${c.id}: contraste ${r.toFixed(2)} sobre ${fondo} en ${modo}, por debajo de 3:1`);
                }
            }
        }
    }
    return errores;
}

function cssPaleta(p) {
    const lineas = modo => FAMILIAS.flatMap(f => p[f].map(c => `    --p-${f}-${c.id}: ${c[modo]};`)).join('\n');
    return [
        '/* paleta:inicio · generado por scripts/generar-paleta.js desde data/paleta.json, no editar a mano */',
        ':root {', lineas('claro'), '}',
        'html.dark {', lineas('oscuro'), '}',
        '/* paleta:fin */', ''
    ].join('\n');
}

module.exports = { validarPaleta, contraste, cssPaleta, FAMILIAS };
