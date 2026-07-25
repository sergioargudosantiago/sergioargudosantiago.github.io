#!/usr/bin/env node
/*
 * Auditoría determinista de los esquemas de temario. Coste cero: no usa ningún modelo.
 *
 * Su función es reducir el conjunto que después merece una revisión con IA. Todo lo
 * que se puede comprobar con una regla se comprueba aquí: temas que faltan, títulos
 * que no cuadran con el temario oficial, esquemas anormalmente cortos, tildes
 * perdidas y referencias normativas o estadísticas que envejecen.
 *
 * Uso:  node scripts/auditar-temas.js
 *       node scripts/auditar-temas.js --json      (salida legible por máquina)
 *
 * Entrada:  review/txt/*.txt          (los genera scripts/extraer-temas.sh)
 *           js/main.js                (títulos oficiales del temario)
 * Salida:   review/auditoria-automatica.md
 *           review/estado.json        (ledger con hash por tema)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const TXT_DIR = path.join(ROOT, 'review', 'txt');
const OUT_MD = path.join(ROOT, 'review', 'auditoria-automatica.md');
const OUT_LEDGER = path.join(ROOT, 'review', 'estado.json');

const JSON_MODE = process.argv.includes('--json');

// ---------------------------------------------------------------------------
// Reglas
// ---------------------------------------------------------------------------

// Organismos y normas que han cambiado de nombre o han sido derogados. La forma
// antigua no es necesariamente un error (puede aparecer en un contexto histórico
// legítimo), por eso se reporta como aviso y no como fallo.
const RENOMBRADOS = [
    { patron: /Ministerio de Industria,\s*Comercio y Turismo/gi,
      nota: 'Desde 2023 las competencias de comercio están en el Ministerio de Economía, Comercio y Empresa.' },
    { patron: /Ministerio de Asuntos Econ[oó]micos y Transformaci[oó]n Digital/gi,
      nota: 'Departamento reorganizado en 2023.' },
    { patron: /\bTratado de Niza\b(?!.{0,80}(hist|anteced|evoluc))/gi,
      nota: 'Comprobar que se cita como antecedente y no como marco vigente (rige Lisboa).' },
    { patron: /\bComunidad Econ[oó]mica Europea\b(?!.{0,80}(hist|anteced|1957|1958|evoluc))/gi,
      nota: 'Comprobar que el contexto es histórico.' },
    { patron: /\bNAFTA\b(?!.{0,60}(T-MEC|USMCA|sustitu|antes|anterior))/gi,
      nota: 'Sustituido por el T-MEC/USMCA en 2020.' },
    // Cualquier composición de la UE que no sea 27: UE-15, UE-25, UE-28…
    // (27 es la correcta desde 2020, así que se excluye explícitamente.)
    { patron: /\bUE-?(?:6|9|1[0-9]|2[0-689]|3[0-9])\b/g,
      nota: 'Composición de la UE distinta de 27. Comprobar que el contexto es histórico.' }
];

// Palabras del dominio que aparecen con frecuencia sin tilde en los esquemas.
// Se listan explícitamente en lugar de usar una regla genérica sobre -cion/-sion
// para no generar falsos positivos con siglas o nombres propios.
const SIN_TILDE = [
    'cooperacion', 'produccion', 'integracion', 'situacion', 'evolucion', 'aplicacion',
    'exportacion', 'importacion', 'informacion', 'legislacion', 'regulacion', 'negociacion',
    'organizacion', 'administracion', 'clasificacion', 'certificacion', 'acreditacion',
    'financiacion', 'inversion', 'comision', 'decision', 'union', 'region',
    'politica', 'politicas', 'economia', 'economico', 'economica', 'economicos', 'economicas',
    'paises', 'area', 'areas', 'petroleo', 'orbita', 'sovietica', 'sovieticos',
    'transito', 'regimen', 'regimenes', 'articulo', 'articulos', 'parrafo',
    'maritimo', 'aereo', 'tecnico', 'tecnica', 'tecnicas', 'practica', 'practicas',
    'metodo', 'metodos', 'analisis', 'estadistica', 'estadisticas', 'publico', 'publica',
    'credito', 'deficit', 'superavit', 'garantia', 'compania', 'espana', 'espanol', 'espanola'
];
const SIN_TILDE_RE = new RegExp('\\b(' + SIN_TILDE.join('|') + ')\\b', 'gi');

// Citas normativas: se extraen para poder comprobarlas de un vistazo, no se juzgan.
const NORMATIVA_RE = /\b(?:Reglamento|Directiva|Decisi[oó]n)\s*(?:\((?:UE|CE|CEE|UE,\s*Euratom)\)\s*)?(?:n[.ºo°]*\s*)?\d{1,4}\/\d{2,4}|\bReal\s+Decreto(?:-ley)?\s+\d{1,4}\/\d{4}|\bLey\s+(?:Org[aá]nica\s+)?\d{1,3}\/\d{4}/gi;

// Referencias a estadísticas con año, que caducan solas. La ventana es corta a
// propósito: con más margen se cuelan referencias históricas legítimas ("la crisis
// de 2009") que no son datos desactualizados.
const ESTADISTICA_ANUAL_RE = /\b(?:OMC|FMI|OCDE|Banco Mundial|UNCTAD|Eurostat|INE|ICEX)\b[^.\n]{0,25}?\b(20[0-2]\d)\b/gi;

const ANIO_ACTUAL = new Date().getFullYear();
const ANTIGUEDAD_ACEPTABLE = 3;   // años
// Por debajo de este año, una cifra citada casi siempre es contexto histórico y no
// una estadística que haya que refrescar.
const ANIO_MINIMO_ESTADISTICA = 2015;

// ---------------------------------------------------------------------------
// Títulos oficiales del temario, leídos de js/main.js para no duplicarlos
// ---------------------------------------------------------------------------

function cargarTitulosOficiales() {
    const src = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');
    const bloques = {};

    [['1', 'EXERCISE_1_TITLES'], ['3', 'EXERCISE_3_TITLES'], ['5', 'EXERCISE_5_TITLES']]
        .forEach(([ej, nombre]) => {
            const m = src.match(new RegExp('const\\s+' + nombre + '\\s*=\\s*\\{([\\s\\S]*?)\\n\\};'));
            if (!m) return;
            const titulos = {};
            const re = /(\d+)\s*:\s*"((?:[^"\\]|\\.)*)"/g;
            let t;
            while ((t = re.exec(m[1])) !== null) {
                titulos[Number(t[1])] = t[2].replace(/\\"/g, '"');
            }
            bloques[ej] = titulos;
        });

    return bloques;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function normalizar(s) {
    return String(s || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Similitud por solapamiento de palabras significativas. Suficiente para detectar
// que un fichero está bajo el número de tema equivocado, que es lo que interesa.
function similitud(a, b) {
    const pa = new Set(normalizar(a).split(' ').filter(w => w.length > 3));
    const pb = new Set(normalizar(b).split(' ').filter(w => w.length > 3));
    if (!pa.size || !pb.size) return 0;
    let comunes = 0;
    pa.forEach(w => { if (pb.has(w)) comunes++; });
    return comunes / Math.min(pa.size, pb.size);
}

function unicos(lista) {
    return Array.from(new Set(lista));
}

// ---------------------------------------------------------------------------
// Auditoría
// ---------------------------------------------------------------------------

function auditar() {
    if (!fs.existsSync(TXT_DIR)) {
        console.error('ERROR: no existe ' + TXT_DIR + '. Ejecuta antes scripts/extraer-temas.sh');
        process.exit(1);
    }

    const oficiales = cargarTitulosOficiales();
    const ficheros = fs.readdirSync(TXT_DIR).filter(f => f.endsWith('.txt')).sort();

    const temas = [];

    ficheros.forEach(f => {
        const m = f.match(/^ejercicio-(\d+)-(\d+)\.txt$/);
        if (!m) return;
        const ejercicio = m[1];
        const numero = Number(m[2]);
        const texto = fs.readFileSync(path.join(TXT_DIR, f), 'utf8');

        const fuenteM = texto.match(/^#FUENTE:\s*(.*)$/m);
        const fuente = fuenteM ? fuenteM[1].trim() : '';
        const cuerpo = texto.replace(/^#FUENTE:.*$/m, '');

        const palabras = cuerpo.split(/\s+/).filter(Boolean).length;
        const hash = crypto.createHash('sha256').update(cuerpo).digest('hex').slice(0, 16);

        const avisos = [];

        // -- título vs temario oficial --
        const oficial = oficiales[ejercicio] && oficiales[ejercicio][numero];
        if (!oficial) {
            avisos.push({
                tipo: 'sin-titulo-oficial',
                gravedad: 'media',
                detalle: `No hay título para el tema ${numero} del ejercicio ${ejercicio} en js/main.js.`
            });
        } else {
            const sim = similitud(fuente.replace(/^TEMA\s*\d+\.?\s*/i, ''), oficial);
            if (sim < 0.5) {
                avisos.push({
                    tipo: 'titulo-discrepante',
                    gravedad: 'alta',
                    detalle: `El fichero dice "${fuente}" pero el temario dice "${oficial}" (coincidencia ${(sim * 100).toFixed(0)} %).`
                });
            }
        }

        // -- longitud --
        if (palabras < 400) {
            avisos.push({
                tipo: 'esquema-corto',
                gravedad: palabras < 200 ? 'alta' : 'media',
                detalle: `Solo ${palabras} palabras; puede estar truncado o incompleto.`
            });
        }

        // -- tildes --
        const tildes = unicos((cuerpo.match(SIN_TILDE_RE) || []).map(w => w.toLowerCase()));
        if (tildes.length) {
            avisos.push({
                tipo: 'tildes',
                gravedad: 'baja',
                detalle: `${tildes.length} palabra(s) sin tilde: ${tildes.slice(0, 12).join(', ')}${tildes.length > 12 ? '…' : ''}`
            });
        }

        // -- organismos y normas renombrados --
        RENOMBRADOS.forEach(r => {
            const hits = cuerpo.match(r.patron);
            if (hits) {
                avisos.push({
                    tipo: 'referencia-obsoleta',
                    gravedad: 'media',
                    detalle: `"${unicos(hits).join('", "')}" — ${r.nota}`
                });
            }
        });

        // -- estadísticas con año viejo --
        const estad = [];
        let e;
        ESTADISTICA_ANUAL_RE.lastIndex = 0;
        while ((e = ESTADISTICA_ANUAL_RE.exec(cuerpo)) !== null) {
            const anio = Number(e[1]);
            if (anio >= ANIO_MINIMO_ESTADISTICA && ANIO_ACTUAL - anio > ANTIGUEDAD_ACEPTABLE) {
                estad.push(e[0].replace(/[\s(]+/g, ' ').trim());
            }
        }
        if (estad.length) {
            avisos.push({
                tipo: 'estadistica-caducada',
                gravedad: 'media',
                detalle: `Datos con más de ${ANTIGUEDAD_ACEPTABLE} años: ${unicos(estad).slice(0, 5).join(' · ')}`
            });
        }

        // -- normativa citada (informativo, para revisión manual o por lotes) --
        const normas = unicos((cuerpo.match(NORMATIVA_RE) || []).map(s => s.replace(/\s+/g, ' ').trim()));

        temas.push({
            fichero: f, ejercicio, numero, fuente,
            titulo_oficial: oficial || null,
            palabras, hash, avisos, normas, tildes
        });
    });

    // -- temas que faltan --
    const faltantes = [];
    Object.keys(oficiales).forEach(ej => {
        const presentes = new Set(temas.filter(t => t.ejercicio === ej).map(t => t.numero));
        Object.keys(oficiales[ej]).map(Number).sort((a, b) => a - b).forEach(n => {
            if (!presentes.has(n)) {
                faltantes.push({ ejercicio: ej, numero: n, titulo: oficiales[ej][n] });
            }
        });
    });

    return { temas, faltantes, oficiales };
}

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------

function generarInforme({ temas, faltantes, oficiales }) {
    const hoy = new Date().toISOString().slice(0, 10);
    const L = [];

    const conAvisos = temas.filter(t => t.avisos.length);
    const graves = temas.filter(t => t.avisos.some(a => a.gravedad === 'alta'));
    const totalPalabras = temas.reduce((a, t) => a + t.palabras, 0);

    L.push('# Auditoría automática del temario');
    L.push('');
    L.push(`_Generado el ${hoy} por \`scripts/auditar-temas.js\`. Sin coste de modelo._`);
    L.push('');
    L.push('## Resumen');
    L.push('');
    L.push('| | |');
    L.push('|---|---|');
    L.push(`| Esquemas extraídos | ${temas.length} |`);
    L.push(`| Palabras totales | ${totalPalabras.toLocaleString('es-ES')} |`);
    L.push(`| Temas que faltan | ${faltantes.length} |`);
    L.push(`| Esquemas con algún aviso | ${conAvisos.length} |`);
    L.push(`| Esquemas con aviso grave | ${graves.length} |`);
    L.push('');

    // --- faltantes ---
    L.push('## 1. Temas que faltan');
    L.push('');
    if (!faltantes.length) {
        L.push('Ninguno: hay esquema para todos los temas del temario.');
    } else {
        const porEj = {};
        faltantes.forEach(f => { (porEj[f.ejercicio] = porEj[f.ejercicio] || []).push(f); });
        Object.keys(porEj).sort().forEach(ej => {
            const total = Object.keys(oficiales[ej]).length;
            const hay = total - porEj[ej].length;
            L.push(`### Ejercicio ${ej} — ${hay} de ${total}`);
            L.push('');
            porEj[ej].forEach(f => L.push(`- **Tema ${f.numero}** — ${f.titulo}`));
            L.push('');
        });
    }
    L.push('');

    // --- avisos de contenido, uno por uno ---
    // Las tildes se sacan de aquí y se agregan aparte: afectan a casi todos los
    // esquemas y repetirlas 98 veces enterraría los avisos que sí son singulares.
    const ordenGravedad = { alta: 0, media: 1, baja: 2 };
    const conAvisosContenido = temas.filter(t => t.avisos.some(a => a.tipo !== 'tildes'));

    L.push('## 2. Avisos de contenido');
    L.push('');
    if (!conAvisosContenido.length) {
        L.push('Ningún esquema ha disparado avisos de contenido.');
    } else {
        conAvisosContenido
            .slice()
            .sort((a, b) => {
                const ga = Math.min(...a.avisos.map(x => ordenGravedad[x.gravedad]));
                const gb = Math.min(...b.avisos.map(x => ordenGravedad[x.gravedad]));
                return ga - gb || a.fichero.localeCompare(b.fichero);
            })
            .forEach(t => {
                L.push(`### Ej. ${t.ejercicio} · Tema ${t.numero} — ${t.titulo_oficial || t.fuente}`);
                L.push('');
                L.push(`\`${t.fichero}\` · ${t.palabras} palabras`);
                L.push('');
                t.avisos
                    .filter(a => a.tipo !== 'tildes')
                    .sort((a, b) => ordenGravedad[a.gravedad] - ordenGravedad[b.gravedad])
                    .forEach(a => {
                        const marca = { alta: 'GRAVE', media: 'REVISAR', baja: 'MENOR' }[a.gravedad];
                        L.push(`- **${marca}** · _${a.tipo}_ — ${a.detalle}`);
                    });
                L.push('');
            });
    }
    L.push('');

    // --- ortografía, agregada ---
    L.push('## 3. Tildes perdidas');
    L.push('');
    const conTildes = temas.filter(t => t.avisos.some(a => a.tipo === 'tildes'));
    if (!conTildes.length) {
        L.push('No se han detectado palabras del listado sin tilde.');
    } else {
        const frecuencia = {};
        temas.forEach(t => (t.tildes || []).forEach(w => { frecuencia[w] = (frecuencia[w] || 0) + 1; }));
        const ranking = Object.entries(frecuencia).sort((a, b) => b[1] - a[1]);
        const distintas = ranking.length;

        L.push(`Afecta a **${conTildes.length} de ${temas.length}** esquemas, con **${distintas}** palabras distintas.`);
        L.push('');
        L.push('No es un problema de la extracción: los mismos documentos mezclan palabras');
        L.push('bien acentuadas con otras sin acentuar, así que viene del original. Se corrige');
        L.push('sobre los `.docx` de `public/temas/` y se vuelve a exportar el PDF; hacerlo en');
        L.push('el PDF no serviría porque se regenera desde el Word.');
        L.push('');
        L.push('| Palabra | Esquemas afectados |');
        L.push('|---|---|');
        ranking.slice(0, 20).forEach(([w, n]) => L.push(`| ${w} | ${n} |`));
        L.push('');
        L.push('Esquemas con más incidencias:');
        L.push('');
        conTildes
            .slice()
            .sort((a, b) => (b.tildes || []).length - (a.tildes || []).length)
            .slice(0, 10)
            .forEach(t => {
                L.push(`- **${(t.tildes || []).length}** — Ej. ${t.ejercicio} · Tema ${t.numero}: ${t.titulo_oficial || t.fuente}`);
            });
    }

    // --- normativa ---
    L.push('## 4. Normativa citada');
    L.push('');
    L.push('Listado extraído automáticamente. No implica que esté derogada: sirve para');
    L.push('comprobar de un vistazo las referencias más sensibles a cambios legislativos.');
    L.push('');
    const conNormas = temas.filter(t => t.normas.length);
    if (!conNormas.length) {
        L.push('No se han detectado citas normativas con el formato esperado.');
    } else {
        conNormas.forEach(t => {
            L.push(`- **Ej. ${t.ejercicio} · Tema ${t.numero}** — ${t.normas.join(' · ')}`);
        });
    }
    L.push('');

    // --- longitudes ---
    L.push('## 5. Distribución de longitud');
    L.push('');
    const ordenados = temas.slice().sort((a, b) => a.palabras - b.palabras);
    L.push('Los más cortos (posible contenido incompleto):');
    L.push('');
    ordenados.slice(0, 8).forEach(t => {
        L.push(`- ${t.palabras} palabras — Ej. ${t.ejercicio} · Tema ${t.numero}: ${t.titulo_oficial || t.fuente}`);
    });
    L.push('');
    L.push('Los más largos:');
    L.push('');
    ordenados.slice(-4).reverse().forEach(t => {
        L.push(`- ${t.palabras} palabras — Ej. ${t.ejercicio} · Tema ${t.numero}: ${t.titulo_oficial || t.fuente}`);
    });
    L.push('');

    L.push('---');
    L.push('');
    L.push('## Qué hacer con esto');
    L.push('');
    L.push('1. Los **temas que faltan** y los avisos **GRAVE** no necesitan revisión con IA: son hechos.');
    L.push('2. Los avisos **MENOR** de tildes se arreglan de una pasada sobre el `.docx` original.');
    L.push('3. Solo lo que quede después merece el gasto de una revisión de contenido por lotes.');
    L.push('');

    return L.join('\n') + '\n';
}

function generarLedger(temas) {
    // El hash permite saltarse en futuras revisiones los temas que no han cambiado,
    // que es lo que evita pagar dos veces por lo mismo.
    const previo = fs.existsSync(OUT_LEDGER)
        ? JSON.parse(fs.readFileSync(OUT_LEDGER, 'utf8'))
        : { temas: {} };

    const ledger = { generado: new Date().toISOString(), temas: {} };

    temas.forEach(t => {
        const clave = `ejercicio-${t.ejercicio}-${String(t.numero).padStart(2, '0')}`;
        const antes = previo.temas[clave];
        ledger.temas[clave] = {
            hash: t.hash,
            palabras: t.palabras,
            avisos: t.avisos.length,
            // Se conserva la marca de revisión solo si el contenido no ha cambiado.
            revisado: (antes && antes.hash === t.hash) ? (antes.revisado || null) : null,
            hallazgos: (antes && antes.hash === t.hash) ? (antes.hallazgos || null) : null
        };
    });

    return ledger;
}

// ---------------------------------------------------------------------------

function main() {
    const resultado = auditar();

    fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
    fs.writeFileSync(OUT_MD, generarInforme(resultado), 'utf8');
    fs.writeFileSync(OUT_LEDGER, JSON.stringify(generarLedger(resultado.temas), null, 2) + '\n', 'utf8');

    if (JSON_MODE) {
        console.log(JSON.stringify(resultado, null, 2));
        return;
    }

    const conAvisos = resultado.temas.filter(t => t.avisos.length).length;
    const graves = resultado.temas.filter(t => t.avisos.some(a => a.gravedad === 'alta')).length;

    console.log(`Esquemas analizados : ${resultado.temas.length}`);
    console.log(`Temas que faltan    : ${resultado.faltantes.length}`);
    console.log(`Con avisos          : ${conAvisos} (${graves} graves)`);
    console.log(`Informe             : ${path.relative(ROOT, OUT_MD)}`);
    console.log(`Ledger              : ${path.relative(ROOT, OUT_LEDGER)}`);
}

main();
