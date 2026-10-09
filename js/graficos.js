/**
 * Gráficos de sergioargudo.es en SVG, sin dependencias.
 * Colores: variables --p-* (data/paleta.json vía npm run paleta) y --c-* de css/sitio.css.
 * Tipos: lineas, apiladas, ranking, mancuernas, panelesGemelos. Cada uno se
 * registra para redibujarse al cambiar el ancho del contenedor y con
 * Graficos.redibujarTodo() al cambiar el tema.
 * Las funciones puras se prueban en scripts/lib/graficos.test.js.
 */
(function (raiz) {
    'use strict';

    // ---------- funciones puras ----------
    // Punto de miles también con cuatro cifras y signo menos tipográfico (U+2212),
    // igual que las fichas (scripts/generar-fichas.js) y el resto de la página.
    function formato(x) {
        const r = Math.round(x), miles = String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return (r < 0 ? '−' : '') + miles;
    }
    const rangoLineas = (vals, yMax) => [Math.min(0, ...vals), yMax ?? Math.max(0, ...vals)];
    const formatoPct = x => x == null || !isFinite(x) ? '–'
        : (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
    const variacionPct = (base, actual) => base == null || actual == null || base === 0 ? null : (actual / base - 1) * 100;

    function marcas(min, max, n = 5) {
        if (min === max) return [min, min + 1];
        const paso0 = (max - min) / n, mag = 10 ** Math.floor(Math.log10(paso0));
        const paso = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= paso0);
        const lo = Math.floor(min / paso) * paso, hi = Math.ceil(max / paso) * paso, r = [];
        for (let t = lo; t <= hi + paso / 2; t += paso) r.push(+t.toFixed(6));
        return r;
    }

    function sumaMovil(serie, n) {
        const r = [];
        for (let i = n - 1; i < serie.length; i++) r.push(serie.slice(i - n + 1, i + 1).reduce((s, v) => s + v, 0));
        return r;
    }

    const pasoEtiquetas = (n, ancho) => Math.max(1, Math.ceil(n / Math.max(2, Math.floor(ancho / 42))));
    // Etiquetas visibles contadas desde el final: el último dato siempre lleva etiqueta
    // y ninguna queda más cerca de su vecina que el paso.
    function indicesEtiquetas(n, ancho) {
        const paso = pasoEtiquetas(n, ancho), r = [];
        for (let i = n - 1; i >= 0; i -= paso) r.unshift(i);
        return r;
    }
    const anchoDibujable = ancho => ancho > 0;
    const conAlfa = (hex, a) => `rgba(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;
    // Cinta curva entre dos tramos verticales: de [a0, b0] en x0 a [a1, b1] en x1
    function cinta(x0, a0, b0, x1, a1, b1) {
        const xm = (x0 + x1) / 2, r = n => Math.round(n * 10) / 10;
        return `M${r(x0)},${r(a0)}C${r(xm)},${r(a0)} ${r(xm)},${r(a1)} ${r(x1)},${r(a1)}` +
            `L${r(x1)},${r(b1)}C${r(xm)},${r(b1)} ${r(xm)},${r(b0)} ${r(x0)},${r(b0)}Z`;
    }

    const puras = { marcas, formato, rangoLineas, formatoPct, variacionPct, sumaMovil, pasoEtiquetas, indicesEtiquetas, anchoDibujable, conAlfa, cinta };
    if (typeof module !== 'undefined' && module.exports) { module.exports = puras; return; }

    // ---------- dibujo (solo navegador) ----------
    const NS = 'http://www.w3.org/2000/svg';
    const v = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const cuota = x => x == null || !isFinite(x) ? '–' : x.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';

    function S(tag, at, padre) {
        const e = document.createElementNS(NS, tag);
        for (const k in at) e.setAttribute(k, at[k]);
        if (padre) padre.appendChild(e);
        return e;
    }

    // Registro de gráficos para redibujar al cambiar el ancho o el tema
    const registro = new Map();
    let observador = null, cuadro = 0;
    const pendientes = new Set();
    function programar(el) {
        pendientes.add(el);
        if (!cuadro) cuadro = requestAnimationFrame(() => { cuadro = 0; const l = [...pendientes]; pendientes.clear(); l.forEach(redibujar); });
    }
    function registrar(tipo, el, op) {
        registro.set(el, [tipo, op]);
        if (!observador && typeof ResizeObserver !== 'undefined') {
            observador = new ResizeObserver(entradas => entradas.forEach(e => {
                if (registro.has(e.target) && String(Math.round(e.contentRect.width)) !== e.target.dataset.w) programar(e.target);
            }));
        }
        if (observador) observador.observe(el);
    }
    function redibujar(el) { const r = registro.get(el); if (r) DIBUJO[r[0]](el, r[1]); }
    function redibujarTodo() { registro.forEach((_, el) => redibujar(el)); }

    function lienzo(el, h, titulo) {
        const w = el.clientWidth;
        if (!anchoDibujable(w)) { el.dataset.w = '0'; return null; }
        el.innerHTML = '';
        el.dataset.w = String(Math.round(w));
        // role=group (no img): dentro hay zonas enfocables que el lector de pantalla debe anunciar
        const svg = S('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: 'group', 'aria-label': titulo || '' }, el);
        return { svg, w, h };
    }
    function sinDatos(el) { el.innerHTML = '<p class="c-nota">Sin datos para este periodo.</p>'; el.dataset.w = String(Math.round(el.clientWidth)); }
    function tablaAccesible(el, cabecera, filas) {
        const t = document.createElement('table');
        t.className = 'sr-only';
        t.innerHTML = `<thead><tr>${cabecera.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${filas.map(f => `<tr>${f.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody>`;
        el.appendChild(t);
    }

    // Tooltip único, con ratón, toque y teclado
    let tip = null;
    function verTip(x, y, html) {
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'graficos-tip'; tip.className = 'graficos-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
            document.body.appendChild(tip);
            // en móvil no hay «mouseleave»: se oculta al desplazar o al tocar fuera de un gráfico
            window.addEventListener('scroll', () => ocultarTip(), { passive: true });
            document.addEventListener('touchstart', ev => { if (!(ev.target.closest && ev.target.closest('.graficos-lienzo'))) ocultarTip(); }, { passive: true });
        }
        tip.innerHTML = html; tip.hidden = false;
        const r = tip.getBoundingClientRect();
        let px = x + 14, py = y + 14;
        if (px + r.width > innerWidth - 8) px = x - r.width - 14;
        if (py + r.height > innerHeight - 8) py = y - r.height - 14;
        tip.style.left = Math.max(8, px) + 'px'; tip.style.top = Math.max(8, py) + 'px';
    }
    const ocultarTip = () => { if (tip) tip.hidden = true; };
    const filaTip = (nombre, color, valor) => `<div class="fila"><span>${color ? `<i class="graficos-muestra" style="background:${color}"></i>` : ''}${nombre}</span><span>${valor}</span></div>`;

    // Zonas interactivas: un rectángulo transparente por punto, columna o fila.
    // Tabulador itinerante: una sola parada de Tab por gráfico y las flechas recorren las zonas.
    function zonas(svg, rects, etiqueta, html, entrar, salir) {
        const lista = rects.map((at, i) => {
            // forma: 'circle' en el mapa; por defecto rectángulo
            const { forma = 'rect', ...resto } = at;
            const r = S(forma, Object.assign({ fill: 'transparent', tabindex: i === 0 ? '0' : '-1', role: 'graphics-symbol', 'aria-label': etiqueta(i) }, resto), svg);
            r.addEventListener('focus', () => lista.forEach((z, k) => z.setAttribute('tabindex', k === i ? '0' : '-1')));
            const ver = (x, y) => { if (entrar) entrar(i); verTip(x, y, html(i)); };
            const fuera = () => { ocultarTip(); if (salir) salir(i); };
            r.addEventListener('mousemove', ev => ver(ev.clientX, ev.clientY));
            r.addEventListener('touchstart', ev => ver(ev.touches[0].clientX, ev.touches[0].clientY), { passive: true });
            r.addEventListener('focus', () => { const b = r.getBoundingClientRect(); ver(b.left + b.width / 2, b.top); });
            r.addEventListener('mouseleave', fuera);
            r.addEventListener('blur', fuera);
            r.addEventListener('keydown', ev => {
                const paso = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 0;
                if (paso && lista[i + paso]) { ev.preventDefault(); lista[i + paso].focus(); }
                if (ev.key === 'Escape') { fuera(); r.blur(); }
            });
            return r;
        });
        return lista;
    }

    function ejeY(svg, ti, y, x0, x1) {
        for (const t of ti) {
            S('line', { x1: x0, x2: x1, y1: y(t), y2: y(t), stroke: t === 0 ? v('--c-tenue') : v('--c-linea'), 'stroke-width': 1 }, svg);
            S('text', { x: x1 + 6, y: y(t) + 4 }, svg).textContent = formato(t);
        }
    }
    const vacia = s => !s || !s.length || s.every(x => x == null);

    // Dos series con banda de saldo. desde = índice del primer dato provisional.
    function dibujarLineas(el, op) {
        const { x, a, b, nombres, colores, desde = null, yMax = null, destacar = null, titulo = '' } = op;
        if (vacia(a) && vacia(b)) return sinDatos(el);
        const c = lienzo(el, +el.dataset.h || 240, titulo);
        if (!c) return;
        const { svg, w, h } = c;
        const m = { t: 14, b: 26, l: 10, r: 58 }, x0 = m.l + 8, x1 = w - m.r - 8;
        const vals = [...a, ...b].filter(t => t != null);
        const ti = marcas(...rangoLineas(vals, yMax));
        const y = t => m.t + (ti[ti.length - 1] - t) / (ti[ti.length - 1] - ti[0]) * (h - m.t - m.b);
        const xs = x.map((_, i) => x.length > 1 ? x0 + i * (x1 - x0) / (x.length - 1) : (x0 + x1) / 2);
        const [cA, cB] = colores.map(v);
        ejeY(svg, ti, y, m.l, w - m.r);
        indicesEtiquetas(x.length, x1 - x0).forEach(i => { S('text', { x: xs[i], y: h - 8, 'text-anchor': 'middle' }, svg).textContent = x[i]; });

        // banda de saldo, partida en los cruces
        const tramo = (p, q, ta, tb, sa, sb) => S('polygon', { points: `${p},${y(ta)} ${q},${y(tb)} ${q},${y(sb)} ${p},${y(sa)}`, fill: (ta - sa + tb - sb) >= 0 ? conAlfa(cA, 0.14) : conAlfa(cB, 0.16) }, svg);
        for (let i = 0; i < x.length - 1; i++) {
            if ([a[i], a[i + 1], b[i], b[i + 1]].some(t => t == null)) continue;
            const d0 = a[i] - b[i], d1 = a[i + 1] - b[i + 1];
            if (d0 * d1 < 0) {
                const f = d0 / (d0 - d1), cx = xs[i] + f * (xs[i + 1] - xs[i]), cy = a[i] + f * (a[i + 1] - a[i]);
                tramo(xs[i], cx, a[i], cy, b[i], cy); tramo(cx, xs[i + 1], cy, a[i + 1], cy, b[i + 1]);
            } else tramo(xs[i], xs[i + 1], a[i], a[i + 1], b[i], b[i + 1]);
        }

        const corte = desde ?? x.length;
        const grosor = s => destacar == null ? 2 : destacar === s ? 3 : 1.5;
        const trazo = (s, i0, i1, color, ancho, raya) => {
            let tramoActual = [];
            const cerrar = () => { if (tramoActual.length > 1) S('polyline', { points: tramoActual.join(' '), fill: 'none', stroke: color, 'stroke-width': ancho, 'stroke-linejoin': 'round', 'stroke-dasharray': raya || 'none' }, svg); tramoActual = []; };
            for (let i = Math.max(0, i0); i <= i1; i++) { if (s[i] == null) cerrar(); else tramoActual.push(`${xs[i]},${y(s[i])}`); }
            cerrar();
        };
        [[a, cA, 'a'], [b, cB, 'b']].forEach(([s, color, id]) => {
            trazo(s, 0, Math.min(corte, x.length) - 1, color, grosor(id));
            if (corte < x.length) trazo(s, corte - 1, x.length - 1, color, grosor(id), '5 4');
            s.forEach((t, i) => {
                if (t == null || !(x.length <= 6 || i === s.length - 1)) return;
                S('circle', { cx: xs[i], cy: y(t), r: 4, fill: i >= corte ? v('--c-superficie') : color, stroke: color, 'stroke-width': 2 }, svg);
            });
        });

        // valor del último dato junto al punto: arriba la serie mayor, abajo la menor
        const n = x.length - 1;
        if (a[n] != null && b[n] != null) {
            const arribaA = a[n] >= b[n];
            [[a[n], arribaA], [b[n], !arribaA]].forEach(([t, arriba]) =>
                S('text', { x: xs[n] - 8, y: y(t) + (arriba ? -10 : 18), 'text-anchor': 'end', class: 'valor' }, svg).textContent = formato(t));
        }

        const guia = S('line', { y1: m.t, y2: h - m.b, stroke: v('--c-tenue'), 'stroke-dasharray': '2 3', visibility: 'hidden' }, svg);
        const banda = x.length > 1 ? (x1 - x0) / (x.length - 1) : x1 - x0;
        const fmt = t => t == null ? '–' : formato(t);
        zonas(svg, xs.map(cx => ({ x: cx - banda / 2, y: m.t, width: banda, height: h - m.t - m.b })),
            i => `${x[i]}: ${nombres[0]} ${fmt(a[i])}, ${nombres[1]} ${fmt(b[i])} millones de euros`,
            i => `<div class="cab">${x[i]}${desde != null && i >= desde ? ' · provisional' : ''}</div>` +
                filaTip(nombres[0], cA, fmt(a[i])) + filaTip(nombres[1], cB, fmt(b[i])) +
                (a[i] != null && b[i] != null ? filaTip('Saldo', '', formato(a[i] - b[i])) : ''),
            i => { guia.setAttribute('x1', xs[i]); guia.setAttribute('x2', xs[i]); guia.setAttribute('visibility', 'visible'); },
            () => guia.setAttribute('visibility', 'hidden'));
        tablaAccesible(el, ['', nombres[0], nombres[1]], x.map((t, i) => [t, fmt(a[i]), fmt(b[i])]));
    }

    // Columnas apiladas en positivo y negativo con una línea de total
    function dibujarApiladas(el, op) {
        const { x, etiquetas, series, total, titulo = '' } = op;
        if (!x.length || vacia(total.valores)) return sinDatos(el);
        const c = lienzo(el, +el.dataset.h || 280, titulo);
        if (!c) return;
        const { svg, w, h } = c;
        const m = { t: 14, b: 26, l: 10, r: 62 }, x0 = m.l, x1 = w - m.r - 6;
        const pos = x.map((_, i) => series.reduce((s, se) => s + Math.max(0, se.valores[i] || 0), 0));
        const neg = x.map((_, i) => series.reduce((s, se) => s + Math.min(0, se.valores[i] || 0), 0));
        const ti = marcas(Math.min(0, ...neg, ...total.valores), Math.max(0, ...pos, ...total.valores));
        const y = t => m.t + (ti[ti.length - 1] - t) / (ti[ti.length - 1] - ti[0]) * (h - m.t - m.b);
        const banda = (x1 - x0) / x.length, xs = x.map((_, i) => x0 + banda * (i + 0.5));
        const ancho = banda > 10 ? banda * 0.7 : Math.max(1, banda - 1);
        ejeY(svg, ti, y, m.l, w - m.r);
        // solo las etiquetas que caben: se salta un número fijo de las no vacías
        const conEtiqueta = x.map((_, i) => i).filter(i => etiquetas[i]);
        const visibles = new Set(indicesEtiquetas(conEtiqueta.length, x1 - x0).map(k => conEtiqueta[k]));
        x.forEach((_, i) => {
            let arriba = 0, abajo = 0;
            series.forEach(se => {
                const val = se.valores[i];
                if (!val) return;
                const ini = val > 0 ? arriba : abajo, fin = ini + val;
                if (val > 0) arriba = fin; else abajo = fin;
                S('rect', { x: xs[i] - ancho / 2, y: Math.min(y(ini), y(fin)), width: ancho, height: Math.max(0.5, Math.abs(y(ini) - y(fin)) - (banda > 10 ? 1 : 0)), fill: v(se.color) }, svg);
            });
            if (visibles.has(i)) S('text', { x: xs[i], y: h - 8, 'text-anchor': xs[i] < 20 ? 'start' : 'middle' }, svg).textContent = etiquetas[i];
        });
        const puntos = total.valores.map((t, i) => `${xs[i]},${y(t)}`).join(' ');
        S('polyline', { points: puntos, fill: 'none', stroke: v('--c-superficie'), 'stroke-width': 5, 'stroke-linejoin': 'round' }, svg);
        S('polyline', { points: puntos, fill: 'none', stroke: v('--c-tinta'), 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
        const n = x.length - 1;
        S('circle', { cx: xs[n], cy: y(total.valores[n]), r: 4, fill: v('--c-tinta'), stroke: v('--c-superficie'), 'stroke-width': 2 }, svg);
        S('text', { x: xs[n] - 8, y: y(total.valores[n]) - 10, 'text-anchor': 'end', class: 'valor' }, svg).textContent = formato(total.valores[n]);
        const guia = S('line', { y1: m.t, y2: h - m.b, stroke: v('--c-tenue'), 'stroke-dasharray': '2 3', visibility: 'hidden' }, svg);
        zonas(svg, xs.map(cx => ({ x: cx - banda / 2, y: m.t, width: banda, height: h - m.t - m.b })),
            i => `${x[i]}: ${total.nombre} ${formato(total.valores[i])} millones de euros`,
            i => `<div class="cab">${x[i]}</div>` + series.map(se => filaTip(se.nombre, v(se.color), formato(se.valores[i] || 0))).join('') +
                filaTip(total.nombre, v('--c-tinta'), formato(total.valores[i])),
            i => { guia.setAttribute('x1', xs[i]); guia.setAttribute('x2', xs[i]); guia.setAttribute('visibility', 'visible'); },
            () => guia.setAttribute('visibility', 'hidden'));
        tablaAccesible(el, ['', ...series.map(se => se.nombre), total.nombre],
            x.map((t, i) => [t, ...series.map(se => formato(se.valores[i] || 0)), formato(total.valores[i])]));
    }

    // Barras horizontales ordenadas con columna de variación
    function dibujarRanking(el, op) {
        const { color, titulo = '' } = op;
        const filas = op.filas.filter(f => f.valor != null);
        if (!filas.length) return sinDatos(el);
        const fh = 30, h = filas.length * fh + 8;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const etq = Math.min(130, w * 0.32), x0 = etq + 8, x1 = w - 62 - 58;
        const max = Math.max(...filas.map(f => f.valor));
        const ys = filas.map((_, i) => 4 + i * fh + fh / 2);
        filas.forEach((f, i) => {
            const cy = ys[i], largo = Math.max(2, (x1 - x0) * f.valor / max);
            S('text', { x: etq, y: cy + 4, 'text-anchor': 'end', class: 'nombre' }, svg).textContent = f.nombre;
            S('rect', { x: x0, y: cy - 9, width: largo, height: 18, rx: 2, fill: f.resto ? v('--c-tenue') : v(color), opacity: f.resto ? 0.45 : 1 }, svg);
            S('text', { x: x0 + largo + 6, y: cy + 4, class: 'valor' }, svg).textContent = formato(f.valor);
            S('text', { x: w - 4, y: cy + 4, 'text-anchor': 'end' }, svg).textContent = formatoPct(f.variacion);
        });
        zonas(svg, ys.map(cy => ({ x: 0, y: cy - fh / 2, width: w, height: fh })),
            i => `${filas[i].nombre}: ${formato(filas[i].valor)} millones de euros, ${formatoPct(filas[i].variacion)}`,
            i => `<div class="cab">${filas[i].nombre}</div>` + (filas[i].serie || []).map(([a, val]) => filaTip(a, '', val == null ? '–' : formato(val))).join(''));
        tablaAccesible(el, ['', 'Millones de euros', 'Variación'], filas.map(f => [f.nombre, formato(f.valor), formatoPct(f.variacion)]));
    }

    // Mancuernas: dos valores por fila (ingresos y pagos)
    function dibujarMancuernas(el, op) {
        const { filas, nombres, colores = ['--p-flujos-exportaciones', '--p-flujos-importaciones'], titulo = '', xMax = null } = op;
        if (!filas.length) return sinDatos(el);
        // en pantallas estrechas el nombre va encima de su fila para que quepa entero
        const apilado = el.clientWidth < 520;
        const fh = apilado ? 42 : 28, top = 22, h = filas.length * fh + top + 4;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const [cA, cB] = colores.map(v);
        const etq = apilado ? 0 : Math.min(190, w * 0.4), x0 = apilado ? 12 : etq + 10, x1 = w - 12;
        const ti = marcas(0, xMax ?? Math.max(...filas.flatMap(f => [f.a, f.b])), w < 500 ? 3 : 5);
        const x = t => x0 + (x1 - x0) * t / ti[ti.length - 1];
        ti.forEach((t, k) => {
            S('line', { x1: x(t), x2: x(t), y1: top - 4, y2: h, stroke: v('--c-linea') }, svg);
            // la última marca se alinea a la derecha para no salirse del lienzo
            S('text', { x: x(t), y: 12, 'text-anchor': k === ti.length - 1 ? 'end' : k === 0 ? 'start' : 'middle' }, svg).textContent = formato(t);
        });
        const ys = filas.map((_, i) => top + i * fh + fh / 2);
        filas.forEach((f, i) => {
            const cy = apilado ? ys[i] + 8 : ys[i];
            S('text', apilado ? { x: f.sangria ? 20 : 10, y: ys[i] - 6, 'text-anchor': 'start' } : { x: etq, y: cy + 4, 'text-anchor': 'end' }, svg);
            const nombre = svg.lastChild;
            nombre.setAttribute('class', 'nombre');
            nombre.setAttribute('font-size', f.sangria ? 11.5 : 12.5);
            if (f.sangria) nombre.setAttribute('style', `fill:${v('--c-tenue')}`);
            nombre.textContent = (f.sangria ? '· ' : '') + f.nombre;
            S('line', { x1: x(f.a), x2: x(f.b), y1: cy, y2: cy, stroke: v('--c-linea'), 'stroke-width': 3 }, svg);
            S('circle', { cx: x(f.b), cy, r: 5, fill: cB, stroke: v('--c-superficie'), 'stroke-width': 2 }, svg);
            S('circle', { cx: x(f.a), cy, r: 5, fill: cA, stroke: v('--c-superficie'), 'stroke-width': 2 }, svg);
        });
        zonas(svg, ys.map(cy => ({ x: 0, y: cy - fh / 2, width: w, height: fh })),
            i => `${filas[i].nombre}: ${nombres[0]} ${formato(filas[i].a)}, ${nombres[1]} ${formato(filas[i].b)} millones de euros`,
            i => { const f = filas[i]; return `<div class="cab">${f.nombre}</div>` +
                filaTip(nombres[0], cA, `${formato(f.a)} · ${cuota(f.cuotaA)}`) + filaTip(nombres[1], cB, `${formato(f.b)} · ${cuota(f.cuotaB)}`) +
                filaTip('Saldo', '', formato(f.a - f.b)) + '<div class="nota">% sobre el total de servicios no turísticos</div>'; });
        tablaAccesible(el, ['', nombres[0], nombres[1], `% ${nombres[0].toLowerCase()}`, `% ${nombres[1].toLowerCase()}`],
            filas.map(f => [f.nombre, formato(f.a), formato(f.b), cuota(f.cuotaA), cuota(f.cuotaB)]));
    }

    // Mariposa: a a la izquierda, b a la derecha, nombres en el centro (encima en móvil)
    function dibujarMariposa(el, op) {
        const { filas, nombres, colores = ['--p-flujos-exportaciones', '--p-flujos-importaciones'], titulo = '' } = op;
        if (!filas.length) return sinDatos(el);
        const apilado = el.clientWidth < 560;
        const fh = apilado ? 40 : 30, top = 26, h = filas.length * fh + top + 4;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const [cA, cB] = colores.map(v);
        const centro = w / 2, ys = filas.map((_, i) => top + i * fh + fh / 2);
        const cys = ys.map(y => apilado ? y + 7 : y);
        // nombres primero: el hueco central se ajusta al más largo
        const anchos = filas.map((f, i) => {
            const t = S('text', { x: centro, y: apilado ? ys[i] - 8 : cys[i] + 4, 'text-anchor': 'middle', class: 'nombre' }, svg);
            t.textContent = f.nombre;
            return t.getComputedTextLength ? t.getComputedTextLength() : f.nombre.length * 7;
        });
        const hueco = apilado ? 1 : Math.max(...anchos) / 2 + 10, largoMax = centro - hueco - 52;
        const max = Math.max(...filas.flatMap(f => [f.a, f.b]));
        const L = t => largoMax * t / max;
        const sumA = filas.reduce((s, f) => s + f.a, 0), sumB = filas.reduce((s, f) => s + f.b, 0);
        S('text', { x: centro - Math.max(hueco, 8), y: 14, 'text-anchor': 'end', class: 'nombre', style: `fill:${cA}` }, svg).textContent = '← ' + nombres[0];
        S('text', { x: centro + Math.max(hueco, 8), y: 14, 'text-anchor': 'start', class: 'nombre', style: `fill:${cB}` }, svg).textContent = nombres[1] + ' →';
        filas.forEach((f, i) => {
            const cy = cys[i], alto = apilado ? 14 : 18;
            S('rect', { x: centro - hueco - L(f.a), y: cy - alto / 2, width: L(f.a), height: alto, rx: 2, fill: cA }, svg);
            S('rect', { x: centro + hueco, y: cy - alto / 2, width: L(f.b), height: alto, rx: 2, fill: cB }, svg);
            S('text', { x: centro - hueco - L(f.a) - 5, y: cy + 4, 'text-anchor': 'end' }, svg).textContent = formato(f.a);
            S('text', { x: centro + hueco + L(f.b) + 5, y: cy + 4, 'text-anchor': 'start' }, svg).textContent = formato(f.b);
        });
        zonas(svg, ys.map(cy => ({ x: 0, y: cy - fh / 2, width: w, height: fh })),
            i => `${filas[i].nombre}: ${nombres[0]} ${formato(filas[i].a)}, ${nombres[1]} ${formato(filas[i].b)} millones de euros`,
            i => { const f = filas[i]; return `<div class="cab">${f.nombre}</div>` +
                filaTip(nombres[0], cA, `${formato(f.a)} · ${cuota(100 * f.a / sumA)}`) + filaTip(nombres[1], cB, `${formato(f.b)} · ${cuota(100 * f.b / sumB)}`) +
                filaTip('Saldo', '', formato(f.a - f.b)) + '<div class="nota">Millones de euros y % sobre el total</div>'; });
        tablaAccesible(el, ['', nombres[0], nombres[1]], filas.map(f => [f.nombre, formato(f.a), formato(f.b)]));
    }

    // Barras divergentes desde cero: positivas a la derecha, negativas a la izquierda.
    // El nombre va al otro lado del eje, junto al cero.
    function dibujarDivergentes(el, op) {
        const { filas, nombres = ['Exportaciones', 'Importaciones'], colores = ['--p-flujos-exportaciones', '--p-flujos-importaciones'], titulo = '' } = op;
        if (!filas.length) return sinDatos(el);
        const fh = 24, top = 8, sep = filas.some(f => f.valor < 0) && filas.some(f => f.valor >= 0) ? 14 : 0;
        const h = filas.length * fh + top + sep + 4;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const [cPos, cNeg] = colores.map(v);
        const max = Math.max(...filas.map(f => f.valor)), min = Math.min(...filas.map(f => f.valor));
        const margen = 62, x = t => margen + (w - 2 * margen) * (t - min) / (max - min || 1), x0 = x(0);
        let yAcum = top, cambio = false;
        const ys = filas.map(f => { if (!cambio && f.valor < 0 && sep) { yAcum += sep; cambio = true; } const y = yAcum + fh / 2; yAcum += fh; return y; });
        S('line', { x1: x0, x2: x0, y1: 0, y2: h, stroke: v('--c-tenue') }, svg);
        filas.forEach((f, i) => {
            const cy = ys[i], pos = f.valor >= 0, xf = x(f.valor);
            S('rect', { x: Math.min(x0, xf), y: cy - 8, width: Math.max(1, Math.abs(xf - x0)), height: 16, rx: 2, fill: pos ? cPos : cNeg }, svg);
            S('text', { x: pos ? x0 - 6 : x0 + 6, y: cy + 4, 'text-anchor': pos ? 'end' : 'start', class: 'nombre' }, svg).textContent = f.nombre;
            S('text', { x: pos ? xf + 5 : xf - 5, y: cy + 4, 'text-anchor': pos ? 'start' : 'end' }, svg).textContent = formato(f.valor);
        });
        zonas(svg, ys.map(cy => ({ x: 0, y: cy - fh / 2, width: w, height: fh })),
            i => `${filas[i].nombre}: saldo ${formato(filas[i].valor)} millones de euros`,
            i => { const f = filas[i]; return `<div class="cab">${f.nombre}</div>` +
                filaTip(nombres[0], cPos, formato(f.a)) + filaTip(nombres[1], cNeg, formato(f.b)) +
                filaTip('Saldo', '', formato(f.valor)) + '<div class="nota">Millones de euros</div>'; });
        tablaAccesible(el, ['', nombres[0], nombres[1], 'Saldo'], filas.map(f => [f.nombre, formato(f.a), formato(f.b), formato(f.valor)]));
    }

    // Tiras al 100 %: una fila por categoría, partes en el orden dado
    function dibujarTiras(el, op) {
        const { filas, titulo = '', notaTip = '' } = op;
        if (!filas.length) return sinDatos(el);
        const apilado = el.clientWidth < 560;
        const fh = apilado ? 46 : 34, h = filas.length * fh + 4;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const etq = apilado ? 0 : Math.min(120, w * 0.22), x0 = apilado ? 0 : etq + 10, x1 = w - 2, alto = 22;
        const segmentos = [];
        filas.forEach((f, i) => {
            const cyBarra = apilado ? 4 + i * fh + 18 + alto / 2 : 4 + i * fh + fh / 2;
            S('text', apilado ? { x: 0, y: cyBarra - alto / 2 - 5 } : { x: etq, y: cyBarra + 4, 'text-anchor': 'end' }, svg);
            svg.lastChild.setAttribute('class', 'nombre');
            svg.lastChild.textContent = f.nombre;
            const total = f.partes.reduce((s, p) => s + p.valor, 0);
            let xa = x0;
            f.partes.forEach(p => {
                const ancho = (x1 - x0) * p.valor / total, pct = 100 * p.valor / total;
                S('rect', { x: xa, y: cyBarra - alto / 2, width: Math.max(0, ancho - 1), height: alto, fill: v(p.color) }, svg);
                if (ancho > 30) S('text', { x: xa + ancho / 2, y: cyBarra + 4, 'text-anchor': 'middle', style: 'fill:#fff;font-weight:500' }, svg).textContent = Math.round(pct) + ' %';
                segmentos.push({ x: xa, y: cyBarra - alto / 2, width: Math.max(1, ancho), height: alto, fila: f, parte: p, pct });
                xa += ancho;
            });
        });
        zonas(svg, segmentos.map(({ x, y, width, height }) => ({ x, y, width, height })),
            i => { const s = segmentos[i]; return `${s.fila.nombre}, ${s.parte.nombre}: ${cuota(s.pct)}, ${formato(s.parte.valor)} millones de euros`; },
            i => { const s = segmentos[i]; return `<div class="cab">${s.fila.nombre}</div>` +
                filaTip(s.parte.nombre, v(s.parte.color), `${cuota(s.pct)} · ${formato(s.parte.valor)}`) + (notaTip ? `<div class="nota">${notaTip}</div>` : ''); });
        tablaAccesible(el, ['', ...filas[0].partes.map(p => p.nombre)], filas.map(f => {
            const total = f.partes.reduce((s, p) => s + p.valor, 0);
            return [f.nombre, ...f.partes.map(p => cuota(100 * p.valor / total))];
        }));
    }

    // Iconos esquemáticos de los grupos de las ramas, de 18 × 12 con la esquina en (x, y)
    function icono(svg, tipo, x, y) {
        if (tipo === 'ue') {
            S('rect', { x, y, width: 18, height: 12, rx: 1.5, fill: '#003399' }, svg);
            for (let i = 0; i < 12; i++) {
                const a = i * Math.PI / 6;
                S('circle', { cx: x + 9 + 3.9 * Math.cos(a), cy: y + 6 + 3.9 * Math.sin(a), r: 0.75, fill: '#FFCC00' }, svg);
            }
        } else {
            const g = { fill: 'none', stroke: v('--c-tenue'), 'stroke-width': 1 };
            S('circle', Object.assign({ cx: x + 9, cy: y + 6, r: 5.5 }, g), svg);
            S('ellipse', Object.assign({ cx: x + 9, cy: y + 6, rx: 2.4, ry: 5.5 }, g), svg);
            S('line', Object.assign({ x1: x + 3.5, x2: x + 14.5, y1: y + 6, y2: y + 6 }, g), svg);
        }
    }

    // Ramas: el origen se abre en grupos y cada grupo en destinos, con grosor proporcional
    // al valor. invertir = los destinos a la izquierda y las flechas llegan al origen.
    function dibujarRamas(el, op) {
        const { origen, grupos, total, invertir = false, color = '--p-flujos-exportaciones', nombreValor = 'Millones de euros', titulo = '' } = op;
        if (!grupos.length) return sinDatos(el);
        const estrecho = el.clientWidth < 560;
        const fh = estrecho ? 32 : 26, cab = 30, hueco = 18, top = 6;
        const filas = [];
        let y = top;
        grupos.forEach(g => {
            y += cab;
            const y0 = y;
            g.hijos.forEach(hj => { filas.push({ g, hj, cy: y + fh / 2 }); y += fh; });
            g.y0 = y0; g.y1 = y;
            y += hueco;
        });
        const h = y - hueco + 6;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const X = x => invertir ? w - x : x;
        const ancla = a => !invertir ? a : a === 'start' ? 'end' : a === 'end' ? 'start' : a;
        const caja = (x, yy, ancho, alto, at) => S('rect', Object.assign({ x: invertir ? w - x - ancho : x, y: yy, width: ancho, height: alto }, at), svg);
        const cFlujo = v(color);
        const etq = estrecho ? 124 : 200, xO = estrecho ? 4 : 74, nodo = 8;
        const xC = w - etq - 10, xG = xO + nodo + (xC - xO - nodo) * 0.42;
        const maxHijo = Math.max(...grupos.flatMap(g => g.hijos.map(hj => hj.valor)));
        const k = (fh - 7) / maxHijo;
        // origen centrado entre los nodos de grupo
        grupos.forEach(g => { g.alto = k * g.valor; g.cy = (g.y0 + g.y1) / 2; g.top = g.cy - g.alto / 2; });
        // total puede incluir comercio sin país (avituallamiento): el nodo mide lo repartido, la etiqueta el total
        const altoO = k * grupos.reduce((s, g) => s + g.valor, 0), cyO = (grupos[0].cy + grupos[grupos.length - 1].cy) / 2;
        let yo = cyO - altoO / 2;
        grupos.forEach(g => {
            S('path', { d: cinta(X(xO + nodo), yo, yo + g.alto, X(xG), g.top, g.top + g.alto), fill: conAlfa(cFlujo, 0.22) }, svg);
            yo += g.alto;
            let yg = g.top;
            g.hijos.forEach(hj => {
                const fila = filas.find(f => f.hj === hj), grosor = Math.max(1, k * hj.valor), col = v(hj.color);
                S('path', { d: cinta(X(xG + nodo), yg, yg + k * hj.valor, X(xC), fila.cy - grosor / 2, fila.cy + grosor / 2), fill: conAlfa(col, 0.5) }, svg);
                yg += k * hj.valor;
                if (!invertir) {
                    const pa = Math.max(5, grosor / 2 + 2);
                    S('polygon', { points: `${X(xC)},${fila.cy - pa} ${X(xC + 9)},${fila.cy} ${X(xC)},${fila.cy + pa}`, fill: col }, svg);
                } else caja(xC - 2, fila.cy - grosor / 2, 3, grosor, { fill: col });
            });
            caja(xG, g.top, nodo, g.alto, { fill: cFlujo, rx: 1 });
            // nombre del grupo, con icono
            const ty = g.y0 - 10;   // en la fila de cabecera, libre de cintas
            const t = S('text', { x: X(xG + nodo / 2 + 12), y: ty, 'text-anchor': ancla('start'), class: 'nombre', style: 'font-weight:700' }, svg);
            t.textContent = `${g.nombre} · ${cuota(100 * g.valor / total)}`;
            icono(svg, g.icono, invertir ? w - (xG + nodo / 2 - 10) - 18 : xG + nodo / 2 - 10, ty - 10);
        });
        // nodo de origen
        caja(xO, cyO - altoO / 2, nodo, altoO, { fill: v('--c-tinta'), rx: 1 });
        // en estrecho el nombre va encima del nodo, que se pega al borde
        const atO = estrecho ? [X(xO), cyO - altoO / 2 - 20, cyO - altoO / 2 - 6, ancla('start')] : [X(xO - 6), cyO - 2, cyO + 13, ancla('end')];
        const tO = S('text', { x: atO[0], y: atO[1], 'text-anchor': atO[3], class: 'nombre', style: 'font-weight:700' }, svg);
        tO.textContent = origen;
        S('text', { x: atO[0], y: atO[2], 'text-anchor': atO[3] }, svg).textContent = formato(total);
        // destinos: nombre y valor
        filas.forEach(({ hj, cy }) => {
            const xt = X(xC + 14);
            if (estrecho) {
                S('text', { x: xt, y: cy - 2, 'text-anchor': ancla('start'), class: 'nombre', style: hj.resto ? `fill:${v('--c-tenue')}` : '' }, svg).textContent = hj.nombre;
                S('text', { x: xt, y: cy + 11, 'text-anchor': ancla('start') }, svg).textContent = `${formato(hj.valor)} · ${cuota(hj.cuota)}`;
            } else {
                S('text', { x: xt, y: cy + 4, 'text-anchor': ancla('start'), class: 'nombre', style: hj.resto ? `fill:${v('--c-tenue')}` : '' }, svg).textContent = hj.nombre;
                S('text', { x: X(w - 2), y: cy + 4, 'text-anchor': ancla('end') }, svg).textContent = formato(hj.valor);
            }
        });
        zonas(svg, filas.map(({ cy }) => ({ x: invertir ? 0 : xG, y: cy - fh / 2, width: w - xG, height: fh })),
            i => { const { g, hj } = filas[i]; return `${hj.nombre}: ${formato(hj.valor)} millones de euros, ${cuota(hj.cuota)} del total, ${cuota(100 * hj.valor / g.valor)} de ${g.nombre}`; },
            i => { const { g, hj } = filas[i]; return `<div class="cab">${hj.nombre}</div>` +
                filaTip(nombreValor, v(hj.color), formato(hj.valor)) + filaTip('% del total', '', cuota(hj.cuota)) +
                filaTip(`% de ${g.nombre}`, '', cuota(100 * hj.valor / g.valor)) + (hj.puesto ? filaTip('Puesto', '', String(hj.puesto)) : ''); });
        tablaAccesible(el, ['', 'Grupo', nombreValor, '% del total'], filas.map(({ g, hj }) => [hj.nombre, g.nombre, formato(hj.valor), cuota(hj.cuota)]));
    }

    const DIBUJO = { lineas: dibujarLineas, apiladas: dibujarApiladas, ranking: dibujarRanking, mancuernas: dibujarMancuernas,
        mariposa: dibujarMariposa, divergentes: dibujarDivergentes, tiras: dibujarTiras, ramas: dibujarRamas };
    const publico = tipo => (el, op) => { registrar(tipo, el, op); DIBUJO[tipo](el, op); };

    function panelesGemelos(els, ops) {
        const yMax = Math.max(...ops.flatMap(o => [...o.a, ...o.b]).filter(t => t != null));
        els.forEach((el, i) => publico('lineas')(el, Object.assign({}, ops[i], { yMax })));
    }

    raiz.Graficos = Object.assign({
        lineas: publico('lineas'), apiladas: publico('apiladas'), ranking: publico('ranking'),
        mancuernas: publico('mancuernas'), mariposa: publico('mariposa'), divergentes: publico('divergentes'),
        tiras: publico('tiras'), ramas: publico('ramas'), panelesGemelos, redibujarTodo
    }, puras);
})(typeof window !== 'undefined' ? window : globalThis);
