#!/usr/bin/env node
'use strict';

/**
 * Cambia el dominio público del sitio en todo el repositorio, de una pasada.
 *
 *   node scripts/cambiar-dominio.js --ver                 (qué cambiaría)
 *   node scripts/cambiar-dominio.js --aplicar             (a sergioargudo.com)
 *   node scripts/cambiar-dominio.js --aplicar --revertir  (vuelta a github.io)
 *
 * Toca las <link rel="canonical">, og:url, twitter:url, el enlace del feed y
 * las URL absolutas de sitemap.xml, robots.txt y el generador de artículos, y
 * escribe (o borra) el fichero CNAME que GitHub Pages necesita.
 *
 * NO toca DNS ni la configuración de GitHub: eso hay que hacerlo a mano. Ver la
 * lista de registros al final de este fichero.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

const ANTIGUO = 'https://sergioargudosantiago.github.io';
const NUEVO = 'https://sergioargudo.com';
const HOST_NUEVO = 'sergioargudo.com';

const args = process.argv.slice(2);
const aplicar = args.includes('--aplicar');
const revertir = args.includes('--revertir');

const desde = revertir ? NUEVO : ANTIGUO;
const hasta = revertir ? ANTIGUO : NUEVO;

// Ficheros donde vive el dominio. El .html se descubre solo para no olvidar
// ninguna página nueva; el resto va explícito.
const ficheros = [
    ...fs.readdirSync(RAIZ).filter(f => f.endsWith('.html')),
    ...fs.readdirSync(path.join(RAIZ, 'articulos'))
        .filter(f => f.endsWith('.html')).map(f => path.join('articulos', f)),
    'sitemap.xml',
    'robots.txt',
    'feed.xml',
    path.join('scripts', 'build-articulos.js')
].filter(f => fs.existsSync(path.join(RAIZ, f)));

let total = 0;
const resumen = [];

for (const relativo of ficheros) {
    const ruta = path.join(RAIZ, relativo);
    const antes = fs.readFileSync(ruta, 'utf8');
    const veces = antes.split(desde).length - 1;
    if (!veces) continue;

    total += veces;
    resumen.push(`  ${relativo}: ${veces}`);
    if (aplicar) fs.writeFileSync(ruta, antes.split(desde).join(hasta), 'utf8');
}

// CNAME: GitHub Pages lo lee para servir el dominio personalizado.
const rutaCNAME = path.join(RAIZ, 'CNAME');
if (aplicar) {
    if (revertir) {
        if (fs.existsSync(rutaCNAME)) { fs.unlinkSync(rutaCNAME); resumen.push('  CNAME: borrado'); }
    } else {
        fs.writeFileSync(rutaCNAME, HOST_NUEVO + '\n', 'utf8');
        resumen.push(`  CNAME: escrito (${HOST_NUEVO})`);
    }
}

console.log(`${aplicar ? 'Cambiadas' : 'Se cambiarían'} ${total} apariciones de ${desde} por ${hasta}:`);
console.log(resumen.join('\n') || '  (ninguna)');

if (!aplicar) {
    console.log('\nEsto ha sido una simulación. Para aplicarlo: --aplicar');
} else {
    console.log('\nHecho en el repositorio. Falta lo que no puede hacer un script:');
    console.log(`
  1. Cloudflare > DNS de ${HOST_NUEVO}, registros del ápice SIN proxy (nube gris):
       A  @  185.199.108.153
       A  @  185.199.109.153
       A  @  185.199.110.153
       A  @  185.199.111.153
     El proxy naranja rompe la validación del certificado de GitHub: tiene que
     quedar en "DNS only" al menos hasta que Pages emita el certificado.

  2. Para www, un CNAME www -> sergioargudosantiago.github.io (también sin proxy)
     y una regla de redirección de www al ápice.

  3. GitHub > Settings > Pages > Custom domain: ${HOST_NUEVO}, y marcar
     "Enforce HTTPS" cuando el certificado esté emitido (tarda unos minutos).

  4. Cloudflare > Email Routing: activarlo y crear la dirección
     contacto@${HOST_NUEVO} reenviando al Gmail personal. Cloudflare añade solo
     los MX y el TXT de SPF; hay que verificar el destino desde el correo que
     manda.

  5. Comprobar: curl -I https://${HOST_NUEVO} y enviar una prueba a
     contacto@${HOST_NUEVO}.
`);
}
