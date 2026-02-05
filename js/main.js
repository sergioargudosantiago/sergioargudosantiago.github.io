// State Management
let currentExercise = null;
let currentTopics = [];
let filteredTopics = [];

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
        const topic = {
            number: i,
            name: fileName,
            path: path, // Path with properly encoded filename
            status: 'coming-soon', // Default status
            message: null
        };

        // Exercise 3: Topics 1-50 available (except 12, 33, 43)
        if (exerciseNumber === 3) {
            if ([12, 33, 43].includes(i)) {
                topic.status = 'discarded';
                topic.message = 'No disponible, era mi tema de descarte';
            } else if (i >= 1 && i <= 50) {
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
