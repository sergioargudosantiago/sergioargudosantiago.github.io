/**
 * Regenera data/balanza_data.js con los últimos datos de la Balanza de Pagos
 * descargados de la API de estadísticas del Banco de España.
 *
 * Uso:  node scripts/update_balanza_data.js
 *
 * comercio-exterior.html carga data/balanza_data.js y, además, refresca en el
 * navegador vía js/bde-api.js; este script sirve para consolidar los datos en
 * el repositorio (histórico completo) sin depender de la API en cada visita.
 * Sin dependencias externas (Node >= 18).
 */
const fs = require('fs');
const path = require('path');

const API = 'https://app.bde.es/bierest/resources/srdatosapp/listaSeries';
const OUTPUT = path.join(__dirname, '..', 'data', 'balanza_data.js');

const MONTH_ABBR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Códigos de serie (fila "CÓDIGO DE LA SERIE" de balanza/be*.csv), en el mismo
// orden de columnas que usan los gráficos de comercio-exterior.html.
const GROUPS = {
    BALANZA_171_RAW: {
        freq: 'M', minYear: 2015,
        labels: [
            'Cuenta Corriente', 'Bienes y Servicios', 'Rentas Primaria y Secundaria',
            'Cuenta de Capital', 'Cta. Corriente + Capital',
            'Cuenta Financiera', 'Banco de España', 'Excl. Banco de España', 'Errores y Omisiones'
        ],
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
    BALANZA_174_RAW: {
        freq: 'Q', minYear: 2015,
        labels: [
            'Bienes Saldo', 'Bienes Ingresos', 'Bienes Pagos',
            'Servicios Saldo', 'Turismo Saldo', 'Serv. No Turísticos Saldo',
            'Servicios Ingresos', 'Turismo Ingresos', 'Serv. No Turísticos Ingresos',
            'Servicios Pagos', 'Turismo Pagos', 'Serv. No Turísticos Pagos'
        ],
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
    BALANZA_174A_RAW: {
        freq: 'Q', minYear: 2020, ingresosPagos: true,
        labels: [
            'Total No Turísticos', 'Transformación y Reparaciones', 'Transporte',
            'Construcción', 'Seguros y Pensiones', 'Servicios Financieros',
            'Propiedad Intelectual', 'Telecomunicaciones e Informática',
            'Otros Serv. Empresariales', 'I+D', 'Consultoría',
            'Serv. Técnicos y Comerciales', 'Personales y Culturales'
        ],
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
    BALANZA_174C_RAW: {
        freq: 'Q', minYear: 2020,
        labels: [
            'Total', 'Europa', 'UE 27', 'UEM 20',
            'Alemania', 'Bélgica', 'Países Bajos', 'Francia',
            'Italia', 'Irlanda', 'Portugal', 'UE27 extra UEM20',
            'Europa extra UE27', 'Reino Unido', 'Rusia', 'Suiza',
            'América', 'Am. Norte y Central', 'EEUU', 'Am. del Sur',
            'África', 'Asia'
        ],
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

async function fetchGroup(group) {
    const url = `${API}?idioma=es&series=${encodeURIComponent(group.codes.join(','))}&rango=MAX`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} en ${url}`);
    const series = await resp.json();
    if (!Array.isArray(series)) throw new Error(`Respuesta inesperada: ${JSON.stringify(series).slice(0, 200)}`);

    const byCode = {};
    series.forEach(s => { byCode[s.serie] = s; });

    const periods = new Map(); // 'year-month' -> { year, month, values[] }
    group.codes.forEach((code, col) => {
        const s = byCode[code];
        if (!s || !Array.isArray(s.fechas)) {
            console.warn(`  ⚠ serie sin datos: ${code}`);
            return;
        }
        s.fechas.forEach((f, i) => {
            const year = +f.slice(0, 4);
            const month = +f.slice(5, 7);
            if (!year || !month || year < group.minYear) return;
            const key = `${year}-${month}`;
            if (!periods.has(key)) periods.set(key, { year, month, values: new Array(group.codes.length).fill(null) });
            const v = s.valores[i];
            periods.get(key).values[col] = (v == null || isNaN(v)) ? null : v;
        });
    });

    let records;
    if (group.freq === 'M') {
        records = [...periods.values()]
            .filter(p => p.values[0] != null)
            .map(p => ({ year: p.year, month: p.month, monthName: MONTH_ABBR[p.month - 1], values: p.values }));
        records.sort((a, b) => a.year - b.year || a.month - b.month);
    } else {
        // La API fecha los trimestres en el primer mes del trimestre (1, 4, 7, 10)
        records = [...periods.values()]
            .filter(p => p.values[0] != null && (p.month - 1) % 3 === 0)
            .map(p => {
                const base = { year: p.year, quarter: (p.month - 1) / 3 + 1 };
                if (group.ingresosPagos) {
                    return { ...base, ingresos: p.values.slice(0, 13), pagos: p.values.slice(13, 26) };
                }
                return { ...base, values: p.values };
            });
        records.sort((a, b) => a.year - b.year || a.quarter - b.quarter);
    }
    return { labels: group.labels, data: records };
}

async function main() {
    let js = '// ========== BALANZA DE PAGOS DATA (Banco de España) ==========\n';
    js += `// Generado por scripts/update_balanza_data.js el ${new Date().toISOString().slice(0, 10)}\n`;
    js += '// Fuente: API de estadísticas del BdE — https://www.bde.es/webbe/es/estadisticas/recursos/api-estadisticas-bde.html\n\n';

    for (const [name, group] of Object.entries(GROUPS)) {
        console.log(`Descargando ${name} (${group.codes.length} series)...`);
        const formatted = await fetchGroup(group);
        const last = formatted.data[formatted.data.length - 1];
        const period = group.freq === 'M' ? `${last.monthName} ${last.year}` : `${last.quarter}T ${last.year}`;
        console.log(`  ${formatted.data.length} registros, último: ${period}`);
        js += `const ${name} = ${JSON.stringify(formatted)};\n\n`;
    }

    fs.writeFileSync(OUTPUT, js, 'utf-8');
    console.log(`\nEscrito ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024).toFixed(0)} KB)`);
}

main().catch(err => { console.error(err); process.exit(1); });
