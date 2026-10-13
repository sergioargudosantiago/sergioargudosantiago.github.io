#!/usr/bin/env node
'use strict';

/**
 * Saca del BOE el programa oficial de la oposición (anexo I de la convocatoria):
 * ejercicios, partes y el enunciado literal de cada tema. Escribe
 * temas/programa.json, que es de donde salen los nombres de los esquemas en el
 * listado de esquemas.html y en la cabecera de cada esquema.
 *
 *   pdftotext -enc UTF-8 -layout convocatoria.pdf convocatoria.txt
 *   node scripts/programa-boe.js convocatoria.txt
 *
 * Hay que repetirlo cuando salga una convocatoria con el programa cambiado. El
 * texto se copia tal cual: no se corrige ni se abrevia nada.
 */

const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, '..', 'temas', 'programa.json');
const EJERCICIO = { Primer: 1, Tercer: 3, Quinto: 5 };

const limpia = (l) => l
    .replace(/[  -​ ]/g, ' ')   // el BOE pone espacio de cuadratín tras el número
    .replace(/cve: BOE-A-\d+-\d+/, '')
    .replace(/Verificable en https:\/\/www\.boe\.es/, '')
    .replace(/\s+$/, '');
// Cabecera que el BOE repite en cada página.
const esCabecera = (t) => /BOLET[ÍI]N OFICIAL DEL ESTADO/.test(t) || /^N[úu]m\. \d+\s/.test(t);

function leerPrograma(texto) {
    const lineas = texto.split(/\r?\n/);
    const ini = lineas.findIndex(l => /^\s*ANEXO I\s*$/.test(limpia(l)));
    const fin = lineas.findIndex((l, i) => i > ini && /^\s*ANEXO II\b/.test(l));
    if (ini < 0 || fin < 0) throw new Error('No encuentro el anexo I en el texto.');

    const cve = (texto.match(/BOE-A-\d+-\d+/) || [''])[0];
    const numero = (texto.match(/N[úu]m\. (\d+)\s+(\S+ \d+ de \S+ de \d+)/) || []);
    const programa = { fuente: { cve, boe: numero[1] ? `BOE núm. ${numero[1]}, ${numero[2].toLowerCase()}` : '' }, ejercicios: {} };

    let ej = null, parte = null, tema = null, enNota = false;
    const cierra = () => {
        if (tema) { programa.ejercicios[ej].temas[tema.n] = tema.t.replace(/\s+/g, ' ').trim(); tema = null; }
    };

    for (let i = ini + 1; i < fin; i++) {
        const t = limpia(lineas[i]).trim();
        if (esCabecera(t)) continue;
        let m;
        if ((m = t.match(/^[IVX]+\. (Primer|Tercer|Quinto) ejercicio$/))) {
            cierra(); ej = EJERCICIO[m[1]]; parte = null; enNota = false;
            programa.ejercicios[ej] = { partes: [], temas: {} };
            continue;
        }
        if (!ej) continue;
        // «Parte A. Comercio de mercancías. Análisis sectorial1»: el 1 final es la
        // llamada a la nota.
        if ((m = t.match(/^Parte ([A-Z])\. (.+?)\d?$/))) {
            cierra(); enNota = false;
            parte = { letra: m[1], titulo: m[2].trim(), desde: null, hasta: null };
            programa.ejercicios[ej].partes.push(parte);
            continue;
        }
        if (/^Nota\d/.test(t)) { cierra(); enNota = true; parte.nota = t.replace(/^Nota\d\.\s*/, ''); continue; }
        if (!t) { enNota = false; continue; }
        const siguiente = Object.keys(programa.ejercicios[ej].temas).length + (tema ? 2 : 1);
        if ((m = t.match(/^(\d{1,2})\. (.+)$/)) && Number(m[1]) === siguiente) {
            cierra(); enNota = false;
            tema = { n: Number(m[1]), t: m[2] };
            if (parte) { parte.desde = parte.desde || tema.n; parte.hasta = tema.n; }
            continue;
        }
        if (enNota) { parte.nota += ' ' + t; continue; }
        // Línea que acaba en guion: es un guion del propio texto («Máquina-
        // herramienta», «Decretos-leyes»), no un corte de palabra.
        if (tema) tema.t += (/-$/.test(tema.t) ? '' : ' ') + t;
    }
    cierra();
    return programa;
}

if (require.main === module) {
    const entrada = process.argv[2];
    if (!entrada) { console.error('Uso: node scripts/programa-boe.js <convocatoria.txt>'); process.exit(1); }
    const programa = leerPrograma(fs.readFileSync(entrada, 'utf8'));
    fs.writeFileSync(SALIDA, JSON.stringify(programa, null, 2) + '\n');
    for (const [e, p] of Object.entries(programa.ejercicios)) {
        console.log(`ejercicio ${e}: ${Object.keys(p.temas).length} temas, partes ${p.partes.map(x => `${x.letra} ${x.desde}-${x.hasta}`).join(', ')}`);
    }
    console.log(`-> ${path.relative(process.cwd(), SALIDA)}`);
}

module.exports = { leerPrograma };
