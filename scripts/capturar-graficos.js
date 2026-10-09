/**
 * Capturas de comercio-exterior.html a 375 y 1280 px, en claro y oscuro, para
 * revisar los gráficos. Salida en review/capturas/ (no versionado).
 * Necesita Playwright: npm install --no-save playwright && npx playwright install chromium
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'review', 'capturas');
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.csv': 'text/csv', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

const servidor = http.createServer((req, res) => {
    const ruta = path.join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
    if (!ruta.startsWith(RAIZ) || !fs.existsSync(ruta) || fs.statSync(ruta).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(ruta)] || 'application/octet-stream' });
    fs.createReadStream(ruta).pipe(res);
});

(async () => {
    await new Promise(r => servidor.listen(0, r));
    const url = `http://localhost:${servidor.address().port}/comercio-exterior.html`;
    fs.mkdirSync(SALIDA, { recursive: true });
    const nav = await chromium.launch();
    let fallos = 0;
    for (const ancho of [375, 1280]) for (const tema of ['claro', 'oscuro']) {
        const p = await nav.newPage({ viewport: { width: ancho, height: 900 }, colorScheme: tema === 'oscuro' ? 'dark' : 'light' });
        const errores = [];
        p.on('pageerror', e => errores.push(e.message));
        await p.goto(url, { waitUntil: 'networkidle' });
        await p.evaluate(t => document.documentElement.classList.toggle('dark', t === 'oscuro'), tema);
        await p.evaluate(() => selectMacroSector('Agroalimentario'));
        await p.waitForTimeout(800);
        await p.screenshot({ path: path.join(SALIDA, `flujos-${ancho}-${tema}.png`), fullPage: true });
        await p.evaluate(() => switchMainTab('balanza'));
        await p.waitForTimeout(800);
        await p.screenshot({ path: path.join(SALIDA, `balanza171-${ancho}-${tema}.png`), fullPage: true });
        await p.evaluate(() => switchBPTab('s174'));
        await p.waitForTimeout(800);
        await p.screenshot({ path: path.join(SALIDA, `balanza174-${ancho}-${tema}.png`), fullPage: true });
        if (errores.length) { fallos++; console.log(`✖ ${ancho}/${tema}: ${errores.join(' | ')}`); }
        await p.close();
    }
    await nav.close();
    servidor.close();
    console.log(`Capturas en ${path.relative(process.cwd(), SALIDA)}${fallos ? ` · ${fallos} con errores` : ''}`);
    process.exit(fallos ? 1 : 0);
})();
