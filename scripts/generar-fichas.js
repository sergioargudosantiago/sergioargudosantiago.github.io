#!/usr/bin/env node
'use strict';

/**
 * Fichas imprimibles del temario (ejercicio 1, temas 1 a 20): tres páginas A4
 * por tema con los datos de comercio exterior de su sector.
 *
 *   node scripts/generar-fichas.js          (o: npm run fichas)
 *   node scripts/generar-fichas.js 6 12     (solo esos temas)
 *
 * Lee data/flujos_data.csv y scripts/fichas/temas.json (qué rúbricas de
 * DataComex forman cada tema) y escribe public/fichas/tema-NN.html más un
 * índice. Página 1: resumen; página 2: exportación por subsector; página 3:
 * importación por subsector. Para sacar los PDF: npm run fichas:pdf.
 *
 * Todas las cifras salen del CSV: nada se escribe a mano. Las «claves para el
 * tema» se redactan con reglas fijas sobre esos mismos datos; conviene
 * leerlas antes de publicar.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const CSV = path.join(RAIZ, 'data', 'flujos_data.csv');
const CONFIG = path.join(__dirname, 'fichas', 'temas.json');
const SALIDA = path.join(RAIZ, 'public', 'fichas');

const ANIOS = ['2021', '2022', '2023', '2024', '2025'];
const ULTIMO = '2025', PREVIO = '2024';
const EXTRACCION = '4 de julio de 2026';

// --- Datos --------------------------------------------------------------------

function leerCSV(texto) {
    const lineas = texto.replace(/^﻿/, '').trim().split(/\r?\n/);
    const partir = (l) => {
        const out = []; let cur = '', q = false;
        for (let i = 0; i < l.length; i++) {
            const c = l[i];
            if (c === '"') { if (q && l[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
            else if (c === ',' && !q) { out.push(cur); cur = ''; }
            else cur += c;
        }
        out.push(cur);
        return out;
    };
    const cab = partir(lineas[0]);
    return lineas.slice(1).map(l => {
        const v = partir(l), o = {};
        cab.forEach((h, i) => { o[h] = v[i]; });
        o.valor = parseFloat(o.total_millones) || 0;
        return o;
    });
}

/**
 * Cuando un nivel 3 aparece agregado (lv4 = NA) y además con sus hijos de
 * nivel 4, los hijos suman exactamente al padre: se queda una sola versión
 * según el nivel que pida la ficha.
 */
function filasUtiles(filas, nivelFila) {
    const padres = new Set(filas.filter(f => f.lv4 === 'NA').map(f => f.year + '|' + f.flujo + '|' + f.lv3));
    const conHijos = new Set(filas.filter(f => f.lv4 !== 'NA').map(f => f.year + '|' + f.flujo + '|' + f.lv3));
    return filas.filter(f => {
        const k = f.year + '|' + f.flujo + '|' + f.lv3;
        if (nivelFila === 'lv4' && conHijos.has(k)) return f.lv4 !== 'NA';
        return f.lv4 === 'NA' || !padres.has(k);
    });
}

const LIT = { lv1: 'lit_lv1', lv2: 'lit_lv2', lv3: 'lit_lv3', lv4: 'lit_lv4' };

function cumple(fila, filtros) {
    return filtros.some(f => Object.entries(f).every(([nivel, valor]) => fila[LIT[nivel]] === valor));
}

// --- Formato ------------------------------------------------------------------

const limpio = (s) => String(s || '').replace(/\s+/g, ' ').trim();

/** Mayúsculas de DataComex (BIENES DE EQUIPO) a forma de frase. */
function frase(s) {
    s = limpio(s);
    if (s && s === s.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3}/.test(s)) s = s.charAt(0) + s.slice(1).toLowerCase();
    return s;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Miles con punto siempre (es-ES no agrupa los números de cuatro cifras). */
function num(n, dec = 0) {
    const neg = n < 0, a = Math.abs(n);
    const [ent, frac] = a.toFixed(dec).split('.');
    const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '−' : '') + miles + (frac ? ',' + frac : '');
}
const conSigno = (n, dec = 0) => (n > 0 ? '+' : '') + num(n, dec);
const pct = (n, dec = 1) => num(n, dec) + ' %';
const pctSigno = (n, dec = 1) => (n > 0 ? '+' : n < 0 ? '' : '') + num(n, dec) + ' %';

/** Quita «de porcino» de «Carne congelada de porcino» dentro del grupo Porcino. */
function sinGrupo(nombre, grupo) {
    const g = grupo.toLowerCase().replace(/[()]/g, '');
    const re = new RegExp('\\s+de\\s+' + g.replace(/[.*+?^${}|[\]\\]/g, '\\$&') + 's?$', 'i');
    const corto = nombre.replace(re, '');
    return corto.length >= 3 ? corto.charAt(0).toUpperCase() + corto.slice(1) : nombre;
}

// --- Cálculo de una ficha -----------------------------------------------------

function calcular(tema, todas) {
    const utiles = filasUtiles(todas, tema.fila).filter(f =>
        cumple(f, tema.incluir) && !(tema.excluir && cumple(f, tema.excluir)));
    if (!utiles.length) throw new Error(`Tema ${tema.tema}: ningún dato coincide con sus filtros`);

    const total = (flujo, anio) => utiles.filter(f => f.flujo === flujo && f.year === anio).reduce((s, f) => s + f.valor, 0);
    const serie = (flujo) => ANIOS.map(a => total(flujo, a));
    const E = serie('E'), I = serie('I');

    // Filas de detalle: (grupo, fila) con valor, variación, cuota UE y países
    const nivelPais = { lv3: 'top_paises_lv3', lv4: 'top_paises_lv4' }[tema.fila] || 'top_paises_lv3';
    const nivelUE = { lv3: 'pct_ue_lv3', lv4: 'pct_ue_lv4' }[tema.fila] || 'pct_ue_lv3';
    const detalle = (flujo) => {
        const mapa = new Map();
        for (const f of utiles.filter(x => x.flujo === flujo && (x.year === ULTIMO || x.year === PREVIO))) {
            const grupo = frase(f[LIT[tema.grupo]]);
            const nombre = frase(f[LIT[tema.fila]]);
            const k = grupo + '|' + nombre;
            const o = mapa.get(k) || { grupo, nombre, v: 0, vPrev: 0, ue: 0, base: 0, paises: '', paisesPadre: '' };
            if (f.year === ULTIMO) {
                o.v += f.valor;
                const p = parseFloat(f[nivelUE]);
                if (!isNaN(p)) { o.ue += f.valor * p / 100; o.base += f.valor; }
                o.paises = o.paises || limpio(f[nivelPais]);
                o.paisesPadre = limpio(f.top_paises_lv3);
            } else o.vPrev += f.valor;
            mapa.set(k, o);
        }
        const filas = [...mapa.values()].filter(o => o.v > 0.5);
        // En el nivel 4 de algunos sectores el CSV copia en cada hijo los países
        // y la cuota UE del padre: si es así, no se presentan como propios.
        if (tema.fila === 'lv4') {
            const porGrupo = {};
            filas.forEach(o => { (porGrupo[o.grupo] = porGrupo[o.grupo] || []).push(o); });
            Object.values(porGrupo).forEach(hermanos => {
                if (hermanos.length > 1 && hermanos.every(o => o.paises === hermanos[0].paises)) {
                    hermanos.forEach(o => { o.heredado = true; });
                }
            });
        }
        filas.forEach(o => {
            o.var = o.vPrev > 0 ? (o.v / o.vPrev - 1) * 100 : null;
            o.pctUE = o.base > 0 ? o.ue / o.base * 100 : null;
            if (o.nombre.toLowerCase() !== o.grupo.toLowerCase()) o.nombre = sinGrupo(o.nombre, o.grupo);
        });
        const grupos = [];
        for (const o of filas) {
            let g = grupos.find(x => x.nombre === o.grupo);
            if (!g) grupos.push(g = { nombre: o.grupo, total: 0, filas: [] });
            g.total += o.v; g.filas.push(o);
        }
        grupos.forEach(g => g.filas.sort((a, b) => b.v - a.v));
        grupos.sort((a, b) => b.total - a.total);
        return grupos;
    };
    let exp = detalle('E'), imp = detalle('I');

    // Algunos desgloses de nivel 4 del CSV no son datos de DataComex sino un
    // reparto del total con porcentajes fijos (todos los hijos varían igual).
    // Si es así, la ficha no los presenta y se queda en el nivel 3.
    let estimado = false;
    if (tema.fila === 'lv4') {
        estimado = [...exp, ...imp].some(g => g.filas.length > 1 && g.filas.every(o =>
            o.var != null && g.filas[0].var != null && Math.abs(o.var - g.filas[0].var) < 0.05));
        if (estimado) return calcular({ ...tema, fila: 'lv3', grupo: 'lv3', _estimado: true }, todas);
    }

    // Cuota UE del conjunto, ponderada por valor
    const filasE = exp.flatMap(g => g.filas);
    const baseUE = filasE.filter(o => o.pctUE != null).reduce((s, o) => s + o.v, 0);
    const ueTotal = baseUE ? filasE.filter(o => o.pctUE != null).reduce((s, o) => s + o.v * o.pctUE, 0) / baseUE : null;

    // Países del conjunto: solo cuando el tema es una única rúbrica entera
    const unico = (nivel) => {
        const lits = new Set(utiles.map(f => f[LIT[nivel]]));
        return lits.size === 1 && !tema.excluir;
    };
    let destinos = '', origenes = '';
    for (const nivel of ['lv1', 'lv2', 'lv3']) {
        if (unico(nivel) && tema.incluir.length === 1 && Object.keys(tema.incluir[0])[0] === nivel) {
            const campo = 'top_paises_' + nivel;
            destinos = limpio((utiles.find(f => f.flujo === 'E' && f.year === ULTIMO) || {})[campo]);
            origenes = limpio((utiles.find(f => f.flujo === 'I' && f.year === ULTIMO) || {})[campo]);
        }
    }

    return { tema, E, I, exp, imp, ueTotal, destinos, origenes, estimado: !!tema._estimado };
}

// --- Claves para el tema (reglas fijas sobre los datos) -----------------------

function claves(d) {
    const out = [];
    // «Carne congelada» no dice de qué: con varios grupos se añade entre paréntesis
    const variosGrupos = d.exp.length > 1;
    const quien = (o) => esc(o.nombre.toLowerCase()) + (variosGrupos && o.nombre.toLowerCase() !== o.grupo.toLowerCase() ? ' (' + esc(o.grupo.toLowerCase()) + ')' : '');
    const e = d.E[4], i = d.I[4];
    const filasE = d.exp.flatMap(g => g.filas).sort((a, b) => b.v - a.v);
    const filasI = d.imp.flatMap(g => g.filas).sort((a, b) => b.v - a.v);

    if (filasE.length > 1) {
        const top = filasE[0], cuota = top.v / e * 100;
        out.push(`<strong>${quien(top).replace(/^./, c => c.toUpperCase())}</strong> es lo que más se exporta: el ${pct(cuota, 0)} del sector.`);
    }

    const cE = (d.E[4] / d.E[0] - 1) * 100, cI = (d.I[4] / d.I[0] - 1) * 100;
    const cob0 = d.E[0] / d.I[0] * 100, cob1 = e / i * 100;
    out.push(`Desde 2021 la exportación ${cE >= 0 ? 'crece' : 'cae'} un ${pct(Math.abs(cE), 0)} y la importación ${cI >= 0 ? 'crece' : 'cae'} un ${pct(Math.abs(cI), 0)}; la tasa de cobertura pasa del ${pct(cob0, 0)} al ${pct(cob1, 0)}.`);

    if (d.ueTotal != null) {
        const fuera = filasE.filter(o => o.v >= e * 0.05 && o.pctUE != null && !o.heredado && o.pctUE < d.ueTotal - 20)
            .sort((a, b) => a.pctUE - b.pctUE)[0];
        let t = `El <strong>${pct(d.ueTotal, 0)}</strong> de la exportación va a la UE27.`;
        if (fuera) t += ` La excepción es ${quien(fuera)}: solo un ${pct(fuera.pctUE, 0)}, con destino ${esc(fuera.paises)}.`;
        out.push(t);
    }

    const relevantes = filasE.filter(o => o.v >= e * 0.03 && o.var != null);
    if (relevantes.length >= 2) {
        const sube = [...relevantes].sort((a, b) => b.var - a.var)[0];
        const baja = [...relevantes].sort((a, b) => a.var - b.var)[0];
        if (sube.var > 0 && baja.var < 0) {
            out.push(`En ${ULTIMO}, lo que más crece en exportación es ${quien(sube)}, ${pctSigno(sube.var)}, y lo que más cae, ${quien(baja)}, ${pctSigno(baja.var)}.`);
        } else if (sube.var > 0) {
            out.push(`En ${ULTIMO}, lo que más crece en exportación es ${quien(sube)}, ${pctSigno(sube.var)}.`);
        }
    }

    if (filasI.length && i > 0) {
        const topI = filasI[0];
        out.push(`La primera importación es ${quien(topI)}: ${num(topI.v)} M€${topI.paises && !topI.heredado ? ', sobre todo desde ' + esc(topI.paises) : ''}.`);
    }
    return out.slice(0, 5);
}

// --- HTML -----------------------------------------------------------------------

function grafico(E, I) {
    const max = Math.max(...E, ...I);
    const paso = (() => { const p = Math.pow(10, Math.floor(Math.log10(max / 2))); return [1, 2, 2.5, 5, 10].map(m => m * p).find(s => max / s <= 4); })();
    const tope = Math.ceil(max / paso) * paso;
    const x = (k) => 8 + k * 70, y = (v) => 150 - v / tope * 130;
    const linea = (s) => s.map((v, k) => `${x(k)},${y(v).toFixed(1)}`).join(' ');
    const marcas = [];
    for (let v = 0; v <= tope + 1e-9; v += paso) {
        marcas.push(`<line x1="8" x2="288" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="${v === 0 ? '#1F2A1D' : '#E2E7DF'}" stroke-width="1"/>` +
            `<text x="294" y="${(y(v) + 4).toFixed(1)}" class="eje">${num(v)}</text>`);
    }
    return `<svg viewBox="0 0 350 172" class="grafico" role="img" aria-label="Exportación de ${num(E[0])} a ${num(E[4])} M€ e importación de ${num(I[0])} a ${num(I[4])} M€ entre 2021 y 2025">
${marcas.join('\n')}
<polyline points="${linea(I)}" fill="none" stroke="#EB6834" stroke-width="2.5" stroke-linejoin="round"/>
<polyline points="${linea(E)}" fill="none" stroke="#2A78D6" stroke-width="2.5" stroke-linejoin="round"/>
<text x="8" y="168" class="eje">2021</text><text x="270" y="168" class="eje">2025</text>
</svg>`;
}

function paginaResumen(d, nTema) {
    const e = d.E[4], i = d.I[4], ePrev = d.E[3], iPrev = d.I[3];
    const vE = (e / ePrev - 1) * 100, vI = (i / iPrev - 1) * 100;
    const saldo = e - i, cob = e / i * 100;
    const tabla = d.exp.length >= 2
        ? d.exp.map(g => {
            const gi = d.imp.find(x => x.nombre === g.nombre);
            const vi = gi ? gi.total : 0;
            return [g.nombre, g.total, vi];
        })
        : d.exp[0].filas.slice(0, 6).map(o => {
            const oi = d.imp.flatMap(g => g.filas).find(x => x.nombre === o.nombre);
            return [o.nombre, o.v, oi ? oi.v : 0];
        });
    const tituloTabla = d.exp.length >= 2 ? `Por subsector, ${ULTIMO}` : `Principales subsectores, ${ULTIMO}`;
    const mercados = d.destinos ? `<p class="pie-tabla">Destinos: ${esc(d.destinos)} · Orígenes: ${esc(d.origenes)}</p>` : '';
    const avisoEstimado = d.estimado ? ' El desglose por producto que hay en los datos de la web es un reparto estimado, no una cifra de DataComex: esta ficha se queda en el total hasta que se regeneren los datos.' : '';
    const nota = (d.tema.nota || d.estimado) ? `<p class="nota-tema"><strong>Alcance:</strong> ${esc((d.tema.nota || '') + avisoEstimado).trim()}</p>` : '';
    return `<section class="pagina">
  <header class="cab">
    <div class="cab-txt">
      <span class="marca">SAS · FICHAS DEL TEMARIO</span>
      <h1>${esc(d.tema.titulo)}</h1>
      <span class="sub">Comercio exterior de España · ${ULTIMO} y evolución desde 2021</span>
    </div>
    <div class="sello"><span>EJERCICIO 1</span><b>T${nTema}</b></div>
  </header>
  <div class="kpis">
    <div class="kpi exp"><span>Exportación</span><b>${num(e)}</b><span>M€ · ${pctSigno(vE)} vs ${PREVIO}</span></div>
    <div class="kpi imp"><span>Importación</span><b>${num(i)}</b><span>M€ · ${pctSigno(vI)} vs ${PREVIO}</span></div>
    <div class="kpi sal"><span>Saldo</span><b>${conSigno(saldo)}</b><span>M€ · cobertura ${pct(cob, 0)}</span></div>
    <div class="kpi ue"><span>Hacia la UE</span><b>${d.ueTotal != null ? pct(d.ueTotal) : '—'}</b><span>de la exportación</span></div>
  </div>
  <div class="dos">
    <div><h2>Evolución, M€</h2><div class="leyenda"><span><i class="l-exp"></i>Exportación</span><span><i class="l-imp"></i>Importación</span></div>${grafico(d.E, d.I)}</div>
    <div>
      <h2>${tituloTabla}</h2>
      <table class="tabla">
        <thead><tr><th>M€</th><th>Exp.</th><th>Imp.</th><th>Saldo</th></tr></thead>
        <tbody>${tabla.map(([n, ve, vi]) => `<tr><td>${esc(n)}</td><td>${num(ve)}</td><td>${num(vi)}</td><td>${conSigno(ve - vi)}</td></tr>`).join('')}</tbody>
      </table>
      ${mercados}
    </div>
  </div>
  ${nota}
  <div class="claves">
    <h2>CLAVES PARA EL TEMA</h2>
    <ul>${claves(d).map(c => `<li>${c}</li>`).join('')}</ul>
  </div>
  <div class="notas"><h2>Mis notas</h2><div class="renglones"></div></div>
  ${pie('1 / 3')}
</section>`;
}

function paginaDetalle(d, nTema, flujo) {
    const grupos = flujo === 'E' ? d.exp : d.imp;
    const exp = flujo === 'E';
    const hayHeredados = grupos.some(g => g.filas.some(o => o.heredado));
    const filas = grupos.map(g => {
        const redundante = g.filas.length === 1 && g.filas[0].nombre.toLowerCase() === g.nombre.toLowerCase();
        const cabecera = !redundante && (grupos.length > 1 || g.filas.length > 1)
            ? `<tr class="grupo"><td>${esc(g.nombre.toUpperCase())}</td><td>${num(g.total)}</td><td></td><td></td><td></td></tr>` : '';
        return cabecera + g.filas.map(o => {
            const ue = o.heredado || o.pctUE == null ? '<span class="tenue">—</span>'
                : `<span class="barra-ue"><i style="width:${o.pctUE.toFixed(1)}%"></i></span>${num(o.pctUE, 1)} %`;
            const variacion = o.var == null ? '<span class="tenue">nuevo</span>'
                : `<span class="${o.var >= 0 ? 'pos' : 'neg'}">${pctSigno(o.var)}</span>`;
            const paises = o.heredado ? '<span class="tenue">ver fila del grupo</span>' : esc(o.paises || '—');
            const clase = redundante && grupos.length > 1 ? ' class="grupo-fila"' : '';
            return `<tr${clase}><td>${esc(redundante && grupos.length > 1 ? o.nombre.toUpperCase() : o.nombre)}</td><td>${num(o.v)}</td><td>${variacion}</td><td class="ue">${ue}</td><td>${paises}</td></tr>`;
        }).join('');
    }).join('');
    const avisoHeredado = d.estimado ? ' Sin desglose por producto: el que hay en los datos de la web es un reparto estimado.' : hayHeredados
        ? ` En este sector DataComex solo da países y cuota UE para el grupo completo: ${esc(grupos[0].filas[0].paises)}.` : '';
    return `<section class="pagina">
  <header class="cab-det">
    <span class="marca">SAS · FICHAS DEL TEMARIO · TEMA ${nTema}</span>
    <span class="pag">${exp ? '2 / 3' : '3 / 3'}</span>
  </header>
  <div>
    <h1 class="h1-det">${esc(d.tema.titulo)} · ${exp ? 'exportación' : 'importación'} por subsector</h1>
    <span class="sub">${ULTIMO}, millones de euros. Variación frente a ${PREVIO} y parte que ${exp ? 'va a' : 'llega desde'} la UE27.${avisoHeredado}</span>
  </div>
  <table class="detalle">
    <thead><tr><th>Subsector</th><th>M€</th><th>Var. ${ULTIMO.slice(2)}/${PREVIO.slice(2)}</th><th>${exp ? 'Cuota UE' : 'Desde la UE'}</th><th>${exp ? 'Principales destinos' : 'Principales orígenes'}</th></tr></thead>
    <tbody>${filas}</tbody>
  </table>
  ${pie(exp ? '2 / 3' : '3 / 3', `Variación calculada sobre el valor en euros. ${exp ? 'Cuota UE: % del valor con destino' : 'Desde la UE: % del valor con origen'} en la UE27.`)}
</section>`;
}

function pie(pag, extra = '') {
    return `<footer class="pie"><span>${extra ? extra + ' ' : ''}Fuente: DataComex (Ministerio de Economía, Comercio y Empresa), extracción ${EXTRACCION}. ${ULTIMO} provisional.</span><span class="url">sergioargudo.es · ${pag}</span></footer>`;
}

const ESTILO = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #D9DED6; font-family: 'Atkinson Hyperlegible', system-ui, sans-serif; color: #1F2A1D; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pagina { width: 210mm; height: 297mm; margin: 10mm auto; padding: 12mm 12.5mm 10.5mm; background: #fff; display: flex; flex-direction: column; gap: 4.4mm; font-size: 12.5px; line-height: 1.4; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.18); page-break-after: always; break-after: page; }
@media print { body { background: #fff; } .pagina { margin: 0; box-shadow: none; } }
h1, h2 { margin: 0; }
.marca { font-family: Orbitron, sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .16em; color: #3B4533; }
.cab { display: flex; justify-content: space-between; gap: 16px; }
.cab-txt { display: flex; flex-direction: column; gap: 4px; }
.cab h1 { font-family: Fraunces, Georgia, serif; font-weight: 700; font-size: 31px; line-height: 1.08; text-wrap: balance; }
.sub { font-size: 13.5px; color: #4A5546; }
.sello { background: #3B4533; color: #fff; padding: 8px 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 4px 4px 0 #A8862F; min-width: 92px; align-self: flex-start; }
.sello span { white-space: nowrap; font-family: Orbitron, sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: .14em; color: #E0C46B; }
.sello b { font-family: Orbitron, sans-serif; font-size: 28px; font-weight: 800; line-height: 1.1; }
.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; }
.kpi { border: 1px solid #C9D1C5; border-top: 4px solid; padding: 8px 11px; display: flex; flex-direction: column; gap: 1px; }
.kpi span { font-size: 12px; } .kpi span:first-child { color: #4A5546; }
.kpi b { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 21px; }
.kpi.exp { border-top-color: #2A78D6; } .kpi.imp { border-top-color: #EB6834; } .kpi.sal { border-top-color: #1F6B33; } .kpi.ue { border-top-color: #2A5DB0; }
.dos { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 22px; }
.dos > div { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
h2 { font-size: 12.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #3B4533; }
.grafico { width: 100%; height: auto; }
.grafico .eje { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; fill: #4A5546; }
.leyenda { display: flex; gap: 14px; font-size: 12px; font-weight: 700; }
.leyenda span { display: flex; align-items: center; gap: 6px; }
.leyenda i { display: inline-block; width: 16px; height: 3px; }
.l-exp { background: #2A78D6; } .l-imp { background: #EB6834; }
.tabla { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.tabla th { text-align: right; padding: 4px; border-bottom: 2px solid #1F2A1D; font-size: 12px; }
.tabla th:first-child { text-align: left; }
.tabla td { padding: 4px; border-bottom: 1px solid #C9D1C5; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.tabla td:first-child { text-align: left; font-family: 'Atkinson Hyperlegible', sans-serif; }
.pie-tabla { margin: 0; font-size: 12px; color: #4A5546; }
.nota-tema { margin: 0; font-size: 12px; color: #4A5546; border-left: 3px solid #A8862F; padding-left: 8px; }
.claves { background: #EEF3EB; border: 1px solid #C9D1C5; padding: 11px 16px; display: flex; flex-direction: column; gap: 6px; }
.claves h2 { font-family: Orbitron, sans-serif; font-size: 11.5px; letter-spacing: .14em; text-transform: none; }
.claves ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.notas { flex-grow: 1; display: flex; flex-direction: column; gap: 6px; min-height: 60px; }
.renglones { flex-grow: 1; background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #C9D1C5 27px, #C9D1C5 28px); }
.pie { margin-top: auto; display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid #C9D1C5; padding-top: 7px; font-size: 11.5px; color: #4A5546; }
.pie .url { font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
.cab-det { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3B4533; padding-bottom: 8px; }
.cab-det .pag { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #3B4533; }
.h1-det { font-family: Fraunces, Georgia, serif; font-weight: 700; font-size: 23px; line-height: 1.15; text-wrap: balance; margin-bottom: 3px; }
.detalle { width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.25; font-variant-numeric: tabular-nums; }
.detalle th { text-align: left; font-size: 11.5px; color: #4A5546; border-bottom: 2px solid #1F2A1D; padding: 4px; }
.detalle th:nth-child(2), .detalle th:nth-child(3) { text-align: right; }
.detalle td { padding: 4px; border-bottom: 1px solid #DCE3D8; vertical-align: middle; }
.detalle td:nth-child(2), .detalle td:nth-child(3) { text-align: right; font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
.detalle td:nth-child(2) { width: 62px; } .detalle td:nth-child(3) { width: 72px; } .detalle td:nth-child(4) { width: 96px; } .detalle td:nth-child(5) { width: 205px; }
.detalle tr.grupo td { background: #EEF3EB; font-family: Orbitron, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .1em; color: #3B4533; padding-top: 5px; }
.detalle tr.grupo td:nth-child(2) { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0; color: #1F2A1D; }
.detalle tr.grupo-fila td { background: #EEF3EB; }
.detalle tr.grupo-fila td:first-child { font-family: Orbitron, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .1em; color: #3B4533; }
.detalle .ue { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; white-space: nowrap; }
.barra-ue { display: inline-block; width: 36px; height: 7px; background: #E2E7DF; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
.barra-ue i { display: block; height: 100%; background: #2A5DB0; border-radius: 2px; }
.pos { color: #1F6B33; font-weight: 600; } .neg { color: #B42318; font-weight: 600; }
.tenue { color: #6B7568; font-family: 'Atkinson Hyperlegible', sans-serif; font-size: 11.5px; }
`;

const FUENTES = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Fraunces:opsz,wght@9..144,700&family=IBM+Plex+Mono:wght@400;600&family=Orbitron:wght@700;800&display=swap';

function documento(titulo, cuerpo) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>${esc(titulo)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FUENTES}">
<style>${ESTILO}</style>
</head>
<body>
${cuerpo}
</body>
</html>
`;
}

// --- Principal --------------------------------------------------------------------

function main() {
    const todas = leerCSV(fs.readFileSync(CSV, 'utf8'));
    const { temas } = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
    const pedidos = process.argv.slice(2).map(Number).filter(Boolean);
    const elegidos = pedidos.length ? temas.filter(t => pedidos.includes(t.tema)) : temas;
    fs.mkdirSync(SALIDA, { recursive: true });

    const resumen = [];
    for (const tema of elegidos) {
        const d = calcular(tema, todas);
        const n = String(tema.tema).padStart(2, '0');
        const html = documento(`Tema ${tema.tema}. ${tema.titulo} — ficha de comercio exterior`,
            [paginaResumen(d, tema.tema), paginaDetalle(d, tema.tema, 'E'), paginaDetalle(d, tema.tema, 'I')].join('\n'));
        fs.writeFileSync(path.join(SALIDA, `tema-${n}.html`), html, 'utf8');
        resumen.push({ tema, e: d.E[4], i: d.I[4] });
        const filasMax = Math.max(...['exp', 'imp'].map(k => d[k].reduce((s, g) => s + g.filas.length + 1, 0)));
        console.log(`  · tema-${n}.html  exp ${num(d.E[4])} M€ · imp ${num(d.I[4])} M€ · ${filasMax} filas de detalle${filasMax > 32 ? '  ⚠ puede no caber en una página' : ''}`);
    }

    if (!pedidos.length) {
        const filas = resumen.map(({ tema, e, i }) => {
            const n = String(tema.tema).padStart(2, '0');
            return `<tr><td>${tema.tema}</td><td><a href="tema-${n}.html">${esc(tema.titulo)}</a></td><td>${num(e)}</td><td>${num(i)}</td><td>${tema.encaje}</td><td><a href="pdf/tema-${n}.pdf">PDF</a></td></tr>`;
        }).join('\n');
        const indice = documento('Fichas de comercio exterior del temario',
            `<section class="pagina" style="height:auto;min-height:297mm">
  <span class="marca">SAS · FICHAS DEL TEMARIO</span>
  <h1 style="font-family:Fraunces,Georgia,serif;font-size:30px">Fichas de comercio exterior · ejercicio 1, temas 1 a 20</h1>
  <p class="sub">Cifras de ${ULTIMO} en millones de euros. Fuente: DataComex, extracción ${EXTRACCION}.</p>
  <table class="tabla"><thead><tr><th>Tema</th><th>Sector</th><th>Exporta</th><th>Importa</th><th>Encaje</th><th>PDF</th></tr></thead><tbody>
${filas}
  </tbody></table>
</section>`);
        fs.writeFileSync(path.join(SALIDA, 'index.html'), indice, 'utf8');
        console.log('  · index.html');
    }
    console.log(`${elegidos.length} ficha(s) en public/fichas/.`);
}

main();
