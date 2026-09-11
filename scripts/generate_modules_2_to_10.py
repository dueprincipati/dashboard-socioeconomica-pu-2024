import os

head_template = """<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Pesaro Urbino 2025</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {{ font-family: 'Inter', sans-serif; }}
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .chart-container {{ position: relative; height: 40vh; width: 100%; }}
        .tab-content {{ display: none; }}
        .tab-content.active {{ display: block; }}
        .tab-btn {{ position: relative; color: #94a3b8; transition: color 0.2s ease-in-out; padding-bottom: 8px; }}
        .tab-btn:hover {{ color: #f8fafc; }}
        .tab-btn.active {{ color: {active_color}; font-weight: 600; }}
        .tab-btn.active::after {{ content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background-color: {active_color}; }}
        .card {{ background-color: #1e293b; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #334155; transition: transform 0.2s ease, box-shadow 0.2s ease; }}
        .card:hover {{ transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }}
    </style>
</head>
<body class="bg-slate-900 text-slate-300">
    <div class="container mx-auto p-4 md:p-8">
        <header class="mb-8 text-center">
            <div class="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-900/40 rounded-full border border-indigo-700/50">Edizione 2025 - CIV INPS</div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-white">{title}</h1>
            <p class="text-lg text-slate-400 mt-1">Provincia di Pesaro Urbino (RSP 2025)</p>
        </header>
"""

footer_template = """    </div>
    <script>
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.container');
                parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const target = document.getElementById(btn.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
    </script>
</body>
</html>
"""

# 02_mercato_lavoro.html
body_02 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tasso di Occupazione</h3>
                <p class="text-4xl font-bold text-white mt-2">68,7%</p>
                <p class="text-sm text-slate-500 mt-1">Popolazione 15-64 anni (2025)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tasso di Disoccupazione</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">4,1%</p>
                <p class="text-sm text-slate-500 mt-1">Popolazione 15-74 anni (2025)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Lavoratori Totali</h3>
                <p class="text-4xl font-bold text-white mt-2">174.451</p>
                <p class="text-sm text-slate-500 mt-1">Dato aggiornato al 2024</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Saldo Contratti 2025</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">+436</p>
                <p class="text-sm text-slate-500 mt-1">Assunzioni netti nel 2025</p>
            </div>
        </div>

        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="occupazione">Occupazione e Struttura</button>
            <button class="tab-btn" data-tab="flussi">Flussi e Contratti</button>
        </div>

        <div id="tab-contents" class="mt-8">
            <div id="occupazione" class="tab-content active space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Indicatori del Mercato del Lavoro (2023-2025)</h3>
                    <p class="text-slate-400 mb-4">Il tasso di occupazione a Pesaro Urbino si attesta al <strong class="text-emerald-400">68,7%</strong>, confermandosi notevolmente superiore alla media nazionale (62,5%). Il tasso di disoccupazione è contenuto al <strong class="text-sky-400">4,1%</strong> (contro il 6,2% italiano).</p>
                    <div class="chart-container"><canvas id="mainIndicatorsChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Composizione Lavoratori per Posizione (2024)</h3>
                        <p class="text-slate-400 mb-4">La maggioranza degli occupati (<strong class="text-slate-100">80,6%</strong>) è rappresentata da lavoratori dipendenti (140.641 unità), seguiti da commercianti (12.004) e artigiani (11.235).</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="workersCompositionChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Divario Retributivo di Genere (€/giorno, 2024)</h3>
                        <p class="text-slate-400 mb-4">Permane un gender pay gap consistente: la retribuzione media provinciale è di <strong class="text-sky-400">103,0 €/giorno per gli uomini</strong> contro <strong class="text-pink-400">73,6 €/giorno per le donne</strong> (divario del 28,5%).</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="genderPayGapChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div id="flussi" class="tab-content space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Tipologie Contrattuali nelle Assunzioni (2024 vs 2025)</h3>
                    <p class="text-slate-400 mb-4">Nel 2025 le assunzioni a tempo determinato (17.611) e intermittente (12.331) rimangono le formule prevalenti nel flusso di ingresso al lavoro.</p>
                    <div class="chart-container"><canvas id="hiresByContractChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Saldo Assunzioni/Cessazioni per Contratto (2025)</h3>
                        <p class="text-slate-400 mb-4">Il saldo complessivo 2025 è positivo per <strong class="text-emerald-400">+436 unità</strong> (49.709 assunzioni vs 49.273 cessazioni).</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="hiresTerminationsBalanceChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Lavoro Part-Time per Genere (Dipendenti, 2024)</h3>
                        <p class="text-slate-400 mb-4">Il lavoro a tempo parziale è fortemente asimmetrico: interessa il <strong class="text-pink-400">48,4% delle lavoratrici</strong> a fronte del <strong class="text-sky-400">12,1% dei lavoratori maschi</strong>.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="partTimeIncidenceChart"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/02_mercato_lavoro.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Mercato del Lavoro", active_color="#4ade80") + body_02 + footer_template)

# 03_entrate_vigilanza.html
body_03 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Entrate Contributive 2025</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">€790,8M</p>
                <p class="text-sm text-slate-500 mt-1">Riscossioni ordinarie Uniemens (+17,1%)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Recupero Crediti 2025</h3>
                <p class="text-4xl font-bold text-white mt-2">€58,6M</p>
                <p class="text-sm text-slate-500 mt-1">Fase amministrativa Uniemens</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Lavoratori Irregolari</h3>
                <p class="text-4xl font-bold text-orange-400 mt-2">2.572</p>
                <p class="text-sm text-slate-500 mt-1">Rilevati in vigilanza 2025</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tasso DURC Irregolari</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">8,5%</p>
                <p class="text-sm text-slate-500 mt-1">In calo rispetto al 9,7% del 2024</p>
            </div>
        </div>

        <div class="space-y-6">
            <div class="card">
                <h3 class="font-bold text-xl text-slate-200 mb-4">Evoluzione Riscossioni Ordinarie Uniemens (2022-2025)</h3>
                <p class="text-slate-400 mb-4">Forte incremento del gettito contributivo ordinario che raggiunge i <strong class="text-emerald-400">790,76 milioni di euro nel 2025</strong> (+17,1% rispetto ai 675,25M € del 2024).</p>
                <div class="chart-container"><canvas id="chart-entrate-contributive"></canvas></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Vigilanza Ispettiva (2024 vs 2025)</h3>
                    <p class="text-slate-400 mb-4">Nel 2025 concluse 153 ispezioni, con 134 aziende irregolari (87,6%) e 2.572 lavoratori coinvolti. Accertati oltre <strong class="text-slate-100">€ 6,2M di contributi</strong> e <strong class="text-slate-100">€ 3,7M di sanzioni</strong>.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-vigilanza-ispettiva"></canvas></div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">DURC Online: Trend Regolarità (2023-2025)</h3>
                    <p class="text-slate-400 mb-4">A fronte di 23.186 DURC regolari emessi nel 2025, la quota di irregolarità scende all'<strong class="text-emerald-400">8,5%</strong>, segnalando una crescente conformità contributiva delle imprese.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-durc"></canvas></div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/03_entrate_vigilanza.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Entrate e Vigilanza", active_color="#10b981") + body_03 + footer_template)

# 04_ammortizzatori.html
body_04 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Domande NASpI 2025</h3>
                <p class="text-4xl font-bold text-white mt-2">16.370</p>
                <p class="text-sm text-slate-500 mt-1">Domande accolte nel 2025</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">NASpI Accolte in 15gg</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">89,3%</p>
                <p class="text-sm text-slate-500 mt-1">Performance 2025 (in aumento)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tempi Erogazione CIGO</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">7 gg</p>
                <p class="text-sm text-slate-500 mt-1">Tempo medio domanda/autorizzazione</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tempi Erogazione FIS</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">29 gg</p>
                <p class="text-sm text-slate-500 mt-1">Netto recupero da 52 gg del 2024</p>
            </div>
        </div>

        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="cessazione">Cessazione Rapporto (NASpI)</button>
            <button class="tab-btn" data-tab="sospensione">Sospensione Rapporto (CIG)</button>
        </div>

        <div id="tab-contents" class="mt-8">
            <div id="cessazione" class="tab-content active space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Domande NASpI Accolte per Genere (2022-2025)</h3>
                    <p class="text-slate-400 mb-4">Nel 2025 le domande NASpI accolte si stabilizzano a 16.370 (9.352 donne, pari al 57,1%, e 7.018 uomini).</p>
                    <div class="chart-container"><canvas id="naspiGenderChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Beneficiari per Tipologia di Prestazione (2025)</h3>
                        <p class="text-slate-400 mb-4">La NASpI costituisce il 95,2% dei trattamenti di disoccupazione (20.380 beneficiari), affiancata da disoccupazione agricola (880) e Dis-coll (135).</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="benefitsTypeChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Tempi di Accoglimento NASpI (2025)</h3>
                        <p class="text-slate-400 mb-4">L'<strong class="text-emerald-400">89,3%</strong> delle domande NASpI viene accolto entro 15 giorni dalla presentazione, superando la performance dell'anno precedente.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="naspiTimingChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div id="sospensione" class="tab-content space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Ore CIG Autorizzate per Tipologia (2022-2025)</h3>
                    <p class="text-slate-400 mb-4">Distribuzione delle ore di cassa integrazione guadagni ordinarie (CIGO), straordinarie (CIGS) e Fondi di Solidarietà.</p>
                    <div class="chart-container"><canvas id="cigHoursChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Beneficiari CIG per Strumento (2025)</h3>
                        <p class="text-slate-400 mb-4">La CIGO continua a rappresentare lo strumento prevalente a supporto delle imprese provinciali.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="cigBeneficiariesChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Tempi Medi di Erogazione CIGO e FIS (2025)</h3>
                        <p class="text-slate-400 mb-4">Pesaro Urbino registra tempi di autorizzazione rapidissimi: <strong class="text-emerald-400">7 giorni per CIGO</strong> (vs 18 gg media Italia) e <strong class="text-emerald-400">29 giorni per FIS</strong> (vs 65 gg media Italia).</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="erogationTimingChart"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/04_ammortizzatori.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Ammortizzatori Sociali", active_color="#a855f7") + body_04 + footer_template)

# 05_pensioni.html
body_05 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Pensionati Totali 2025</h3>
                <p class="text-4xl font-bold text-white mt-2">99.246</p>
                <p class="text-sm text-slate-500 mt-1">Donne 51,6% (51.249) | Uomini 48,4% (47.997)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Pensioni IVS Vigenti</h3>
                <p class="text-4xl font-bold text-white mt-2">113.214</p>
                <p class="text-sm text-slate-500 mt-1">Trattamenti pensionistici attivi</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Efficienza Liquidazione</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">82,7%</p>
                <p class="text-sm text-slate-500 mt-1">Gest. Privata liquidate < 30gg (vs 76,9% 2024)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Pensioni Liquidate 2025</h3>
                <p class="text-4xl font-bold text-white mt-2">5.751</p>
                <p class="text-sm text-slate-500 mt-1">Nuove decorrenze nell'anno</p>
            </div>
        </div>

        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="vigenti">Pensioni Vigenti</button>
            <button class="tab-btn" data-tab="liquidate">Pensioni Liquidate</button>
            <button class="tab-btn" data-tab="tempi">Tempi di Liquidazione</button>
            <button class="tab-btn" data-tab="anticipi">Anticipi Pensionistici</button>
        </div>

        <div id="tab-contents" class="mt-8">
            <div id="vigenti" class="tab-content active space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Pensionati INPS per Tipologia (2025)</h3>
                        <p class="text-slate-400 mb-4">Prevalenza della componente femminile sia nei pensionati previdenziali IVS sia nei beneficiari di prestazioni assistenziali.</p>
                        <div class="chart-container"><canvas id="pensionersByTypeChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Trattamenti Vigenti per Gestione (2025)</h3>
                        <p class="text-slate-400 mb-4">I lavoratori autonomi (42.080) e il FPLD (40.170) costituiscono oltre il 72% del carico pensionistico totale.</p>
                        <div class="chart-container"><canvas id="pensionsByFundChart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Importi Medi Mensili Pensioni IVS per Genere e Gestione (€)</h3>
                    <p class="text-slate-400 mb-4">Permane un marcato divario retributivo riflesso sulle pensioni: nel FPLD gli uomini percepiscono mediamente 1.810 € contro 918 € delle donne.</p>
                    <div class="chart-container"><canvas id="averageAmountChart"></canvas></div>
                </div>
            </div>

            <div id="liquidate" class="tab-content space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Evoluzione Pensioni Liquidate (2022-2025)</h3>
                    <p class="text-slate-400 mb-4">Nel 2025 sono state liquidate 5.751 pensioni (3.109 donne e 2.642 uomini).</p>
                    <div class="chart-container"><canvas id="liquidatedPensionsTrendChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Composizione Pensioni Liquidate (2025)</h3>
                        <p class="text-slate-400 mb-4">Le pensioni di vecchiaia (29,9%) e di anzianità/anticipata (26,3%) rappresentano la quota maggiore.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="liquidatedCompositionChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Liquidate per Sistema di Calcolo (2022-2025)</h3>
                        <p class="text-slate-400 mb-4">Crescita costante del sistema interamente contributivo (845 pensioni nel 2025), a fronte della flessione del calcolo retributivo.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="calculationSystemChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div id="tempi" class="tab-content space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Performance di Liquidazione entro 30 Giorni per Gestione (2025)</h3>
                    <p class="text-slate-400 mb-4">Netto miglioramento: la Gestione Privata sale all'<strong class="text-emerald-400">82,7%</strong> di liquidazioni entro un mese (da 76,9% nel 2024), la Pubblica all'<strong class="text-emerald-400">83,7%</strong> e i Fondi Speciali al <strong class="text-emerald-400">94,9%</strong>.</p>
                    <div class="chart-container"><canvas id="performanceByFundChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Distribuzione Tempi - Gestione Privata (2025)</h3>
                        <div class="chart-container" style="height: 30vh;"><canvas id="privateTimingDistributionChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Confronto Performance con Benchmark Italia (2025)</h3>
                        <div class="chart-container" style="height: 30vh;"><canvas id="benchmarkTimingChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div id="anticipi" class="tab-content space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Evoluzione Domande Anticipi (Opzione Donna e Quota 103)</h3>
                        <p class="text-slate-400 mb-4">Forte contrazione per via dell'inasprimento dei requisiti di legge: Opzione Donna scende a 26 domande accolte e Quota 103 a 39.</p>
                        <div class="chart-container"><canvas id="anticipiTrendChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Domande Quota 100/102/103 per Genere</h3>
                        <div class="chart-container"><canvas id="quoteGenderChart"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/05_pensioni.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Prestazioni Pensionistiche", active_color="#06b6d4") + body_05 + footer_template)

# 06_assistenza.html
body_06 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Nuclei Assegno Unico</h3>
                <p class="text-4xl font-bold text-white mt-2">37.788</p>
                <p class="text-sm text-slate-500 mt-1">Nuclei beneficiari a domanda (2025)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Prestazioni Inv. Civile Liquidate</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">4.249</p>
                <p class="text-sm text-slate-500 mt-1">In forte aumento (+20% vs 2024)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Tempo Medio Inv. Civile</h3>
                <p class="text-4xl font-bold text-white mt-2">157 gg</p>
                <p class="text-sm text-slate-500 mt-1">In miglioramento rispetto a 162 gg 2024</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Assegno Inclusione (ADI)</h3>
                <p class="text-4xl font-bold text-sky-400 mt-2">1.557</p>
                <p class="text-sm text-slate-500 mt-1">Domande accolte nel 2025</p>
            </div>
        </div>

        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="invalidita">Invalidità Civile</button>
            <button class="tab-btn" data-tab="sostegno">Sostegno al Reddito e Famiglia</button>
        </div>

        <div id="tab-contents" class="mt-8">
            <div id="invalidita" class="tab-content active space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Prestazioni Vigenti per Genere e Tipologia (2025)</h3>
                        <p class="text-slate-400 mb-4">L'indennità di accompagnamento rappresenta il trattamento principale con 16.524 beneficiari (10.239 donne e 6.285 uomini).</p>
                        <div class="chart-container"><canvas id="prestazioniVigentiChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Evoluzione Prestazioni Liquidate (2022-2025)</h3>
                        <p class="text-slate-400 mb-4">Netto incremento nel 2025 con 4.249 prestazioni liquidate (3.488 indennità e 761 pensioni).</p>
                        <div class="chart-container"><canvas id="liquidazioniTrendChart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Tempi Medi di Definizione: Sanitaria e Amministrativa (Giorni, 2025)</h3>
                    <p class="text-slate-400 mb-4">I tempi medi complessivi scendono a 157 giorni (139 gg per la fase sanitaria e 18 gg per quella amministrativa).</p>
                    <div class="chart-container"><canvas id="tempiDefinizioneChart"></canvas></div>
                </div>
                <!-- NUOVA TAVOLA 48 RSP 2025 -->
                <div class="card border border-indigo-500/40 bg-slate-900/90">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded">NOVITÀ TAVOLA 48</span>
                        <h3 class="font-bold text-xl text-indigo-200">Prestazioni per Fasce di Liquidazione - Tempi di Accoglimento (Tavola 48)</h3>
                    </div>
                    <p class="text-slate-400 mb-4">Distribuzione dettagliata dei tempi di accoglimento per 8 scaglioni temporali: a Pesaro Urbino la maggior concentrazione (31,9%) ricade nella fascia tra 181 e 360 giorni, seguita dal 19,8% tra 121 e 180 giorni.</p>
                    <div class="chart-container"><canvas id="fasceLiquidazioneChart"></canvas></div>
                </div>
            </div>

            <div id="sostegno" class="tab-content space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Misure di Sostegno al Reddito (ADI e SFL 2025)</h3>
                        <p class="text-slate-400 mb-4">Nel 2025 accolte 1.557 domande di Assegno di Inclusione (ADI) e 149 di Supporto Formazione e Lavoro (SFL).</p>
                        <div class="chart-container"><canvas id="sostegnoRedditoChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Nuclei Beneficiari di Assegno Unico Universale</h3>
                        <p class="text-slate-400 mb-4">I nuclei familiari beneficiari di AUU a domanda a Pesaro Urbino si attestano a 37.788 nel 2025.</p>
                        <div class="chart-container"><canvas id="assegnoUnicoChart"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/06_assistenza.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Prestazioni Assistenziali e Sociali", active_color="#eab308") + body_06 + footer_template)

# 07_contenzioso.html (Capitolo 7 nel 2025)
body_07 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Ricorsi Amministrativi 2025</h3>
                <p class="text-4xl font-bold text-white mt-2">408</p>
                <p class="text-sm text-slate-500 mt-1">Ricorsi pervenuti (in calo da 514 del 2024)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Giacenza Finale Ricorsi</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">38</p>
                <p class="text-sm text-slate-500 mt-1">Pendenze residue al 31/12/2025</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Favorevole INPS (Contributivo)</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">67,3%</p>
                <p class="text-sm text-slate-500 mt-1">Esito positivo sui giudizi ordinari definiti</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Giudizi ATP Invalidità</h3>
                <p class="text-4xl font-bold text-white mt-2">767</p>
                <p class="text-sm text-slate-500 mt-1">Accertamenti tecnici preventivi iniziati</p>
            </div>
        </div>

        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="amministrativo">Contenzioso Amministrativo</button>
            <button class="tab-btn" data-tab="giudiziario">Contenzioso Giudiziario</button>
        </div>

        <div id="tab-contents" class="mt-8">
            <div id="amministrativo" class="tab-content active space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Flusso dei Ricorsi Amministrativi (2025)</h3>
                    <p class="text-slate-400 mb-4">A fronte di 408 nuovi ricorsi pervenuti e 40 da lavorare a inizio anno, ne sono stati definiti complessivamente 410, riducendo la giacenza finale a soli <strong class="text-emerald-400">38 ricorsi pendenti</strong>.</p>
                    <div class="chart-container"><canvas id="adminAppealsFlowChart"></canvas></div>
                </div>
            </div>

            <div id="giudiziario" class="tab-content space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Esito dei Giudizi Definiti per Tipologia (2025)</h3>
                        <p class="text-slate-400 mb-4">Nei giudizi ordinari l'esito favorevole all'Istituto raggiunge il 67,3% nella materia contributiva, mentre negli ATP di invalidità civile l'esito favorevole all'utente è al 51,6%.</p>
                        <div class="chart-container"><canvas id="judicialOutcomesChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Giudizi Ordinari Iniziati per Materia (2025)</h3>
                        <div class="chart-container"><canvas id="judicialCasesBySubjectChart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Andamento delle Pendenze Giudiziarie (Inizio vs Fine 2025)</h3>
                    <div class="chart-container"><canvas id="pendingCasesChart"></canvas></div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/07_contenzioso.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Contenzioso", active_color="#ef4444") + body_07 + footer_template)

# 08_utenza.html (Capitolo 8 nel 2025)
body_08 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Consulenze II Livello</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">3.520</p>
                <p class="text-sm text-slate-500 mt-1">In aumento del +16,5% sul 2024</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Web Meeting I Livello</h3>
                <p class="text-4xl font-bold text-sky-400 mt-2">110</p>
                <p class="text-sm text-slate-500 mt-1">+75% di crescita nell'anno</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Cassetto Aziende (Out)</h3>
                <p class="text-4xl font-bold text-white mt-2">22.658</p>
                <p class="text-sm text-slate-500 mt-1">Comunicazioni evase dall'INPS</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">PEC Ricevute</h3>
                <p class="text-4xl font-bold text-white mt-2">20.355</p>
                <p class="text-sm text-slate-500 mt-1">Flusso digitale costante</p>
            </div>
        </div>

        <div class="space-y-6">
            <div class="card">
                <h3 class="font-bold text-xl text-slate-200 mb-4">Canali di Accesso di I Livello (2024 vs 2025)</h3>
                <p class="text-slate-400 mb-4">Si conferma la graduale transizione verso canali remoti e digitali: le presenze fisiche in sede scendono a 5.788, mentre aumentano i web meeting (110) e si consolida il ricontatto telefonico (4.751).</p>
                <div class="chart-container"><canvas id="chart-canali-accesso"></canvas></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Cassetto Bidirezionale: Aziende e Patronati (2025)</h3>
                    <p class="text-slate-400 mb-4">Volumi in forte espansione con le imprese: 18.478 comunicazioni in entrata e 22.658 in uscita.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-cassetto-bidirezionale"></canvas></div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Flusso PEC (2024 vs 2025)</h3>
                    <p class="text-slate-400 mb-4">Il volume di comunicazioni certificate inviate e ricevute testimonia l'elevato grado di interazione digitale.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-pec"></canvas></div>
                </div>
            </div>
        </div>
"""
with open('dashboard_2025/08_utenza.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Relazioni con l'Utenza", active_color="#3b82f6") + body_08 + footer_template)

# 09_organizzazione.html (Capitolo 9 nel 2025)
body_09 = """
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Personale INPS Totale</h3>
                <p class="text-4xl font-bold text-white mt-2">124</p>
                <p class="text-sm text-slate-500 mt-1">Donne 66,9% (83) | Uomini 33,1% (41)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Età Media Personale</h3>
                <p class="text-4xl font-bold text-white mt-2">53,8</p>
                <p class="text-sm text-slate-500 mt-1">Anni, al 31/12/2025</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Strutture INPS nel Territorio</h3>
                <p class="text-4xl font-bold text-white mt-2">4</p>
                <p class="text-sm text-slate-500 mt-1">Pesaro, Fano, Urbino, Cagli (+2 Punti Servizio)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Sportelli Patronato e CAF</h3>
                <p class="text-4xl font-bold text-white mt-2">94</p>
                <p class="text-sm text-slate-500 mt-1">70 patronati e 24 CAF nei 50 comuni</p>
            </div>
        </div>

        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Personale INPS per Area Professionale (2025)</h3>
                    <p class="text-slate-400 mb-4">L'organico comprende 1 dirigente, 4 medici/professionisti legali e 119 dipendenti nelle aree professionali.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-personale"></canvas></div>
                </div>
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Presidio Territoriale nei Comuni (2025)</h3>
                    <p class="text-slate-400 mb-4">Rete capillare di supporto alla cittadinanza estesa su tutti i 50 comuni della provincia.</p>
                    <div class="chart-container" style="height: 30vh;"><canvas id="chart-strutture"></canvas></div>
                </div>
            </div>
            <div class="card">
                <h3 class="font-bold text-xl text-slate-200 mb-4">Evoluzione Storica Età Media Personale INPS (2018-2025)</h3>
                <div class="chart-container"><canvas id="chart-eta-media"></canvas></div>
            </div>
        </div>
"""
with open('dashboard_2025/09_organizzazione.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Organizzazione e Risorse Umane", active_color="#6366f1") + body_09 + footer_template)

# 10_patrimonio.html (Capitolo 10 nel 2025)
body_10 = """
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Consistenza Patrimoniale 2025</h3>
                <p class="text-4xl font-bold text-emerald-400 mt-2">€13,84M</p>
                <p class="text-sm text-slate-500 mt-1">Valore patrimonio da reddito costante</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Numero Fabbricati</h3>
                <p class="text-4xl font-bold text-white mt-2">4</p>
                <p class="text-sm text-slate-500 mt-1">Unità immobiliari gestite</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Unità Agricole</h3>
                <p class="text-4xl font-bold text-white mt-2">0</p>
                <p class="text-sm text-slate-500 mt-1">Nessun terreno agricolo da reddito</p>
            </div>
        </div>

        <div class="space-y-6">
            <div class="card">
                <h3 class="font-bold text-xl text-slate-200 mb-4">Valore Patrimonio Immobiliare da Reddito (2022-2025)</h3>
                <p class="text-slate-400 mb-4">Il valore del patrimonio a Pesaro Urbino rimane costante a <strong class="text-emerald-400">13.839.976,40 €</strong>, costituendo una quota rilevante dell'intero patrimonio regionale delle Marche.</p>
                <div class="chart-container"><canvas id="chart-patrimonio-valore"></canvas></div>
            </div>
        </div>
"""
with open('dashboard_2025/10_patrimonio.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Patrimonio a Reddito", active_color="#64748b") + body_10 + footer_template)

print("Generated modules 2 to 10 successfully.")
