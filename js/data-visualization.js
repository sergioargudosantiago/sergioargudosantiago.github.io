// Data Visualization Logic
let dataLoaded = false;
let plazasChartInstance = null;
let ratioChartInstance = null;

// Load and Process CSV Data
async function loadDataVisualization() {
    // Only load once
    if (dataLoaded) {
        return;
    }

    try {
        // Fetch the CSV file
        const response = await fetch('data/estadisticas.csv');

        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de datos');
        }

        const csvText = await response.text();

        // Parse CSV
        const data = parseCSV(csvText);

        if (data.length > 0) {
            // Process and render data
            renderCharts(data);
            renderTable(data);
            dataLoaded = true;
        } else {
            showNoDataMessage();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage(error.message);
    }
}

// Simple CSV Parser
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim());

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            // Try to parse as number, otherwise keep as string
            const value = values[index];
            row[header] = isNaN(value) ? value : Number(value);
        });
        data.push(row);
    }

    return data;
}

// Render Charts
function renderCharts(data) {
    // Expected data format:
    // [
    //   { "Año": 2022, "Plazas": 10, "Aspirantes": 500, "Ratio": 50 },
    //   { "Año": 2023, "Plazas": 15, "Aspirantes": 600, "Ratio": 40 },
    //   ...
    // ]

    // Extract data for charts
    const years = data.map(row => row['Año'] || row['Year'] || row['Convocatoria'] || '');
    const plazas = data.map(row => row['Plazas'] || row['Positions'] || 0);
    const aspirantes = data.map(row => row['Aspirantes'] || row['Applicants'] || 0);
    const ratios = data.map(row => row['Ratio'] || row['Ratio Aspirantes/Plaza'] || 0);

    // Render Bar Chart - Plazas Evolution
    renderPlazasChart(years, plazas, aspirantes);

    // Render Pie Chart - Ratio
    renderRatioChart(years, ratios);
}

// Render Plazas Bar Chart
function renderPlazasChart(years, plazas, aspirantes) {
    const ctx = document.getElementById('plazasChart');

    if (!ctx) return;

    // Destroy existing chart if any
    if (plazasChartInstance) {
        plazasChartInstance.destroy();
    }

    plazasChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Plazas',
                    data: plazas,
                    backgroundColor: 'hsla(224, 64%, 33%, 0.8)', // Primary color
                    borderColor: 'hsl(224, 64%, 33%)',
                    borderWidth: 2
                },
                {
                    label: 'Aspirantes',
                    data: aspirantes,
                    backgroundColor: 'hsla(217, 94%, 67%, 0.8)', // Accent color
                    borderColor: 'hsl(217, 94%, 67%)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Render Ratio Pie Chart
function renderRatioChart(years, ratios) {
    const ctx = document.getElementById('ratioChart');

    if (!ctx) return;

    // Destroy existing chart if any
    if (ratioChartInstance) {
        ratioChartInstance.destroy();
    }

    // Generate colors for pie chart
    const colors = [
        'hsla(224, 64%, 33%, 0.8)',  // Primary
        'hsla(217, 94%, 67%, 0.8)',  // Accent
        'hsla(210, 40%, 96.1%, 0.8)', // Secondary
        'hsla(215, 20%, 65%, 0.8)',  // Muted
        'hsla(0, 84.2%, 60.2%, 0.8)' // Destructive
    ];

    ratioChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: years.map(year => `${year}`),
            datasets: [{
                label: 'Ratio Aspirantes/Plaza',
                data: ratios,
                backgroundColor: colors.slice(0, years.length),
                borderColor: colors.slice(0, years.length).map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.parsed} aspirantes/plaza`;
                        }
                    }
                }
            }
        }
    });
}

// Render Data Table
function renderTable(data) {
    const tableBody = document.getElementById('dataTableBody');

    if (!tableBody || data.length === 0) {
        return;
    }

    // Clear loading message
    tableBody.innerHTML = '';

    // Populate table rows
    data.forEach((row, index) => {
        const year = row['Año'] || row['Year'] || row['Convocatoria'] || '-';
        const plazas = row['Plazas'] || row['Positions'] || '-';
        const aspirantes = row['Aspirantes'] || row['Applicants'] || '-';
        const ratio = row['Ratio'] || row['Ratio Aspirantes/Plaza'] || '-';

        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-background/30' : '';
        tr.innerHTML = `
            <td class="p-3 border-b">${year}</td>
            <td class="p-3 border-b">${plazas}</td>
            <td class="p-3 border-b">${aspirantes}</td>
            <td class="p-3 border-b">${ratio}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Show error message
function showErrorMessage(message) {
    const tableBody = document.getElementById('dataTableBody');
    const plazasCanvas = document.getElementById('plazasChart');
    const ratioCanvas = document.getElementById('ratioChart');

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td class="p-3 border-b" colspan="4">
                    <div class="text-center text-destructive">
                        <p class="font-semibold">Error al cargar los datos</p>
                        <p class="text-sm">${message}</p>
                        <p class="text-sm mt-2 text-muted-foreground">Asegúrese de que el archivo 'data/estadisticas.csv' existe y es válido.</p>
                    </div>
                </td>
            </tr>
        `;
    }

    // Hide charts and show placeholder message
    if (plazasCanvas && plazasCanvas.parentElement) {
        plazasCanvas.parentElement.innerHTML = `
            <h3 class="text-xl font-bold text-primary mb-4">Evolución de Plazas</h3>
            <div class="flex items-center justify-center h-64 text-muted-foreground">
                <p>No se pudieron cargar los datos del gráfico</p>
            </div>
        `;
    }

    if (ratioCanvas && ratioCanvas.parentElement) {
        ratioCanvas.parentElement.innerHTML = `
            <h3 class="text-xl font-bold text-primary mb-4">Ratio Aspirantes/Plaza</h3>
            <div class="flex items-center justify-center h-64 text-muted-foreground">
                <p>No se pudieron cargar los datos del gráfico</p>
            </div>
        `;
    }
}

// Show no data message
function showNoDataMessage() {
    const tableBody = document.getElementById('dataTableBody');

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td class="p-3 border-b" colspan="4">
                    <div class="text-center text-muted-foreground">
                        <p class="font-semibold">No se encontraron datos</p>
                        <p class="text-sm">El archivo de datos está vacío o tiene un formato incorrecto.</p>
                    </div>
                </td>
            </tr>
        `;
    }
}
