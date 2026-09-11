# -*- coding: utf-8 -*-
import re
from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

soup = BeautifulSoup(orig_html, 'html.parser')

soup.title.string = "Dashboard Socio-Economica - Provincia di Pesaro Urbino 2025"

header = soup.find('header')
if header:
    h1 = header.find('h1')
    if h1: h1.string = "Dashboard Socio-Economica 2025"
    p_sub = header.find('p')
    if p_sub: p_sub.string = "Provincia di Pesaro Urbino — Dati Relazione Sociale Provinciale 2025"

    # Remove existing switchers if present
    for old_sw in header.find_all('div', class_=re.compile(r'justify-center gap-2 mt-4')):
        old_sw.decompose()

    switcher_html = """
    <div class="flex items-center justify-center gap-2 mt-4">
        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-2">Seleziona Versione:</span>
        <a href="index.html" class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors">Edizione 2024</a>
        <a href="index_2025.html" class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white border border-blue-500 shadow-md">Edizione 2025 (Attiva)</a>
        <a href="index_confronto.html" class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800 hover:text-white border border-indigo-700/60 transition-colors">📊 Confronto 2024 vs 2025</a>
    </div>
    """
    switcher_div = BeautifulSoup(switcher_html, 'html.parser')
    header.append(switcher_div)

# Update KPI values in header
kpi_pop = soup.find(id='kpi-popolazione')
if kpi_pop: kpi_pop.string = "349.558"
kpi_occ = soup.find(id='kpi-occupazione')
if kpi_occ: kpi_occ.string = "68,7%"
kpi_pen = soup.find(id='kpi-pensionati')
if kpi_pen: kpi_pen.string = "99.246"
kpi_ent = soup.find(id='kpi-entrate')
if kpi_ent: kpi_ent.string = "€790,8M"

# Reorder navigation sidebar items according to 2025 structure:
sidebar = soup.find('nav')
if sidebar:
    nav_order = [
        'demografia', 'mercato_lavoro', 'entrate_vigilanza', 'ammortizzatori',
        'pensioni', 'assistenza', 'contenzioso', 'relazioni_utenza',
        'organizzazione', 'patrimonio'
    ]
    links = {a['href'].replace('#', ''): a for a in sidebar.find_all('a', href=True) if a['href'].startswith('#')}
    container = sidebar.find('div', class_=re.compile(r'space-y|nav', re.I)) or sidebar
    for k in nav_order:
        if k in links:
            container.append(links[k])

# Replace section contents from dashboard_2025/*.html
module_map = {
    'demografia': 'dashboard_2025/01_demografia.html',
    'mercato_lavoro': 'dashboard_2025/02_mercato_lavoro.html',
    'entrate_vigilanza': 'dashboard_2025/03_entrate_vigilanza.html',
    'ammortizzatori': 'dashboard_2025/04_ammortizzatori.html',
    'pensioni': 'dashboard_2025/05_pensioni.html',
    'assistenza': 'dashboard_2025/06_assistenza.html',
    'contenzioso': 'dashboard_2025/07_contenzioso.html',
    'relazioni_utenza': 'dashboard_2025/08_utenza.html',
    'organizzazione': 'dashboard_2025/09_organizzazione.html',
    'patrimonio': 'dashboard_2025/10_patrimonio.html'
}

main_content = soup.find('main')
if main_content:
    sections_order = [
        'demografia', 'mercato_lavoro', 'entrate_vigilanza', 'ammortizzatori',
        'pensioni', 'assistenza', 'contenzioso', 'relazioni_utenza',
        'organizzazione', 'patrimonio'
    ]
    for s in main_content.find_all('section'):
        s.decompose()
        
    for idx, sid in enumerate(sections_order):
        file_path = module_map[sid]
        with open(file_path, 'r', encoding='utf-8') as mf:
            m_soup = BeautifulSoup(mf.read(), 'html.parser')
            
            # Remove scripts and headers from standalone module
            for sc in m_soup.find_all('script'):
                sc.decompose()
            container = m_soup.find('div', class_='container')
            if container:
                header_m = container.find('header')
                if header_m: header_m.decompose()
                inner_content = "".join([str(c) for c in container.contents])
            else:
                inner_content = m_soup.body.decode_contents() if m_soup.body else ""
        
        sec_tag = soup.new_tag('section', id=sid, **{'class': 'section-content' + (' active' if idx == 0 else '')})
        sec_soup = BeautifulSoup(f'<div class="section-wrapper space-y-6">{inner_content}</div>', 'html.parser')
        sec_tag.append(sec_soup)
        main_content.append(sec_tag)

# Update script tags to use data_2025.js and main_2025.js
for script in soup.find_all('script', src=True):
    if 'data.js' in script['src'] or 'data_confronto.js' in script['src']:
        script['src'] = 'js/data_2025.js'
    elif 'main.js' in script['src'] or 'main_confronto.js' in script['src']:
        script['src'] = 'js/main_2025.js'

with open('index_2025.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("✅ Generated index_2025.html cleanly!")
