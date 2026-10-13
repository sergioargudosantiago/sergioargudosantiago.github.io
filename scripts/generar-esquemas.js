#!/usr/bin/env node
'use strict';

/**
 * Genera los esquemas de los temas para leer en línea y para imprimir.
 *
 *   npm run esquemas                   todos, a review/esquemas/ (vista previa)
 *   npm run esquemas -- 1/6            solo el tema 6 del ejercicio 1
 *   npm run esquemas -- --publicar     a public/temas/ejercicio-N/tema-NN.html
 *   npm run esquemas:pdf [-- --publicar] PDF A4 al lado de cada HTML (Playwright)
 *
 * Por defecto NO publica: escribe en review/ (no versionado ni servido) para
 * revisar un esquema antes de subirlo. Con --publicar escribe lo que sirve la
 * web y, además, js/esquemas-fechas.js con la fecha de cada esquema y
 * js/esquemas-programa.js con los nombres oficiales de los temas. Solo
 * publica los que tienen fecha en temas/actualizado.json, que son los rehechos
 * con las pautas vigentes: el listado ofrece los demás con su Word y su PDF
 * antiguos y el aviso «en actualización».
 *
 * La fuente son los Markdown de temas/ejercicio-N/tema-NN.md. Los nombres de
 * los temas son los enunciados oficiales del BOE, de temas/programa.json (lo
 * escribe scripts/programa-boe.js), que es también lo que enseña el listado de
 * esquemas.html: así no hay dos copias que mantener. La primera frase del
 * enunciado hace de título y el resto va debajo, en letra menor. La fecha de
 * «Actualizado» sale de temas/actualizado.json.
 *
 * Aspecto: el de las fichas (diseño C), con los apartados en rótulo «arcade»
 * (franja verde salvia con el número en dorado y sombra de píxel). En pantalla
 * es una hoja de una columna con letra de lectura; al imprimir, dos columnas a
 * cuerpo 11,5 px con el pie de página y la numeración en los márgenes de @page.
 *
 * Markdown admitido (lo que usan los esquemas): encabezados #, ## y ###; líneas
 * enteras en negrita que empiezan por número («**2.1. Título**») como encabezado;
 * listas con guion o numeradas, anidadas con dos espacios; párrafos; negrita y
 * cursiva en línea.
 */

const fs = require('fs');
const path = require('path');
const { renderInline, escapeHTML } = require('./lib/markdown');
const { partirEnunciado, sinPuntoFinal } = require('./lib/enunciado');

const RAIZ = path.resolve(__dirname, '..');
const FUENTE = path.join(RAIZ, 'temas');
const PUBLICAR = process.argv.includes('--publicar');
const SALIDA = PUBLICAR ? path.join(RAIZ, 'public', 'temas') : path.join(RAIZ, 'review', 'esquemas');
const FILTRO = (process.argv.find(a => /^\d\/\d+$/.test(a)) || '').split('/').map(Number);
const EJERCICIOS = [1, 3, 5];

// --- Enunciados oficiales ---------------------------------------------------

// Programa del BOE (temas/programa.json, lo escribe scripts/programa-boe.js). Cada
// enunciado se parte en su primera frase, que hace de título, y el resto.
function leerPrograma() {
    const programa = JSON.parse(fs.readFileSync(path.join(FUENTE, 'programa.json'), 'utf8'));
    const enunciados = {};
    for (const n of EJERCICIOS) {
        enunciados[n] = {};
        for (const [num, texto] of Object.entries(programa.ejercicios[n].temas)) {
            enunciados[n][Number(num)] = partirEnunciado(texto);
        }
    }
    return { programa, enunciados };
}

// Lo que lee js/main.js para el listado de esquemas.html: las partes de cada
// ejercicio y, de cada tema, [título, resto].
function programaParaLaWeb({ programa, enunciados }) {
    const web = {};
    for (const n of EJERCICIOS) {
        web[n] = {
            partes: programa.ejercicios[n].partes.map(({ letra, titulo, desde, hasta }) => ({ letra, titulo, desde, hasta })),
            temas: Object.fromEntries(Object.entries(enunciados[n]).map(([num, e]) => [num, [e.titulo, e.resto]])),
        };
    }
    return web;
}

// --- Markdown → bloques -----------------------------------------------------

const NUMERO = /^(\d+(?:\.\d+)*)\.?\s+(.*)$/;

function sinNegrita(texto) {
    const m = texto.match(/^\*\*(.+)\*\*$/);
    return m ? m[1].trim() : texto;
}

function encabezado(nivel, texto) {
    texto = sinNegrita(texto.trim());
    const m = texto.match(NUMERO);
    return { tipo: 'h', nivel, numero: m ? m[1] : null, texto: m ? m[2] : texto };
}

function analizar(md) {
    const bloques = [];
    let lista = null;      // { tipo: 'lista', items: [] } con árbol de elementos
    let pila = [];         // último elemento abierto en cada profundidad
    let parrafo = null;

    const cerrar = () => { lista = null; pila = []; parrafo = null; };

    for (const bruta of md.replace(/\r/g, '').split('\n')) {
        const linea = bruta.replace(/\s+$/, '');
        if (!linea.trim()) { parrafo = null; continue; }

        let m = linea.match(/^(#{1,4})\s+(.*)$/);
        if (m) { cerrar(); bloques.push(encabezado(Math.min(m[1].length, 3), m[2])); continue; }

        m = linea.match(/^\*\*(\d+(?:\.\d+)*)\.?\s+([^*]+)\*\*$/);
        if (m) {
            cerrar();
            bloques.push(encabezado(Math.min(m[1].split('.').length, 3), `${m[1]}. ${m[2]}`));
            continue;
        }

        m = linea.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (m) {
            parrafo = null;
            if (!lista) { lista = { tipo: 'lista', items: [] }; bloques.push(lista); pila = []; }
            let prof = Math.floor(m[1].replace(/\t/g, '  ').length / 2);
            prof = Math.min(prof, pila.length);
            const item = { orden: /\d/.test(m[2]), texto: m[3], hijos: [] };
            (prof === 0 ? lista.items : pila[prof - 1].hijos).push(item);
            pila = pila.slice(0, prof);
            pila.push(item);
            continue;
        }

        // Texto suelto: continúa el último elemento de lista si va sangrado,
        // si no, es un párrafo.
        if (lista && /^\s+/.test(linea) && pila.length) {
            pila[pila.length - 1].texto += ' ' + linea.trim();
            continue;
        }
        lista = null; pila = [];
        if (parrafo) parrafo.texto += ' ' + linea.trim();
        else { parrafo = { tipo: 'p', texto: linea.trim() }; bloques.push(parrafo); }
    }
    return bloques;
}

// --- Bloques → HTML ---------------------------------------------------------

const enLinea = (t) => renderInline(t).replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>');

function htmlItems(items) {
    let out = '';
    let i = 0;
    while (i < items.length) {
        const orden = items[i].orden;
        const etiqueta = orden ? 'ol' : 'ul';
        out += `<${etiqueta}>`;
        while (i < items.length && items[i].orden === orden) {
            const it = items[i++];
            out += `<li>${enLinea(it.texto)}${it.hijos.length ? htmlItems(it.hijos) : ''}</li>`;
        }
        out += `</${etiqueta}>`;
    }
    return out;
}

const dosCifras = (n) => String(n).padStart(2, '0');

function htmlCuerpo(bloques) {
    let apartado = 0;
    const indice = [];
    let html = '';
    for (const b of bloques) {
        if (b.tipo === 'lista') { html += htmlItems(b.items) + '\n'; continue; }
        if (b.tipo === 'p') { html += `<p>${enLinea(b.texto)}</p>\n`; continue; }
        if (b.nivel === 1) {
            apartado++;
            const num = b.numero && /^\d+$/.test(b.numero) ? Number(b.numero) : apartado;
            const id = `apartado-${apartado}`;
            indice.push({ id, num, texto: b.texto });
            html += `<h2 class="sec" id="${id}"><span class="n">${dosCifras(num)}</span>`
                + `<span class="t">${enLinea(b.texto)}</span>`
                + `<span class="px" aria-hidden="true"><i></i><i></i><i></i></span></h2>\n`;
        } else {
            const etiqueta = b.nivel === 2 ? 'h3' : 'h4';
            const num = b.numero ? `<span>${escapeHTML(b.numero)}</span>` : '';
            html += `<${etiqueta} class="sub">${num}${enLinea(b.texto)}</${etiqueta}>\n`;
        }
    }
    return { html, indice };
}

// --- Página -----------------------------------------------------------------

const ESTILOS = `
@page { size: A4; margin: 14mm 12.5mm 15mm;
  @bottom-right { content: "sergioargudo.es · " counter(page) " / " counter(pages); font-family: 'IBM Plex Mono', monospace; font-size: 8.5pt; color: #4A5546; }
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: #D9DED6; font-family: 'Public Sans', system-ui, sans-serif; color: #1F2A1D; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; }
:focus-visible { outline: 2px solid #C8A951; outline-offset: 2px; }

/* Barra superior (solo pantalla) */
.barra { background: #3B4533; color: #C2D9C2; }
.barra-in { max-width: 210mm; margin: 0 auto; padding: 8px 16px; display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: space-between; }
.barra a { color: #C2D9C2; text-decoration: none; font-size: 15px; min-height: 44px; display: inline-flex; align-items: center; }
.barra a:hover { color: #FFFFFF; }
.barra .marca { font-family: Orbitron, sans-serif; font-weight: 700; letter-spacing: .14em; font-size: 13px; color: #FFFFFF; }
.barra .acciones { display: flex; gap: 10px; align-items: center; }
.barra .boton { background: #E0C46B; color: #1F2A1D; font-weight: 700; padding: 0 14px; box-shadow: 3px 3px 0 #1F2A1D; }
.barra .boton:hover { background: #FFFFFF; color: #1F2A1D; }

/* Hoja */
.hoja { max-width: 210mm; margin: 20px auto 40px; padding: 40px 47px 28px; background: #FFFFFF; box-shadow: 0 2px 10px rgba(0,0,0,.18); display: flex; flex-direction: column; gap: 18px; font-size: 15.5px; line-height: 1.5; }
.cab { display: flex; justify-content: space-between; gap: 16px; }
.cab-txt { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.marca-hoja { font-family: Orbitron, sans-serif; font-weight: 700; font-size: 11px; letter-spacing: .16em; color: #3B4533; }
h1 { margin: 0; font-family: Newsreader, Georgia, serif; font-weight: 600; font-size: 34px; line-height: 1.08; text-wrap: balance; }
/* Los enunciados del BOE pueden ser largos: el título baja de cuerpo por tramos. */
h1.largo { font-size: 28px; line-height: 1.12; }
h1.muy-largo { font-size: 23px; line-height: 1.16; }
.enunciado { margin: 3px 0 2px; max-width: 78ch; font-size: 14.5px; line-height: 1.42; color: #4A5546; text-wrap: pretty; }
.sub-cab { font-size: 14px; color: #4A5546; }
.sello { background: #3B4533; color: #FFFFFF; padding: 8px 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 4px 4px 0 #A8862F; min-width: 92px; align-self: flex-start; }
.sello span { white-space: nowrap; font-family: Orbitron, sans-serif; font-size: 9.5px; font-weight: 700; letter-spacing: .14em; color: #E0C46B; }
.sello b { font-family: Orbitron, sans-serif; font-size: 28px; font-weight: 800; line-height: 1.1; }

.indice { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.indice a { display: flex; flex-direction: column; gap: 1px; height: 100%; padding: 6px 9px; background: #3B4533; color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 700; line-height: 1.2; text-transform: uppercase; letter-spacing: .03em; }
.indice a:hover { background: #1F2A1D; }
.indice b { font-family: Orbitron, sans-serif; font-weight: 800; font-size: 13px; color: #E0C46B; letter-spacing: 0; }

/* Cuerpo del esquema */
.esq { min-width: 0; }
.sec { margin: 26px 4px 12px 0; display: flex; align-items: stretch; background: #3B4533; color: #FFFFFF; box-shadow: 4px 4px 0 #A8862F; font-size: 16px; font-weight: 700; line-height: 1.2; text-transform: uppercase; letter-spacing: .03em; scroll-margin-top: 12px; break-inside: avoid; break-after: avoid; }
.esq > .sec:first-child { margin-top: 0; }
.sec .n { font-family: Orbitron, sans-serif; font-weight: 800; font-size: 19px; letter-spacing: 0; background: #E0C46B; color: #1F2A1D; min-width: 46px; display: flex; align-items: center; justify-content: center; }
.sec .t { padding: 9px 12px; display: flex; align-items: center; flex-grow: 1; min-width: 0; }
.sec .px { display: flex; align-items: flex-end; gap: 3px; padding: 0 10px 8px 0; }
.sec .px i { display: block; width: 5px; height: 5px; background: #E0C46B; }
.sec .px i:nth-child(2) { height: 9px; opacity: .7; }
.sec .px i:nth-child(3) { height: 13px; opacity: .45; }
.sub { margin: 16px 0 5px; font-size: 1em; font-weight: 700; line-height: 1.3; display: flex; align-items: baseline; gap: 8px; break-after: avoid; }
.sub span { flex-shrink: 0; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: .78em; color: #3B4533; background: #EEF3EB; border: 1px solid #3B4533; box-shadow: 2px 2px 0 #C9D1C5; padding: 0 5px; }
.sub::after { content: ""; flex: 1 0 24px; align-self: center; border-bottom: 2px dotted #C9D1C5; }
h4.sub { font-size: .94em; margin-top: 12px; }
h4.sub span { background: #FFFFFF; border-color: #C9D1C5; box-shadow: none; }
.sec + .sub { margin-top: 0; }
.esq p { margin: 6px 0; }
.esq ul, .esq ol { margin: 0; padding-left: 18px; }
.esq li { margin: 2px 0; }
.esq li::marker { color: #A8862F; }
.esq ol > li::marker { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
.esq li > ul { list-style: none; padding-left: 16px; }
.esq li > ul > li { position: relative; }
.esq li > ul > li::before { content: "–"; position: absolute; left: -13px; color: #6B7568; }
.esq b { font-weight: 700; }

.pie { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; border-top: 1px solid #C9D1C5; padding-top: 8px; font-size: 12.5px; color: #4A5546; }
.pie .url { font-family: 'IBM Plex Mono', monospace; }

@media screen and (min-width: 821px) {
  .indice { grid-template-columns: repeat(var(--cols, 6), minmax(0, 1fr)); }
}
@media screen and (max-width: 820px) {
  .hoja { margin: 10px; padding: 20px 16px 16px; font-size: 16px; }
  h1 { font-size: 27px; }
  h1.largo { font-size: 23px; }
  h1.muy-largo { font-size: 20px; }
  .enunciado { font-size: 14px; }
  .sello { min-width: 74px; padding: 6px 10px; }
  .sello b { font-size: 22px; }
  .sec { font-size: 14.5px; }
}

/* Impresión y PDF: dos columnas, cuerpo pequeño, sin barra ni pie propio (el pie
   y la numeración van en los márgenes de @page). */
@media print {
  body { background: #FFFFFF; }
  .barra, .pie { display: none; }
  .hoja { max-width: none; margin: 0; padding: 0; box-shadow: none; gap: 12px; font-size: 11.5px; line-height: 1.38; }
  h1 { font-size: 31px; }
  h1.largo { font-size: 25px; }
  h1.muy-largo { font-size: 21px; }
  .enunciado { max-width: none; font-size: 11.5px; line-height: 1.36; }
  .sub-cab { font-size: 13px; }
  .indice { grid-template-columns: repeat(var(--cols, 6), minmax(0, 1fr)); }
  .indice a { padding: 5px 8px; font-size: 9.5px; }
  .indice b { font-size: 12px; }
  .esq { column-count: 2; column-gap: 24px; }
  .sec { font-size: 12.5px; margin: 14px 4px 9px 0; }
  .sec .n { font-size: 15px; min-width: 38px; }
  .sec .t { padding: 6px 10px; }
  .sub { margin: 9px 0 3px; }
  .esq li { margin: 1px 0; }
  .esq ul, .esq ol { padding-left: 14px; }
  .esq li > ul { padding-left: 14px; }
  .esq li > ul > li::before { left: -11px; }
}
`;

// Texto para un content: "…" de CSS: escapa comillas y barras invertidas.
const cadenaCSS = (t) => String(t).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/</g, '\\3C ');

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// «2026-09-07» → «7 de septiembre de 2026».
function fechaEnLetra(iso) {
    const [a, m, d] = iso.split('-').map(Number);
    return `${d} de ${MESES[m - 1]} de ${a}`;
}

// Recorta por palabras para el pie de página del PDF, que es una sola línea.
function recortar(texto, max) {
    if (texto.length <= max) return texto;
    return texto.slice(0, max).replace(/\s+\S*$/, '').replace(/[,:;.]$/, '') + '…';
}

function pagina({ ejercicio, numero, enunciado, cuerpo, indice, actualizado }) {
    const nn = dosCifras(numero);
    const fecha = actualizado
        ? ` · Actualizado el <time datetime="${actualizado}">${fechaEnLetra(actualizado)}</time>` : '';
    const titulo = sinPuntoFinal(enunciado.titulo);
    const claseTitulo = titulo.length > 95 ? ' class="muy-largo"' : titulo.length > 55 ? ' class="largo"' : '';
    const resto = enunciado.resto ? `\n      <p class="enunciado">${escapeHTML(enunciado.resto)}</p>` : '';
    const tituloTema = `Tema ${numero}. ${titulo}`;
    const pdf = `tema-${nn}.pdf`;
    const descarga = `Esquema tema ${numero} (ejercicio ${ejercicio}).pdf`;
    const indiceHtml = indice.map(a =>
        `<li><a href="#${a.id}"><b>${dosCifras(a.num)}</b>${escapeHTML(a.texto.replace(/\*\*/g, ''))}</a></li>`).join('');
    return `<!DOCTYPE html>
<!-- Generado por scripts/generar-esquemas.js desde temas/ejercicio-${ejercicio}/tema-${nn}.md. No editar a mano. -->
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>${escapeHTML(tituloTema)} — esquema del ejercicio ${ejercicio}</title>
<link rel="icon" href="../../../logos/png/SAS-icono-claro.png?v=3" type="image/png">
<link rel="icon" href="/favicon.ico?v=3" sizes="16x16 32x32 48x48">
<link rel="stylesheet" href="../../../css/fuentes.css">
<style>${ESTILOS}
@page { @bottom-left { content: "${cadenaCSS(`Esquema · ${recortar(tituloTema, 88)}`)}"; font-family: 'Public Sans', sans-serif; font-size: 8.5pt; color: #4A5546; } }
</style>
</head>
<body>
<header class="barra">
  <div class="barra-in">
    <a class="marca" href="../../../esquemas.html">← ESQUEMAS</a>
    <div class="acciones"><a class="boton" href="${pdf}" download="${escapeHTML(descarga)}">Descargar PDF</a></div>
  </div>
</header>
<main class="hoja">
  <div class="cab">
    <div class="cab-txt">
      <div class="marca-hoja">SERGIO ARGUDO · ESQUEMAS SOIVRE</div>
      <h1${claseTitulo}>${escapeHTML(titulo)}</h1>${resto}
      <div class="sub-cab">Ejercicio ${ejercicio} · Esquema del tema ${numero}${fecha}</div>
    </div>
    <div class="sello" aria-label="Ejercicio ${ejercicio}, tema ${numero}"><span>EJ. ${ejercicio} · TEMA</span><b>${numero}</b></div>
  </div>
  <nav aria-label="Apartados del esquema"><ol class="indice" style="--cols: ${indice.length <= 6 ? indice.length : Math.ceil(indice.length / 2)}">${indiceHtml}</ol></nav>
  <div class="esq">
${cuerpo}  </div>
  <footer class="pie"><span>Esquema propio a partir del tema desarrollado</span><span class="url">sergioargudo.es</span></footer>
</main>
</body>
</html>
`;
}

// --- Principal --------------------------------------------------------------

function main() {
    const oficial = leerPrograma();
    // Fecha de «Actualizado» de cada esquema (la escribe el repositorio privado de
    // herramientas): la del último guardado del tema del que sale.
    const rutaFechas = path.join(FUENTE, 'actualizado.json');
    const fechas = fs.existsSync(rutaFechas) ? JSON.parse(fs.readFileSync(rutaFechas, 'utf8')) : {};
    let total = 0;
    const avisos = [];
    for (const ej of EJERCICIOS) {
        const dir = path.join(FUENTE, `ejercicio-${ej}`);
        if (!fs.existsSync(dir)) continue;
        const destino = path.join(SALIDA, `ejercicio-${ej}`);
        fs.mkdirSync(destino, { recursive: true });
        for (const f of fs.readdirSync(dir).filter(x => /^tema-\d+\.md$/.test(x)).sort()) {
            const numero = Number(f.match(/\d+/)[0]);
            if (FILTRO[0] && (FILTRO[0] !== ej || FILTRO[1] !== numero)) continue;
            const enunciado = oficial.enunciados[ej][numero];
            if (!enunciado) { avisos.push(`ejercicio ${ej}, tema ${numero}: sin enunciado en temas/programa.json`); continue; }
            const { html, indice } = htmlCuerpo(analizar(fs.readFileSync(path.join(dir, f), 'utf8')));
            if (!indice.length) avisos.push(`ejercicio ${ej}, tema ${numero}: sin apartados de primer nivel`);
            // Solo se publican los esquemas con fecha: los rehechos con las pautas
            // vigentes. Los demás siguen en la web con su Word y su PDF antiguos.
            const actualizado = fechas[`ejercicio-${ej}-${dosCifras(numero)}`];
            if (PUBLICAR && !actualizado) continue;
            const salida = path.join(destino, f.replace('.md', '.html'));
            fs.writeFileSync(salida, pagina({ ejercicio: ej, numero, enunciado, cuerpo: html, indice, actualizado }));
            total++;
        }
    }
    // El listado de esquemas.html enseña la misma fecha junto a cada tema.
    if (PUBLICAR) {
        fs.writeFileSync(path.join(RAIZ, 'js', 'esquemas-fechas.js'),
            '// Generado por scripts/generar-esquemas.js desde temas/actualizado.json. No editar a mano.\n'
            + `const ESQUEMAS_ACTUALIZADO = ${JSON.stringify(fechas)};\n`);
        // Y los nombres oficiales de los temas, agrupados por las partes del programa.
        fs.writeFileSync(path.join(RAIZ, 'js', 'esquemas-programa.js'),
            '// Generado por scripts/generar-esquemas.js desde temas/programa.json (anexo I de la\n'
            + `// convocatoria, ${oficial.programa.fuente.cve}). No editar a mano.\n`
            + `const ESQUEMAS_PROGRAMA = ${JSON.stringify(programaParaLaWeb(oficial))};\n`);
    }
    console.log(`${total} esquemas en ${path.relative(RAIZ, SALIDA)}/.`);
    for (const a of avisos) console.warn(`  aviso: ${a}`);
}

if (require.main === module) main();

module.exports = { analizar, htmlCuerpo };
