// node --test scripts/lib/  (npm test)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { validarBalanza } = require('./validar-balanza');

// Datos reales del repositorio: deben pasar sin errores
function cargar() {
    const src = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'balanza_data.js'), 'utf8');
    const nombres = [...src.matchAll(/const (\w+) =/g)].map(m => m[1]);
    return new Function(`${src}; return { ${nombres.join(', ')} };`)();
}
const copia = x => JSON.parse(JSON.stringify(x));

test('los datos publicados cumplen todas las validaciones', () => {
    const d = cargar();
    const { errores } = validarBalanza(d, copia(d));
    assert.deepStrictEqual(errores, []);
});

test('una identidad que no cuadra bloquea', () => {
    const d = cargar(), n = copia(d);
    n.BALANZA_171_RAW.data[10].values[0] += 500; // cuenta corriente
    const { errores } = validarBalanza(n, d);
    assert.ok(errores.some(e => e.startsWith('Cuenta corriente = bienes y servicios + rentas')));
});

test('un hueco en la serie mensual bloquea', () => {
    const d = cargar(), n = copia(d);
    n.BALANZA_171_RAW.data.splice(20, 1);
    const { errores } = validarBalanza(n, null);
    assert.ok(errores.some(e => e.includes('hueco')));
});

test('perder historia o retroceder el último dato bloquea', () => {
    const d = cargar(), n = copia(d);
    n.BALANZA_171_RAW.data.pop();
    const { errores } = validarBalanza(n, d);
    assert.ok(errores.some(e => e.includes('retrocede')));
    assert.ok(errores.some(e => e.includes('desaparece')));
});

test('un nulo en un agregado bloquea y en un país de 17.4C no', () => {
    const d = cargar(), n = copia(d);
    const L = n.BALANZA_174C_RAW.labels;
    n.BALANZA_174C_RAW.data[3].values[L.indexOf('Suiza')] = null;
    let { errores } = validarBalanza(n, null);
    assert.deepStrictEqual(errores, []);
    n.BALANZA_174C_RAW.data[3].values[L.indexOf('UE 27')] = null;
    ({ errores } = validarBalanza(n, null));
    assert.ok(errores.some(e => e.includes('falta «UE 27»')));
});

test('una revisión del BdE no bloquea y se lista', () => {
    const d = cargar(), n = copia(d);
    const r = n.BALANZA_174_RAW.data[5];
    r.values[1] += 10; r.values[0] += 10; // ingresos y saldo de bienes, la identidad sigue cuadrando
    const { errores, revisiones } = validarBalanza(n, d);
    assert.ok(!errores.some(e => e.startsWith('Saldo de bienes')));
    assert.strictEqual(revisiones.filter(x => x.grupo === 'BALANZA_174_RAW').length, 2);
});

test('un dato mensual viejo avisa', () => {
    const d = cargar();
    const { avisos } = validarBalanza(d, null, new Date(2030, 0, 1));
    assert.ok(avisos.some(a => a.includes('último dato mensual')));
});
