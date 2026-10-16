#!/usr/bin/env node
/**
 * Novedades de la web: la página novedades.html y la franja de la portada.
 *
 * Fuentes:
 *   - data/novedades.json: lo que se apunta a mano (esquemas, fichas, datos de flujos…).
 *     Se añade una con:  npm run novedades -- --nueva esquemas "Texto largo" "Texto corto" [enlace]
 *     (tipos: esquemas, fichas, datos, web; la fecha es la de hoy).
 *   - Los artículos publicados (articulos/*.md sin «estado: proximamente»).
 *   - La última actualización de la balanza de pagos (cabecera de data/balanza_data.js).
 *
 * Escribe entre marcas:
 *   - index.html            <!-- novedades-franja:inicio --> … <!-- novedades-franja:fin -->
 *   - novedades.html        <!-- novedades:inicio --> … <!-- novedades:fin -->
 *
 * Lo llaman `npm run articulos` y `npm run balanza`; tras publicar esquemas, `--nueva`.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const RUTA_NOVEDADES = path.join(RAIZ, 'data', 'novedades.json');
const N_FRANJA = 3;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_BDE = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const TIPOS = { esquemas: 'Esquemas', fichas: 'Fichas', datos: 'Datos', articulo: 'Artículo', web: 'Web' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const partes = iso => iso.split('-').map(Number);
const fechaCorta = iso => { const [, m, d] = partes(iso); return `${d} ${MESES[m - 1].slice(0, 3)}`; };
const fechaLarga = iso => { const [, m, d] = partes(iso); return `${d} de ${MESES[m - 1]}`; };
const diaSemana = iso => DIAS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
const hoy = () => new Date().toISOString().slice(0, 10);
const CANDADO = '<svg class="c-candado" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

// ---------- --nueva ----------
function nueva(args) {
    const [tipo, texto, corto, enlace] = args;
    if (!TIPOS[tipo] || tipo === 'articulo' || !texto) {
        console.error('Uso: npm run novedades -- --nueva <esquemas|fichas|datos|web> "Texto" ["Texto corto"] [enlace]');
        process.exit(1);
    }
    const lista = JSON.parse(fs.readFileSync(RUTA_NOVEDADES, 'utf8'));
    const n = { fecha: hoy(), tipo, texto };
    if (corto) n.corto = corto;
    if (enlace) n.enlace = enlace;
    lista.unshift(n);
    fs.writeFileSync(RUTA_NOVEDADES, '[\n' + lista.map(x => '  ' + JSON.stringify(x).replace(/","/g, '", "').replace(/":"/g, '": "').replace(/^\{"/, '{ "').replace(/"\}$/, '" }')).join(',\n') + '\n]\n', 'utf8');
    console.log(`Novedad añadida (${n.fecha}): ${texto}`);
}

// ---------- fuentes ----------
function frontmatter(texto) {
    const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const d = {};
    if (m) for (const l of m[1].split(/\r?\n/)) {
        const p = l.match(/^([\w-]+)\s*:\s*(.+)$/);
        if (p) d[p[1]] = p[2].trim().replace(/^["']|["']$/g, '');
    }
    return d;
}

function articulos() {
    const dir = path.join(RAIZ, 'articulos');
    return fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md').map(f => {
        const d = frontmatter(fs.readFileSync(path.join(dir, f), 'utf8'));
        return { titulo: d.titulo, fecha: d.fecha, slug: d.slug || f.replace(/\.md$/, ''), proximo: d.estado === 'proximamente' };
    }).filter(a => a.titulo && a.fecha).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function balanza() {
    const js = leer('data/balanza_data.js');
    const gen = js.match(/Generado[^\n]*?el (\d{4}-\d{2}-\d{2})/);
    const ult = [...js.matchAll(/"year":(\d{4}),"month":(\d{1,2})/g)].pop();
    if (!gen || !ult) return null;
    return { generado: gen[1], anio: +ult[1], mes: +ult[2] };
}

function flujos() {
    const filas = leer('data/flujos_data.csv').split(/\r?\n/).slice(1).filter(Boolean);
    const anios = new Set(), prov = new Set();
    for (const f of filas) {
        const anio = +f.slice(0, 4);
        anios.add(anio);
        if (/,provisional\s*$/.test(f)) prov.add(anio);
    }
    const a = [...anios].sort();
    return { desde: a[0], hasta: a[a.length - 1], provisionales: [...prov].sort() };
}

function esquemas() {
    const programa = JSON.parse(leer('temas/programa.json'));
    const fechas = JSON.parse(leer('temas/actualizado.json'));
    return Object.entries(programa.ejercicios).map(([n, e]) => ({
        n: +n,
        total: Math.max(...e.partes.map(p => p.hasta)),
        alDia: Object.keys(fechas).filter(k => k.startsWith(`ejercicio-${n}-`)).length
    }));
}

function todas(arts, bp) {
    const lista = JSON.parse(fs.readFileSync(RUTA_NOVEDADES, 'utf8'));
    arts.filter(a => !a.proximo).forEach(a => lista.push({
        fecha: a.fecha, tipo: 'articulo', texto: `Artículo: ${a.titulo}`, corto: a.titulo, enlace: `articulos/${a.slug}.html`
    }));
    if (bp) lista.push({
        fecha: bp.generado, tipo: 'datos', texto: `Balanza de pagos actualizada, con datos hasta ${MESES[bp.mes - 1]} de ${bp.anio}`,
        corto: 'Balanza de pagos actualizada', enlace: 'comercio-exterior.html'
    });
    // orden por fecha, de más reciente a más antigua; a igual fecha, el orden del fichero
    return lista.map((x, i) => [x, i]).sort((a, b) => b[0].fecha.localeCompare(a[0].fecha) || a[1] - b[1]).map(x => x[0]);
}

// ---------- HTML ----------
function franja(lista) {
    const items = lista.slice(0, N_FRANJA).map(n =>
        `                    <li><a href="${esc(n.enlace || 'novedades.html')}"><time datetime="${n.fecha}">${fechaCorta(n.fecha)}</time> ${esc(n.corto || n.texto)}</a></li>`).join('\n');
    return `
        <aside class="c-franja" aria-labelledby="franja-titulo">
            <div class="c-franja-int">
                <h2 class="c-franja-rotulo" id="franja-titulo">Novedades</h2>
                <ul class="c-franja-lista">
${items}
                </ul>
                <a class="c-franja-todas" href="novedades.html">Todas &rarr;</a>
            </div>
        </aside>
        `;
}

function pagina(lista, arts, bp, fl, esq) {
    const alDia = esq.reduce((s, e) => s + e.alDia, 0), total = esq.reduce((s, e) => s + e.total, 0);
    // como la tarjeta de la portada: «del primer ejercicio, … del tercero y … del quinto»
    const ordinal = ['', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto'];
    const detalle = esq.map((e, i) => `${e.alDia} de ${e.total} del ${i === 0 ? `${ordinal[e.n].replace(/^(prim|terc)ero$/, '$1er')} ejercicio` : ordinal[e.n]}`);
    const ultimoEsq = lista.find(n => n.tipo === 'esquemas');
    const tarjetaEsq = `
                    <a class="c-tarjeta-enlace c-arcade" href="esquemas.html">
                        <span class="c-arcade-rotulo">Esquemas</span>
                        <span class="c-cifra-grande">${alDia} / ${total}</span>
                        <span>esquemas al día: ${detalle.slice(0, -1).join(', ')} y ${detalle[detalle.length - 1]}.${ultimoEsq ? ` Último cambio, el ${fechaLarga(ultimoEsq.fecha)}.` : ''}</span>
                    </a>`;

    const prov = fl.provisionales;
    const textoProv = prov.length ? `, con ${prov.length > 1 ? `${prov.slice(0, -1).join(', ')} y ${prov[prov.length - 1]} provisionales` : `${prov[0]} provisional`}` : '';
    const tarjetaDatos = `
                    <a class="c-tarjeta-enlace" href="comercio-exterior.html">
                        <span class="c-antetitulo">Comercio exterior</span>
                        <span class="c-cifra-grande">${bp ? `${MESES_BDE[bp.mes - 1].charAt(0)}${MESES_BDE[bp.mes - 1].slice(1).toLowerCase()} ${bp.anio}` : `${fl.desde}–${fl.hasta}`}</span>
                        <span>${bp ? `Último mes de la balanza de pagos, actualizada el ${fechaLarga(bp.generado)}. ` : ''}Flujos por sector ${fl.desde}–${fl.hasta}${textoProv}.</span>
                    </a>`;

    const proximo = [...arts].reverse().find(a => a.proximo);
    const ultimo = arts.find(a => !a.proximo);
    const tarjetaArt = proximo ? `
                    <div class="c-tarjeta-enlace c-tarjeta-proxima" aria-disabled="true">
                        <span class="c-antetitulo">${CANDADO} Próximo artículo · ${diaSemana(proximo.fecha)} ${fechaLarga(proximo.fecha)}</span>
                        <span class="c-titulo-tarjeta">${esc(proximo.titulo)}</span>
                        <span>Dos artículos al mes, los martes.</span>
                    </div>` : ultimo ? `
                    <a class="c-tarjeta-enlace" href="articulos/${ultimo.slug}.html">
                        <span class="c-antetitulo">Último artículo · ${fechaLarga(ultimo.fecha)}</span>
                        <span class="c-titulo-tarjeta">${esc(ultimo.titulo)}</span>
                        <span>Dos artículos al mes, los martes.</span>
                    </a>` : '';

    const meses = [];
    for (const n of lista) {
        const [a, m] = partes(n.fecha), clave = `${a}-${m}`;
        let g = meses.find(x => x.clave === clave);
        if (!g) meses.push(g = { clave, titulo: `${MESES[m - 1].charAt(0).toUpperCase()}${MESES[m - 1].slice(1)} de ${a}`, items: [] });
        g.items.push(n);
    }
    const secciones = meses.map((g, i) => `
            <section class="c-seccion" aria-labelledby="mes-${g.clave}">
                <h2 class="c-seccion-titulo" id="mes-${g.clave}">${g.titulo}</h2>
                <ul class="c-novedades">
${g.items.map(n => `                    <li><time datetime="${n.fecha}">${fechaCorta(n.fecha)}</time><span class="c-novedades-tipo">${TIPOS[n.tipo] || esc(n.tipo)}</span>${n.enlace ? `<a href="${esc(n.enlace)}">${esc(n.texto)}</a>` : `<span>${esc(n.texto)}</span>`}</li>`).join('\n')}
                </ul>${i === meses.length - 1 ? `
                <div class="c-acciones">
                    <a class="c-boton" href="https://www.linkedin.com/in/sergio-argudo-santiago/" target="_blank" rel="noopener noreferrer">Seguir en LinkedIn</a>
                </div>` : ''}
            </section>`).join('\n');

    return `
            <section class="c-tres" aria-label="Estado de la web">${tarjetaEsq}${tarjetaDatos}${tarjetaArt}
            </section>
${secciones}
            `;
}

function entreMarcas(fichero, nombre, contenido) {
    const ruta = path.join(RAIZ, fichero);
    const html = fs.readFileSync(ruta, 'utf8');
    const re = new RegExp(`<!-- ${nombre}:inicio -->[\\s\\S]*?<!-- ${nombre}:fin -->`);
    if (!re.test(html)) { console.error(`${fichero}: faltan las marcas ${nombre}:inicio/fin`); process.exit(1); }
    const nuevo = html.replace(re, () => `<!-- ${nombre}:inicio -->${contenido}<!-- ${nombre}:fin -->`);
    if (nuevo !== html) fs.writeFileSync(ruta, nuevo, 'utf8');
}

// ---------- principal ----------
const args = process.argv.slice(2);
if (args[0] === '--nueva') nueva(args.slice(1));

const arts = articulos(), bp = balanza(), fl = flujos(), esq = esquemas();
const lista = todas(arts, bp);
entreMarcas('index.html', 'novedades-franja', franja(lista));
entreMarcas('novedades.html', 'novedades', pagina(lista, arts, bp, fl, esq));
console.log(`Novedades: ${lista.length} entradas; franja de la portada con las ${Math.min(N_FRANJA, lista.length)} últimas.`);
