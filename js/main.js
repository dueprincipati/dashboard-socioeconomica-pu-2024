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
            chart: ['#f97316', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280']
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });

        // Card zoom functionality
        document.querySelectorAll('.zoomable').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('canvas')) return; // Don't zoom when clicking on charts
                this.zoomCard(card);
            });
        });

        // Zoom overlay close
        document.getElementById('zoom-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'zoom-overlay') {
                this.closeZoom();
            }
        });

        // Escape key to close zoom
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeZoom();
            }
        });

        // Internal tabs for demografia section
        document.querySelectorAll('.tab-btn-demo').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.demoTab;
                this.switchDemografiaTab(tab);
            });
        });

        // Internal tabs for mercato del lavoro section
        document.querySelectorAll('.tab-btn-lavoro').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.lavoroTab;
                this.switchLavoroTab(tab);
            });
        });

        // Internal tabs for contenzioso section
        document.querySelectorAll('.tab-btn-contenzioso').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.contenziosoTab;
                this.switchContenziosoTab(tab);
            });
        });
    }

    switchSection(sectionName) {
        // Update active tab
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
        this.loadSectionCharts(sectionName);
    }

    zoomCard(card) {
        const overlay = document.getElementById('zoom-overlay');
        const zoomedCard = document.getElementById('zoomed-card');
        
        const clonedCard = card.cloneNode(true);
        clonedCard.classList.add('zoomed');
        
        zoomedCard.innerHTML = '';
        zoomedCard.appendChild(clonedCard);
        
        overlay.classList.remove('hidden');
        
        // Re-render chart in zoomed view
        const canvas = clonedCard.querySelector('canvas');
        if (canvas) {
            const chartId = canvas.id;
            const originalChart = this.charts[chartId];
            if (originalChart) {
                // Create new chart with same configuration
                const newChart = new Chart(canvas, originalChart.config);
                // Store reference for cleanup
                this.zoomedChart = newChart;
            }
        }
    }

    closeZoom() {
        const overlay = document.getElementById('zoom-overlay');
        overlay.classList.add('hidden');
        
        // Destroy zoomed chart
        if (this.zoomedChart) {
            this.zoomedChart.destroy();
            this.zoomedChart = null;
        }
    }

    switchDemografiaTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn-demo').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-demo-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.demo-tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        
        const activeTab = document.getElementById(`demo-${tabName}`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.classList.remove('hidden');
        }
    }

    switchLavoroTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn-lavoro').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lavoro-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.lavoro-tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        
        const activeTab = document.getElementById(`lavoro-${tabName}`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.classList.remove('hidden');
        }
    }

    switchContenziosoTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn-contenzioso').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-contenzioso-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.contenzioso-tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        
        const activeTab = document.getElementById(`contenzioso-${tabName}`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.classList.remove('hidden');
        }
    }

    async loadDashboard() {
        try {
            // Hide loading, show content
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');

            // Load initial section
            this.loadSectionCharts(this.currentSection);
            this.updateKPIs();

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateKPIs() {
        const kpis = dashboardData.kpi;
        
        document.getElementById('kpi-popolazione').textContent = kpis.popolazione_totale.toLocaleString('it-IT');
        document.getElementById('kpi-occupazione').textContent = kpis.tasso_occupazione + '%';
        document.getElementById('kpi-pensionati').textContent = kpis.pensionati_totale.toLocaleString('it-IT');
        document.getElementById('kpi-entrate').textContent = kpis.crescita_entrate;
    }

    loadSectionCharts(sectionName) {
        switch (sectionName) {
            case 'demografia':
                this.loadDemografiaCharts();
                break;
            case 'mercato_lavoro':
                this.loadMercatoLavoroCharts();
                break;
            case 'entrate_vigilanza':
                this.loadEntrateVigilanzaCharts();
                break;
            case 'ammortizzatori':
                this.loadAmmortizzatoriCharts();
                break;
            case 'pensioni':
                this.loadPensioniCharts();
                break;
            case 'assistenza':
                this.loadAssistenzaCharts();
                break;
            case 'relazioni_utenza':
                this.loadRelazioniUtenzaCharts();
                break;
            case 'organizzazione':
                this.loadOrganizzazioneCharts();
                break;
            case 'contenzioso':
                this.loadContenziosoCharts();
                break;
            case 'patrimonio':
                this.loadPatrimonioCharts();
                break;
        }
    }

    loadDemografiaCharts() {
        // Popolazione per genere e età
        const popolazioneData = dashboardData.demografia.popolazione;
        this.createChart('chart-popolazione', {
            type: 'doughnut',
            data: {
                labels: ['Femmine', 'Maschi'],
                datasets: [{
                    data: [popolazioneData.femmine, popolazioneData.maschi],
                    backgroundColor: [this.colors.accent, this.colors.secondary],
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

        // Saldo naturale
        const saldoData = dashboardData.demografia.saldo_naturale.serie_storica;
        this.createChart('chart-saldo-naturale', {
            type: 'line',
            data: {
                labels: saldoData.map(d => d.anno),
                datasets: [{
                    label: 'Saldo Naturale',
                    data: saldoData.map(d => d.saldo),
                    borderColor: this.colors.error,
                    backgroundColor: this.colors.error + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
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

        // Longevità
        const longevitaData = dashboardData.demografia.longevita.data;
        this.createChart('chart-longevita', {
            type: 'bar',
            data: {
                labels: ['2013', '2023'],
                datasets: [{
                    label: 'Femmine',
                    data: [longevitaData[2013].alla_nascita.femmine, longevitaData[2023].alla_nascita.femmine],
                    backgroundColor: this.colors.accent
                }, {
                    label: 'Maschi',
                    data: [longevitaData[2013].alla_nascita.maschi, longevitaData[2023].alla_nascita.maschi],
                    backgroundColor: this.colors.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 75,
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

        // Flussi migratori
        const flussiData = dashboardData.demografia.flussi_migratori.saldo_demografico.serie_storica;
        this.createChart('chart-flussi-migratori', {
            type: 'line',
            data: {
                labels: flussiData.map(d => d.anno),
                datasets: [{
                    label: 'Saldo Migratorio',
                    data: flussiData.map(d => d.saldo_migratorio),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4
                }, {
                    label: 'Saldo Naturale',
                    data: flussiData.map(d => d.saldo_naturale),
                    borderColor: this.colors.error,
                    backgroundColor: this.colors.error + '20',
                    tension: 0.4
                }, {
                    label: 'Saldo Demografico',
                    data: flussiData.map(d => d.saldo_demografico),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
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

    loadMercatoLavoroCharts() {
        // Lavoratori per categoria
        const lavoratoriData = dashboardData.mercato_lavoro.lavoratori;
        this.createChart('chart-lavoratori-categoria', {
            type: 'pie',
            data: {
                labels: ['Dipendenti', 'Artigiani', 'Commercianti', 'Agricoli Autonomi', 'Gestione Separata'],
                datasets: [{
                    data: [
                        lavoratoriData.dipendenti.totale,
                        lavoratoriData.autonomi.artigiani,
                        lavoratoriData.autonomi.commercianti,
                        lavoratoriData.autonomi.agricoli,
                        lavoratoriData.gestione_separata
                    ],
                    backgroundColor: this.colors.chart.slice(0, 5),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0', fontSize: 10 }
                    }
                }
            }
        });

        // Tasso di occupazione per fascia d'età
        const occupazioneData = dashboardData.mercato_lavoro.indicatori_occupazione.tasso_occupazione;
        this.createChart('chart-tasso-occupazione', {
            type: 'bar',
            data: {
                labels: ['15-24', '25-34', '35-49', '50-64'],
                datasets: [{
                    label: 'Femmine',
                    data: [
                        occupazioneData.femmine['15-24'],
                        occupazioneData.femmine['25-34'],
                        occupazioneData.femmine['35-49'],
                        occupazioneData.femmine['50-64']
                    ],
                    backgroundColor: this.colors.accent
                }, {
                    label: 'Maschi',
                    data: [
                        occupazioneData.maschi['15-24'],
                        occupazioneData.maschi['25-34'],
                        occupazioneData.maschi['35-49'],
                        occupazioneData.maschi['50-64']
                    ],
                    backgroundColor: this.colors.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return value + '%'; }
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

        // Assunzioni vs Cessazioni
        const assunzioniData = dashboardData.mercato_lavoro.assunzioni.confronto;
        const cessazioniData = dashboardData.mercato_lavoro.cessazioni.confronto;
        this.createChart('chart-assunzioni-cessazioni', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [{
                    label: 'Assunzioni',
                    data: [assunzioniData[2023].totale, assunzioniData[2024].totale],
                    backgroundColor: this.colors.success
                }, {
                    label: 'Cessazioni',
                    data: [cessazioniData[2023].totale, cessazioniData[2024].totale],
                    backgroundColor: this.colors.error
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

        // Retribuzioni per settore
        const retribuzioniData = dashboardData.mercato_lavoro.retribuzioni.settore_privato;
        const settori = ['manifatturiero', 'costruzioni', 'commercio', 'turismo_ristorazione', 'attivita_finanziarie'];
        const settoriLabels = ['Manifatturiero', 'Costruzioni', 'Commercio', 'Turismo/Ristorazione', 'Attività Finanziarie'];
        
        this.createChart('chart-retribuzioni', {
            type: 'bar',
            data: {
                labels: settoriLabels,
                datasets: [{
                    label: 'Femmine',
                    data: settori.map(s => retribuzioniData[s].femmine),
                    backgroundColor: this.colors.accent
                }, {
                    label: 'Maschi',
                    data: settori.map(s => retribuzioniData[s].maschi),
                    backgroundColor: this.colors.secondary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return '€' + value; }
                        },
                        grid: { color: '#334155' }
                    },
                    y: {
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

    loadAmmortizzatoriCharts() {
        // Setup tabs functionality
        this.setupAmmortizzatoriTabs();

        // Chart colors
        const colors = {
            pink: '#ec4899',
            sky: '#06b6d4',
            purple: '#8b5cf6',
            teal: '#14b8a6',
            orange: '#f97316',
            green: '#10b981',
            red: '#ef4444'
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

        const years = ['2022', '2023', '2024'];
        
        // --- CESSAZIONE RAPPORTO ---
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
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' }}, 
                    tooltip: {callbacks: {label: (c) => `${c.label}: ${c.raw}%`}}
                }
            }
        });

        // --- SOSPENSIONE RAPPORTO ---
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

    setupAmmortizzatoriTabs() {
        const tabs = document.querySelectorAll('#ammortizzatori .tab-btn');
        const contents = document.querySelectorAll('#ammortizzatori .tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }

    loadPensioniCharts() {
        // Setup tabs functionality
        this.setupPensioniTabs();

        // Chart colors
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

        // Render all charts for pensioni
        this.renderPensioniChartsForTab('vigenti');
    }

    setupPensioniTabs() {
        const tabs = document.querySelectorAll('#pensioni .tab-btn');
        const contents = document.querySelectorAll('#pensioni .tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const activeContent = document.getElementById(tab.dataset.tab);
                activeContent.classList.add('active');
                
                // Render charts only when tab is activated
                this.renderPensioniChartsForTab(activeContent.id);
            });
        });
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

    loadAssistenzaCharts() {
        // Setup tabs functionality
        this.setupAssistenzaTabs();

        // Chart colors
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

        // --- INVALIDITÀ CIVILE ---
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
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: 'Tempo Medio 2023 (gg)', data: [142, 118, 144], backgroundColor: 'rgba(192, 132, 252, 0.6)', borderRadius: 5 },
                    { label: 'Tempo Medio 2024 (gg)', data: [162, 115, 140], backgroundColor: colors.purple, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        // --- SOSTEGNO AL REDDITO ---
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
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}` } } } }
        });
    }

    setupAssistenzaTabs() {
        const tabs = document.querySelectorAll('#assistenza .tab-btn');
        const contents = document.querySelectorAll('#assistenza .tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
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

    loadContenziosoCharts() {
        // Contenzioso amministrativo
        this.createChart('chart-contenzioso-amm', {
            type: 'doughnut',
            data: {
                labels: ['Ricorsi Pervenuti 2024', 'Ricorsi Pervenuti 2023'],
                datasets: [{
                    data: [514, 458],
                    backgroundColor: [this.colors.primary, this.colors.secondary],
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

        // Contenzioso giudiziario per materia (esempio con dati principali)
        this.createChart('chart-contenzioso-giud', {
            type: 'bar',
            data: {
                labels: ['Contributivo', 'Pensionistico', 'Invalidità Civile'],
                datasets: [{
                    label: 'Favorevole INPS (%)',
                    data: [52.4, 61.5, 64.5],
                    backgroundColor: this.colors.success
                }, {
                    label: 'Favorevole Utenti (%)',
                    data: [16.7, 26.9, 35.5],
                    backgroundColor: this.colors.error
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return value + '%'; }
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

        // ATP Invalidità Civile
        this.createChart('chart-atp-invalidita', {
            type: 'doughnut',
            data: {
                labels: ['Favorevole INPS', 'Favorevole Utenti', 'Altri Esiti'],
                datasets: [{
                    data: [33.2, 58.2, 8.6],
                    backgroundColor: [this.colors.success, this.colors.error, this.colors.warning],
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
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Create new chart
        this.charts[canvasId] = new Chart(ctx, config);
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