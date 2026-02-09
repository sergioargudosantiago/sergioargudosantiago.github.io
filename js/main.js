// State Management
let currentExercise = null;
let currentTopics = [];
let filteredTopics = [];

// Topic Titles for Exercise 3 (Tercer ejercicio)
const EXERCISE_3_TITLES = {
    1: "El comercio internacional. Marco general y principales magnitudes.",
    2: "Balanza de Pagos. Concepto. Presentaciones, metodología y estructura.",
    3: "El comercio exterior español: Principales rasgos.",
    4: "La empresa ante el comercio internacional.",
    5: "El marketing internacional. Concepto y funciones.",
    6: "Las formas de acceso a los mercados.",
    7: "Instrumentos financieros de apoyo a la internacionalización (I). El Crédito Oficial.",
    8: "Instrumentos financieros de apoyo a la internacionalización (II). El Seguro de Crédito.",
    9: "Instrumentos financieros de apoyo a la internacionalización (III). El FIEM.",
    10: "Instrumentos comerciales de apoyo a la internacionalización (I): ICEX.",
    11: "Instrumentos comerciales de apoyo a la internacionalización (II): Las Cámaras de Comercio.",
    12: "Instrumentos fiscales no aduaneros. IVA en comercio exterior. INTRASTAT.",
    13: "El factoring, el leasing y el forfaiting.",
    14: "Financiación de operaciones de comercio exterior: Mercado de divisas.",
    15: "Medios de pago y cobro internacionales.",
    16: "Contratación internacional (I): Generalidades. INCOTERMS.",
    17: "Contratación internacional (II): Incumplimiento y resolución de conflictos.",
    18: "Inversiones extranjeras. Inversión directa y en valores negociables.",
    19: "Inversión española en el exterior.",
    20: "Inversión extranjera en España.",
    21: "El régimen aduanero del comercio exterior: política aduanera comunitaria.",
    22: "Sistema de Preferencias Generalizadas.",
    23: "Regímenes aduaneros: Generalidades y tipos.",
    24: "Los regímenes especiales. Tránsito, depósito, perfeccionamiento.",
    25: "Instrumentos de defensa comercial: salvaguardia, antidumping, antisubvención.",
    26: "Comercio exterior de material de defensa y de doble uso.",
    27: "Obstáculos comerciales: Identificación y caracterización.",
    28: "Medidas sanitarias y fitosanitarias. Acuerdo MSF de la OMC.",
    29: "Medidas de armonización y transparencia en la UE.",
    30: "Política comunitaria en materia de normas y evaluación de la conformidad.",
    31: "Acuerdos de reconocimiento mutuo sobre evaluación de la conformidad.",
    32: "El transporte internacional marítimo y aéreo.",
    33: "El transporte internacional por carretera y ferrocarril.",
    34: "Naciones Unidas: Objetivos y Órganos principales.",
    35: "La cooperación económica internacional: el FMI.",
    36: "Instituciones multilaterales de financiación y ayuda al desarrollo.",
    37: "La OCDE: Objetivo, estructura y funciones.",
    38: "Las negociaciones comerciales multilaterales: evolución del GATT.",
    39: "La OMC y la economía mundial. Sistema, objetivo, funciones.",
    40: "La OMC y los Acuerdos multilaterales y plurilaterales.",
    41: "La Unión Europea: Antecedentes y evolución. Tratados.",
    42: "Las Instituciones de la Unión Europea.",
    43: "Toma de decisiones en la UE. Proceso legislativo, comitología.",
    44: "El Mercado Único Europeo. Libre circulación.",
    45: "La política agrícola de la UE. Organización común de mercado.",
    46: "La política pesquera de la UE.",
    47: "La política de calidad de productos agroalimentarios de la UE.",
    48: "Política de protección de consumidores de la UE.",
    49: "Política económica y monetaria de la UE.",
    50: "Política industrial y empresarial de la UE.",
    51: "Política de medio ambiente de la UE y compromisos internacionales.",
    52: "Política de Competencia de la UE.",
    53: "Política regional y de cohesión de la UE. Fondos europeos.",
    54: "Política comercial de la UE (I): Política comercial común.",
    55: "Política comercial de la UE (II): EEE, Reino Unido, Suiza, Turquía, Rusia, Balcanes.",
    56: "Política comercial de la UE (III): Euromediterráneo, África, Caribe, Pacífico.",
    57: "Política comercial de la UE (IV): Estados Unidos, Canadá, Latinoamérica.",
    58: "Política comercial de la UE (V): Asia, Oceanía, Golfo."
};

// Topic Titles for Exercise 5 (Quinto ejercicio)
const EXERCISE_5_TITLES = {
    1: "Objeto y método de la ciencia económica. Economistas clásicos y Marx.",
    2: "Evolución del pensamiento económico. Neoclásicos, Keynes.",
    3: "Teoría de la Demanda. Teoría de la producción. Teoría de los Costes.",
    4: "El funcionamiento del mercado. Competencia perfecta, monopolio, oligopolio.",
    5: "La política monetaria. Estrategias y efectos.",
    6: "La política fiscal. Disciplina fiscal y sostenibilidad.",
    7: "Crecimiento económico y desarrollo. Modelos de crecimiento.",
    8: "La globalización de la economía. Decisiones de inversión.",
    9: "La integración económica regional.",
    10: "La política agraria española en el marco de la PAC.",
    11: "Sector pesquero español. Evolución y situación actual en la UE.",
    12: "La política industrial en España. Medio Ambiente e I+D.",
    13: "La política energética española.",
    14: "El sector servicios en España. Construcción y vivienda.",
    15: "La política de desarrollo regional en España.",
    16: "El marco económico de la distribución comercial.",
    17: "Evolución de la actividad comercial. Ratios y formatos.",
    18: "Precios y márgenes en el canal de distribución. IPC.",
    19: "La Ordenación del Comercio Minorista.",
    20: "Instrumentos de apoyo al comercio minorista.",
    21: "El comercio mayorista en España. MERCASA.",
    22: "Servicios de la Sociedad de la Información y Comercio Electrónico.",
    23: "Otras formas comerciales: Franquicias, venta a distancia, venta automática.",
    24: "La protección al consumidor.",
    25: "La defensa de la libre competencia en España.",
    26: "Prácticas restrictivas de la competencia.",
    27: "Concentraciones económicas.",
    28: "Ayudas públicas. Regulación y control.",
    29: "Las fuentes del Derecho Administrativo.",
    30: "El reglamento. La potestad reglamentaria.",
    31: "El acto administrativo: concepto, clases y elementos.",
    32: "Los recursos administrativos.",
    33: "La jurisdicción contencioso-administrativa.",
    34: "Los contratos administrativos.",
    35: "El servicio público: concepto y gestión.",
    36: "El Procedimiento Administrativo Común.",
    37: "El Estatuto Básico del Empleado Público.",
    38: "El ciudadano y la Administración pública.",
    39: "La Constitución Española de 1978.",
    40: "El Gobierno y su presidente. Administración Central del Estado.",
    41: "Organización y competencias del Ministerio de Economía, Comercio y Empresa.",
    42: "Organización territorial del Estado. Comunidades Autónomas.",
    43: "El sistema tributario español.",
    44: "La Ley General Presupuestaria y las leyes anuales de presupuestos.",
    45: "Políticas Públicas: Igualdad, Violencia de Género, Discapacidad, LGTBI, Transparencia.",
    46: "Gobernanza Pública y Gobierno Abierto."
};


// Mobile Menu Functions
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Modal Functions
function openModal(type, title, exerciseNumber = null, topicCount = null) {
    if (type === 'coming-soon') {
        document.getElementById('comingSoonTitle').textContent = title;
        document.getElementById('comingSoonModal').classList.add('active');
    } else if (type === 'topic-list') {
        currentExercise = { number: exerciseNumber, count: topicCount, title: title };

        // Set modal title
        const titleText = title.toLowerCase().replace('ejercicio', 'Ejercicio');
        document.getElementById('modalTitle').textContent = `Esquemas del ${titleText}`;

        // Generate and display topics
        currentTopics = generateTopics(exerciseNumber, topicCount);
        filteredTopics = [...currentTopics];
        renderTopics();

        // Clear search
        document.getElementById('modalSearch').value = '';

        // Show modal
        document.getElementById('topicModal').classList.add('active');
    }
}

function closeModal() {
    document.getElementById('topicModal').classList.remove('active');
    document.getElementById('comingSoonModal').classList.remove('active');
    currentExercise = null;
    currentTopics = [];
    filteredTopics = [];
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal on backdrop click
document.getElementById('topicModal').addEventListener('click', (e) => {
    if (e.target.id === 'topicModal') {
        closeModal();
    }
});

document.getElementById('comingSoonModal').addEventListener('click', (e) => {
    if (e.target.id === 'comingSoonModal') {
        closeModal();
    }
});

// Topic Generation Function
function generateTopics(exerciseNumber, topicCount) {
    const topics = [];

    for (let i = 1; i <= topicCount; i++) {
        const fileName = `ESQUEMA TEMA ${i}.docx`;
        // Encode the filename separately to properly handle spaces
        const encodedFileName = encodeURIComponent(fileName);
        // HARDCODED relative path with dot prefix for proper resolution
        const path = `./public/temas/ejercicio-${exerciseNumber}/${encodedFileName}`;

        // Determine the display name (full title)
        let displayName = fileName;
        if (exerciseNumber === 3 && EXERCISE_3_TITLES[i]) {
            displayName = `TEMA ${i}. ${EXERCISE_3_TITLES[i]}`;
        } else if (exerciseNumber === 5 && EXERCISE_5_TITLES[i]) {
            displayName = `TEMA ${i}. ${EXERCISE_5_TITLES[i]}`;
        }

        const topic = {
            number: i,
            name: displayName,
            path: path, // Path with properly encoded filename
            status: 'coming-soon', // Default status
            message: null
        };

        // Exercise 3: Topics 1-58 available (except 12, 33, 43)
        if (exerciseNumber === 3) {
            if ([12, 33, 43].includes(i)) {
                topic.status = 'discarded';
                topic.message = 'No disponible, era mi tema de descarte';
            } else if (i >= 1 && i <= 58) {
                topic.status = 'available';
            }
        }
        // Exercise 5: All topics 1-46 available
        else if (exerciseNumber === 5) {
            if (i >= 1 && i <= 46) {
                topic.status = 'available';
            }
        }

        topics.push(topic);
    }

    return topics;
}

// Render Topics Function
function renderTopics() {
    const topicList = document.getElementById('topicList');

    if (filteredTopics.length === 0) {
        topicList.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <p class="font-semibold">No se encontraron resultados.</p>
                <p class="text-sm">Pruebe con otra búsqueda.</p>
            </div>
        `;
        return;
    }

    topicList.innerHTML = filteredTopics.map(topic => renderTopicItem(topic)).join('');
}

// Render Individual Topic Item - Energy Cell Design
function renderTopicItem(topic) {
    switch (topic.status) {
        case 'available':
            return `
                <a href="${topic.path}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   download
                   onclick="console.log('Attempting to download:', '${topic.path}');"
                   class="flex cursor-pointer items-center justify-between bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 transition-all duration-300 hover:bg-white/80 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:border-accent/50 group">
                    <span class="font-serif font-semibold text-foreground/90 group-hover:text-primary transition-colors">${topic.name}</span>
                    <svg class="h-5 w-5 text-muted-foreground transition-all group-hover:text-accent group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </a>
            `;
        case 'discarded':
            return `
                <div class="flex items-center justify-between bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-4 opacity-60">
                    <span class="font-serif font-medium text-foreground/70">${topic.name}</span>
                    <span class="text-sm text-muted-foreground italic">${topic.message}</span>
                </div>
            `;
        case 'coming-soon':
            return `
                <div class="flex items-center justify-between bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-4 opacity-60">
                    <span class="font-serif font-medium text-foreground/70">${topic.name}</span>
                    <span class="text-sm text-muted-foreground">Próximamente disponible</span>
                </div>
            `;
        default:
            return '';
    }
}

// Filter Topics Function
function filterTopics() {
    const searchQuery = document.getElementById('modalSearch').value.toLowerCase();

    if (!searchQuery) {
        filteredTopics = [...currentTopics];
    } else {
        filteredTopics = currentTopics.filter(topic =>
            topic.name.toLowerCase().includes(searchQuery)
        );
    }

    renderTopics();
}

// Header Search Redirection
function handleGlobalSearch(query) {
    if (!query) return;
    const currentPath = window.location.pathname;
    if (currentPath.includes('temario.html')) {
        // If already on temario, open global search modal
        openGlobalSearch(query);
    } else {
        // Otherwise redirect to temario with query
        window.location.href = `temario.html?q=${encodeURIComponent(query)}`;
    }
}

function openGlobalSearch(query) {
    currentExercise = { number: 'all', count: 104, title: 'BÚSQUEDA GLOBAL' };
    document.getElementById('modalTitle').textContent = `Resultados de búsqueda: "${query}"`;

    // Combine all topics from Ejercicio 3 and 5
    const topics3 = generateTopics(3, 58);
    const topics5 = generateTopics(5, 46);
    currentTopics = [...topics3, ...topics5];

    filteredTopics = currentTopics.filter(topic =>
        topic.name.toLowerCase().includes(query.toLowerCase())
    );

    renderTopics();
    document.getElementById('modalSearch').value = query;
    document.getElementById('topicModal').classList.add('active');
}

document.getElementById('headerSearch')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGlobalSearch(e.target.value);
});

document.getElementById('mobileSearch')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGlobalSearch(e.target.value);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query && window.location.pathname.includes('temario.html')) {
        openGlobalSearch(query);
    }
});
