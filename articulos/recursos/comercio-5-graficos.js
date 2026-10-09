/**
 * Gráficos del artículo «El comercio exterior español en 5 gráficos».
 * Lee data/articulos/comercio-5-graficos.json (pipeline privado del autor),
 * y data/paleta.json, y pinta cada
 * <div data-grafico> de los fragmentos comercio-g1..g5 con js/graficos.js.
 */
(function () {
    'use strict';

    const NOMBRE_FLUJO = { exportaciones: 'Exportaciones', importaciones: 'Importaciones' };
    // ISO2 de los países con color propio en data/paleta.json (familia paises)
    const ISO_PALETA = { FR: 'francia', DE: 'alemania', IT: 'italia', PT: 'portugal', GB: 'reino-unido',
        US: 'eeuu', NL: 'paises-bajos', MA: 'marruecos', CN: 'china' };
    const N_RAMA = 8, N_SALDO = 10;
    const cuota1 = x => x.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';

    const lienzo = id => document.querySelector(`[data-grafico="${id}"]`);
    const figura = id => lienzo(id) && lienzo(id).closest('figure');
    // Texto alternativo que el generador pone en la envoltura del fragmento
    const alt = id => { const f = lienzo(id) && lienzo(id).closest('.art-figura'); return f ? f.dataset.alt : ''; };

    function fuente(d) {
        const prov = d.anual.filter(a => a.estado === 'provisional').map(a => a.anio);
        const tramo = prov.length > 1 ? `${prov[0]} y ${prov[prov.length - 1]}` : prov[0];
        return `Fuente: ${d.fuente}.` + (prov.length ? ` Datos de ${tramo} provisionales.` : '');
    }

    function g1(d) {
        const x = d.anual.map(a => String(a.anio));
        const desde = d.anual.findIndex(a => a.estado === 'provisional');
        Graficos.lineas(lienzo('g1-flujos'), {
            x, a: d.anual.map(a => a.exportaciones), b: d.anual.map(a => a.importaciones),
            nombres: ['Exportaciones', 'Importaciones'], colores: ['--p-flujos-exportaciones', '--p-flujos-importaciones'],
            desde: desde < 0 ? null : desde, titulo: alt('g1-flujos')
        });
        Graficos.apiladas(lienzo('g1-saldo'), {
            x, etiquetas: x,
            series: [
                { nombre: 'Saldo energético', valores: d.anual.map(a => a.saldo_energetico), color: '--p-sectores-energeticos' },
                { nombre: 'Saldo no energético', valores: d.anual.map(a => a.saldo_no_energetico), color: '--p-sectores-otras' }
            ],
            total: { nombre: 'Saldo total', valores: d.anual.map(a => Math.round((a.saldo_energetico + a.saldo_no_energetico) * 10) / 10) },
            titulo: 'Saldo comercial energético y no energético, 2015-2025'
        });
    }

    function g2(d, nombreSector) {
        Graficos.mariposa(lienzo('g2'), {
            filas: d.sectores.map(s => ({ nombre: nombreSector[s.id], a: s.exportaciones, b: s.importaciones })),
            nombres: ['Exportaciones', 'Importaciones'], titulo: alt('g2')
        });
    }

    // Ramas desde España: UE-27 y resto del mundo, con sus primeros países y un resto
    function g3(d, flujo) {
        // total nacional: incluye avituallamiento y destinos no determinados, que no se reparten por país
        const total = d.anual[d.anual.length - 1][flujo];
        const sinPais = figura('g3').querySelector('[data-sin-pais]');
        if (sinPais) sinPais.textContent = cuota1(100 * d.sin_pais[flujo] / total);
        const orden = d.paises.filter(p => p[flujo] > 0).sort((a, b) => b[flujo] - a[flujo]);
        const puesto = new Map(orden.map((p, i) => [p.iso2, i + 1]));
        const grupo = (nombre, icono, lista, nombreResto) => {
            const hijos = lista.slice(0, N_RAMA).map(p => ({
                nombre: p.nombre, valor: p[flujo], cuota: 100 * p[flujo] / total, puesto: puesto.get(p.iso2),
                color: ISO_PALETA[p.iso2] ? `--p-paises-${ISO_PALETA[p.iso2]}` : '--p-paises-resto'
            }));
            const resto = lista.slice(N_RAMA), vResto = resto.reduce((s, p) => s + p[flujo], 0);
            if (resto.length) hijos.push({ nombre: `${nombreResto} (${resto.length})`, valor: vResto, cuota: 100 * vResto / total, color: '--p-paises-resto', resto: true });
            return { nombre, icono, valor: lista.reduce((s, p) => s + p[flujo], 0), hijos };
        };
        Graficos.ramas(lienzo('g3'), {
            origen: 'España', total, invertir: flujo === 'importaciones',
            color: `--p-flujos-${flujo}`, nombreValor: NOMBRE_FLUJO[flujo], titulo: alt('g3'),
            grupos: [grupo('Unión Europea', 'ue', orden.filter(p => p.ue), 'Resto de la UE'),
                grupo('Resto del mundo', 'mundo', orden.filter(p => !p.ue), 'Otros países')]
        });
    }

    function g4(d) {
        const saldos = d.paises.map(p => ({ nombre: p.nombre, a: p.exportaciones, b: p.importaciones,
            valor: Math.round((p.exportaciones - p.importaciones) * 10) / 10 })).sort((a, b) => b.valor - a.valor);
        const filas = saldos.slice(0, N_SALDO).concat(saldos.slice(-N_SALDO));
        Graficos.divergentes(lienzo('g4'), { filas, titulo: alt('g4') });
    }

    function g5(d, paleta, flujo) {
        // Los diez sectores, en el orden de apilado de la paleta
        const filas = paleta.paises.filter(p => p.id !== 'resto').map(p => {
            const del = d.adn.filter(r => r.pais === p.id);
            const partes = paleta.sectores.map(s => ({ nombre: s.nombre, color: `--p-sectores-${s.id}`,
                valor: del.filter(r => r.sector === s.id).reduce((t, r) => t + r[flujo], 0) }));
            return { nombre: p.nombre, partes };
        });
        Graficos.tiras(lienzo('g5'), { filas, titulo: alt('g5'), notaTip: `% sobre las ${flujo} con ese país y millones de euros` });
        const leyenda = figura('g5').querySelector('[data-leyenda]');
        leyenda.innerHTML = filas[0].partes.map(p => `<span><i class="graficos-muestra" style="background:var(${p.color})"></i>${p.nombre}</span>`).join('');
    }

    // Conmutador Exportaciones/Importaciones de una figura
    function conmutador(id, pintar) {
        const fig = figura(id);
        const titulo = fig.querySelector('[data-titulo-exportaciones]');
        fig.querySelectorAll('.art-conmutador button').forEach(b => b.addEventListener('click', () => {
            const flujo = b.dataset.flujo;
            fig.querySelectorAll('.art-conmutador button').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
            titulo.textContent = titulo.dataset[`titulo${flujo[0].toUpperCase()}${flujo.slice(1)}`];
            pintar(flujo);
        }));
        pintar('exportaciones');
    }

    async function iniciar() {
        if (!lienzo('g1-flujos')) return;
        const json = r => fetch(r).then(x => { if (!x.ok) throw new Error(`${r}: ${x.status}`); return x.json(); });
        let d, paleta;
        try {
            [d, paleta] = await Promise.all([
                json('../data/articulos/comercio-5-graficos.json'), json('../data/paleta.json')]);
        } catch (e) {
            document.querySelectorAll('.art-fig .graficos-lienzo').forEach(el => {
                el.innerHTML = '<p class="c-nota">No se han podido cargar los datos del gráfico.</p>';
            });
            return;
        }
        document.querySelectorAll('.art-fig [data-fuente]').forEach(el => { el.textContent = fuente(d); });
        document.querySelectorAll('.art-fig [data-anio]').forEach(el => { el.textContent = d.anio; });
        const nombreSector = Object.fromEntries(paleta.sectores.map(s => [s.id, s.nombre]));
        g1(d);
        g2(d, nombreSector);
        conmutador('g3', flujo => g3(d, flujo));
        g4(d);
        conmutador('g5', flujo => g5(d, paleta, flujo));
        // Al cambiar de tema, los colores salen de otras variables
        new MutationObserver(() => Graficos.redibujarTodo())
            .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
