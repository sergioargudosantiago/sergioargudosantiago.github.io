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
    const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
    const formato = x => nf.format(Math.round(x));
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
    const anchoDibujable = ancho => ancho > 0;
    const conAlfa = (hex, a) => `rgba(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;

    const puras = { marcas, formato, formatoPct, variacionPct, sumaMovil, pasoEtiquetas, anchoDibujable, conAlfa };
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
        const svg = S('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': titulo || '' }, el);
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

    // Zonas interactivas: un rectángulo transparente enfocable por punto, columna o fila
    function zonas(svg, rects, etiqueta, html, entrar, salir) {
        const lista = rects.map((at, i) => {
            const r = S('rect', Object.assign({ fill: 'transparent', tabindex: '0', role: 'graphics-symbol', 'aria-label': etiqueta(i) }, at), svg);
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
        const ti = marcas(Math.min(0, ...vals), yMax ?? Math.max(...vals));
        const y = t => m.t + (ti[ti.length - 1] - t) / (ti[ti.length - 1] - ti[0]) * (h - m.t - m.b);
        const xs = x.map((_, i) => x.length > 1 ? x0 + i * (x1 - x0) / (x.length - 1) : (x0 + x1) / 2);
        const [cA, cB] = colores.map(v);
        ejeY(svg, ti, y, m.l, w - m.r);
        const paso = pasoEtiquetas(x.length, x1 - x0);
        x.forEach((t, i) => { if (i % paso === 0 || i === x.length - 1) S('text', { x: xs[i], y: h - 8, 'text-anchor': 'middle' }, svg).textContent = t; });

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
        const saltoEtq = pasoEtiquetas(conEtiqueta.length, x1 - x0);
        const visibles = new Set(conEtiqueta.filter((_, k) => k % saltoEtq === 0));
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
        const { filas, nombres, colores = ['--p-flujos-exportaciones', '--p-flujos-importaciones'], titulo = '' } = op;
        if (!filas.length) return sinDatos(el);
        // en pantallas estrechas el nombre va encima de su fila para que quepa entero
        const apilado = el.clientWidth < 520;
        const fh = apilado ? 42 : 28, top = 22, h = filas.length * fh + top + 4;
        const c = lienzo(el, h, titulo);
        if (!c) return;
        const { svg, w } = c;
        const [cA, cB] = colores.map(v);
        const etq = apilado ? 0 : Math.min(190, w * 0.4), x0 = apilado ? 6 : etq + 10, x1 = w - 12;
        const ti = marcas(0, Math.max(...filas.flatMap(f => [f.a, f.b])), w < 500 ? 3 : 5);
        const x = t => x0 + (x1 - x0) * t / ti[ti.length - 1];
        ti.forEach((t, k) => {
            S('line', { x1: x(t), x2: x(t), y1: top - 4, y2: h, stroke: v('--c-linea') }, svg);
            // la última marca se alinea a la derecha para no salirse del lienzo
            S('text', { x: x(t), y: 12, 'text-anchor': k === ti.length - 1 ? 'end' : k === 0 ? 'start' : 'middle' }, svg).textContent = formato(t);
        });
        const ys = filas.map((_, i) => top + i * fh + fh / 2);
        filas.forEach((f, i) => {
            const cy = apilado ? ys[i] + 8 : ys[i];
            S('text', apilado ? { x: f.sangria ? 12 : 0, y: ys[i] - 6, 'text-anchor': 'start' } : { x: etq, y: cy + 4, 'text-anchor': 'end' }, svg);
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

    const DIBUJO = { lineas: dibujarLineas, apiladas: dibujarApiladas, ranking: dibujarRanking, mancuernas: dibujarMancuernas };
    const publico = tipo => (el, op) => { registrar(tipo, el, op); DIBUJO[tipo](el, op); };

    function panelesGemelos(els, ops) {
        const yMax = Math.max(...ops.flatMap(o => [...o.a, ...o.b]).filter(t => t != null));
        els.forEach((el, i) => publico('lineas')(el, Object.assign({}, ops[i], { yMax })));
    }

    raiz.Graficos = Object.assign({
        lineas: publico('lineas'), apiladas: publico('apiladas'), ranking: publico('ranking'),
        mancuernas: publico('mancuernas'), panelesGemelos, redibujarTodo
    }, puras);
})(typeof window !== 'undefined' ? window : globalThis);
