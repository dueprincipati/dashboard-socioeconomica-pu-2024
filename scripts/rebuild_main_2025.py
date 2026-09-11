# -*- coding: utf-8 -*-
import sys

js_code = """// Dashboard Socio-Economica - Provincia di Pesaro Urbino 2025
// Gestione dell'interattività, navigazione per sezioni e tab, e rendering Chart.js

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
            Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
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
                    labels: { color: '#cbd5e1', boxWidth: 14, padding: 12 }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
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
        // Tab navigation principale (sezioni)
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Zoomable cards
        document.querySelectorAll('.zoomable, .card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('canvas, .filter-btn, button, .tab-btn, a, input, select')) return;
                this.zoomCard(card);
            });
        });

        const overlay = document.getElementById('zoom-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target.id === 'zoom-overlay') this.closeZoom();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeZoom();
        });
    }

    setupInternalTabs() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const parentSection = btn.closest('section') || btn.closest('.container') || document;
                if (!parentSection) return;

                const sectionTabs = parentSection.querySelectorAll('.tab-btn');
                const sectionContents = parentSection.querySelectorAll('.tab-content');
                const targetTabId = btn.dataset.tab;

                sectionTabs.forEach(t => t.classList.remove('active'));
                sectionContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const targetContent = parentSection.querySelector('#' + targetTabId) || document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    const secId = parentSection.id || this.currentSection;
                    
                    requestAnimationFrame(() => {
                        this.renderChartsForTab(secId, targetTabId);
                        setTimeout(() => this.resizeTabCharts(targetTabId), 50);
                        setTimeout(() => this.resizeTabCharts(targetTabId), 200);
                    });
                }
            });
        });
    }

    switchSection(sectionName) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeNavBtn = document.querySelector('[data-section="' + sectionName + '"]');
        if (activeNavBtn) activeNavBtn.classList.add('active');

        document.querySelectorAll('.section-content, .dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionName);
        if (activeSection) {
            activeSection.classList.add('active');
            this.currentSection = sectionName;

            requestAnimationFrame(() => {
                try {
                    this.loadSectionCharts(sectionName);
                } catch (err) {
                    console.error('Error loading section ' + sectionName + ':', err);
                }
                setTimeout(() => this.resizeSectionCharts(sectionName), 60);
                setTimeout(() => this.resizeSectionCharts(sectionName), 250);
            });
        }
    }

    zoomCard(card) {
        const overlay = document.getElementById('zoom-overlay');
        const zoomedCard = document.getElementById('zoomed-card');
        if (!overlay || !zoomedCard) return;

        const clonedCard = card.cloneNode(true);
        clonedCard.classList.remove('zoomable');
        clonedCard.classList.add('zoomed');

        zoomedCard.innerHTML = '';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-3 right-4 text-slate-400 hover:text-white text-3xl font-bold p-1 z-20 transition-colors leading-none';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Chiudi zoom');
        closeBtn.onclick = () => this.closeZoom();
        zoomedCard.appendChild(closeBtn);

        zoomedCard.appendChild(clonedCard);
        overlay.classList.remove('hidden');

        const canvases = clonedCard.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const chartId = canvas.id;
            const originalChart = this.charts[chartId];
            if (originalChart && originalChart.config) {
                try {
                    new Chart(canvas, {
                        type: originalChart.config.type,
                        data: JSON.parse(JSON.stringify(originalChart.config.data)),
                        options: {
                            ...originalChart.config.options,
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                } catch (err) {
                    console.warn('Could not render zoomed chart for ' + chartId + ':', err);
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
        if (typeof dashboardData2025 === 'undefined' || !dashboardData2025.kpi) return;
        const kpis = dashboardData2025.kpi;
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
                case 'demografia':
                    this.loadDemografiaCharts('struttura');
                    break;
                case 'mercato_lavoro':
                    this.loadMercatoLavoroCharts('occupazione');
                    break;
                case 'entrate_vigilanza':
                    this.loadEntrateVigilanzaCharts();
                    break;
                case 'ammortizzatori':
                    this.loadAmmortizzatoriCharts('cessazione');
                    break;
                case 'pensioni':
                    this.loadPensioniCharts('vigenti');
                    break;
                case 'assistenza':
                    this.loadAssistenzaCharts('invalidita');
                    break;
                case 'contenzioso':
                    this.loadContenziosoCharts('amministrativo');
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
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
                if (typeof chart.update === 'function') chart.update('none');
            }
        });
    }

    resizeSectionCharts(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        section.querySelectorAll('canvas').forEach(canvas => {
            const chart = this.charts[canvas.id];
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
                if (typeof chart.update === 'function') chart.update('none');
            }
        });
    }

    createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            return null;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(canvas, config);
            return this.charts[canvasId];
        } catch (error) {
            console.error('Error creating chart ' + canvasId + ':', error);
            return null;
        }
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
                    { label: '0-14 anni', data: [11.5, 11.3, 11.9], backgroundColor: colors.teal, borderRadius: 5 },
                    { label: '15-64 anni', data: [62.8, 62.1, 63.4], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: '65 e oltre', data: [25.7, 26.6, 24.7], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('genderDistributionChart', {
            type: 'doughnut',
            data: {
                labels: ['Femmine', 'Maschi'],
                datasets: [{
                    data: [50.7, 49.3],
                    backgroundColor: [colors.pink, colors.sky],
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    tooltip: { callbacks: { label: (c) => c.label + ': ' + c.raw + '%' } }
                }
            }
        });

        this.createChart('lifeExpectancyChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: 'Femmine', data: [86.4, 86.2, 85.6], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [82.8, 82.4, 81.5], backgroundColor: colors.sky, borderRadius: 5 }
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
        const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

        this.createChart('naturalBalanceChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { type: 'line', label: 'Saldo Naturale', data: [-728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883, -2009], borderColor: colors.purple, tension: 0.3, yAxisID: 'y1' },
                    { label: 'Nascite', data: [2931, 2840, 2717, 2528, 2378, 2268, 2161, 2182, 2122, 2036, 1884], backgroundColor: colors.green, borderRadius: 5, yAxisID: 'y' },
                    { label: 'Decessi', data: [3659, 3977, 3806, 3898, 3792, 3934, 4916, 4200, 4392, 3919, 3893], backgroundColor: colors.red, borderRadius: 5, yAxisID: 'y' }
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
                    { label: 'Immigrati', data: [1774, 1437, 1629, 1700, 1894, 1843, 1618, 1630, 1626, 1758, 1924], borderColor: colors.green, tension: 0.3 },
                    { label: 'Emigrati', data: [538, 635, 702, 683, 790, 665, 748, 564, 642, 653, 817], borderColor: colors.orange, tension: 0.3 }
                ]
            },
            options: commonOptions
        });

        this.createChart('demographicBalanceChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { label: 'Saldo Naturale', data: [-728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883, -2009], backgroundColor: colors.red, borderRadius: 5 },
                    { label: 'Saldo Migratorio', data: [1236, 802, 927, 1017, 1104, 1178, 870, 1066, 984, 1105, 1107], backgroundColor: colors.green, borderRadius: 5 },
                    { type: 'line', label: 'Saldo Demografico Totale', data: [508, -335, -162, -353, -310, -488, -1885, -952, -1286, -778, -902], borderColor: colors.purple, tension: 0.3, pointBackgroundColor: colors.purple, pointRadius: 4 }
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
                labels: ['2023', '2024', '2025'],
                datasets: [
                    { label: 'Tasso Occupazione PU', data: [69.2, 70.1, 68.7], borderColor: colors.green, tension: 0.3, borderWidth: 3 },
                    { label: 'Tasso Disoccupazione PU', data: [5.2, 3.7, 5.4], borderColor: colors.orange, tension: 0.3, borderWidth: 3 },
                    { label: 'Tasso Occupazione Italia', data: [61.5, 62.2, 62.5], borderColor: colors.green, tension: 0.3, borderDash: [5, 5], borderWidth: 1.5 },
                    { label: 'Tasso Disoccupazione Italia', data: [7.7, 6.5, 6.2], borderColor: colors.orange, tension: 0.3, borderDash: [5, 5], borderWidth: 1.5 }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.raw + '%' } }
                }
            }
        });

        this.createChart('workersCompositionChart', {
            type: 'bar',
            data: {
                labels: ['Dipendenti', 'Commercianti', 'Artigiani', 'Gest. Separata', 'Domestici', 'Agricoli Autonomi'],
                datasets: [{
                    label: 'Numero Lavoratori (2025)',
                    data: [140641, 12004, 11235, 7655, 4776, 2694],
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
                    { label: 'Femmine (€/gg)', data: [82.7, 70.4, 52.8, 61.1, 71.5], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi (€/gg)', data: [107.9, 91.5, 61.5, 77.9, 93.1], backgroundColor: colors.sky, borderRadius: 5 }
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
                    { label: 'Assunzioni 2024', data: [7727, 18388, 7595, 5043, 12153], backgroundColor: 'rgba(148, 163, 184, 0.7)', borderRadius: 5 },
                    { label: 'Assunzioni 2025', data: [7417, 17611, 7231, 5119, 12331], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('hiresTerminationsBalanceChart', {
            type: 'bar',
            data: {
                labels: ['T. Indeterminato', 'T. Determinato', 'Stagionale', 'Somministrazione', 'Intermittente'],
                datasets: [
                    { label: 'Assunzioni 2025', data: [7417, 17611, 7231, 5119, 12331], backgroundColor: colors.green, borderRadius: 5 },
                    { label: 'Cessazioni 2025', data: [11443, 13375, 7257, 5009, 12189], backgroundColor: colors.red, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('partTimeIncidenceChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Marche', 'Italia'],
                datasets: [
                    { label: 'Donne (%)', data: [48.4, 45.8, 44.5], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Uomini (%)', data: [12.1, 13.2, 15.8], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.raw + '%' } }
                }
            }
        });
    }

    // ==========================================
    // 3. ENTRATE E VIGILANZA
    // ==========================================
    loadEntrateVigilanzaCharts() {
        const ev = dashboardData2025.entrate_vigilanza;
        const entrateList = ev.entrate_contributive?.serie_storica || ev.entrate_contributive_list || ev.entrate_contributive || [];

        this.createChart('chart-entrate-contributive', {
            type: 'line',
            data: {
                labels: entrateList.map(d => d.anno),
                datasets: [{
                    label: 'Entrate Contributive (€M)',
                    data: entrateList.map(d => (d.importo / 1000000).toFixed(1)),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 550,
                        ticks: { color: '#e2e8f0', callback: (v) => '€' + v + 'M' },
                        grid: { color: '#334155' }
                    },
                    x: { ticks: { color: '#e2e8f0' }, grid: { color: '#334155' } }
                }
            }
        });

        const vig = ev.vigilanza_ispettiva?.confronto || ev.vigilanza_ispettiva || {};
        const v24 = vig['2024'] || {};
        const v25 = vig['2025'] || {};

        this.createChart('chart-vigilanza-ispettiva', {
            type: 'bar',
            data: {
                labels: ['Ispezioni', 'Aziende Irregolari', 'Lavoratori', 'Accertato Contributi (K€)', 'Accertato Sanzioni (K€)'],
                datasets: [{
                    label: '2024',
                    data: [
                        v24.ispezioni || v24.numero_ispezioni || 185,
                        v24.aziende_irregolari || 153,
                        v24.lavoratori || 2205,
                        Math.round((v24.accertato_contributi || 5828964) / 1000),
                        Math.round((v24.accertato_sanzioni || 3402959) / 1000)
                    ],
                    backgroundColor: 'rgba(148, 163, 184, 0.7)'
                }, {
                    label: '2025',
                    data: [
                        v25.ispezioni || v25.numero_ispezioni || 153,
                        v25.aziende_irregolari || 134,
                        v25.lavoratori || 2572,
                        Math.round((v25.accertato_contributi || 6214580) / 1000),
                        Math.round((v25.accertato_sanzioni || 3712900) / 1000)
                    ],
                    backgroundColor: this.colors.primary
                }]
            },
            options: this.getCommonOptions()
        });

        const durcList = ev.durc?.evoluzione || ev.durc_list || ev.durc || [];
        this.createChart('chart-durc', {
            type: 'line',
            data: {
                labels: durcList.map(d => d.anno),
                datasets: [{
                    label: 'DURC Regolari',
                    data: durcList.map(d => d.regolari),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: '% DURC Irregolari',
                    data: durcList.map(d => d.perc_irregolari),
                    borderColor: this.colors.error,
                    backgroundColor: this.colors.error + '20',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        ticks: { color: '#10b981' }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#ef4444', callback: (v) => v + '%' }
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
        const years = ['2022', '2023', '2024', '2025'];

        this.createChart('naspiGenderChart', {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    { label: 'Femmine', data: [8934, 8900, 9379, 9352], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [5806, 6367, 7016, 7018], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('benefitsTypeChart', {
            type: 'bar',
            data: {
                labels: ['NASpI', 'Disoccupazione Agricola', 'DIS-COLL'],
                datasets: [
                    { label: '2024', data: [19543, 937, 110], backgroundColor: 'rgba(148, 163, 184, 0.7)', borderRadius: 5 },
                    { label: '2025', data: [20380, 880, 135], backgroundColor: colors.purple, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('naspiTimingChart', {
            type: 'doughnut',
            data: {
                labels: ['Entro 15 gg', 'Oltre 15 gg'],
                datasets: [{
                    data: [89.3, 10.7],
                    backgroundColor: [colors.green, colors.red],
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    tooltip: { callbacks: { label: (c) => c.label + ': ' + c.raw + '%' } }
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
                labels: ['2022', '2023', '2024', '2025'],
                datasets: [
                    { label: 'CIGO', data: [365795, 720750, 681287, 710200], borderColor: colors.sky, tension: 0.3 },
                    { label: 'CIGS', data: [126111, 97009, 437841, 412500], borderColor: colors.pink, tension: 0.3 },
                    { label: 'Fondi Solidarietà', data: [90184, 17793, 4034, 5200], borderColor: colors.green, tension: 0.3 }
                ]
            },
            options: commonOptions
        });

        this.createChart('cigBeneficiariesChart', {
            type: 'bar',
            data: {
                labels: ['2024', '2025'],
                datasets: [
                    { label: 'CIGO', data: [7293, 7420], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'CIGS', data: [1987, 1860], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Fondi Solidarietà', data: [72, 85], backgroundColor: colors.green, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('erogationTimingChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Regione Marche', 'Italia'],
                datasets: [
                    { label: 'CIGO (gg)', data: [7, 10, 18], backgroundColor: colors.purple, borderRadius: 5 },
                    { label: 'FIS (gg)', data: [29, 35, 65], backgroundColor: colors.teal, borderRadius: 5 }
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
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        if (tabId === 'vigenti') {
            this.createChart('pensionersByTypeChart', {
                type: 'bar',
                data: {
                    labels: ['Femmine', 'Maschi'],
                    datasets: [
                        { label: 'Pensionati IVS', data: [46120, 44094], backgroundColor: colors.teal, borderRadius: 5 },
                        { label: 'Beneficiari Assistenziali', data: [15129, 8903], backgroundColor: colors.purple, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
            });

            this.createChart('pensionsByFundChart', {
                type: 'doughnut',
                data: {
                    labels: ['Lavoratori Autonomi', 'FPLD', 'Dipendenti Pubblici', 'Altre Gestioni'],
                    datasets: [{
                        data: [42080, 40170, 21150, 9814],
                        backgroundColor: [colors.purple, colors.sky, colors.teal, colors.orange],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
            });

            this.createChart('averageAmountChart', {
                type: 'bar',
                data: {
                    labels: ['FPLD', 'Dip. Pubblici', 'Lavoratori Autonomi'],
                    datasets: [
                        { label: 'Femmine (€)', data: [918.0, 1890.0, 762.0], backgroundColor: colors.pink, borderRadius: 5 },
                        { label: 'Maschi (€)', data: [1810.0, 2535.0, 1345.0], backgroundColor: colors.sky, borderRadius: 5 }
                    ]
                },
                options: commonOptions
            });
        }
        else if (tabId === 'liquidate') {
            this.createChart('liquidatedPensionsTrendChart', {
                type: 'line',
                data: {
                    labels: ['2022', '2023', '2024', '2025'],
                    datasets: [
                        { label: 'Totale', data: [6030, 5508, 5822, 5751], borderColor: colors.teal, tension: 0.3, borderWidth: 3 },
                        { label: 'Femmine', data: [3231, 2863, 2960, 3109], borderColor: colors.pink, tension: 0.3, borderDash: [5, 5] },
                        { label: 'Maschi', data: [2799, 2645, 2862, 2642], borderColor: colors.sky, tension: 0.3, borderDash: [5, 5] }
                    ]
                },
                options: commonOptions
            });

            this.createChart('liquidatedCompositionChart', {
                type: 'doughnut',
                data: {
                    labels: ['Vecchiaia', 'Anzianità/Anticipate', 'Superstiti', 'Invalidità'],
                    datasets: [{
                        data: [1720, 1513, 1528, 990],
                        backgroundColor: [colors.teal, colors.sky, colors.purple, colors.pink],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }
            });

            this.createChart('calculationSystemChart', {
                type: 'bar',
                data: {
                    labels: ['2022', '2023', '2024', '2025'],
                    datasets: [
                        { label: 'Retributivo', data: [1453, 1301, 1262, 1185], backgroundColor: colors.purple, borderRadius: 5 },
                        { label: 'Misto', data: [3240, 3022, 3275, 3210], backgroundColor: colors.sky, borderRadius: 5 },
                        { label: 'Contributivo', data: [821, 746, 793, 845], backgroundColor: colors.teal, borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
            });
        }
        else if (tabId === 'tempi') {
            this.createChart('performanceByFundChart', {
                type: 'bar',
                data: {
                    labels: ['Fondi Speciali', 'Gestione Pubblica', 'Gestione Privata'],
                    datasets: [{
                        label: '% liquidate entro 30 giorni',
                        data: [94.9, 83.7, 82.7],
                        backgroundColor: [colors.teal, colors.purple, colors.sky],
                        borderRadius: 5
                    }]
                },
                options: { 
                    ...commonOptions, 
                    indexAxis: 'y', 
                    plugins: { legend: { display: false } }, 
                    scales: { 
                        x: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8', callback: (v) => v + '%' } },
                        y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    } 
                }
            });

            this.createChart('privateTimingDistributionChart', {
                type: 'doughnut',
                data: {
                    labels: ['Entro 30 gg', '31-60 gg', '61-90 gg', 'Oltre 90 gg'],
                    datasets: [{
                        data: [82.7, 9.1, 3.5, 4.7],
                        backgroundColor: [colors.green, colors.orange, colors.pink, colors.red],
                        borderColor: '#1e293b'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } }, tooltip: { callbacks: { label: (c) => c.label + ': ' + c.raw + '%' } } } }
            });

            this.createChart('benchmarkTimingChart', {
                type: 'bar',
                data: {
                    labels: ['Gestione Privata', 'Gestione Pubblica'],
                    datasets: [
                        { label: 'Pesaro e Urbino', data: [82.7, 83.7], backgroundColor: colors.teal, borderRadius: 5 },
                        { label: 'Italia', data: [80.1, 83.9], backgroundColor: 'rgba(45, 212, 191, 0.4)', borderRadius: 5 }
                    ]
                },
                options: { ...commonOptions, scales: { ...commonOptions.scales, y: { max: 100, ticks: { callback: (v) => v + '%' } } } }
            });
        }
        else if (tabId === 'anticipi') {
            this.createChart('anticipiTrendChart', {
                type: 'line',
                data: {
                    labels: ['2022', '2023', '2024', '2025'],
                    datasets: [
                        { label: 'Opzione Donna', data: [218, 101, 39, 26], borderColor: colors.pink, tension: 0.3 },
                        { label: 'Quota 102/103', data: [25, 127, 100, 39], borderColor: colors.sky, tension: 0.3 }
                    ]
                },
                options: commonOptions
            });

            this.createChart('quoteGenderChart', {
                type: 'bar',
                data: {
                    labels: ['Quota 102 (2022)', 'Quota 103 (2023)', 'Quota 103 (2024)', 'Quota 103 (2025)'],
                    datasets: [
                        { label: 'Femmine', data: [11, 24, 18, 9], backgroundColor: colors.pink, borderRadius: 5 },
                        { label: 'Maschi', data: [14, 103, 82, 30], backgroundColor: colors.sky, borderRadius: 5 }
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
                    { label: 'Femmine', data: [10239, 3280], backgroundColor: colors.pink, borderRadius: 5 },
                    { label: 'Maschi', data: [6285, 2590], backgroundColor: colors.sky, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });

        this.createChart('liquidazioniTrendChart', {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Totale Prestazioni Liquidate',
                    data: [3526, 3596, 3540, 4249],
                    borderColor: colors.teal,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 5
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } } }
        });

        this.createChart('tempiDefinizioneChart', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino 2024', 'Pesaro e Urbino 2025', 'Regione Marche 2025', 'Italia 2025'],
                datasets: [
                    { label: 'Fase Sanitaria (gg)', data: [142, 139, 95, 120], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'Fase Amministrativa (gg)', data: [20, 18, 17, 15], backgroundColor: colors.orange, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
        });

        this.createChart('fasceLiquidazioneChart', {
            type: 'bar',
            data: {
                labels: ['<15gg', '16-30gg', '31-60gg', '61-90gg', '91-120gg', '121-180gg', '181-360gg', '>360gg'],
                datasets: [
                    { label: 'Pesaro Urbino (%)', data: [1.5, 1.4, 6.8, 10.4, 10.4, 19.8, 31.9, 18.0], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'Marche (%)', data: [4.9, 6.1, 12.3, 12.9, 11.6, 18.7, 22.9, 10.7], backgroundColor: colors.teal, borderRadius: 5 },
                    { label: 'Italia (%)', data: [6.0, 5.0, 11.2, 10.0, 9.8, 13.4, 20.2, 24.5], backgroundColor: 'rgba(148, 163, 184, 0.5)', borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, plugins: { ...commonOptions.plugins, tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.raw + '%' } } } }
        });
    }

    renderAssistenzaSostegno() {
        const colors = this.colors;
        const commonOptions = this.getCommonOptions();

        this.createChart('sostegnoRedditoChart', {
            type: 'bar',
            data: {
                labels: ['2022', '2023', '2024', '2025'],
                datasets: [
                    { label: 'RdC/PdC', data: [2299, 942, 0, 0], backgroundColor: colors.orange, borderRadius: 5 },
                    { label: 'ADI', data: [0, 0, 1737, 1557], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'SFL', data: [0, 143, 185, 149], backgroundColor: colors.teal, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { stacked: true } } }
        });

        this.createChart('assegnoUnicoChart', {
            type: 'bar',
            data: {
                labels: ['2024', '2025'],
                datasets: [{
                    label: 'Nuclei AU a domanda',
                    data: [38226, 37788],
                    backgroundColor: [colors.green, colors.teal],
                    borderRadius: 5
                }]
            },
            options: { ...commonOptions, plugins: { legend: { display: false } } }
        });
    }

    // ==========================================
    // 7. CONTENZIOSO
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
                labels: ['Giacenza Iniziale', 'Pervenuti 2025', 'Definiti/Deliberati', 'Giacenza Finale'],
                datasets: [{
                    label: 'Numero Ricorsi',
                    data: [40, 408, 410, 38],
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
                labels: ['Contenzioso Ordinario (145 def.)', 'ATP Invalidità Civile (729 def.)'],
                datasets: [
                    { label: 'Favorevole INPS (%)', data: [67.3, 39.6], backgroundColor: colors.green, borderRadius: 5 },
                    { label: 'Favorevole Utenti (%)', data: [32.7, 51.6], backgroundColor: colors.pink, borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, scales: { x: { stacked: true }, y: { max: 100, ticks: { callback: (v) => v + '%' } } } }
        });

        this.createChart('judicialCasesBySubjectChart', {
            type: 'bar',
            data: {
                labels: ['Contributivo', 'Inv. Civile Legale', 'Pensioni', 'Indebiti', 'Altri'],
                datasets: [{
                    label: 'Giudizi Iniziati 2025',
                    data: [47, 38, 24, 15, 14],
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
                    { label: 'Pendenza Inizio 2025', data: [114, 482], backgroundColor: 'rgba(248, 113, 113, 0.6)', borderRadius: 5 },
                    { label: 'Pendenza Fine 2025', data: [109, 520], backgroundColor: colors.red, borderRadius: 5 }
                ]
            },
            options: commonOptions
        });
    }

    // ==========================================
    // 8. RELAZIONI CON L'UTENZA
    // ==========================================
    loadRelazioniUtenzaCharts() {
        const ru = dashboardData2025.relazioni_utenza;
        const c1 = ru.informazione_primo_livello || {};
        const c1_24 = c1['2024'] || { accesso_sede: 8652, ricontatto_telefonico: 5214, web_meeting: 63 };
        const c1_25 = c1['2025'] || { accesso_sede: 5788, ricontatto_telefonico: 4751, web_meeting: 110 };

        this.createChart('chart-canali-accesso', {
            type: 'bar',
            data: {
                labels: ['Accesso in Sede', 'Ricontatto Telefonico', 'Web Meeting'],
                datasets: [{
                    label: '2024',
                    data: [c1_24.accesso_sede, c1_24.ricontatto_telefonico, c1_24.web_meeting],
                    backgroundColor: 'rgba(148, 163, 184, 0.7)'
                }, {
                    label: '2025',
                    data: [c1_25.accesso_sede, c1_25.ricontatto_telefonico, c1_25.web_meeting],
                    backgroundColor: this.colors.primary
                }]
            },
            options: this.getCommonOptions()
        });

        const cb = ru.cassetto_bidirezionale || {};
        const az = cb.aziende_2025 || cb.aziende?.['2025'] || { in_entrata: 18478, in_uscita: 22658 };
        const pat = cb.patronati_2025 || cb.patronati?.['2025'] || { in_entrata: 9493, in_uscita: 9496 };

        this.createChart('chart-cassetto-bidirezionale', {
            type: 'bar',
            data: {
                labels: ['Aziende (2025)', 'Patronati (2025)'],
                datasets: [{
                    label: 'In Entrata',
                    data: [az.in_entrata, pat.in_entrata],
                    backgroundColor: this.colors.success
                }, {
                    label: 'In Uscita',
                    data: [az.in_uscita, pat.in_uscita],
                    backgroundColor: this.colors.primary
                }]
            },
            options: this.getCommonOptions()
        });

        const pec = ru.flusso_pec || {};
        const pec24 = pec['2024'] || { inviate: 14410, ricevute: 19919 };
        const pec25 = pec['2025'] || { inviate: 13538, ricevute: 20355 };

        this.createChart('chart-pec', {
            type: 'bar',
            data: {
                labels: ['2024', '2025'],
                datasets: [{
                    label: 'PEC Inviate',
                    data: [pec24.inviate, pec25.inviate],
                    backgroundColor: this.colors.primary
                }, {
                    label: 'PEC Ricevute',
                    data: [pec24.ricevute, pec25.ricevute],
                    backgroundColor: this.colors.secondary
                }]
            },
            options: this.getCommonOptions()
        });
    }

    // ==========================================
    // 9. ORGANIZZAZIONE
    // ==========================================
    loadOrganizzazioneCharts() {
        const org = dashboardData2025.organizzazione;
        const pers = org.personale || {};

        this.createChart('chart-personale', {
            type: 'doughnut',
            data: {
                labels: ['Dirigenti', 'Medici e Professionisti', 'Aree Professionali'],
                datasets: [{
                    data: [
                        pers.dirigenti || pers.per_area?.dirigenti?.totale || 1,
                        pers.medici_professionisti || pers.per_area?.medici_professionisti?.totale || 4,
                        pers.aree_professionali || pers.per_area?.aree_professionali?.totale || 119
                    ],
                    backgroundColor: [this.colors.error, this.colors.warning, this.colors.primary],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#e2e8f0' } }
                }
            }
        });

        const pres = org.presidio || org.distribuzione_territoriale?.strutture || {};
        this.createChart('chart-strutture', {
            type: 'bar',
            data: {
                labels: ['Comuni', 'Strutture INPS', 'Punti Servizio', 'Patronati', 'CAF'],
                datasets: [{
                    label: 'Presidi Territoriali',
                    data: [
                        pres.comuni || pres.numero_comuni || 50,
                        pres.strutture_inps || 4,
                        pres.punti_cliente_servizio || 2,
                        pres.patronati || 70,
                        pres.caf || 24
                    ],
                    backgroundColor: [
                        this.colors.secondary,
                        this.colors.primary,
                        this.colors.warning,
                        this.colors.success,
                        this.colors.accent
                    ]
                }]
            },
            options: {
                ...this.getCommonOptions(),
                plugins: { legend: { display: false } }
            }
        });

        const serie = pers.serie_storica || [];
        this.createChart('chart-eta-media', {
            type: 'line',
            data: {
                labels: serie.map(d => d.anno),
                datasets: [{
                    label: 'Consistenza Organico (Unità)',
                    data: serie.map(d => d.totale),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 100,
                        suggestedMax: 150,
                        ticks: { color: '#e2e8f0', callback: (v) => v + ' unità' },
                        grid: { color: '#334155' }
                    },
                    x: { ticks: { color: '#e2e8f0' }, grid: { color: '#334155' } }
                }
            }
        });
    }

    // ==========================================
    // 10. PATRIMONIO
    // ==========================================
    loadPatrimonioCharts() {
        const patr = dashboardData2025.patrimonio || {};
        const confMarche = patr.confronto_marche || {
            'pesaro_urbino': 13.84,
            'ancona': 9.42,
            'macerata': 3.25,
            'ascoli_piceno': 1.95,
            'fermo': 0.81
        };

        this.createChart('chart-patrimonio-valore', {
            type: 'bar',
            data: {
                labels: ['Pesaro e Urbino', 'Ancona', 'Macerata', 'Ascoli Piceno', 'Fermo'],
                datasets: [{
                    label: 'Patrimonio a Reddito (€ Milioni)',
                    data: [
                        confMarche.pesaro_urbino || 13.84,
                        confMarche.ancona || 9.42,
                        confMarche.macerata || 3.25,
                        confMarche.ascoli_piceno || 1.95,
                        confMarche.fermo || 0.81
                    ],
                    backgroundColor: [
                        this.colors.primary,
                        'rgba(148, 163, 184, 0.6)',
                        'rgba(148, 163, 184, 0.6)',
                        'rgba(148, 163, 184, 0.6)',
                        'rgba(148, 163, 184, 0.6)'
                    ],
                    borderRadius: 5
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e2e8f0', callback: (v) => '€' + v + 'M' },
                        grid: { color: '#334155' }
                    },
                    x: { ticks: { color: '#e2e8f0' }, grid: { color: '#334155' } }
                }
            }
        });
    }
}

// Inizializzazione automatica al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard2025 = new Dashboard();
});
"""

with open('js/main_2025.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("✅ js/main_2025.js rewritten cleanly and robustly!")
