# -*- coding: utf-8 -*-
import os
from bs4 import BeautifulSoup

module_sections = {
    '01_demografia.html': 'demografia',
    '02_mercato_lavoro.html': 'mercato_lavoro',
    '03_entrate_vigilanza.html': 'entrate_vigilanza',
    '04_ammortizzatori.html': 'ammortizzatori',
    '05_pensioni.html': 'pensioni',
    '06_assistenza.html': 'assistenza',
    '07_contenzioso.html': 'contenzioso',
    '08_utenza.html': 'relazioni_utenza',
    '09_organizzazione.html': 'organizzazione',
    '10_patrimonio.html': 'patrimonio'
}

for fname, sec_id in module_sections.items():
    fpath = os.path.join('dashboard_2025', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Ensure container or section has id=sec_id
    container = soup.find('div', class_='container')
    if container:
        container['id'] = sec_id
        container['class'] = container.get('class', []) + ['section-content', 'active']
        
    # Remove any old scripts referencing data_2025 or main_2025 to avoid duplicates
    for s in soup.find_all('script'):
        if s.get('src') and ('data_2025' in s['src'] or 'main_2025' in s['src']):
            s.decompose()
        elif s.string and 'new Dashboard' in s.string:
            s.decompose()
            
    # Append scripts at bottom of body
    body = soup.find('body')
    if body:
        # Script tags
        s_data = soup.new_tag('script', src='../js/data_2025.js')
        s_main = soup.new_tag('script', src='../js/main_2025.js')
        s_init = soup.new_tag('script')
        s_init.string = f"""
        document.addEventListener('DOMContentLoaded', () => {{
            const d = new Dashboard();
            d.currentSection = '{sec_id}';
            d.loadSectionCharts('{sec_id}');
        }});
        """
        body.append(s_data)
        body.append(s_main)
        body.append(s_init)
        
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
    print(f"✅ Upgraded {fpath} with standalone chart rendering for section '{sec_id}'")
