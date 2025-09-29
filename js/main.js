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
        // NASpI evoluzione
        const naspiData = dashboardData.ammortizzatori.naspi.evoluzione;
        this.createChart('chart-naspi', {
            type: 'line',
            data: {
                labels: naspiData.map(d => d.anno),
                datasets: [{
                    label: 'Femmine',
                    data: naspiData.map(d => d.femmine),
                    borderColor: this.colors.accent,
                    backgroundColor: this.colors.accent + '20',
                    tension: 0.4
                }, {
                    label: 'Maschi',
                    data: naspiData.map(d => d.maschi),
                    borderColor: this.colors.secondary,
                    backgroundColor: this.colors.secondary + '20',
                    tension: 0.4
                }, {
                    label: 'Totale',
                    data: naspiData.map(d => d.totale),
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

        // CIG ore utilizzate
        const cigData = dashboardData.ammortizzatori.cig.evoluzione;
        this.createChart('chart-cig', {
            type: 'bar',
            data: {
                labels: cigData.map(d => d.anno),
                datasets: [{
                    label: 'CIGO',
                    data: cigData.map(d => d.cigo),
                    backgroundColor: this.colors.primary
                }, {
                    label: 'CIGS',
                    data: cigData.map(d => d.cigs),
                    backgroundColor: this.colors.secondary
                }, {
                    label: 'FIS',
                    data: cigData.map(d => d.fis),
                    backgroundColor: this.colors.accent
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, ticks: { color: '#e2e8f0' }, grid: { color: '#334155' } },
                    y: { 
                        stacked: true, 
                        beginAtZero: true,
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return (value / 1000000).toFixed(1) + 'M'; }
                        },
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

        // Tempi di erogazione
        const tempiData = dashboardData.ammortizzatori.tempi_erogazione;
        this.createChart('chart-tempi-erogazione', {
            type: 'bar',
            data: {
                labels: ['CIGO 2023', 'CIGO 2024', 'FIS 2023', 'FIS 2024'],
                datasets: [{
                    label: 'Pesaro e Urbino',
                    data: [tempiData.cigo[2023], tempiData.cigo[2024], tempiData.fis[2023], tempiData.fis[2024]],
                    backgroundColor: this.colors.primary
                }, {
                    label: 'Italia',
                    data: [33, tempiData.cigo.confronti_2024.italia, 122, tempiData.fis.confronti_2024.italia],
                    backgroundColor: this.colors.secondary
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
                            callback: function(value) { return value + ' gg'; }
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

    loadPensioniCharts() {
        // Pensioni per gestione
        const pensioniData = dashboardData.pensioni.pensioni_vigenti.per_gestione;
        this.createChart('chart-pensioni-gestione', {
            type: 'doughnut',
            data: {
                labels: ['Fondo Dipendenti', 'Dipendenti Pubblici', 'Lavoratori Autonomi', 'Altre Previdenziali'],
                datasets: [{
                    data: [
                        pensioniData.fondo_lavoratori_dipendenti.totale,
                        pensioniData.dipendenti_pubblici.totale,
                        pensioniData.lavoratori_autonomi.totale,
                        pensioniData.altre_previdenziali.totale
                    ],
                    backgroundColor: this.colors.chart.slice(0, 4),
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

        // Importi medi per genere
        const importiData = dashboardData.pensioni.importi_medi_vigenti.confronto_territori;
        this.createChart('chart-importi-medi', {
            type: 'bar',
            data: {
                labels: ['Fondo Dipendenti', 'Dipendenti Pubblici', 'Lavoratori Autonomi'],
                datasets: [{
                    label: 'Femmine PU',
                    data: [
                        importiData.pesaro_urbino.fondo_dipendenti.femmine,
                        importiData.pesaro_urbino.dipendenti_pubblici.femmine,
                        importiData.pesaro_urbino.lavoratori_autonomi.femmine
                    ],
                    backgroundColor: this.colors.accent
                }, {
                    label: 'Maschi PU',
                    data: [
                        importiData.pesaro_urbino.fondo_dipendenti.maschi,
                        importiData.pesaro_urbino.dipendenti_pubblici.maschi,
                        importiData.pesaro_urbino.lavoratori_autonomi.maschi
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
                        ticks: { 
                            color: '#e2e8f0',
                            callback: function(value) { return '€' + value; }
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

        // Anticipazioni pensionistiche
        const anticipazioniData = dashboardData.pensioni.anticipazioni_pensionistiche;
        this.createChart('chart-anticipazioni', {
            type: 'bar',
            data: {
                labels: ['Opzione Donna 2022', 'Opzione Donna 2023', 'Opzione Donna 2024', 'Quota 103 2023', 'Quota 103 2024', 'APE Sociale 2024'],
                datasets: [{
                    label: 'Domande Accolte',
                    data: [
                        anticipazioniData.opzione_donna[2022],
                        anticipazioniData.opzione_donna[2023],
                        anticipazioniData.opzione_donna[2024],
                        anticipazioniData.quota_103[2023].totale,
                        anticipazioniData.quota_103[2024].totale,
                        anticipazioniData.ape_sociale[2024]
                    ],
                    backgroundColor: [
                        this.colors.accent,
                        this.colors.accent,
                        this.colors.accent,
                        this.colors.primary,
                        this.colors.primary,
                        this.colors.success
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
                        ticks: { 
                            color: '#e2e8f0',
                            maxRotation: 45
                        },
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
    }

    loadAssistenzaCharts() {
        // Invalidità civile
        const invaliditaData = dashboardData.assistenza.invalidita_civile.prestazioni_vigenti;
        this.createChart('chart-invalidita-civile', {
            type: 'doughnut',
            data: {
                labels: ['Indennità Accompagnamento', 'Pensioni Invalidità'],
                datasets: [{
                    data: [
                        invaliditaData.indennita_accompagnamento.totale,
                        invaliditaData.pensioni_invalidita.totale
                    ],
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

        // Sostegno al reddito
        const sostegnoData = dashboardData.assistenza.sostegno_reddito.evoluzione_accolte;
        this.createChart('chart-sostegno-reddito', {
            type: 'bar',
            data: {
                labels: ['RdC/PdC 2022', 'RdC/PdC 2023', 'ADI 2024', 'SFL 2024'],
                datasets: [{
                    label: 'Domande Accolte',
                    data: [
                        sostegnoData[2022].rdc_pdc,
                        sostegnoData[2023].rdc_pdc,
                        sostegnoData[2024].adi,
                        sostegnoData[2024].sfl
                    ],
                    backgroundColor: [
                        this.colors.error,
                        this.colors.error,
                        this.colors.success,
                        this.colors.primary
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

        // Assegno unico
        const assegnoData = dashboardData.assistenza.assegno_unico;
        this.createChart('chart-assegno-unico', {
            type: 'bar',
            data: {
                labels: ['2023', '2024'],
                datasets: [{
                    label: 'Nuclei Beneficiari',
                    data: [
                        assegnoData[2023].nuclei_au_domanda,
                        assegnoData[2024].nuclei_au_domanda
                    ],
                    backgroundColor: this.colors.success
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