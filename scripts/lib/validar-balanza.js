/**
 * Validaciones de data/balanza_data.js antes de escribirlo.
 *
 * validarBalanza(nuevo, anterior, hoy) recibe los grupos ya formateados
 * ({ BALANZA_171_RAW: { labels, data }, ... }) y devuelve
 * { errores, avisos, revisiones }. Con algún error, el fichero no se escribe.
 *
 * - Identidades contables de cada serie y entre series. El BdE publica en
 *   millones redondeados, así que se admite 1 M€ de diferencia por sumando.
 * - Periodos seguidos, sin huecos, y sin nulos salvo en los países de 17.4C
 *   (el BdE no publica algunos trimestres de 2020-2022).
 * - Frente al fichero anterior: no se pierde ningún periodo, el último dato no
 *   retrocede y ningún valor publicado pasa a nulo. Los cambios de valor son
 *   revisiones del BdE: no bloquean, se listan.
 */

// Columnas de 17.4C que pueden venir vacías: países sueltos, no agregados
const NULOS_PERMITIDOS = {
    BALANZA_174C_RAW: ['Alemania', 'Bélgica', 'Países Bajos', 'Francia', 'Italia', 'Irlanda',
        'Portugal', 'Reino Unido', 'Rusia', 'Suiza', 'EEUU']
};

// [descripción, grupo, total, sumandos (con '-' delante si restan), campo]
// campo: 'values' en 17.1, 17.4 y 17.4C; 'ingresos' o 'pagos' en 17.4A.
const IDENTIDADES = [
    ['Cuenta corriente = bienes y servicios + rentas', 'BALANZA_171_RAW', 'Cuenta Corriente', ['Bienes y Servicios', 'Rentas Primaria y Secundaria']],
    ['Cuenta corriente y de capital = corriente + capital', 'BALANZA_171_RAW', 'Cta. Corriente + Capital', ['Cuenta Corriente', 'Cuenta de Capital']],
    ['Cuenta financiera = Banco de España + resto', 'BALANZA_171_RAW', 'Cuenta Financiera', ['Banco de España', 'Excl. Banco de España']],
    ['Errores y omisiones = financiera - (corriente + capital)', 'BALANZA_171_RAW', 'Errores y Omisiones', ['Cuenta Financiera', '-Cta. Corriente + Capital']],
    ['Saldo de bienes = ingresos - pagos', 'BALANZA_174_RAW', 'Bienes Saldo', ['Bienes Ingresos', '-Bienes Pagos']],
    ['Saldo de servicios = ingresos - pagos', 'BALANZA_174_RAW', 'Servicios Saldo', ['Servicios Ingresos', '-Servicios Pagos']],
    ['Saldo de servicios = turismo + no turísticos', 'BALANZA_174_RAW', 'Servicios Saldo', ['Turismo Saldo', 'Serv. No Turísticos Saldo']],
    ['Ingresos por servicios = turismo + no turísticos', 'BALANZA_174_RAW', 'Servicios Ingresos', ['Turismo Ingresos', 'Serv. No Turísticos Ingresos']],
    ['Pagos por servicios = turismo + no turísticos', 'BALANZA_174_RAW', 'Servicios Pagos', ['Turismo Pagos', 'Serv. No Turísticos Pagos']],
    ['Saldo de turismo = ingresos - pagos', 'BALANZA_174_RAW', 'Turismo Saldo', ['Turismo Ingresos', '-Turismo Pagos']],
    ['Saldo no turístico = ingresos - pagos', 'BALANZA_174_RAW', 'Serv. No Turísticos Saldo', ['Serv. No Turísticos Ingresos', '-Serv. No Turísticos Pagos']],
    ...['ingresos', 'pagos'].flatMap(campo => [
        [`No turísticos (${campo}) = suma de ramas`, 'BALANZA_174A_RAW', 'Total No Turísticos',
            ['Transformación y Reparaciones', 'Transporte', 'Construcción', 'Seguros y Pensiones', 'Servicios Financieros',
                'Propiedad Intelectual', 'Telecomunicaciones e Informática', 'Otros Serv. Empresariales', 'Personales y Culturales'], campo],
        [`Otros servicios empresariales (${campo}) = I+D + consultoría + técnicos`, 'BALANZA_174A_RAW', 'Otros Serv. Empresariales',
            ['I+D', 'Consultoría', 'Serv. Técnicos y Comerciales'], campo]
    ]),
    ['UE 27 = UEM 20 + resto de la UE', 'BALANZA_174C_RAW', 'UE 27', ['UEM 20', 'UE27 extra UEM20']],
    ['América = norte y centro + sur', 'BALANZA_174C_RAW', 'América', ['Am. Norte y Central', 'Am. del Sur']]
];

// Identidades que el BdE no cumple exactamente: solo avisan si se alejan más del 1 %
const IDENTIDADES_AVISO = [
    ['Europa = UE 27 + resto de Europa', 'BALANZA_174C_RAW', 'Europa', ['UE 27', 'Europa extra UE27']]
];

const clave = r => r.month != null ? `${r.year}-${String(r.month).padStart(2, '0')}` : `${r.year}T${r.quarter}`;
const filas = (r, campo = 'values') => r[campo];

function residuo(grupo, r, total, sumandos, campo) {
    const col = n => grupo.labels.indexOf(n);
    const x = filas(r, campo);
    const t = x[col(total)];
    let s = 0;
    for (const n of sumandos) {
        const resta = n.startsWith('-'), v = x[col(resta ? n.slice(1) : n)];
        if (v == null || t == null) return null;
        s += resta ? -v : v;
    }
    return { dif: t - s, total: t };
}

function validarBalanza(nuevo, anterior = null, hoy = new Date()) {
    const errores = [], avisos = [], revisiones = [];

    for (const [nombre, g] of Object.entries(nuevo)) {
        if (!g.data.length) { errores.push(`${nombre}: sin registros`); continue; }

        // columnas que el BdE ha dejado de servir
        g.labels.forEach((lab, i) => {
            if (g.data.every(r => [r.values, r.ingresos, r.pagos].every(x => !x || x[i] == null)))
                errores.push(`${nombre}: la serie «${lab}» llega vacía`);
        });

        // periodos seguidos
        const mensual = g.data[0].month != null;
        for (let i = 1; i < g.data.length; i++) {
            const a = g.data[i - 1], b = g.data[i];
            const esperado = mensual
                ? (a.month === 12 ? [a.year + 1, 1] : [a.year, a.month + 1])
                : (a.quarter === 4 ? [a.year + 1, 1] : [a.year, a.quarter + 1]);
            if (b.year !== esperado[0] || (mensual ? b.month : b.quarter) !== esperado[1])
                errores.push(`${nombre}: hueco entre ${clave(a)} y ${clave(b)}`);
        }

        // nulos fuera de las columnas permitidas
        const permitidos = NULOS_PERMITIDOS[nombre] || [];
        for (const r of g.data) for (const campo of ['values', 'ingresos', 'pagos']) {
            if (!r[campo]) continue;
            r[campo].forEach((v, i) => {
                if (v == null && !permitidos.includes(g.labels[i]))
                    errores.push(`${nombre} ${clave(r)}: falta «${g.labels[i]}»${campo !== 'values' ? ` (${campo})` : ''}`);
            });
        }
    }

    // identidades contables
    const comprobar = (lista, bloquea) => {
        for (const [desc, nombre, total, sumandos, campo = 'values'] of lista) {
            const g = nuevo[nombre];
            if (!g) continue;
            for (const r of g.data) {
                const res = residuo(g, r, total, sumandos, campo);
                if (!res) continue;
                const tolerancia = bloquea ? sumandos.length : Math.max(sumandos.length, Math.abs(res.total) * 0.01);
                if (Math.abs(res.dif) > tolerancia)
                    (bloquea ? errores : avisos).push(`${desc}: no cuadra en ${clave(r)} (diferencia ${res.dif} M€)`);
            }
        }
    };
    comprobar(IDENTIDADES, true);
    comprobar(IDENTIDADES_AVISO, false);

    // identidades entre series
    const s174 = nuevo.BALANZA_174_RAW;
    if (s174) {
        const trim = new Map(s174.data.map(r => [clave(r), r.values]));
        const c174 = n => s174.labels.indexOf(n);
        const cruzar = (desc, nombre, campo, col, col174) => {
            const g = nuevo[nombre];
            if (!g) return;
            for (const r of g.data) {
                const t = trim.get(clave(r));
                if (!t) continue;
                const dif = r[campo][g.labels.indexOf(col)] - t[c174(col174)];
                if (Math.abs(dif) > 1) errores.push(`${desc}: no cuadra en ${clave(r)} (diferencia ${dif} M€)`);
            }
        };
        cruzar('Turismo por países (total) = ingresos por turismo de 17.4', 'BALANZA_174C_RAW', 'values', 'Total', 'Turismo Ingresos');
        cruzar('Servicios no turísticos por tipo (ingresos) = 17.4', 'BALANZA_174A_RAW', 'ingresos', 'Total No Turísticos', 'Serv. No Turísticos Ingresos');
        cruzar('Servicios no turísticos por tipo (pagos) = 17.4', 'BALANZA_174A_RAW', 'pagos', 'Total No Turísticos', 'Serv. No Turísticos Pagos');

        const s171 = nuevo.BALANZA_171_RAW;
        if (s171) {
            const bys = s171.labels.indexOf('Bienes y Servicios');
            for (const r of s174.data) {
                const meses = s171.data.filter(m => m.year === r.year && Math.ceil(m.month / 3) === r.quarter);
                if (meses.length !== 3) continue;
                const dif = meses.reduce((s, m) => s + m.values[bys], 0) - r.values[c174('Bienes Saldo')] - r.values[c174('Servicios Saldo')];
                if (Math.abs(dif) > 4) errores.push(`Bienes y servicios mensual (17.1) frente a trimestral (17.4): no cuadra en ${clave(r)} (diferencia ${dif} M€)`);
            }
        }
    }

    // frescura del último dato mensual
    const s171 = nuevo.BALANZA_171_RAW;
    if (s171 && s171.data.length) {
        const u = s171.data[s171.data.length - 1];
        const meses = (hoy.getFullYear() - u.year) * 12 + (hoy.getMonth() + 1 - u.month);
        if (meses > 4) avisos.push(`El último dato mensual es de ${clave(u)}, hace ${meses} meses: comprobar si el BdE ha cambiado los códigos de serie`);
    }

    // frente al fichero anterior
    if (anterior) {
        for (const [nombre, gAnt] of Object.entries(anterior)) {
            const g = nuevo[nombre];
            if (!g) { errores.push(`${nombre}: estaba en el fichero anterior y ya no llega`); continue; }
            const porClave = new Map(g.data.map(r => [clave(r), r]));
            const uA = gAnt.data[gAnt.data.length - 1], uN = g.data[g.data.length - 1];
            if (uA && uN && clave(uN) < clave(uA)) errores.push(`${nombre}: el último dato retrocede de ${clave(uA)} a ${clave(uN)}`);
            for (const rA of gAnt.data) {
                const r = porClave.get(clave(rA));
                if (!r) {
                    // los grupos con minYear más reciente no deben contar como pérdida
                    if (rA.year >= g.data[0].year) errores.push(`${nombre}: desaparece el periodo ${clave(rA)}`);
                    continue;
                }
                for (const campo of ['values', 'ingresos', 'pagos']) {
                    if (!rA[campo]) continue;
                    rA[campo].forEach((vA, i) => {
                        const v = r[campo][i];
                        if (vA != null && v == null) errores.push(`${nombre} ${clave(r)}: «${gAnt.labels[i]}» tenía dato y ahora llega vacío`);
                        else if (vA != null && v !== vA)
                            revisiones.push({ grupo: nombre, periodo: clave(r), serie: gAnt.labels[i] + (campo !== 'values' ? ` (${campo})` : ''), antes: vA, ahora: v });
                    });
                }
            }
        }
    }

    return { errores, avisos, revisiones };
}

module.exports = { validarBalanza, IDENTIDADES, clave };
