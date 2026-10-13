'use strict';

/**
 * Parte el enunciado oficial de un tema (el del BOE, que puede pasar de 400
 * caracteres) en su primera frase y el resto, para enseñarlo con dos pesos: la
 * primera frase como título y el resto debajo, en letra menor. No cambia ni una
 * letra: titulo + ' ' + resto vuelve a dar el enunciado.
 *
 * Corta en el primer «. » o «: » que no esté dentro de un paréntesis y al que
 * siga una mayúscula, una cifra o una comilla. «Sector de bienes de equipo (I):
 * Maquinaria…» da el título «Sector de bienes de equipo (I):», y «Otros sectores
 * … (Condimentos y especias. Platos preparados).» no se parte.
 */
function partirEnunciado(texto) {
    const t = String(texto || '').trim();
    let nivel = 0;
    for (let i = 0; i < t.length - 2; i++) {
        const c = t[i];
        if (c === '(') nivel++;
        else if (c === ')') nivel = Math.max(0, nivel - 1);
        else if (nivel === 0 && (c === '.' || c === ':') && t[i + 1] === ' ' && /[A-ZÁÉÍÓÚÑ«¿0-9]/.test(t[i + 2])) {
            return { titulo: t.slice(0, i + 1), resto: t.slice(i + 2) };
        }
    }
    return { titulo: t, resto: '' };
}

// El título sin su punto o sus dos puntos finales, para un encabezado.
const sinPuntoFinal = (titulo) => titulo.replace(/[.:]\s*$/, '');

module.exports = { partirEnunciado, sinPuntoFinal };
