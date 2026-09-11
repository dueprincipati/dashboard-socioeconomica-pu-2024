// Dashboard Socio-Economica - Main JavaScript
// Gestione dell'interattività, navigazione e grafici

class Dashboard {
    constructor() {
        this.charts = {};
        this.currentSection = 'demografia';
        this.colors = {
            primary: '#f97316',
            secondary: '#06b6d4',
            accent: '#ec4899',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            orange: '#fb923c',
            sky: '#38bdf8',
            teal: '#2dd4bf',
            pink: '#f472b6',
            red: '#f87171',
            purple: '#c084fc',
            green: '#4ade80',
            chart: ['#38bdf8', '#4ade80', '#fb923c', '#f472b6', '#c084fc', '#2dd4bf', '#ef4444', '#06b6d4']
        };
        this.init();
    }

    init() {
        this.setupChartDefaults();
        this.setupEventListeners();
        this.setupInternalTabs();
        this.loadDashboard();
    }

    setupChartDefaults() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#94a3b8';
        }
    }

    getCommonOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        };
    }

    setupEventListeners() {
        // Tab navigation (sezioni principali)
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Funzionalità di zoom sulle card
        document.querySelectorAll('.zoomable').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('canvas, .filter-btn, button, .tab-btn, a')) return;
                this.zoomCard(card);
            });
        });

        // Chiusura overlay di zoom al click sullo sfondo
        const overlay = document.getElementById('zoom-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target.id === 'zoom-overlay') {
                    this.closeZoom();
                }
            });
        }

        // Tasto Escape per chiudere lo zoom
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeZoom();
            }
        });
    }

    setupInternalTabs() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const parentSection = btn.closest('section');
                if (!parentSection) return;

                const sectionTabs = parentSection.querySelectorAll('.tab-btn');
                const sectionContents = parentSection.querySelectorAll('.tab-content');
                const targetTabId = btn.dataset.tab;

                sectionTabs.forEach(t => t.classList.remove('active'));
                sectionContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const targetContent = parentSection.querySelector(`#${targetTabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    this.renderChartsForTab(parentSection.id, targetTabId);
                }
            });
        });
    }

    switchSection(sectionName) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeNavBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavBtn) activeNavBtn.classList.add('active');

        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionName);
        if (activeSection) activeSection.classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionCharts(sectionName);

        setTimeout(() => {
            this.resizeSectionCharts(sectionName);
        }, 60);
    }

    zoomCard(card) {
        const overlay = document.getElementById('zoom-overlay');
        const zoomedCard = document.getElementById('zoomed-card');
        if (!overlay || !zoomedCard) return;

        const clonedCard = card.cloneNode(true);
        clonedCard.classList.remove('zoomable');
        clonedCard.classList.add('zoomed');

        zoomedCard.innerHTML = '';

        // Pulsante di chiusura
        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-3 right-4 text-slate-400 hover:text-white text-3xl font-bold p-1 z-20 transition-colors leading-none';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Chiudi zoom');
        closeBtn.onclick = () => this.closeZoom();
        zoomedCard.appendChild(closeBtn);

        zoomedCard.appendChild(clonedCard);
        overlay.classList.remove('hidden');

        // Renderizza nuovamente i grafici nel card ingrandito
        const canvases = clonedCard.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const chartId = canvas.id;
            const originalChart = this.charts[chartId];
            if (originalChart && originalChart.config) {
                try {
                    const clonedConfig = {
                        type: originalChart.config.type,
                        data: JSON.parse(JSON.stringify(originalChart.config.data)),
                        options: {
                            ...originalChart.config.options,
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    };
                    new Chart(canvas, clonedConfig);
                } catch (err) {
                    console.warn(`Could not render zoomed chart for ${chartId}:`, err);
                }
            }
        });
    }

    closeZoom() {
        const overlay = document.getElementById('zoom-overlay');
        if (overlay) overlay.classList.add('hidden');
        const zoomedCard = document.getElementById('zoomed-card');
        if (zoomedCard) zoomedCard.innerHTML = '';
    }

    async loadDashboard() {
        try {
            const loading = document.getElementById('loading');
            if (loading) loading.classList.add('hidden');
            const content = document.getElementById('content');
            if (content) content.classList.remove('hidden');

            this.updateKPIs();
            this.loadSectionCharts(this.currentSection);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateKPIs() {
        if (typeof dashboardData === 'undefined' || !dashboardData.kpi) return;
        const kpis = dashboardData.kpi;
        const popEl = document.getElementById('kpi-popolazione');
        if (popEl && kpis.popolazione_totale) popEl.textContent = kpis.popolazione_totale.toLocaleString('it-IT');
        const occEl = document.getElementById('kpi-occupazione');
        if (occEl && kpis.tasso_occupazione) occEl.textContent = kpis.tasso_occupazione + '%';
        const penEl = document.getElementById('kpi-pensionati');
        if (penEl && kpis.pensionati_totale) penEl.textContent = kpis.pensionati_totale.toLocaleString('it-IT');
        const entEl = document.getElementById('kpi-entrate');
        if (entEl && kpis.crescita_entrate) entEl.textContent = kpis.crescita_entrate;
    }

    loadSectionCharts(sectionName) {
        const section = document.getElementById(sectionName);
        if (!section) return;

        const activeInternalTab = section.querySelector('.tab-content.active');
        if (activeInternalTab) {
            this.renderChartsForTab(sectionName, activeInternalTab.id);
        } else {
            switch (sectionName) {
                case 'entrate_vigilanza':
                    this.loadEntrateVigilanzaCharts();
                    break;
                case 'relazioni_utenza':
                    this.loadRelazioniUtenzaCharts();
                    break;
                case 'organizzazione':
                    this.loadOrganizzazioneCharts();
                    break;
                case 'patrimonio':
                    this.loadPatrimonioCharts();
                    break;
            }
        }
    }

    renderChartsForTab(sectionId, tabId) {
        switch (sectionId) {
            case 'demografia':
                this.loadDemografiaCharts(tabId);
                break;
            case 'mercato_lavoro':
                this.loadMercatoLavoroCharts(tabId);
                break;
            case 'ammortizzatori':
                this.loadAmmortizzatoriCharts(tabId);
                break;
            case 'pensioni':
                this.loadPensioniCharts(tabId);
                break;
            case 'assistenza':
                this.loadAssistenzaCharts(tabId);
                break;
            case 'contenzioso':
                this.loadContenziosoCharts(tabId);
                break;
        }
        setTimeout(() => this.resizeTabCharts(tabId), 30);
    }

    resizeTabCharts(tabId) {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;
        tabEl.querySelectorAll('canvas').forEach(canvas => {
            const chart = this.charts[canvas.id];
            if (chart) chart.resize();
        });
    }

    resizeSectionCharts(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        section.querySelectorAll('canvas').forEach(canvas => {
            const chart = this.charts[canvas.id];
            if (chart) chart.resize();
        });
    }

    // ==========================================
    // 1. DEMOGRAFIA
    // ==========================================
    loadDemografiaCharts(tabId = 'struttura') {
        if (tabId === 'struttura') {
            this.renderDemografiaStruttura();
        } else if (tabId === 'dinamica') {
            this.renderDemografiaDinamica();
        }
    }

    renderDemografiaStruttura() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('agePyramidChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: '0-14 anni', data: [11.8, 11.6, 12.2], backgroundColor: colors.teal, borderRadius: 5 },
                    { label: '15-64 anni', data: [63.0, 62.2, 63.5], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: '65 e oltre', data: [25.3, 26.2, 24.4], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('genderDistributionChart', {
            type: 'doughnut',
            data: {
                labels: ['Femmine', 'Maschi'],
                datasets: [{
                    data: [50.8, 49.2],
                    backgroundColor: [colors.pink, colors.sky],
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } }
                }
            }
        });

        this.createChart('lifeExpectancyChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: 'Femmine', data: [86.1, 85.9, 85.1], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [82.2, 81.9, 81.0], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: { ...commonOptions.scales.y, beginAtZero: false, suggestedMin: 80 }
                }
            }
        });
    }

    renderDemografiaDinamica() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();
        const years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

        this.createChart('naturalBalanceChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { type: 'line', label: 'Saldo Naturale', data: [-717, -728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883], borderColor: colors.purple, tension: 0.3, yAxisID: 'y1' },
                    { label: 'Nascite', data: [3076, 2931, 2840, 2717, 2528, 2378, 2268, 2161, 2182, 2122, 2036], backgroundColor: colors.green, borderRadius: 5, yAxisID: 'y' },
                    { label: 'Decessi', data: [3793, 3659, 3977, 3806, 3898, 3792, 3934, 4916, 4200, 4392, 3919], backgroundColor: colors.red, borderRadius: 5, yAxisID: 'y' }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: { position: 'left', title: { display: true, text: 'Nascite / Decessi' } },
                    y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Saldo' } }
                }
            }
        });

        this.createChart('migrationFlowChart', {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    { label: 'Immigrati', data: [1888, 1774, 1437, 1629, 1700, 1894, 1843, 1618, 1630, 1626, 1758], borderColor: colors.green, tension: 0.3 },
                    { label: 'Emigrati', data: [508, 538, 635, 702, 683, 790, 665, 748, 564, 642, 653], borderColor: colors.orange, tension: 0.3 }
                ]
            },
            options: commonOptions
        });

        this.createChart('demographicBalanceChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { label: 'Saldo Naturale', data: [-717, -728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883], backgroundColor: colors.red, borderRadius: 5 },
                    { label: 'Saldo Migratorio', data: [1380, 1236, 802, 927, 1017, 1104, 1178, 870, 1066, 984, 1105], backgroundColor: colors.green, borderRadius: 5 },
                    { type: 'line', label: 'Saldo Demografico Totale', data: [663, 508, -335, -162, -353, -310, -488, -1885, -952, -1286, -778], borderColor: colors.purple, tension: 0.3, pointBackgroundColor: colors.purple, pointRadius: 4 }
                ]
            },
            options: {
                ...commonOptions,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { ...commonOptions.scales.x },
                    y: { ...commonOptions.scales.y, stacked: true }
                },
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: { position: 'nearest' }
                }
            }
        });
    }

    // ==========================================
    // 2. MERCATO DEL LAVORO
    // ==========================================
    loadMercatoLavoroCharts(tabId = 'occupazione') {
        if (tabId === 'occupazione') {
            this.renderMercatoLavoroOccupazione();
        } else if (tabId === 'flussi') {
            this.renderMercatoLavoroFlussi();
        }
    }

    renderMercatoLavoroOccupazione() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('mainIndicatorsChart', {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    { label: 'Tasso Occupazione PU', data: [69.6, 69.2, 70.1], borderColor: colors.green, tension: 0.3, borderWidth: 3 },
                    { label: 'Tasso Disoccupazione PU', data: [4.9, 5.2, 3.7], borderColor: colors.orange, tension: 0.3, borderWidth: 3 },
                    { label: 'Tasso Occupazione Italia', data: [60.1, 61.5, 62.2], borderColor: colors.green, tension: 0.3, borderDash: [5, 5], borderWidth: 1.5 },
                    { label: 'Tasso Disoccupazione Italia', data: [8.1, 7.7, 6.5], borderColor: colors.orange, tension: 0.3, borderDash: [5, 5], borderWidth: 1.5 }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.raw}%` } }
                }
            }
        });

        this.createChart('workersCompositionChart', {
            type: 'bar',
            data: {
                labels: ['Dipendenti', 'Commercianti', 'Artigiani', 'Gest. Separata', 'Domestici', 'Agricoli Autonomi'],
                datasets: [{
                    label: 'Numero Lavoratori (2023)',
                    data: [138925, 12217, 11987, 7149, 4868, 2744],
                    backgroundColor: [colors.sky, colors.teal, colors.purple, colors.pink, colors.orange, colors.green],
                    borderRadius: 5
                }]
            },
            options: { ...commonOptions, indexAxis: 'y', plugins: { legend: { display: false } } }
        });

        this.createChart('genderPayGapChart', {
            type: 'bar',
            data: {
                labels: ['Manifatturiero', 'Commercio', 'Alloggio/Ristorazione', 'Sanità', 'Costruzioni'],
                datasets: [
                    { label: 'Femmine', data: [78.1, 67.9, 51.3, 58.4, 68.1], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [102.6, 89.0, 60.6, 74.6, 90.5], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });
    }

    renderMercatoLavoroFlussi() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('hiresByContractChart', {
            type: 'bar',
            data: {
                labels: ['T. Indeterminato', 'T. Determinato', 'Stagionale', 'Somministrazione', 'Intermittente'],
                datasets: [
                    { label: 'Assunzioni 2023', data: [8613, 19258, 7251, 5716, 11106], backgroundColor: 'rgba(56, 189, 248, 0.6)', borderRadius: 5 },
                    { label: 'Assunzioni 2024', data: [7727, 18388, 7595, 5043, 12153], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('hiresTerminationsBalanceChart', {
            type: 'bar',
            data: {
                labels: ['T. Indeterminato', 'T. Determinato', 'Stagionale', 'Somministrazione', 'Intermittente'],
                datasets: [
                    { label: 'Assunzioni 2024', data: [7727, 18388, 7595, 5043, 12153], backgroundColor: colors.green, borderRadius: 5 },
                    { label: 'Cessazioni 2024', data: [11130, 14409, 7561, 5114, 11840], backgroundColor: colors.red, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('partTimeIncidenceChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Marche', 'Italia'],
                datasets: [
                    { label: 'Donne', data: [48.1, 45.6, 44.1], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Uomini', data: [11.5, 12.9, 15.4], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.raw}%` } }
                }
            }
        });
    }


    loadEntrateVigilanzaCharts() {
        // Entrate contributive
        const entrateData = dashboardData.entrate_vigilanza.entrate_contributive.serie_storica;
        this.createChart('chart-entrate-contributive', {
            type: 'line',
            data: {
                labels: entrateData.map(d => d.anno),
                datasets: [{
                    label: 'Entrate Contributive (€M)',
                    data: entrateData.map(d => d.importo / 1000000),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return '€' + value + 'M'; }
                        },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });

        // Vigilanza ispettiva
        const vigilanzaData = dashboardData.entrate_vigilanza.vigilanza_ispettiva.confronto;
        this.createChart('chart-vigilanza-ispettiva', {
            type: 'bar',
            data: {
                labels: ['Ispezioni', 'Aziende Irregolari', 'Accertato Contributi (K€)', 'Accertato Sanzioni (K€)'],
                datasets: [{
                    label: '2023',
                    data: [
                        vigilanzaData[2023].numero_ispezioni,
                        vigilanzaData[2023].aziende_irregolari,
                        vigilanzaData[2023].accertato_contributi / 1000,
                        vigilanzaData[2023].accertato_sanzioni / 1000
                    ],
                    backgroundColor: this.colors.secondary
                }, {
                    label: '2024',
                    data: [
                        vigilanzaData[2024].numero_ispezioni,
                        vigilanzaData[2024].aziende_irregolari,
                        vigilanzaData[2024].accertato_contributi / 1000,
                        vigilanzaData[2024].accertato_sanzioni / 1000
                    ],
                    backgroundColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });

        // DURC
        const durcData = dashboardData.entrate_vigilanza.durc.evoluzione;
        this.createChart('chart-durc', {
            type: 'line',
            data: {
                labels: durcData.map(d => d.anno),
                datasets: [{
                    label: 'DURC Regolari',
                    data: durcData.map(d => d.regolari),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: '% DURC Irregolari',
                    data: durcData.map(d => d.perc_irregolari),
                    borderColor: this.colors.error,
                    backgroundColor: this.colors.error + '20',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return value + '%'; }
                        },
                        grid: { drawOnChartArea: false }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }


    // ==========================================
    // 4. AMMORTIZZATORI SOCIALI
    // ==========================================
    loadAmmortizzatoriCharts(tabId = 'cessazione') {
        if (tabId === 'cessazione') {
            this.renderAmmortizzatoriCessazione();
        } else if (tabId === 'sospensione') {
            this.renderAmmortizzatoriSospensione();
        }
    }

    renderAmmortizzatoriCessazione() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();
        const years = ['2022', '2023', '2024'];

        this.createChart('naspiGenderChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { label: 'Femmine', data: [8934, 8900, 9379], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [5806, 6367, 7016], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('benefitsTypeChart', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [
                    { label: 'NASpI', data: [19543, 20464], backgroundColor: colors.purple, borderRadius: 5 },
                    { label: 'Disoccupazione Agricola', data: [937, 902], backgroundColor: colors.teal, borderRadius: 5 },
                    { label: 'Dis-coll', data: [110, 126], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('naspiTimingChart', {
            type: 'doughnut',
            data: {
                labels: ['Entro 15 gg', 'Oltre 15 gg'],
                datasets: [{
                    data: [88.5, 11.5],
                    backgroundColor: [colors.green, colors.red],
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } }
                }
            }
        });
    }

    renderAmmortizzatoriSospensione() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('cigHoursChart', {
            type: 'line',
            data: {
                labels: ['2021', '2022', '2023', '2024'],
                datasets: [
                    { label: 'CIGO', data: [1233742, 365795, 720750, 681287], borderColor: colors.sky, tension: 0.3 },
                    { label: 'CIGS', data: [115336, 126111, 97009, 437841], borderColor: colors.pink, tension: 0.3 },
                    { label: 'Fondi Solidarietà', data: [1014495, 90184, 17793, 4034], borderColor: colors.green, tension: 0.3 }
                ]
            },
            options: commonOptions
        });

        this.createChart('cigBeneficiariesChart', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [
                    { label: 'CIGO', data: [7694, 7293], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'CIGS', data: [1025, 1987], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Fondi Solidarietà', data: [130, 72], backgroundColor: colors.green, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('erogationTimingChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: 'CIGO (gg)', data: [11, 12, 21], backgroundColor: colors.purple, borderRadius: 5 },
                    { label: 'FIS (gg)', data: [52, 41, 78], backgroundColor: colors.teal, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });
    }

    // ==========================================
    // 5. PENSIONI
    // ==========================================
    loadPensioniCharts(tabId = 'vigenti') {
        this.renderPensioniChartsForTab(tabId);
    }


    renderPensioniChartsForTab(tabId) {
        const colors = {
            orange: '#fb923c',
            sky: '#38bdf8',
            teal: '#2dd4bf',
            pink: '#f472b6',
            red: '#f87171',
            purple: '#c084fc',
            green: '#4ade80'
        };

        const commonOptions = { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { position: 'bottom', labels: { color: '#cbd5e1' } } 
            }, 
            scales: { 
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } }, 
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } } 
            } 
        };

        if (tabId === 'vigenti') {
            this.createChart('pensionersByTypeChart', {
                type: 'bar',
                data: {
                    labels: ['Femmine', 'Maschi'],
                    datasets: [
                        { label: 'Pensionati IVS', data: [45645, 43460], backgroundColor: colors.teal, borderRadius: 5 },
                        { label: 'Beneficiari Assistenziali', data: [14394, 8566], backgroundColor: colors.purple, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
            });

            this.createChart('averageAmountChart', {
                type: 'bar',
                data: {
                    labels: ['FPLD', 'Dip. Pubblici', 'Lavoratori Autonomi'],
                    datasets: [
                        { label: 'Femmine', data: [905.5, 1875.4, 754.4], backgroundColor: colors.pink, borderRadius: 5 },
                        { label: 'Maschi', data: [1789.1, 2511.7, 1330.4], backgroundColor: colors.sky, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, plugins: { ...commonOptions.plugins, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.raw.toFixed(2)} €` } } } }
            });

            this.createChart('retirementAgeChart', {
                type: 'line',
                data: {
                    labels: ['2022', '2023', '2024'],
                    datasets: [
                        { label: 'Femmine', data: [64.4, 64.9, 65.0], borderColor: colors.pink, tension: 0.3 },
                        { label: 'Maschi', data: [63.4, 63.1, 63.2], borderColor: colors.sky, tension: 0.3 }
                    ]
                },
                options: commonOptions
            });

            this.createChart('pensionsByFundChart', {
                type: 'doughnut',
                data: {
                    labels: ['Lavoratori Autonomi', 'FPLD', 'Dipendenti Pubblici', 'Altre Gestioni'],
                    datasets: [{
                        data: [42269, 40466, 20684, 9563],
                        backgroundColor: [colors.purple, colors.sky, colors.teal, colors.orange],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
            });
        }
        else if (tabId === 'liquidate') {
             this.createChart('liquidatedPensionsTrendChart', {
                type: 'line',
                data: {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        { label: 'Totale', data: [5818, 6030, 5508, 5822], borderColor: colors.teal, tension: 0.3, borderWidth: 3 },
                        { label: 'Femmine', data: [3187, 3231, 2863, 2960], borderColor: colors.pink, tension: 0.3, borderDash: [5, 5] },
                        { label: 'Maschi', data: [2631, 2799, 2645, 2862], borderColor: colors.sky, tension: 0.3, borderDash: [5, 5] }
                    ]
                },
                options: commonOptions
            });

            this.createChart('calculationSystemChart', {
                type: 'bar',
                data: {
                    labels: ['2021', '2022', '2023', '2024'],
                    datasets: [
                        { label: 'Retributivo', data: [1561, 1453, 1301, 1262], backgroundColor: colors.purple, borderRadius: 5 },
                        { label: 'Misto', data: [3228, 3240, 3022, 3275], backgroundColor: colors.sky, borderRadius: 5 },
                        { label: 'Contributivo', data: [613, 821, 746, 793], backgroundColor: colors.teal, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
            });
            
            this.createChart('liquidatedCompositionChart', {
                 type: 'doughnut',
                data: {
                    labels: ['Vecchiaia', 'Anzianità/Anticipate', 'Superstiti', 'Invalidità'],
                    datasets: [{
                        data: [1698, 1559, 1513, 560],
                        backgroundColor: [colors.teal, colors.sky, colors.purple, colors.pink],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
            });
        }
        else if (tabId === 'tempi') {
            this.createChart('performanceByFundChart', {
                type: 'bar',
                data: {
                    labels: ['Fondi Speciali', 'Gestione Pubblica', 'Gestione Privata'],
                    datasets: [{
                        label: '% liquidate entro 30 giorni',
                        data: [98.0, 78.9, 76.9],
                        backgroundColor: [colors.teal, colors.purple, colors.sky],
                        borderRadius: 5
                    }]
                },
                options: { 
                    ...commonOptions, 
                    indexAxis: 'y', 
                    plugins: { legend: { display: false } }, 
                    scales: { 
                        x: { 
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#94a3b8', callback: (v) => v + '%' } 
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    } 
                }
            });

             this.createChart('privateTimingDistributionChart', {
                type: 'doughnut',
                data: {
                    labels: ['Entro 30 gg', '31-60 gg', '61-90 gg', 'Oltre 90 gg'],
                    datasets: [{
                        data: [76.9, 10.9, 4.9, 7.4],
                        backgroundColor: [colors.green, colors.orange, colors.pink, colors.red],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' }}, tooltip: {callbacks: {label: (c) => `${c.label}: ${c.raw}%`}}}}
            });

            this.createChart('benchmarkTimingChart', {
                type: 'bar',
                data: {
                    labels: ['Gestione Privata', 'Gestione Pubblica'],
                    datasets: [
                        { label: 'Pesaro e Urbino', data: [76.9, 78.9], backgroundColor: colors.teal, borderRadius: 5 },
                        { label: 'Italia', data: [78.6, 82.8], backgroundColor: 'rgba(45, 212, 191, 0.4)', borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ticks: { callback: (v) => v + '%' } } } }
            });
        }
        else if (tabId === 'anticipi') {
             this.createChart('anticipiTrendChart', {
                type: 'line',
                data: {
                    labels: ['2022', '2023', '2024'],
                    datasets: [
                        { label: 'Opzione Donna', data: [218, 101, 39], borderColor: colors.pink, tension: 0.3},
                        { label: 'Quota 102/103', data: [25, 127, 100], borderColor: colors.sky, tension: 0.3}
                    ]
                },
                options: commonOptions
            });
            
            this.createChart('anticipiCompositionChart', {
                 type: 'doughnut',
                data: {
                    labels: ['APE Sociale', 'Quota 103', 'Lavoratori Precoci', 'Opzione Donna', 'Lavori Usuranti'],
                    datasets: [{
                        data: [145, 100, 71, 39, 1],
                        backgroundColor: [colors.teal, colors.sky, colors.purple, colors.pink, colors.orange],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
            });

            this.createChart('quoteGenderChart', {
                type: 'bar',
                data: {
                    labels: ['Quota 100 (2021)', 'Quota 102 (2022)', 'Quota 103 (2023)', 'Quota 103 (2024)'],
                    datasets: [
                        { label: 'Femmine', data: [268, 11, 24, 18], backgroundColor: colors.pink, borderRadius: 5 },
                        { label: 'Maschi', data: [425, 14, 103, 82], backgroundColor: colors.sky, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
            });
        }
    }


    // ==========================================
    // 6. PRESTAZIONI ASSISTENZIALI
    // ==========================================
    loadAssistenzaCharts(tabId = 'invalidita') {
        if (tabId === 'invalidita') {
            this.renderAssistenzaInvalidita();
        } else if (tabId === 'sostegno') {
            this.renderAssistenzaSostegno();
        }
    }

    renderAssistenzaInvalidita() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('prestazioniVigentiChart', {
            type: 'bar',
            data: {
                labels: ['Indennità di Accompagnamento', 'Pensioni di Invalidità Civile'],
                datasets: [
                    { label: 'Femmine', data: [9916, 3155], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [5958, 2501], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('liquidazioniTrendChart', {
            type: 'line',
            data: {
                labels: ['2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Totale Prestazioni Liquidate',
                    data: [3906, 3526, 3596, 3540],
                    borderColor: colors.teal,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } } }
        });

        this.createChart('tempiDefinizioneChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino 2023', 'Pesaro e Urbino 2024', 'Regione Marche 2024', 'Italia 2024'],
                datasets: [
                    { label: 'Fase Sanitaria (gg)', data: [123, 142, 97, 125], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'Fase Amministrativa (gg)', data: [19, 20, 18, 16], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
        });
    }

    renderAssistenzaSostegno() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('sostegnoRedditoChart', {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    { label: 'RdC/PdC', data: [2299, 942, 0], backgroundColor: colors.orange, borderRadius: 5 },
                    { label: 'ADI', data: [0, 0, 1737], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'SFL', data: [0, 143, 185], backgroundColor: colors.teal, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
        });

        this.createChart('assegnoUnicoChart', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [{
                    label: 'Nuclei AU a domanda',
                    data: [37537, 38226],
                    backgroundColor: [colors.green, colors.teal],
                    borderRadius: 5
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } } }
        });

        this.createChart('rdcGenderChart', {
            type: 'doughnut',
            data: {
                labels: ['Femmine', 'Maschi'],
                datasets: [{
                    data: [560, 382],
                    backgroundColor: [colors.pink, colors.sky],
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}` } }
                }
            }
        });
    }


    loadRelazioniUtenzaCharts() {
        // Canali di accesso
        const canaliData = dashboardData.relazioni_utenza.informazione_primo_livello;
        this.createChart('chart-canali-accesso', {
            type: 'bar',
            data: {
                labels: ['Accesso in Sede', 'Ricontatto Telefonico', 'Web Meeting'],
                datasets: [{
                    label: '2023',
                    data: [
                        canaliData[2023].accesso_sede,
                        canaliData[2023].ricontatto_telefonico,
                        canaliData[2023].web_meeting
                    ],
                    backgroundColor: this.colors.secondary
                }, {
                    label: '2024',
                    data: [
                        canaliData[2024].accesso_sede,
                        canaliData[2024].ricontatto_telefonico,
                        canaliData[2024].web_meeting
                    ],
                    backgroundColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });

        // Cassetto bidirezionale
        const cassettoData = dashboardData.relazioni_utenza.cassetto_bidirezionale;
        this.createChart('chart-cassetto-bidirezionale', {
            type: 'bar',
            data: {
                labels: ['Aziende 2023', 'Aziende 2024', 'Patronati 2023', 'Patronati 2024'],
                datasets: [{
                    label: 'In Entrata',
                    data: [
                        cassettoData.aziende[2023].in_entrata,
                        cassettoData.aziende[2024].in_entrata,
                        cassettoData.patronati[2023].in_entrata,
                        cassettoData.patronati[2024].in_entrata
                    ],
                    backgroundColor: this.colors.success
                }, {
                    label: 'In Uscita',
                    data: [
                        cassettoData.aziende[2023].in_uscita,
                        cassettoData.aziende[2024].in_uscita,
                        cassettoData.patronati[2023].in_uscita,
                        cassettoData.patronati[2024].in_uscita
                    ],
                    backgroundColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });

        // Flusso PEC
        const pecData = dashboardData.relazioni_utenza.flusso_pec;
        this.createChart('chart-pec', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [{
                    label: 'PEC Inviate',
                    data: [pecData[2023].inviate, pecData[2024].inviate],
                    backgroundColor: this.colors.primary
                }, {
                    label: 'PEC Ricevute',
                    data: [pecData[2023].ricevute, pecData[2024].ricevute],
                    backgroundColor: this.colors.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }

    loadOrganizzazioneCharts() {
        // Personale per area
        const personaleData = dashboardData.organizzazione.personale.per_area;
        this.createChart('chart-personale', {
            type: 'doughnut',
            data: {
                labels: ['Dirigenti', 'Medici/Professionisti', 'Aree Professionali'],
                datasets: [{
                    data: [
                        personaleData.dirigenti.totale,
                        personaleData.medici_professionisti.totale,
                        personaleData.aree_professionali.totale
                    ],
                    backgroundColor: [this.colors.error, this.colors.warning, this.colors.primary],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });

        // Strutture territoriali
        const struttureData = dashboardData.organizzazione.distribuzione_territoriale.strutture;
        this.createChart('chart-strutture', {
            type: 'bar',
            data: {
                labels: ['Comuni', 'Strutture INPS', 'Patronati', 'CAF'],
                datasets: [{
                    label: 'Numero',
                    data: [
                        struttureData.numero_comuni,
                        struttureData.strutture_inps,
                        struttureData.patronati,
                        struttureData.caf
                    ],
                    backgroundColor: [
                        this.colors.secondary,
                        this.colors.primary,
                        this.colors.success,
                        this.colors.accent
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Età media evoluzione
        const etaData = dashboardData.organizzazione.personale.eta_media.evoluzione;
        this.createChart('chart-eta-media', {
            type: 'line',
            data: {
                labels: etaData.map(d => d.anno),
                datasets: [{
                    label: 'Età Media',
                    data: etaData.map(d => d.eta),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50,
                        max: 60,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return value + ' anni'; }
                        },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }


    // ==========================================
    // 9. CONTENZIOSO
    // ==========================================
    loadContenziosoCharts(tabId = 'amministrativo') {
        if (tabId === 'amministrativo') {
            this.renderContenziosoAmministrativo();
        } else if (tabId === 'giudiziario') {
            this.renderContenziosoGiudiziario();
        }
    }

    renderContenziosoAmministrativo() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('adminAppealsFlowChart', {
            type: 'bar',
            data: {
                labels: ['Da Lavorare (Inizio Anno)', 'Pervenuti', 'Definiti', 'Da Lavorare (Fine Anno)'],
                datasets: [{
                    label: 'Numero Ricorsi',
                    data: [25, 514, 500, 40],
                    backgroundColor: [colors.orange, colors.sky, colors.green, colors.red],
                    borderRadius: 5
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } } }
        });
    }

    renderContenziosoGiudiziario() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('judicialOutcomesChart', {
            type: 'bar',
            data: {
                labels: ['Contenzioso Ordinario', 'ATP Invalidità Civile'],
                datasets: [
                    { label: 'Favorevole INPS', data: [67, 210], backgroundColor: colors.green, borderRadius: 5 },
                    { label: 'Favorevole Utenti', data: [38, 344], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Altri Esiti', data: [19, 49], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
        });

        this.createChart('judicialCasesBySubjectChart', {
            type: 'bar',
            data: {
                labels: ['Contributivo', 'Inv. Civile', 'Pensioni', 'Indebiti', 'Altri'],
                datasets: [{
                    label: 'Giudizi Iniziati',
                    data: [71, 41, 25, 19, 14],
                    backgroundColor: [colors.sky, colors.teal, colors.purple, colors.pink, colors.orange],
                    borderRadius: 5
                }]
            },
            options: { ...commonOptions, indexAxis: 'y', plugins: { legend: { display: false } } }
        });

        this.createChart('pendingCasesChart', {
            type: 'bar',
            data: {
                labels: ['Contenzioso Ordinario', 'Contenzioso ATP'],
                datasets: [
                    { label: 'Pendenza Inizio 2024', data: [160, 403], backgroundColor: 'rgba(248, 113, 113, 0.6)', borderRadius: 5 },
                    { label: 'Pendenza Fine 2024', data: [206, 398], backgroundColor: colors.red, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });
    }


    loadPatrimonioCharts() {
        // Valore patrimonio
        const patrimonioData = dashboardData.patrimonio.immobiliare;
        this.createChart('chart-patrimonio-valore', {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [{
                    label: 'Valore Patrimonio (€M)',
                    data: [
                        patrimonioData.valore_euro[2022] / 1000000,
                        patrimonioData.valore_euro[2023] / 1000000,
                        patrimonioData.valore_euro[2024] / 1000000
                    ],
                    backgroundColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return '€' + value + 'M'; }
                        },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#e2e8f0' },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }


    createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas element with id '${canvasId}' not found`);
            return null;
        }

        // Destroy existing chart if it exists
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(canvas, config);
            return this.charts[canvasId];
        } catch (error) {
            console.error(`Error creating chart ${canvasId}:`, error);
            return null;
        }
    }

    // Utility method to destroy all charts (useful for cleanup)
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
