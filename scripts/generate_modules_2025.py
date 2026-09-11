import os

os.makedirs('dashboard_2025', exist_ok=True)

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
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const target = document.getElementById(btn.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
    </script>
</body>
</html>
"""

print("Writing 01_demografia.html...")
# 01_demografia.html
body_01 = """
        <!-- Schede KPI -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Popolazione Totale</h3>
                <p class="text-4xl font-bold text-white mt-2">349.558</p>
                <p class="text-sm text-slate-500 mt-1">Dato aggiornato al 2025</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Popolazione 65+</h3>
                <p class="text-4xl font-bold text-white mt-2">25,7%</p>
                <p class="text-sm text-slate-500 mt-1">Quota sul totale (2025)</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Saldo Naturale</h3>
                <p class="text-4xl font-bold text-red-400 mt-2">-2.009</p>
                <p class="text-sm text-slate-500 mt-1">Differenza nascite/decessi 2024</p>
            </div>
            <div class="card">
                <h3 class="text-slate-400 font-semibold text-md">Speranza di Vita (Donne)</h3>
                <p class="text-4xl font-bold text-white mt-2">86,4</p>
                <p class="text-sm text-slate-500 mt-1">Anni, alla nascita (2024)</p>
            </div>
        </div>

        <!-- Tab Buttons -->
        <div id="tabs" class="flex flex-wrap justify-center gap-8 mb-6 border-b border-slate-700">
            <button class="tab-btn active" data-tab="struttura">Struttura Popolazione</button>
            <button class="tab-btn" data-tab="dinamica">Dinamica Demografica</button>
        </div>

        <!-- Tab Content -->
        <div id="tab-contents" class="mt-8">
            <div id="struttura" class="tab-content active space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Confronto Piramide delle Età (% Popolazione, 2025)</h3>
                    <ul class="list-disc list-inside text-slate-400 space-y-2 mb-4">
                        <li>La provincia di Pesaro Urbino registra una quota di <strong class="text-slate-100">popolazione anziana (25,7%)</strong> superiore alla media italiana (24,7%).</li>
                        <li>La popolazione in età lavorativa <strong class="text-sky-400">(15-64 anni)</strong> si attesta al 62,8% (219.667 residenti).</li>
                        <li>I giovani <strong class="text-teal-400">(0-14 anni)</strong> rappresentano l'11,5% (40.004 residenti), confermando il progressivo calo delle nascite.</li>
                    </ul>
                    <div class="chart-container"><canvas id="agePyramidChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Distribuzione Popolazione per Genere (2025)</h3>
                        <p class="text-slate-400 mb-4">La popolazione provinciale è composta per il <strong class="text-pink-400">50,7% da donne (177.340)</strong> e per il <strong class="text-sky-400">49,3% da uomini (172.218)</strong>.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="genderDistributionChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Speranza di Vita alla Nascita (2024)</h3>
                        <p class="text-slate-400 mb-4">La speranza di vita a Pesaro Urbino sale a <strong class="text-pink-400">86,4 anni per le donne</strong> e a <strong class="text-sky-400">82,8 anni per gli uomini</strong>, superando le medie regionali e nazionali.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="lifeExpectancyChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div id="dinamica" class="tab-content space-y-6">
                <div class="card">
                    <h3 class="font-bold text-xl text-slate-200 mb-4">Andamento Saldo Naturale (2014-2024)</h3>
                    <p class="text-slate-400 mb-4">Il saldo naturale provinciale nel 2024 registra un disavanzo di <strong class="text-red-400">-2.009 unità</strong> (1.884 nascite a fronte di 3.893 decessi), confermando il deficit demografico costante nell'ultimo decennio.</p>
                    <div class="chart-container"><canvas id="naturalBalanceChart"></canvas></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Flussi Migratori con l'Estero (2014-2024)</h3>
                        <p class="text-slate-400 mb-4">Nel 2024 si contano <strong class="text-emerald-400">1.924 immigrati dall'estero</strong> e <strong class="text-rose-400">817 emigrati</strong>, generando un saldo migratorio estero positivo pari a +1.107 unità.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="migrationFlowChart"></canvas></div>
                    </div>
                    <div class="card">
                        <h3 class="font-bold text-xl text-slate-200 mb-4">Composizione Saldo Demografico (2014-2024)</h3>
                        <p class="text-slate-400 mb-4">Il saldo migratorio positivo (+1.107) compensa solo parzialmente il saldo naturale negativo (-2.009), determinando un <strong class="text-red-400">saldo demografico netto pari a -902 residenti</strong>.</p>
                        <div class="chart-container" style="height: 30vh;"><canvas id="demographicBalanceChart"></canvas></div>
                    </div>
                </div>
            </div>
        </div>
"""

with open('dashboard_2025/01_demografia.html', 'w', encoding='utf-8') as f:
    f.write(head_template.format(title="Panorama Socio-Demografico", active_color="#38bdf8") + body_01 + footer_template)

print("01_demografia.html created successfully.")
