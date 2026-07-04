// ========== CLIENTE API ESTADÍSTICAS BANCO DE ESPAÑA ==========
// Actualización híbrida de la Balanza de Pagos: la página se renderiza al instante
// con los datos incrustados en comercio-exterior.html y, al abrir la pestaña,
// este módulo consulta la API pública del BdE y fusiona los periodos nuevos o
// revisados. Si la API falla, la web sigue funcionando con los datos incrustados.
// Docs: https://www.bde.es/webbe/es/estadisticas/recursos/api-estadisticas-bde.html

const BDE_API_BASE = 'https://app.bde.es/bierest/resources/srdatosapp/listaSeries';
const BDE_CACHE_KEY = 'bde_api_cache_v1';
const BDE_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 h

const BDE_MONTH_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Códigos de serie en el MISMO orden de columnas que las estructuras BALANZA_*_RAW
// incrustadas (extraídos de la fila "CÓDIGO DE LA SERIE" de balanza/be*.csv).
const BDE_SERIES_GROUPS = {
    // Serie 17.1 — resumen mensual (9 columnas)
    s171: {
        freq: 'M',
        minYear: 2015,
        codes: [
            'DEEM.N.ES.W1.S1.S1.T.B.CA._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.B.GS._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.B.IN._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.B.KA._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.B.CKA._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.N.FA._T.F._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S121.S1.T.N.FA._T.F._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1ZK.S1.T.N.FA._T.F._Z.EUR._T._X.N.ALL',
            'DEEM.N.ES.W1.S1.S1.T.N.EO._Z._Z._Z.EUR._T._X.N.ALL'
        ]
    },
    // Serie 17.4 — cuenta corriente trimestral (12 columnas)
    s174: {
        freq: 'Q',
        minYear: 2015,
        codes: [
            'DEEQ.N.ES.W1.S1.S1.T.B.G._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.G._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.G._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.B.S._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.B.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.B.OS._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.S._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.OS._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.S._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.OS._Z._Z._Z.EUR._T._X.N.ALL'
        ]
    },
    // Serie 17.4A — servicios no turísticos por tipo (13 ingresos + 13 pagos)
    s174a: {
        freq: 'Q',
        minYear: 2020,
        codes: [
            'DEEQ.N.ES.W1.S1.S1.T.C.OS._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SPX4._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SC._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SE._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SF._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SG._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SH._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SI._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SJ._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SJ1._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SJ2._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SJ3._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.C.SPZZ1._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.OS._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SPX4._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SC._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SE._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SF._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SG._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SH._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SI._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SJ._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SJ1._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SJ2._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SJ3._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.W1.S1.S1.T.D.SPZZ1._Z._Z._Z.EUR._T._X.N.ALL'
        ]
    },
    // Serie 17.4C — ingresos por turismo por país/área (22 columnas)
    s174c: {
        freq: 'Q',
        minYear: 2020,
        codes: [
            'DEEQ.N.ES.W1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.E1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.B6.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.I10.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.DE.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.BE.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.NL.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.FR.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.IT.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.IE.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.PT.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.K12.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.G6.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.GB.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.RU.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.CH.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.A1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.A2A5ZZ.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.US.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.A7.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.F1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL',
            'DEEQ.N.ES.S1.S1.S1.T.C.SD._Z._Z._Z.EUR._T._X.N.ALL'
        ]
    }
};

// Descarga un grupo de series (una petición; ~22-26 códigos caben en la URL).
// Devuelve un mapa periodo -> array de valores en el orden de `codes`.
async function bdeFetchGroup(group) {
    const url = `${BDE_API_BASE}?idioma=es&series=${encodeURIComponent(group.codes.join(','))}&rango=60M`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`BdE API HTTP ${resp.status}`);
    const series = await resp.json();
    if (!Array.isArray(series)) throw new Error('BdE API: respuesta inesperada');

    const byCode = {};
    series.forEach(s => { byCode[s.serie] = s; });

    const periods = {}; // 'year-month' -> valores[]
    group.codes.forEach((code, col) => {
        const s = byCode[code];
        if (!s || !Array.isArray(s.fechas)) return;
        s.fechas.forEach((f, i) => {
            const year = +f.slice(0, 4);
            const month = +f.slice(5, 7);
            if (!year || !month || year < group.minYear) return;
            const key = `${year}-${month}`;
            if (!periods[key]) periods[key] = { year, month, values: new Array(group.codes.length).fill(null) };
            const v = s.valores[i];
            periods[key].values[col] = (v == null || isNaN(v)) ? null : v;
        });
    });
    return Object.values(periods);
}

// Fusiona registros de la API sobre el array incrustado (sustituye revisiones,
// añade periodos nuevos). Devuelve true si algo cambió.
function bdeMergeRecords(targetArr, incoming, keyFn) {
    const index = new Map();
    targetArr.forEach((rec, i) => index.set(keyFn(rec), i));
    let changed = false;
    incoming.forEach(rec => {
        const key = keyFn(rec);
        if (index.has(key)) {
            const i = index.get(key);
            if (JSON.stringify(targetArr[i]) !== JSON.stringify(rec)) {
                targetArr[i] = rec;
                changed = true;
            }
        } else {
            targetArr.push(rec);
            index.set(key, targetArr.length - 1);
            changed = true;
        }
    });
    if (changed) {
        targetArr.sort((a, b) => a.year - b.year || (a.month || a.quarter) - (b.month || b.quarter));
    }
    return changed;
}

function bdeToMonthlyRecords(periods) {
    return periods
        .filter(p => p.values[0] != null) // sin cuenta corriente el mes aún no está publicado
        .map(p => ({ year: p.year, month: p.month, monthName: BDE_MONTH_ABBR[p.month - 1], values: p.values }));
}

function bdeToQuarterlyRecords(periods) {
    // La API fecha los trimestres en el primer mes del trimestre (1, 4, 7, 10)
    return periods
        .filter(p => p.values[0] != null && (p.month - 1) % 3 === 0)
        .map(p => ({ year: p.year, quarter: (p.month - 1) / 3 + 1, values: p.values }));
}

function bdeReadCache() {
    try {
        const raw = sessionStorage.getItem(BDE_CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (!cached.ts || Date.now() - cached.ts > BDE_CACHE_TTL_MS) return null;
        return cached.groups;
    } catch (e) {
        return null;
    }
}

function bdeWriteCache(groups) {
    try {
        sessionStorage.setItem(BDE_CACHE_KEY, JSON.stringify({ ts: Date.now(), groups }));
    } catch (e) { /* cuota llena: sin caché */ }
}

let bdeRefreshStarted = false;

// Punto de entrada, invocado desde initBalanzaDeP() en comercio-exterior.html
async function refreshBalanzaFromBdE() {
    if (bdeRefreshStarted) return;
    bdeRefreshStarted = true;
    try {
        let groups = bdeReadCache();
        if (!groups) {
            const [g171, g174, g174a, g174c] = await Promise.all([
                bdeFetchGroup(BDE_SERIES_GROUPS.s171),
                bdeFetchGroup(BDE_SERIES_GROUPS.s174),
                bdeFetchGroup(BDE_SERIES_GROUPS.s174a),
                bdeFetchGroup(BDE_SERIES_GROUPS.s174c)
            ]);
            groups = { s171: g171, s174: g174, s174a: g174a, s174c: g174c };
            bdeWriteCache(groups);
        }

        let changed = false;
        changed = bdeMergeRecords(BALANZA_171_RAW.data, bdeToMonthlyRecords(groups.s171),
            r => `${r.year}-${r.month}`) || changed;
        changed = bdeMergeRecords(BALANZA_174_RAW.data, bdeToQuarterlyRecords(groups.s174),
            r => `${r.year}-${r.quarter}`) || changed;
        changed = bdeMergeRecords(BALANZA_174A_RAW.data,
            bdeToQuarterlyRecords(groups.s174a).map(r => ({
                year: r.year, quarter: r.quarter,
                ingresos: r.values.slice(0, 13), pagos: r.values.slice(13, 26)
            })),
            r => `${r.year}-${r.quarter}`) || changed;
        changed = bdeMergeRecords(BALANZA_174C_RAW.data, bdeToQuarterlyRecords(groups.s174c),
            r => `${r.year}-${r.quarter}`) || changed;

        if (changed) {
            window.bdeApiUpdated = true;
            if (typeof rerenderBalanzaCharts === 'function') rerenderBalanzaCharts();
            console.info('[BdE API] Balanza de pagos actualizada con los últimos datos publicados.');
        } else {
            console.info('[BdE API] Los datos incrustados ya están al día.');
        }
    } catch (e) {
        console.warn('[BdE API] No se pudo actualizar desde la API; se muestran los datos incrustados.', e);
    }
}
