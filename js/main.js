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

// Render Individual Topic Item
function renderTopicItem(topic) {
    switch (topic.status) {
        case 'available':
            return `
                <a href="${topic.path}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   download
                   onclick="console.log('Attempting to download:', '${topic.path}');"
                   class="flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors hover:bg-accent group">
                    <span class="font-serif font-medium text-foreground/80 group-hover:text-foreground">${topic.name}</span>
                    <svg class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </a>
            `;
        case 'discarded':
            return `
                <div class="flex items-center justify-between rounded-md p-3 opacity-60">
                    <span class="font-serif font-medium text-foreground/80">${topic.name}</span>
                    <span class="text-sm text-muted-foreground italic">${topic.message}</span>
                </div>
            `;
        case 'coming-soon':
            return `
                <div class="flex items-center justify-between rounded-md p-3 opacity-60">
                    <span class="font-serif font-medium text-foreground/80">${topic.name}</span>
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

// Header Search (Placeholder functionality)
document.getElementById('headerSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Placeholder - could implement global search functionality here
    console.log('Header search query:', query);
});

document.getElementById('mobileSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Placeholder - could implement global search functionality here
    console.log('Mobile search query:', query);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Page is now self-contained, no section navigation needed
});
