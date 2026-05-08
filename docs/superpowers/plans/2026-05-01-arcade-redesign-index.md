# Arcade Redesign — index.html Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar index.html con estética minimalista arcade (amarillo pastel + negro, Orbitron + Share Tech Mono, formas 100% rectas, ilustración SVG de contenedores marítimos).

**Architecture:** Todos los cambios se aplican directamente en `index.html` (CSS inline en `<style>`, estructura HTML). No hay build tools. Se mantiene Tailwind CDN y los scripts JS existentes intactos.

**Tech Stack:** HTML5, CSS3 (inline), Tailwind CDN, Google Fonts (Orbitron, Share Tech Mono), SVG inline.

**Spec:** `docs/superpowers/specs/2026-05-01-arcade-redesign-index-design.md`

---

## Archivo modificado

- Modify: `index.html` — único archivo afectado. Todos los cambios son en `<head>` (fonts, CSS vars, estilos), `<body>` (estructura HTML del nav, hero, footer) y el bloque `<style>`.

---

### Task 1: Actualizar Google Fonts e imports de tipografía

**Files:**
- Modify: `index.html` (líneas 13-17 — bloque Google Fonts)

- [ ] **Step 1: Reemplazar el bloque de Google Fonts**

Localizar en `<head>` el bloque actual:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
    rel="stylesheet">
```

Reemplazarlo por:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
    href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap"
    rel="stylesheet">
```

- [ ] **Step 2: Abrir index.html en el navegador y verificar**

Las fuentes cargan correctamente si no hay errores en la consola (F12 → Network → Fonts). Aún no se verá diferencia visual porque los estilos aún no las referencian.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "style: swap fonts to Orbitron + Share Tech Mono"
```

---

### Task 2: Reemplazar variables CSS y estilos base

**Files:**
- Modify: `index.html` (bloque `<style>` — `:root`, `html.dark`, `body`, `.font-serif`, `.container-illustration`)

- [ ] **Step 1: Reemplazar el bloque `:root` y dark mode**

Localizar en el bloque `<style>` todo desde `/* CSS Variables - Clean Minimal Theme */` hasta el cierre de `html.dark { ... }` (aproximadamente líneas 100-145) y reemplazarlo por:

```css
/* CSS Variables - Arcade Theme */
:root {
    --background: #FFFBDB;
    --foreground: #000000;
    --primary: #000000;
    --primary-foreground: #FFFBDB;
    --secondary: #FFFBDB;
    --secondary-foreground: #000000;
    --muted: #F5F0C0;
    --muted-foreground: #333333;
    --accent: #000000;
    --accent-foreground: #FFFBDB;
    --border: #000000;
    --input: #FFFBDB;
    --ring: #000000;
    --radius: 0px;
}
```

Eliminar completamente el bloque `html.dark { ... }` (ya no habrá modo oscuro).

- [ ] **Step 2: Actualizar estilos de `html`, `body` y background**

Localizar y reemplazar:
```css
html {
    transition: color 0.3s, background-color 0.3s;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(to bottom, #f5f6f7, #e8eaed);
    position: relative;
    min-height: 100vh;
    color: hsl(var(--foreground));
    padding-bottom: 5rem;
}

html.dark body {
    background: linear-gradient(to bottom, hsl(222, 47%, 11%), hsl(222, 47%, 8%));
}

.font-serif {
    font-family: 'Cambria', 'Noto Serif', serif;
}

/* Dot Grid Background Pattern */
.container-illustration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: #f5f6f7;
    background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
    background-size: 24px 24px;
}

html.dark .container-illustration {
    background-color: hsl(222, 47%, 11%);
    background-image: radial-gradient(circle, hsl(222, 30%, 22%) 1px, transparent 1px);
}
```

Por:
```css
html {
    transition: none;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border-radius: 0 !important;
}

body {
    font-family: 'Share Tech Mono', monospace;
    background: #FFFBDB;
    position: relative;
    min-height: 100vh;
    color: #000000;
    padding-bottom: 5rem;
}

.container-illustration {
    display: none;
}
```

- [ ] **Step 3: Eliminar todos los bloques `html.dark` del CSS**

Buscar en el bloque `<style>` todas las reglas que comiencen con `html.dark` y eliminarlas. Son aproximadamente 30 reglas distribuidas por el CSS.

- [ ] **Step 4: Verificar en navegador**

Al abrir `index.html` el fondo debe ser amarillo `#FFFBDB`. El texto debe verse en negro. Verificar que no hay mensajes de error en consola.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "style: apply arcade color palette and base reset"
```

---

### Task 3: Añadir ilustración SVG de contenedores marítimos al fondo

**Files:**
- Modify: `index.html` — reemplazar el `<div class="container-illustration">` en el `<body>` y añadir estilos CSS para el SVG.

- [ ] **Step 1: Añadir los estilos CSS para el fondo SVG**

Al final del bloque `<style>`, añadir:
```css
/* ===== ARCADE BACKGROUND SVG ===== */
.arcade-bg {
    position: fixed;
    bottom: 4rem;
    right: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.10;
}

.arcade-bg-left {
    position: fixed;
    bottom: 4rem;
    left: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.07;
    transform: scaleX(-1);
}
```

- [ ] **Step 2: Reemplazar el div `.container-illustration` en el HTML**

Localizar en el `<body>`:
```html
<!-- Background Illustration -->
<div class="container-illustration"></div>
```

Reemplazarlo por:
```html
<!-- Background Illustration — Container Towers -->
<svg class="arcade-bg" width="320" height="340" viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Tower 1 (izquierda, 7 contenedores) -->
    <rect x="10" y="40" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="51" x2="82" y2="51" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="42" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="62" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="73" x2="82" y2="73" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="64" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="84" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="95" x2="82" y2="95" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="86" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="106" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="117" x2="82" y2="117" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="108" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="128" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="139" x2="82" y2="139" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="130" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="150" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="161" x2="82" y2="161" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="152" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="10" y="172" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="10" y1="183" x2="82" y2="183" stroke="#B8860B" stroke-width="1"/>
    <rect x="12" y="174" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <!-- Base torre 1 -->
    <rect x="4" y="194" width="84" height="6" fill="#B8860B" opacity="0.4"/>

    <!-- Tower 2 (centro, 5 contenedores) -->
    <rect x="100" y="106" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="100" y1="117" x2="172" y2="117" stroke="#B8860B" stroke-width="1"/>
    <rect x="160" y="108" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="100" y="128" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="100" y1="139" x2="172" y2="139" stroke="#B8860B" stroke-width="1"/>
    <rect x="160" y="130" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="100" y="150" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="100" y1="161" x2="172" y2="161" stroke="#B8860B" stroke-width="1"/>
    <rect x="160" y="152" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="100" y="172" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="100" y1="183" x2="172" y2="183" stroke="#B8860B" stroke-width="1"/>
    <rect x="160" y="174" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="100" y="194" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="100" y1="205" x2="172" y2="205" stroke="#B8860B" stroke-width="1"/>
    <rect x="160" y="196" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <!-- Base torre 2 -->
    <rect x="94" y="216" width="84" height="6" fill="#B8860B" opacity="0.4"/>

    <!-- Tower 3 (derecha, 9 contenedores) -->
    <rect x="192" y="6" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="17" x2="264" y2="17" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="8" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="28" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="39" x2="264" y2="39" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="30" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="50" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="61" x2="264" y2="61" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="52" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="72" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="83" x2="264" y2="83" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="74" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="94" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="105" x2="264" y2="105" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="96" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="116" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="127" x2="264" y2="127" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="118" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="138" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="149" x2="264" y2="149" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="140" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="160" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="171" x2="264" y2="171" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="162" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <rect x="192" y="182" width="72" height="22" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="192" y1="193" x2="264" y2="193" stroke="#B8860B" stroke-width="1"/>
    <rect x="252" y="184" width="10" height="18" stroke="#B8860B" stroke-width="1"/>

    <!-- Base torre 3 -->
    <rect x="186" y="204" width="84" height="6" fill="#B8860B" opacity="0.4"/>

    <!-- Suelo / muelle -->
    <line x1="0" y1="222" x2="320" y2="222" stroke="#B8860B" stroke-width="2"/>

    <!-- Grúa pórtico (derecha) -->
    <line x1="270" y1="222" x2="270" y2="60" stroke="#B8860B" stroke-width="2"/>
    <line x1="270" y1="60" x2="310" y2="60" stroke="#B8860B" stroke-width="2"/>
    <line x1="310" y1="60" x2="310" y2="100" stroke="#B8860B" stroke-width="1.5"/>
    <!-- Cable grúa -->
    <line x1="295" y1="60" x2="295" y2="88" stroke="#B8860B" stroke-width="1" stroke-dasharray="3,3"/>
    <!-- Gancho -->
    <rect x="290" y="88" width="10" height="6" stroke="#B8860B" stroke-width="1"/>
</svg>

<svg class="arcade-bg-left" width="200" height="280" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Torre izquierda decorativa (más pequeña) -->
    <rect x="20" y="60" width="60" height="20" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="20" y1="70" x2="80" y2="70" stroke="#B8860B" stroke-width="1"/>
    <rect x="22" y="62" width="9" height="16" stroke="#B8860B" stroke-width="1"/>

    <rect x="20" y="80" width="60" height="20" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="20" y1="90" x2="80" y2="90" stroke="#B8860B" stroke-width="1"/>
    <rect x="22" y="82" width="9" height="16" stroke="#B8860B" stroke-width="1"/>

    <rect x="20" y="100" width="60" height="20" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="20" y1="110" x2="80" y2="110" stroke="#B8860B" stroke-width="1"/>
    <rect x="22" y="102" width="9" height="16" stroke="#B8860B" stroke-width="1"/>

    <rect x="20" y="120" width="60" height="20" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="20" y1="130" x2="80" y2="130" stroke="#B8860B" stroke-width="1"/>
    <rect x="22" y="122" width="9" height="16" stroke="#B8860B" stroke-width="1"/>

    <rect x="20" y="140" width="60" height="20" stroke="#B8860B" stroke-width="1.5"/>
    <line x1="20" y1="150" x2="80" y2="150" stroke="#B8860B" stroke-width="1"/>
    <rect x="22" y="142" width="9" height="16" stroke="#B8860B" stroke-width="1"/>

    <rect x="14" y="160" width="72" height="5" fill="#B8860B" opacity="0.4"/>
    <line x1="0" y1="165" x2="200" y2="165" stroke="#B8860B" stroke-width="1.5"/>
</svg>
```

- [ ] **Step 3: Verificar en navegador**

Las torres de contenedores deben verse en las esquinas inferior derecha e izquierda, muy sutiles (10% y 7% de opacidad). El texto del hero debe ser perfectamente legible sobre ellas.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: add shipping container SVG background illustration"
```

---

### Task 4: Rediseñar la barra de navegación

**Files:**
- Modify: `index.html` — CSS del nav (`.nav-island`, `.nav-segment`) y HTML del `<nav>`

- [ ] **Step 1: Reemplazar estilos del nav en el bloque `<style>`**

Localizar y reemplazar todo el bloque `/* ========== ILLUMINATED ISLAND NAVIGATION ========== */` (desde `.nav-island {` hasta el cierre de `.search-island svg { ... }` y el media query `@media (max-width: 768px) { .nav-island { display: none; } }`):

```css
/* ===== ARCADE NAVIGATION BAR ===== */
.nav-island {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    padding: 0;
    background: #000000;
    border-bottom: 2px solid #000000;
    height: 3rem;
}

.nav-segment {
    position: relative;
    padding: 0 1.25rem;
    height: 100%;
    display: flex;
    align-items: center;
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    font-weight: 600;
    color: #FFFBDB;
    text-decoration: none;
    border-right: 1px solid rgba(255, 251, 219, 0.2);
    letter-spacing: 0.05em;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
}

.nav-segment:hover {
    background: #FFFBDB;
    color: #000000;
    box-shadow: none;
}

.nav-segment.active {
    background: #FFFBDB;
    color: #000000;
    font-weight: 700;
    box-shadow: none;
}

.search-island {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 0.75rem;
}

.search-island input {
    width: 11rem;
    height: 1.75rem;
    padding: 0 0.75rem 0 2rem;
    background: #1a1a1a;
    border: 1px solid #FFFBDB;
    border-radius: 0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: #FFFBDB;
    outline: none;
}

.search-island input::placeholder {
    color: rgba(255, 251, 219, 0.5);
}

.search-island input:focus {
    background: #2a2a2a;
    border-color: #FFFBDB;
    box-shadow: none;
}

.search-island svg {
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: rgba(255, 251, 219, 0.6);
    pointer-events: none;
}

/* Theme toggle dentro del nav arcade */
.theme-toggle {
    display: none;
}

@media (max-width: 768px) {
    .nav-island {
        display: none;
    }
}
```

- [ ] **Step 2: Verificar en navegador (desktop)**

La barra de navegación debe ser una banda negra horizontal fija en la parte superior. Los links deben ser amarillo claro sobre negro. El link activo (INTRODUCCIÓN) debe invertirse a amarillo/negro. El buscador debe estar alineado a la derecha.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "style: replace floating nav island with arcade full-width bar"
```

---

### Task 5: Rediseñar el hero — tarjeta principal

**Files:**
- Modify: `index.html` — HTML del `<main>` y CSS asociado

- [ ] **Step 1: Añadir estilos arcade para el hero en el bloque `<style>`**

Al final del bloque `<style>`, añadir:

```css
/* ===== ARCADE HERO CARD ===== */
.arcade-card {
    background: #FFFBDB;
    border: 3px solid #000000;
    box-shadow: 6px 6px 0 #000000;
    position: relative;
    padding: 2rem;
}

.arcade-card::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid #000000;
    pointer-events: none;
}

.arcade-title {
    font-family: 'Orbitron', monospace;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #000000;
    text-transform: uppercase;
}

.arcade-body {
    font-family: 'Share Tech Mono', monospace;
    color: #000000;
    line-height: 1.7;
}

/* Tabs arcade */
.arcade-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    border: 2px solid #000000;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}

.arcade-tab {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.5rem 1.25rem;
    background: #FFFBDB;
    color: #000000;
    border: none;
    border-right: 2px solid #000000;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-transform: uppercase;
}

.arcade-tab:last-child {
    border-right: none;
}

.arcade-tab.active-tab {
    background: #000000;
    color: #FFFBDB;
}

.arcade-tab:hover:not(.active-tab) {
    background: #F0E88A;
}

/* CTA Button arcade */
.arcade-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    background: #000000;
    color: #FFFBDB;
    font-family: 'Orbitron', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-decoration: none;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0 #000000;
    transition: box-shadow 0.1s, transform 0.1s;
    text-transform: uppercase;
    cursor: pointer;
}

.arcade-btn:hover {
    box-shadow: 2px 2px 0 #000000;
    transform: translate(2px, 2px);
    opacity: 1;
}

.arcade-btn:active {
    box-shadow: none;
    transform: translate(4px, 4px);
}

.arcade-btn-outline {
    background: #FFFBDB;
    color: #000000;
}

.arcade-btn-outline:hover {
    background: #000000;
    color: #FFFBDB;
}
```

- [ ] **Step 2: Reemplazar el HTML del main — sección hero**

Localizar el `<main>` completo y reemplazarlo por:

```html
<!-- Main Content -->
<main class="relative flex-1">
    <section class="flex min-h-screen w-full items-center justify-center px-4 py-20">
        <div class="container mx-auto max-w-5xl px-4 md:px-6">

            <!-- Tabs arcade -->
            <div class="flex justify-center mb-6 z-30 relative">
                <div class="arcade-tabs">
                    <button onclick="goToSlide(1)" id="tab-1" class="arcade-tab active-tab">
                        Inicio
                    </button>
                    <button onclick="goToSlide(2)" id="tab-2" class="arcade-tab">
                        ¿Por qué Inspector del SOIVRE?
                    </button>
                </div>
            </div>

            <!-- Arcade Card -->
            <div data-reveal class="arcade-card relative w-full max-w-4xl mx-auto min-h-[440px] flex items-center justify-center overflow-hidden">
                <div id="carouselSlides" class="relative w-full h-full flex items-center justify-center">

                    <!-- Slide 1: Intro -->
                    <div class="carousel-slide absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500 opacity-100 z-10 p-4"
                        id="slide-1">
                        <h1 class="arcade-title text-3xl sm:text-4xl md:text-5xl mb-6">
                            INTRODUCCIÓN
                        </h1>
                        <p class="arcade-body mx-auto max-w-[640px] text-sm md:text-base mb-8">
                            Recursos especializados para la preparación de las oposiciones al
                            <strong>Cuerpo de Inspectores del SOIVRE</strong>.
                            <br><br>
                            Material también de gran utilidad para el
                            <strong>Cuerpo de Ingenieros Técnicos del SOIVRE</strong>.
                        </p>
                        <a href="temario.html" class="arcade-btn">
                            Explorar Temario
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>

                    <!-- Slide 2: Why SOIVRE? -->
                    <div class="carousel-slide absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500 opacity-0 z-0 pointer-events-none p-4"
                        id="slide-2">
                        <h1 class="arcade-title text-2xl sm:text-3xl md:text-4xl mb-6">
                            ¿POR QUÉ INSPECTOR DEL SOIVRE?
                        </h1>
                        <p class="arcade-body mx-auto max-w-[640px] text-sm md:text-base mb-8">
                            Una carrera centrada en el comercio exterior con funciones clave en inspección
                            agroalimentaria e industrial, así como en el diseño de política e inteligencia
                            comercial, ofreciendo una sólida proyección nacional e internacional.
                            <br><br>
                            Descubre todo sobre el cuerpo, funciones y destinos en la web de la Asociación.
                        </p>
                        <a href="https://soivre.webflow.io/" target="_blank" rel="noopener noreferrer" class="arcade-btn arcade-btn-outline">
                            Web de la Asociación
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                </div>
            </div>

            <div class="h-8 md:h-12"></div>
        </div>
    </section>
</main>
```

- [ ] **Step 3: Actualizar el script de tabs para usar las clases arcade**

Localizar en el script del carousel la función `showSlide` y reemplazar la sección que actualiza las tabs:

```javascript
// Actualizar Tabs arcade
const tabs = [document.getElementById('tab-1'), document.getElementById('tab-2')];
tabs.forEach((tab, i) => {
    if (tab) {
        if (i === index) {
            tab.classList.add('active-tab');
        } else {
            tab.classList.remove('active-tab');
        }
    }
});
```

- [ ] **Step 4: Verificar en navegador**

La tarjeta hero debe tener borde doble negro con sombra desplazada. Las tabs deben ser botones rectangulares con inversión negro/amarillo al activarse. El botón CTA debe tener sombra sólida y animación de "pulsado" al hover.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "style: redesign hero card with arcade double-border and tabs"
```

---

### Task 6: Rediseñar el footer

**Files:**
- Modify: `index.html` — HTML del `<footer>` y CSS

- [ ] **Step 1: Actualizar el CSS del footer**

Al final del bloque `<style>`, añadir:

```css
/* ===== ARCADE FOOTER ===== */
footer.arcade-footer {
    background: #000000 !important;
    color: #FFFBDB !important;
    border-top: 2px solid #000000 !important;
    backdrop-filter: none !important;
}

footer.arcade-footer a {
    color: #FFFBDB;
    transition: color 0.15s;
}

footer.arcade-footer a:hover {
    color: #FFE566;
    opacity: 1;
}
```

- [ ] **Step 2: Actualizar el HTML del footer**

Localizar el `<footer>` y añadir la clase `arcade-footer`:

```html
<footer class="arcade-footer fixed bottom-0 left-0 right-0 z-50 shadow-lg border-t border-primary/20">
    <div class="container mx-auto flex h-12 items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
```

(Solo añadir `arcade-footer` a las clases existentes y reducir `h-16` a `h-12`)

- [ ] **Step 3: Verificar en navegador**

El footer debe ser una banda negra fija en la parte inferior, con los iconos sociales en amarillo claro. Sin transparencias.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: update footer to arcade black bar"
```

---

### Task 7: Actualizar el menú móvil

**Files:**
- Modify: `index.html` — CSS del menú móvil y HTML del `#mobileMenu`

- [ ] **Step 1: Actualizar los estilos del menú móvil**

Localizar en `<style>` los estilos de `.mobile-menu`, `#mobileMenu`, `.mobile-breadcrumb` y actualizar:

```css
/* ===== ARCADE MOBILE MENU ===== */
.mobile-breadcrumb {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #000000;
    border-bottom: 1px solid #FFFBDB;
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #FFFBDB;
    text-transform: uppercase;
    height: 2.5rem;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
}

@media (min-width: 768px) {
    .mobile-breadcrumb {
        display: none;
    }
}

#mobileMenu {
    transform: translateX(-100%);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.2s ease, opacity 0.2s ease, visibility 0s 0.2s;
    background: #000000 !important;
    border-right: 2px solid #FFFBDB;
}

#mobileMenu.menu-open {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

#mobileMenu a {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    font-weight: 600;
    color: #FFFBDB;
    letter-spacing: 0.05em;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 251, 219, 0.15);
    display: block;
    text-decoration: none;
}

#mobileMenu a:hover,
#mobileMenu a.bg-accent {
    background: #FFFBDB !important;
    color: #000000 !important;
}
```

- [ ] **Step 2: Actualizar el botón hamburguesa**

Localizar el botón de menú móvil y actualizar:

```html
<button
    class="md:hidden fixed top-0 right-0 z-50 p-3 w-10 h-10 flex items-center justify-center bg-black border-l border-b border-yellow-100"
    style="border-color: rgba(255,251,219,0.4)"
    onclick="toggleMobileMenu()" aria-label="Abrir menú">
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="#FFFBDB">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>
```

- [ ] **Step 3: Verificar en móvil (o DevTools con viewport estrecho)**

El breadcrumb superior debe ser una barra negra. El menú desplegable debe abrirse desde la izquierda con fondo negro y links en Orbitron amarillo. El link activo debe invertirse.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: update mobile menu to arcade black panel"
```

---

### Task 8: Limpieza final — eliminar CSS residual

**Files:**
- Modify: `index.html` — eliminar estilos huérfanos del diseño anterior

- [ ] **Step 1: Eliminar clases CSS ya no usadas del bloque `<style>`**

Eliminar los siguientes bloques CSS que ya no tienen referencia en el HTML:
- `.glass { ... }`
- `.glass-card { ... }`
- `.top-nav { ... }`
- `.nav-link { ... }` (ambas definiciones duplicadas)
- `.search-input { ... }`
- Todas las clases de utilidad duplicadas de Tailwind que se definieron manualmente en el CSS (`.container`, `.mx-auto`, `.w-full`, etc.) — Tailwind CDN ya las provee.

- [ ] **Step 2: Eliminar el segundo bloque `tailwind.config` duplicado**

En el `<head>` hay dos bloques `<script>` con `tailwind.config = { ... }`. Eliminar el primero (líneas ~54-97) y conservar solo el segundo (líneas ~984-1020).

- [ ] **Step 3: Verificar que nada se rompe**

Abrir `index.html` en el navegador. Navegar entre las dos slides. Verificar la búsqueda, el menú móvil. No deben aparecer errores en consola.

- [ ] **Step 4: Commit final**

```bash
git add index.html
git commit -m "style: remove legacy CSS — arcade redesign complete"
```

---

## Self-Review

**Spec coverage:**
- ✅ Fondo `#FFFBDB` — Task 2
- ✅ Negro puro texto/bordes — Task 2
- ✅ Orbitron para títulos y nav — Tasks 1, 4, 5, 7
- ✅ Share Tech Mono para cuerpo — Tasks 1, 5
- ✅ `border-radius: 0` en todo — Task 2 (`* { border-radius: 0 !important }`)
- ✅ Sin glassmorphism — Tasks 2, 4, 5
- ✅ SVG contenedores marítimos — Task 3
- ✅ Nav barra negra con inversión activo — Task 4
- ✅ Hero con borde doble y sombra sólida — Task 5
- ✅ Tabs rectangulares invertidos — Task 5
- ✅ CTA con sombra desplazada y efecto pulsado — Task 5
- ✅ Footer negro fijo — Task 6
- ✅ Menú móvil arcade — Task 7
- ✅ Dark mode eliminado — Task 2
- ✅ Scripts JS existentes intactos — Task 5 (solo se adapta la lógica de clases de tabs)
