/**
 * Gráficos del artículo sobre los aranceles de EE. UU. y España.
 * Lee data/articulos/aranceles-eeuu.json (pipeline privado del autor) y
 * pinta cada <div data-grafico> de los fragmentos aranceles-*.html con js/graficos.js.
 * Los países llevan siempre su color de la familia paises de la paleta.
 */
(function () {
    'use strict';

    // Raíz del sitio a partir de la ruta de este script (sirve también en la portada)
    const RAIZ = new URL('../../', document.currentScript.src);

    const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mesCorto = f => `${MESES[+f.slice(5, 7) - 1]}-${f.slice(2, 4)}`;
    const mesLargo = f => `${MESES[+f.slice(5, 7) - 1]}. ${f.slice(0, 4)}`;
    const dec1 = x => x.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const pct = x => x == null ? '–' : dec1(x) + ' %';
    const conSigno = x => (x > 0 ? '+' : '') + Graficos.formato(x);
    // con decimal cuando la cifra es pequeña, para que España no salga como 1
    const conSignoFino = x => (x > 0 ? '+' : x < 0 ? '−' : '') + (Math.abs(x) < 10 ? dec1(Math.abs(x)) : Graficos.formato(Math.abs(x)));
    const trimestre = t => `${t.slice(-1)}.º trimestre de ${t.slice(0, 4)}`;

    // Nombre del JSON -> id de la familia paises de data/paleta.json
    const ID_PAIS = { 'España': 'espana', 'UE-27': 'ue27', 'China': 'china', 'Taiwán': 'taiwan', 'Vietnam': 'vietnam',
        'México': 'mexico', 'Canadá': 'canada', 'Alemania': 'alemania', 'Irlanda': 'irlanda', 'Francia': 'francia',
        'Italia': 'italia', 'Países Bajos': 'paises-bajos', 'Bélgica': 'belgica' };
    const colorPais = n => n === 'Total' ? '--c-tinta' : `--p-paises-${ID_PAIS[n] || 'resto'}`;
    // Canadá, Alemania e Irlanda ya salen en la cascada y en el gráfico de la UE
    const SERIES_G1 = ['España', 'UE-27', 'Total', 'China', 'Taiwán', 'Vietnam', 'México'];
    // Rótulo corto de cada hito sobre los gráficos de índices (el texto largo va en el artículo)
    const HITO_CORTO = { '2025-04': 'Aranceles recíprocos', '2025-09': 'Acuerdo con la UE', '2026-02': 'Fallo del Supremo', '2026-07': 'Sección 301' };
    const DESTACAR_G1 = new Set(['España', 'UE-27']);
    // Grupos CUCI que cuenta el texto
    const DESTACAR_G4 = new Set(['421']);

    const lienzo = id => document.querySelector(`[data-grafico="${id}"]`);
    const alt = id => { const f = lienzo(id) && lienzo(id).closest('.art-figura'); return f ? f.dataset.alt : ''; };

    function fuentes(d) {
        const hasta = mesLargo(d.ultimo_mes);
        return {
            eeuu: `Fuente: ${d.fuente_eeuu}, hasta ${hasta}. Arancel efectivo: derechos pagados sobre el valor importado.`,
            eeuuTotal: `Fuente: U.S. Census Bureau, exportaciones e importaciones de bienes, hasta ${hasta}.`,
            eurostat: `Fuente: Eurostat, exportaciones de cada país a EE. UU. en euros, hasta ${mesLargo(d.g3.ultimo_mes)}.`,
            balanza: `Fuente: Eurostat (balanza de pagos de España con EE. UU., datos del Banco de España), hasta el ${trimestre(d.balanza[d.balanza.length - 1].trimestre)}.`,
            mixta: `Fuente: ${d.fuente_espana} (exportaciones, datos provisionales) y U.S. Census Bureau (arancel efectivo), hasta ${hasta}.`,
            importancia: `Fuente: Eurostat (exportaciones de cada país) y U.S. Census Bureau (importaciones de EE. UU.), año 2025.`
        };
    }

    // Serie de un nombre en filas {serie, fecha, indice}, alineada con x
    const serie = (filas, nombre, x) => x.map(f => { const r = filas.find(q => q.serie === nombre && q.fecha === f); return r ? r.indice : null; });
    const hitosDe = (d, x) => d.hitos.map((h, k) => ({ i: x.indexOf(h.fecha), n: k + 1, principal: k === 0, texto: HITO_CORTO[h.fecha] || h.texto })).filter(h => h.i >= 0);

    function g0(d) {
        Graficos.lineas(lienzo('ar-g0'), {
            x: d.g0.map(r => mesCorto(r.fecha)), a: d.g0.map(r => r.exp), b: d.g0.map(r => r.imp),
            nombres: ['Exportaciones', 'Importaciones'], colores: ['--p-flujos-exportaciones', '--p-flujos-importaciones'],
            unidad: 'miles de millones de dólares', saldo: { color: '--p-paises-resto' },
            marca: { i: d.g0.findIndex(r => r.fecha === '2025-04'), texto: 'Aranceles del 2 de abril', y: 4000 }, titulo: alt('ar-g0')
        });
    }

    function g1(d) {
        const x = [...new Set(d.g1.map(r => r.fecha))].sort();
        const series = SERIES_G1.map(nombre => ({ nombre, color: colorPais(nombre), destacar: DESTACAR_G1.has(nombre), valores: serie(d.g1, nombre, x) }));
        Graficos.indices(lienzo('ar-g1'), { x, etiquetas: x.map(mesCorto), series, hitos: hitosDe(d, x), titulo: alt('ar-g1') });
    }

    // Cascada: quién explica la variación de las importaciones de EE. UU., en miles de millones de dólares
    function g2(d) {
        const mmm = x => x / 1000;
        const tip = (variacion, otras) => [['Variación (miles de M$)', conSignoFino(variacion)], ...otras];
        const fila = p => ({
            nombre: p.pais, valor: mmm(p.var_mm_usd), destacar: p.pais === 'España',
            tip: tip(mmm(p.var_mm_usd), [['Cuota antes', pct(p.cuota_p0)], ['Cuota últimos 12 meses', pct(p.cuota_p1)],
                ['Arancel antes', pct(p.tipo_p0)], ['Arancel últimos 12 meses', pct(p.tipo_p1)]])
        });
        const orden = (a, b) => b.var_mm_usd - a.var_mm_usd;
        const ganan = d.g2.filter(p => p.var_mm_usd >= 0).sort(orden).map(fila);
        const pierden = d.g2.filter(p => p.var_mm_usd < 0).sort(orden).map(fila);
        const t = d.g2_total, total = mmm(t.imp_p1_mm_usd - t.imp_p0_mm_usd);
        const resto = total - [...ganan, ...pierden].reduce((s, f) => s + f.valor, 0);
        const vacio = [['Cuota antes', '–'], ['Cuota últimos 12 meses', '–'], ['Arancel antes', '–'], ['Arancel últimos 12 meses', '–']];
        const filas = [...ganan, ...pierden,
            { nombre: 'Resto de países', valor: resto, color: '--p-paises-resto', tip: tip(resto, vacio) },
            { nombre: 'Total', valor: total, total: true, tip: tip(total, vacio) }];
        Graficos.cascada(lienzo('ar-g2'), { filas, formatoValor: conSignoFino, titulo: alt('ar-g2') });
    }

    // Qué importa EE. UU.: partidas cuyas importaciones totales más suben y más bajan, en miles de millones de dólares
    function demanda(d) {
        const mmm = x => x / 1000;
        const filas = d.demanda.slice().sort((a, b) => b.var_mm_usd - a.var_mm_usd).map(p => ({
            nombre: p.nombre, valor: mmm(p.var_mm_usd), extra: pct(p.tipo_p1), extraFuerte: p.tipo_p1 >= 15,
            tip: [['Variación (miles de M$)', conSignoFino(mmm(p.var_mm_usd))], ['Antes (miles de M$)', Graficos.formato(mmm(p.imp_p0_mm_usd))],
                ['Últimos 12 meses (miles de M$)', Graficos.formato(mmm(p.imp_p1_mm_usd))], ['Arancel antes', pct(p.tipo_p0)],
                ['Arancel últimos 12 meses', pct(p.tipo_p1)], ['Partida', p.hs4]]
        }));
        Graficos.barras(lienzo('ar-demanda'), { filas, formatoValor: conSignoFino, extraTitulo: 'Arancel', titulo: alt('ar-demanda') });
    }

    function g3(d) {
        const x = [...new Set(d.g3.series.map(r => r.fecha))].sort();
        const series = d.g3.paises.map(p => ({ nombre: p.pais, color: colorPais(p.pais), destacar: p.pais === 'España', valores: serie(d.g3.series, p.pais, x) }));
        Graficos.indices(lienzo('ar-g3'), { x, etiquetas: x.map(mesCorto), series, hitos: hitosDe(d, x), titulo: alt('ar-g3') });
    }

    function importancia(d) {
        const fila = (p, valor) => ({ nombre: p.pais, valor, destacar: p.pais === 'España',
            tip: [['Peso de EE. UU. en sus exportaciones', pct(p.peso_eeuu_en_exp)], ['Peso en las importaciones de EE. UU.', pct(p.peso_en_imp_eeuu)]] });
        const opc = { formatoValor: pct, colores: ['--p-flujos-exportaciones', '--p-flujos-exportaciones'] };
        if (lienzo('ar-imp-exp')) Graficos.barras(lienzo('ar-imp-exp'), Object.assign({ filas: d.importancia.map(p => fila(p, p.peso_eeuu_en_exp)),
            titulo: 'Peso de EE. UU. en las exportaciones de cada país, 2025' }, opc));
        if (lienzo('ar-imp-eeuu')) Graficos.barras(lienzo('ar-imp-eeuu'), Object.assign({ filas: d.importancia.map(p => fila(p, p.peso_en_imp_eeuu)),
            titulo: 'Peso de cada país en las importaciones de EE. UU., 2025' }, opc));
    }

    function balanza(d) {
        const b = d.balanza;
        // un rótulo por año, en el cuarto trimestre (el acumulado de ese año)
        const etiquetas = b.map(r => r.trimestre.endsWith('Q4') ? r.trimestre.slice(0, 4) : '');
        Graficos.apiladas(lienzo('ar-balanza'), {
            x: b.map(r => `${r.trimestre.slice(-1)}T ${r.trimestre.slice(0, 4)}`), etiquetas,
            series: [
                { nombre: 'Bienes', color: '--p-balanza-bienes', valores: b.map(r => r.bienes) },
                { nombre: 'Turismo', color: '--p-balanza-turismo', valores: b.map(r => r.turismo) },
                { nombre: 'Servicios no turísticos', color: '--p-balanza-no-turisticos', valores: b.map(r => r.no_turisticos) }],
            total: { nombre: 'Bienes y servicios', valores: b.map(r => r.total) },
            unidad: 'millones de euros', titulo: alt('ar-balanza'),
            marca: { i: b.findIndex(r => r.trimestre === '2025-Q2'), texto: 'Aranceles del 2 de abril' }
        });
    }

    function g4(d) {
        // Aportación de cada sección CUCI a la variación total, en millones de euros (suman el total)
        const tipoEs = (d.g2.find(p => p.pais === 'España') || {}).tipo_p1;
        const tip = s => [['Variación (M€)', conSigno(s.exp_p1 - s.exp_p0)], ['Exportaciones antes (M€)', Graficos.formato(s.exp_p0)],
            ['Últimos 12 meses (M€)', Graficos.formato(s.exp_p1)], ['Arancel antes', pct(s.tipo_p0)], ['Arancel últimos 12 meses', pct(s.tipo_p1)]];
        const sectores = d.g4_sectores.map(s => ({ nombre: s.nombre, valor: s.var_mm, extra: pct(s.tipo_p1), extraFuerte: s.tipo_p1 >= 15, tip: tip(s) }))
            .sort((a, b) => b.valor - a.valor);
        const e = d.espana, total = Math.round((e.exp_eeuu_p1 - e.exp_eeuu_p0) * 10) / 10;
        sectores.push({ nombre: 'Total', valor: total, destacar: true, extra: pct(tipoEs),
            tip: [['Variación (M€)', conSigno(total)], ['Exportaciones antes (M€)', Graficos.formato(e.exp_eeuu_p0)],
                ['Últimos 12 meses (M€)', Graficos.formato(e.exp_eeuu_p1)], ['Arancel antes', '–'], ['Arancel últimos 12 meses', pct(tipoEs)]] });
        if (lienzo('ar-g4-sectores')) Graficos.barras(lienzo('ar-g4-sectores'), { filas: sectores, formatoValor: conSigno, extraTitulo: 'Arancel', titulo: 'Aportación de cada sección CUCI a la variación de las exportaciones españolas a EE. UU.' });
        const productos = d.g4_productos.slice().sort((a, b) => b.var_mm - a.var_mm).map(p => ({
            nombre: p.nombre, valor: p.var_mm, destacar: DESTACAR_G4.has(p.cuci3), extra: pct(p.tipo_p1), extraFuerte: p.tipo_p1 >= 15,
            tip: tip(p).concat([['Grupo CUCI', p.cuci3]])
        }));
        if (lienzo('ar-g4-productos')) Graficos.barras(lienzo('ar-g4-productos'), { filas: productos, formatoValor: conSigno, extraTitulo: 'Arancel', titulo: 'Productos españoles cuyas exportaciones a EE. UU. más suben y más bajan' });
    }

    async function iniciar() {
        // sirve para el artículo y para el carrusel de LinkedIn, que solo trae algunos gráficos
        if (!document.querySelector('[data-grafico^="ar-"]')) return;
        let d;
        try {
            const r = await fetch(new URL('data/articulos/aranceles-eeuu.json', RAIZ));
            if (!r.ok) throw new Error(String(r.status));
            d = await r.json();
        } catch (e) {
            document.querySelectorAll('.art-fig .graficos-lienzo').forEach(el => {
                el.innerHTML = '<p class="c-nota">No se han podido cargar los datos del gráfico.</p>';
            });
            return;
        }
        const f = fuentes(d);
        document.querySelectorAll('[data-fuente]').forEach(el => { el.textContent = f[el.dataset.fuente] || ''; });
        if (lienzo('ar-g0')) g0(d);
        if (lienzo('ar-g1')) g1(d);
        if (lienzo('ar-g2')) g2(d);
        if (lienzo('ar-demanda')) demanda(d);
        if (lienzo('ar-g3')) g3(d);
        importancia(d);
        if (lienzo('ar-balanza')) balanza(d);
        if (lienzo('ar-g4-sectores') || lienzo('ar-g4-productos')) g4(d);
        document.documentElement.dataset.graficosListos = '1';
        // Al cambiar de tema, los colores salen de otras variables
        new MutationObserver(() => Graficos.redibujarTodo())
            .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
