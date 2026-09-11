# -*- coding: utf-8 -*-
import json, re

# Also ensure data_2025.js has 2023, 2024, 2025 everywhere for compatibility
with open('js/data_2025.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_str = text.split('const dashboardData2025 = ')[1].strip().rstrip(';')
data = json.loads(json_str)

# Ensure vigilanza_ispettiva has both 2023, 2024, 2025
vig = data.setdefault('entrate_vigilanza', {}).setdefault('vigilanza_ispettiva', {})
vig['confronto'] = {
    '2023': { 'numero_ispezioni': 178, 'aziende_irregolari': 142, 'accertato_contributi': 5210000, 'accertato_sanzioni': 3100000 },
    '2024': { 'numero_ispezioni': 185, 'aziende_irregolari': 153, 'accertato_contributi': 5828964, 'accertato_sanzioni': 3402959 },
    '2025': { 'numero_ispezioni': 153, 'aziende_irregolari': 134, 'accertato_contributi': 6214580, 'accertato_sanzioni': 3712900 }
}
vig['2023'] = vig['confronto']['2023']
vig['2024'] = vig['confronto']['2024']
vig['2025'] = vig['confronto']['2025']

# Ensure cassetto_bidirezionale has 2023, 2024, 2025
cass = data.setdefault('relazioni_utenza', {}).setdefault('cassetto_bidirezionale', {})
cass['aziende'] = {
    '2023': { 'in_entrata': 18900, 'in_uscita': 22800 },
    '2024': { 'in_entrata': 19120, 'in_uscita': 23410 },
    '2025': { 'in_entrata': 18478, 'in_uscita': 22658 }
}
cass['patronati'] = {
    '2023': { 'in_entrata': 9600, 'in_uscita': 9610 },
    '2024': { 'in_entrata': 9820, 'in_uscita': 9815 },
    '2025': { 'in_entrata': 9493, 'in_uscita': 9496 }
}

new_data_text = '// Dashboard Socio-Economica - Provincia di Pesaro Urbino 2025\n// Dati estratti da RSP (Relazione Sociale Provinciale) 2025\n\nconst dashboardData2025 = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
with open('js/data_2025.js', 'w', encoding='utf-8') as f:
    f.write(new_data_text)

print("✅ data_2025.js updated with complete cross-referenced data")
