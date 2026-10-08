#!/usr/bin/env node
'use strict';

/**
 * Fichas imprimibles de balanza de pagos, con el mismo formato que las de los
 * temas 1 a 20 (scripts/generar-fichas.js, del que toma estilo y utilidades):
 *
 *   bp-balanza.html    Ejercicio 3, tema 2: la balanza de pagos de España
 *   bp-turismo.html    Ejercicio 1, tema 23: servicios turísticos
 *   bp-servicios.html  Ejercicio 1, tema 24: servicios no turísticos
 *
 *   node scripts/generar-fichas-balanza.js   (o: npm run fichas, que hace ambas)
 *
 * Lee data/balanza_data.js (series 17.1 y 17.4 del Banco de España). Solo usa
 * años completos (12 meses o 4 trimestres); el último dato parcial se cita
 * aparte. Las «claves» se redactan con reglas fijas: leerlas antes de publicar.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { num, conSigno, pct, pctSigno, esc, grafico, pie, documento } = require('./generar-fichas.js');

const RAIZ = path.resolve(__dirname, '..');
const DATOS = path.join(RAIZ, 'data', 'balanza_data.js');
const SALIDA = path.join(RAIZ, 'public', 'fichas');
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// --- Datos --------------------------------------------------------------------

function leerBalanza() {
    const texto = fs.readFileSync(DATOS, 'utf8');
    const ctx = {};
    vm.runInNewContext(texto.replace(/^const (\w+) =/gm, 'this.$1 ='), ctx);
    const fecha = (texto.match(/el (\d{4}-\d{2}-\d{2})/) || [])[1] || '';
    return { ...ctx, fecha };
}

/** Suma anual de una serie mensual (17.1) o trimestral (17.4): solo años completos. */
function anual(serie, campo, completos) {
    const por = {};
    for (const d of serie.data) {
        const o = por[d.year] || (por[d.year] = { n: 0, v: null });
        const vals = campo ? d[campo] : d.values;
        o.n++;
        o.v = o.v ? o.v.map((x, i) => x + (vals[i] || 0)) : vals.map(x => x || 0);
    }
    const anios = Object.keys(por).filter(a => por[a].n === completos).sort();
    return { anios, v: Object.fromEntries(anios.map(a => [a, por[a].v])), parcial: Object.keys(por).filter(a => por[a].n < completos) };
}

const fechaLarga = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${a}`; };
const fuente = (b, series) => `Banco de España, Boletín Estadístico, capítulo 17 (${series}); datos descargados el ${fechaLarga(b.fecha)}.`;

// --- Piezas comunes ----------------------------------------------------------------

function cabecera(titulo, sub, ejercicio, tema) {
    return `<header class="cab">
    <div class="cab-txt">
      <span class="marca">SAS · FICHAS DEL TEMARIO · BALANZA DE PAGOS</span>
      <h1>${esc(titulo)}</h1>
      <span class="sub">${esc(sub)}</span>
    </div>
    <div class="sello"><span>EJERCICIO ${ejercicio}</span><b>T${tema}</b></div>
  </header>`;
}

function cabeceraDetalle(tema, pag) {
    return `<header class="cab-det"><span class="marca">SAS · FICHAS DEL TEMARIO · ${esc(tema)}</span><span class="pag">${pag}</span></header>`;
}

function kpis(lista) {
    const color = ['exp', 'imp', 'sal', 'ue'];
    return `<div class="kpis">${lista.map(([etq, valor, sub], k) =>
        `<div class="kpi ${color[k]}"><span>${esc(etq)}</span><b>${valor}</b><span>${sub}</span></div>`).join('')}</div>`;
}

function leyenda(series) {
    return `<div class="leyenda">${series.map(s => `<span><i style="background:${s.color}"></i>${esc(s.nombre)}</span>`).join('')}</div>`;
}

function clavesHTML(lista) {
    return `<div class="claves"><h2>CLAVES PARA EL TEMA</h2><ul>${lista.map(c => `<li>${c}</li>`).join('')}</ul></div>`;
}

const notas = '<div class="notas"><h2>Mis notas</h2><div class="renglones"></div></div>';

function tablaSimple(cabeceras, filas) {
    return `<table class="tabla"><thead><tr>${cabeceras.map(c => `<th>${c}</th>`).join('')}</tr></thead>
<tbody>${filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/** Tabla ancha de la página de detalle: filas con sangría por nivel. */
function tablaDetalle(cabeceras, filas) {
    return `<table class="detalle bp"><thead><tr>${cabeceras.map(c => `<th>${c}</th>`).join('')}</tr></thead>
<tbody>${filas.map(f => `<tr class="${f.clase || ''}">${f.celdas.map((c, k) => `<td${k === 0 && f.nivel ? ` style="padding-left:${4 + f.nivel * 14}px"` : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

const varHTML = (a, b) => b ? `<span class="${a >= b ? 'pos' : 'neg'}">${pctSigno((a / b - 1) * 100)}</span>` : '—';
const saldoHTML = (v) => `<span class="${v >= 0 ? 'pos' : 'neg'}">${conSigno(v)}</span>`;

// --- Ficha 1: la balanza de pagos (ejercicio 3, tema 2) ------------------------------

function fichaBalanza(b) {
    const A = anual(b.BALANZA_171_RAW, null, 12);
    const anios = A.anios.slice(-11), ult = anios[anios.length - 1], prev = anios[anios.length - 2];
    const v = (a, i) => A.v[a][i];
    const S = anual(b.BALANZA_174_RAW, null, 4);
    const s = S.v[ult];
    const cc = v(ult, 0), cap = v(ult, 4);
    let racha = 0;
    for (let k = A.anios.length - 1; k >= 0 && v(A.anios[k], 0) > 0; k--) racha++;
    const ultimoMes = b.BALANZA_171_RAW.data[b.BALANZA_171_RAW.data.length - 1];
    const series = [
        { nombre: 'Cuenta corriente', color: '#2A78D6', valores: anios.map(a => v(a, 0)) },
        { nombre: 'Capacidad de financiación', color: '#1BAF7A', valores: anios.map(a => v(a, 4)) }
    ];
    const claves = [
        racha > 1 ? `La cuenta corriente tiene <strong>superávit ${racha} años seguidos</strong> (${racha === A.anios.length ? `toda la serie, desde ${A.anios[0]}` : `desde ${A.anios[A.anios.length - racha]}`}): en ${ult}, ${conSigno(cc)} M€.` : `En ${ult} la cuenta corriente cierra en ${conSigno(cc)} M€.`,
        `Los <strong>servicios</strong> (${conSigno(s[3])} M€) compensan con creces el déficit de <strong>bienes</strong> (${conSigno(s[0])} M€).`,
        `El turismo aporta el ${pct(s[4] / s[3] * 100, 0)} del superávit de servicios (${conSigno(s[4])} M€).`,
        `Las rentas primaria y secundaria restan ${num(Math.abs(v(ult, 2)))} M€ y la cuenta de capital suma ${num(v(ult, 3))} M€: la capacidad de financiación queda en ${conSigno(cap)} M€.`,
        `Último dato mensual: ${MESES[ultimoMes.month - 1]} de ${ultimoMes.year}, cuenta corriente ${conSigno(ultimoMes.values[0])} M€.`
    ];
    const p1 = `<section class="pagina">
  ${cabecera('La balanza de pagos de España', `Saldos anuales ${anios[0]}–${ult} y composición en ${ult}`, 3, 2)}
  ${kpis([
        ['Cuenta corriente', conSigno(cc), `M€ · ${pctSigno((cc / v(prev, 0) - 1) * 100)} vs ${prev}`],
        ['Bienes y servicios', conSigno(v(ult, 1)), `M€ en ${ult}`],
        ['Rentas', conSigno(v(ult, 2)), 'M€ · primaria y secundaria'],
        ['Cap. de financiación', conSigno(cap), 'M€ · cta. corriente + capital']])}
  <div class="dos">
    <div><h2>Evolución, M€</h2>${leyenda(series)}${grafico(series, anios, `Cuenta corriente y capacidad de financiación de España, ${anios[0]} a ${ult}`)}</div>
    <div>
      <h2>Composición del saldo, ${ult}</h2>
      ${tablaSimple(['M€', 'Saldo'], [
        ['Bienes', saldoHTML(s[0])],
        ['Servicios', saldoHTML(s[3])],
        ['&nbsp;&nbsp;Turismo', saldoHTML(s[4])],
        ['&nbsp;&nbsp;No turísticos', saldoHTML(s[5])],
        ['Rentas primaria y secundaria', saldoHTML(v(ult, 2))],
        ['<strong>Cuenta corriente</strong>', saldoHTML(cc)],
        ['Cuenta de capital', saldoHTML(v(ult, 3))],
        ['<strong>Capacidad de financiación</strong>', saldoHTML(cap)]])}
    </div>
  </div>
  ${clavesHTML(claves)}
  ${notas}
  ${pie('1 / 2', '', fuente(b, 'series 17.1 y 17.4'))}
</section>`;

    const filasAnuales = anios.map(a => ({ celdas: [a, ...[0, 1, 2, 3, 4, 5, 8].map(i => saldoHTML(v(a, i)))] }));
    const meses = b.BALANZA_171_RAW.data.slice(-12).map(d => ({
        celdas: [`${MESES[d.month - 1].slice(0, 3)}. ${d.year}`, ...[0, 1, 2, 3, 4].map(i => saldoHTML(d.values[i]))]
    }));
    const p2 = `<section class="pagina">
  ${cabeceraDetalle('EJERCICIO 3 · TEMA 2', '2 / 2')}
  <div><h1 class="h1-det">La balanza de pagos de España · series anuales y mensuales</h1>
  <span class="sub">Saldos en millones de euros. Años completos (12 meses).</span></div>
  ${tablaDetalle(['Año', 'Cta. corriente', 'Bienes y serv.', 'Rentas', 'Cta. capital', 'Cap. financ.', 'Cta. financiera', 'Errores y omis.'], filasAnuales)}
  <h2>Últimos doce meses</h2>
  ${tablaDetalle(['Mes', 'Cta. corriente', 'Bienes y serv.', 'Rentas', 'Cta. capital', 'Cap. financ.'], meses)}
  ${pie('2 / 2', 'Capacidad de financiación: cuenta corriente más cuenta de capital.', fuente(b, 'serie 17.1'))}
</section>`;
    return documento('La balanza de pagos de España — ficha del temario', p1 + '\n' + p2);
}

// --- Ficha 2: turismo (ejercicio 1, tema 23) ---------------------------------------------

function fichaTurismo(b) {
    const S = anual(b.BALANZA_174_RAW, null, 4);
    const anios = S.anios.slice(-11), ult = anios[anios.length - 1], prev = anios[anios.length - 2];
    const ing = (a) => S.v[a][7], pag = (a) => S.v[a][10], saldo = (a) => S.v[a][4];
    const C = anual(b.BALANZA_174C_RAW, null, 4);
    const lab = b.BALANZA_174C_RAW.labels, c = C.v[ult], cPrev = C.v[prev];
    const idx = (n) => lab.indexOf(n);
    const total = c[idx('Total')];
    const ue = c[idx('UE 27')] / total * 100;
    const paises = ['Alemania', 'Bélgica', 'Países Bajos', 'Francia', 'Italia', 'Irlanda', 'Portugal', 'Reino Unido', 'Rusia', 'Suiza', 'EEUU'];
    const ranking = paises.map(p => [p, c[idx(p)]]).sort((x, y) => y[1] - x[1]);
    const series = [
        { nombre: 'Ingresos', color: '#2A78D6', valores: anios.map(ing) },
        { nombre: 'Pagos', color: '#EB6834', valores: anios.map(pag) }
    ];
    const minimo = anios.reduce((m, a) => ing(a) < ing(m) ? a : m, anios[0]);
    const nombre = (p) => p === 'EEUU' ? 'Estados Unidos' : p;
    const claves = [
        `En ${ult} los ingresos por turismo llegan a <strong>${num(ing(ult))} M€</strong>, ${pctSigno((ing(ult) / ing(prev) - 1) * 100)} sobre ${prev}${minimo !== ult ? `; en ${minimo} se quedaron en ${num(ing(minimo))} M€` : ''}.`,
        `<strong>${esc(nombre(ranking[0][0]))}</strong> es el primer mercado (${pct(ranking[0][1] / total * 100)} de los ingresos), por delante de ${esc(nombre(ranking[1][0]))} y ${esc(nombre(ranking[2][0]))}.`,
        `La UE27 aporta el ${pct(ue, 0)} de los ingresos; el resto de Europa, el ${pct(c[idx('Europa extra UE27')] / total * 100, 0)}.`,
        `El saldo turístico (${conSigno(saldo(ult))} M€) es mayor que el déficit de bienes de la balanza (${conSigno(S.v[ult][0])} M€).`,
        `Los pagos crecen ${(pag(ult) / pag(prev)) > (ing(ult) / ing(prev)) ? 'más' : 'menos'} que los ingresos en ${ult}: ${pctSigno((pag(ult) / pag(prev) - 1) * 100)} frente a ${pctSigno((ing(ult) / ing(prev) - 1) * 100)}.`
    ];
    const regiones = [['UE27', 'UE 27'], ['Resto de Europa', 'Europa extra UE27'], ['América', 'América'], ['Asia', 'Asia'], ['África', 'África']];
    const p1 = `<section class="pagina">
  ${cabecera('Turismo', `Ingresos y pagos por turismo de España · ${ult} y evolución desde ${anios[0]}`, 1, 23)}
  ${kpis([
        ['Ingresos', num(ing(ult)), `M€ · ${pctSigno((ing(ult) / ing(prev) - 1) * 100)} vs ${prev}`],
        ['Pagos', num(pag(ult)), `M€ · ${pctSigno((pag(ult) / pag(prev) - 1) * 100)} vs ${prev}`],
        ['Saldo', conSigno(saldo(ult)), `M€ en ${ult}`],
        ['Desde la UE', pct(ue), 'de los ingresos']])}
  <div class="dos">
    <div><h2>Evolución, M€</h2>${leyenda(series)}${grafico(series, anios, `Ingresos y pagos por turismo de España, ${anios[0]} a ${ult}`)}</div>
    <div>
      <h2>Ingresos por origen, ${ult}</h2>
      ${tablaSimple(['M€', 'Ingresos', 'Peso'], regiones.map(([n, k]) => [n, num(c[idx(k)]), pct(c[idx(k)] / total * 100)]))}
      <p class="pie-tabla">Primeros mercados: ${ranking.slice(0, 3).map(r => esc(nombre(r[0]))).join(', ')}.</p>
    </div>
  </div>
  ${clavesHTML(claves)}
  ${notas}
  ${pie('1 / 2', '', fuente(b, 'series 17.4'))}
</section>`;

    const arbol = [
        ['Total', 0], ['Europa', 0], ['UE 27', 1], ['UEM 20', 2], ['Alemania', 3], ['Bélgica', 3], ['Países Bajos', 3], ['Francia', 3], ['Italia', 3], ['Irlanda', 3], ['Portugal', 3],
        ['UE27 extra UEM20', 2], ['Europa extra UE27', 1], ['Reino Unido', 2], ['Rusia', 2], ['Suiza', 2],
        ['América', 0], ['Am. Norte y Central', 1], ['EEUU', 2], ['Am. del Sur', 1], ['África', 0], ['Asia', 0]
    ];
    const nombreLargo = { 'UE 27': 'UE27', 'UEM 20': 'Zona del euro (UEM20)', 'UE27 extra UEM20': 'UE27 fuera de la zona del euro', 'Europa extra UE27': 'Europa fuera de la UE27', 'Am. Norte y Central': 'América del Norte y Central', 'Am. del Sur': 'América del Sur', EEUU: 'Estados Unidos' };
    const filas = arbol.map(([k, nivel]) => ({
        nivel, clase: nivel === 0 ? 'grupo-fila' : '',
        celdas: [esc(nombreLargo[k] || k), num(c[idx(k)]), num(cPrev[idx(k)]), varHTML(c[idx(k)], cPrev[idx(k)]), pct(c[idx(k)] / total * 100)]
    }));
    const p2 = `<section class="pagina">
  ${cabeceraDetalle('EJERCICIO 1 · TEMA 23', '2 / 2')}
  <div><h1 class="h1-det">Turismo · ingresos por mercado de origen</h1>
  <span class="sub">Millones de euros. Gasto en España de los viajeros de cada zona o país.</span></div>
  ${tablaDetalle(['Origen del viajero', String(ult), String(prev), `Var. ${String(ult).slice(2)}/${String(prev).slice(2)}`, 'Peso'], filas)}
  ${pie('2 / 2', 'Los países están dentro de sus zonas: no se suman a ellas.', fuente(b, 'serie 17.4, ingresos por turismo por país'))}
</section>`;
    return documento('Turismo en la balanza de pagos — ficha del temario', p1 + '\n' + p2);
}

// --- Ficha 3: servicios no turísticos (ejercicio 1, tema 24) -------------------------------

function fichaServicios(b) {
    const S = anual(b.BALANZA_174_RAW, null, 4);
    const anios = S.anios.slice(-11), ult = anios[anios.length - 1], prev = anios[anios.length - 2];
    const ing = (a) => S.v[a][8], pag = (a) => S.v[a][11];
    const I = anual(b.BALANZA_174A_RAW, 'ingresos', 4), P = anual(b.BALANZA_174A_RAW, 'pagos', 4);
    const lab = b.BALANZA_174A_RAW.labels;
    const i25 = I.v[ult], i24 = I.v[prev], p25 = P.v[ult], p24 = P.v[prev];
    const SUB = new Set(['I+D', 'Consultoría', 'Serv. Técnicos y Comerciales']);
    const tipos = lab.map((n, k) => ({ n, k })).filter(t => t.k > 0 && !SUB.has(t.n));
    const porIngreso = [...tipos].sort((a, b2) => i25[b2.k] - i25[a.k]);
    const porSaldo = [...tipos].sort((a, b2) => (i25[a.k] - p25[a.k]) - (i25[b2.k] - p25[b2.k]));
    const peso = ing(ult) / S.v[ult][6] * 100;
    const series = [
        { nombre: 'Ingresos', color: '#2A78D6', valores: anios.map(ing) },
        { nombre: 'Pagos', color: '#EB6834', valores: anios.map(pag) }
    ];
    const nombre = (n) => ({ 'Otros Serv. Empresariales': 'Otros servicios empresariales', 'Serv. Técnicos y Comerciales': 'Servicios técnicos y comerciales', 'Telecomunicaciones e Informática': 'Telecomunicaciones e informática', 'Transformación y Reparaciones': 'Transformación y reparaciones', 'Seguros y Pensiones': 'Seguros y pensiones', 'Servicios Financieros': 'Servicios financieros', 'Propiedad Intelectual': 'Propiedad intelectual', 'Personales y Culturales': 'Personales y culturales' }[n] || n);
    const claves = [
        `Los servicios no turísticos son el ${pct(peso, 0)} de los ingresos por servicios de España: ${num(ing(ult))} M€ en ${ult}.`,
        `<strong>${esc(nombre(porIngreso[0].n))}</strong> es la primera partida (${pct(i25[porIngreso[0].k] / i25[0] * 100, 0)} de los ingresos), seguida de ${esc(nombre(porIngreso[1].n).toLowerCase())} y ${esc(nombre(porIngreso[2].n).toLowerCase())}.`,
        `Desde ${anios[0]} los ingresos se multiplican por ${num(ing(ult) / ing(anios[0]), 1)} y el saldo pasa de ${conSigno(ing(anios[0]) - pag(anios[0]))} a ${conSigno(ing(ult) - pag(ult))} M€.`,
        `La partida con más déficit es ${esc(nombre(porSaldo[0].n).toLowerCase())} (${conSigno(i25[porSaldo[0].k] - p25[porSaldo[0].k])} M€).`
    ];
    const p1 = `<section class="pagina">
  ${cabecera('Servicios no turísticos', `Ingresos y pagos de España · ${ult} y evolución desde ${anios[0]}`, 1, 24)}
  ${kpis([
        ['Ingresos', num(ing(ult)), `M€ · ${pctSigno((ing(ult) / ing(prev) - 1) * 100)} vs ${prev}`],
        ['Pagos', num(pag(ult)), `M€ · ${pctSigno((pag(ult) / pag(prev) - 1) * 100)} vs ${prev}`],
        ['Saldo', conSigno(ing(ult) - pag(ult)), `M€ en ${ult}`],
        ['Peso en servicios', pct(peso), 'de los ingresos']])}
  <div class="dos">
    <div><h2>Evolución, M€</h2>${leyenda(series)}${grafico(series, anios, `Ingresos y pagos por servicios no turísticos, ${anios[0]} a ${ult}`)}</div>
    <div>
      <h2>Principales partidas, ${ult}</h2>
      ${tablaSimple(['M€', 'Ingresos', 'Pagos', 'Saldo'], porIngreso.slice(0, 6).map(t => [esc(nombre(t.n)), num(i25[t.k]), num(p25[t.k]), conSigno(i25[t.k] - p25[t.k])]))}
    </div>
  </div>
  ${clavesHTML(claves)}
  ${notas}
  ${pie('1 / 2', '', fuente(b, 'series 17.4'))}
</section>`;

    const filas = [{ k: 0, nivel: 0 }, ...tipos.flatMap(t => t.n === 'Otros Serv. Empresariales'
        ? [{ k: t.k, nivel: 1 }, ...lab.map((n, k) => ({ n, k })).filter(x => SUB.has(x.n)).map(x => ({ k: x.k, nivel: 2 }))]
        : [{ k: t.k, nivel: 1 }])].map(({ k, nivel }) => ({
            nivel, clase: nivel === 0 ? 'grupo-fila' : '',
            celdas: [esc(k === 0 ? 'Total servicios no turísticos' : nombre(lab[k])), num(i25[k]), varHTML(i25[k], i24[k]), num(p25[k]), varHTML(p25[k], p24[k]), saldoHTML(i25[k] - p25[k])]
        }));
    const p2 = `<section class="pagina">
  ${cabeceraDetalle('EJERCICIO 1 · TEMA 24', '2 / 2')}
  <div><h1 class="h1-det">Servicios no turísticos · ingresos y pagos por tipo</h1>
  <span class="sub">${ult}, millones de euros, y variación frente a ${prev}.</span></div>
  ${tablaDetalle(['Tipo de servicio', 'Ingresos', 'Var.', 'Pagos', 'Var.', 'Saldo'], filas)}
  ${pie('2 / 2', 'I+D, consultoría y servicios técnicos están dentro de otros servicios empresariales: no se suman aparte.', fuente(b, 'serie 17.4, servicios no turísticos por tipo'))}
</section>`;
    return documento('Servicios no turísticos en la balanza de pagos — ficha del temario', p1 + '\n' + p2);
}

// --- Principal ------------------------------------------------------------------------

function main() {
    const b = leerBalanza();
    fs.mkdirSync(SALIDA, { recursive: true });
    const fichas = { 'bp-balanza.html': fichaBalanza, 'bp-turismo.html': fichaTurismo, 'bp-servicios.html': fichaServicios };
    for (const [fichero, fn] of Object.entries(fichas)) {
        fs.writeFileSync(path.join(SALIDA, fichero), fn(b), 'utf8');
        console.log(`  · ${fichero}`);
    }
    console.log(`${Object.keys(fichas).length} ficha(s) de balanza de pagos en public/fichas/.`);
}

main();
