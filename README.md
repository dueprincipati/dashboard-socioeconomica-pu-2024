# Dashboard Socio-Economica Pesaro e Urbino (Edizioni 2024 & 2025)

🏛️ **Dashboard interattiva per l'analisi dei dati socio-economici della Provincia di Pesaro e Urbino**

Una piattaforma web moderna e performante che trasforma i dati della **Relazione Sociale Provinciale (RSP)** del CIV INPS in visualizzazioni interattive, dinamiche e intuitive.

Il repository contiene **due edizioni distinte e indipendenti**:
- **Edizione 2024** (`index.html`): basata sulla relazione sociale provinciale 2024.
- **Edizione 2025** (`index_2025.html`): basata sul documento ufficiale RSP 2025 e perfettamente allineata alla **Nota di Sintesi del Rendiconto Sociale Provinciale 2025**.

---

## 📊 Architettura del Repository

Le due dashboard risiedono nello stesso repository ma operano in maniera **completamente autonoma e separata**, ciascuna con il proprio stack di dati e controller JavaScript:

```
dashboard-socioeconomica-pu-2024/
│
├── 🏛️ EDIZIONE 2024
│   ├── index.html                  # Master Dashboard 2024
│   ├── js/data.js                  # Data layer RSP 2024
│   ├── js/main.js                  # Controller Chart.js 2024
│   └── dashboard/                  # 10 Moduli HTML singoli 2024
│       ├── panorama_socio_demografico.html
│       ├── mercato_del_lavoro.html
│       ├── entrate.htlm
│       ├── ammortizzatori.htlm
│       ├── pensioni.htlm
│       ├── Assistenziali.htlm
│       ├── utenza.htlm
│       ├── Organizzazione.htlm
│       ├── contenzioso.html
│       └── patrimonio.htlm
│
├── 🏛️ EDIZIONE 2025
│   ├── index_2025.html             # Master Dashboard 2025
│   ├── js/data_2025.js             # Data layer RSP 2025 & Nota di Sintesi
│   ├── js/main_2025.js             # Controller Chart.js 2025
│   └── dashboard_2025/             # 10 Moduli HTML singoli 2025 (Standalone)
│       ├── 01_demografia.html
│       ├── 02_mercato_lavoro.html
│       ├── 03_entrate_vigilanza.html
│       ├── 04_ammortizzatori.html
│       ├── 05_pensioni.html
│       ├── 06_assistenza.html
│       ├── 07_contenzioso.html
│       ├── 08_utenza.html
│       ├── 09_organizzazione.html
│       └── 10_patrimonio.html
│
├── 🎨 ASSET CONDIVISI
│   └── css/style.css               # Tema dark mode, card styling, layout
│
├── ⚙️ STRUMENTI E SERVER
│   ├── server.py                   # Server HTTP Python multi-edizione (2024/2025)
│   ├── optimize.py                 # Pipeline di compressione asset (.gz)
│   └── scripts/                    # Utility script per generazione e build
│
└── 📄 FONTI DOCUMENTALI UFFICIALI
    ├── RSP_Pesaro e Urbino 2024(1).docx
    ├── RSP_Pesaro e Urbino_ 2025 .docx
    └── Pesaro e Urbino - NOTA DI SINTESI DEL RENDICONTO SOCIALE PROVINCIALE 2025 .docx
```

---

## 🎯 Sezioni della Dashboard (10 Macro-Aree)

Entrambe le edizioni articolano l'analisi della realtà provinciale in 10 capitoli tematici:

1. **Panorama Socio-Demografico** - Popolazione (349.558), piramide d'età, saldo naturale (-2.009), saldo migratorio (+1.107, incidenza 5,5‰), longevità.
2. **Mercato del Lavoro** - Tasso occupazione (68,7%), disoccupazione (4,1%), inattività (28,3%), 49.709 avviamenti vs 49.273 cessazioni (saldo +436), retribuzioni private (M 103,0 €/die, F 73,6 €/die, gender pay gap 28,5%).
3. **Entrate e Vigilanza** - Entrate contributive a €790,8M (+17,1%), recupero crediti amministrativo (€58,55M), riscossione coattiva (€20,3M totali), vigilanza ispettiva (153 accessi, 134 irregolari), regolarità DURC (8,5% irregolari).
4. **Ammortizzatori Sociali** - Cessazione rapporto: 16.370 domande NASpI (89,3% accolte entro 15 gg), 22.052 beneficiari totali. Sospensione rapporto: 1.145.769 ore CIG, 8.818 beneficiari (6.454 CIGO), tempi medi di autorizzazione rapidissimi (CIGO 7 gg vs 20 gg Italia; FIS 29 gg vs 48 gg Italia).
5. **Prestazioni Pensionistiche** - 99.246 pensionati (47.997 M, 51.249 F), 113.214 pensioni IVS vigenti, 5.751 liquidate nell'anno, anticipazioni pensionistiche (Opzione Donna 26, Quota 103 39).
6. **Prestazioni Assistenziali** - Invalidità civile (16.524 indennità di accompagnamento, 5.760 pensioni di invalidità), tempi medi definizione (157 gg totali, 18 gg fase amm.), misure di inclusione (1.557 ADI, 149 SFL), nuova Tavola 48 per fasce temporali.
7. **Contenzioso** - 408 ricorsi amministrativi, contenzioso giudiziario ordinario (138 giudizi, 81,2% esito favorevole INPS), 767 ATP di invalidità civile.
8. **Relazioni con l'Utenza** - Canali di accesso (5.788 accessi sportello, 4.751 ricontatti telefonici, 3.520 consulenze di II livello), cassetto bidirezionale, 20.355 PEC gestite.
9. **Organizzazione** - Organico a 124 dipendenti (83 F, 41 M, età media 53,8 anni), presidio territoriale (4 strutture provinciali, 70 sportelli patronati, 24 CAF).
10. **Patrimonio a Reddito** - Patrimonio immobiliare a reddito di €13,84M (4 fabbricati, pari al 47,3% dell'intero valore patrimoniale regionale delle Marche).

---

## 🚀 Avvio Rapido

### Prerequisiti
- **Python 3.6+**
- **Browser moderno** (Chrome, Firefox, Safari, Edge)

### Esecuzione con il Server Locale
Il file `server.py` integra il supporto nativo per entrambe le edizioni e gestisce automaticamente porte libere, header CORS e compressione:

```bash
# 1. Avvio Edizione 2024 (default):
python3 server.py

# 2. Avvio diretto Edizione 2025:
python3 server.py -y 2025

# 3. Modalità senza apertura automatica del browser:
python3 server.py -y 2025 --no-browser

# 4. Verifica integrità file di entrambe le edizioni:
python3 server.py --check-only

# 5. Specifica di una porta personalizzata:
python3 server.py -p 8080 -y 2025
```

Una volta avviato il server, è possibile accedere direttamente alle due edizioni tramite i seguenti URL:
- **Edizione 2024**: `http://localhost:8000/index.html` (o `http://localhost:8000/`)
- **Edizione 2025**: `http://localhost:8000/index_2025.html`

---

## 📑 Moduli HTML Standalone (`dashboard/` e `dashboard_2025/`)

Oltre alle due pagine master integrate, ciascuna sezione è disponibile come **modulo HTML standalone** apribile e visualizzabile singolarmente:

- **Moduli 2024**: nella cartella `dashboard/`
- **Moduli 2025**: nella cartella `dashboard_2025/` (es. `dashboard_2025/01_demografia.html`, `dashboard_2025/05_pensioni.html`, ecc.)

Ciascun modulo standalone della versione 2025 è dotato di un proprio script di bootstrap autonomo: i grafici Chart.js e i tab interni funzionano sia se il file viene aperto direttamente nel browser (`file://` o tramite server HTTP), sia all'interno della master dashboard `index_2025.html`.

---

## 🔍 Verifica di Corrispondenza con la Nota di Sintesi 2025

I dati esposti nella Dashboard 2025 sono stati validati punto per punto con il documento ufficiale **«Pesaro e Urbino - NOTA DI SINTESI DEL RENDICONTO SOCIALE PROVINCIALE 2025.docx»**:

| Ambito | Dato Nota di Sintesi 2025 | Dashboard 2025 | Esito |
|---|---|---|:---:|
| **Saldo demografico** | **-902** residenti (-2.009 naturale, +1.107 migratorio) | **-902** residenti | ✅ 100% |
| **Immigrazione** | **5,5‰** nuovi immigrati (vs Marche 5,3‰, Italia 4,2‰) | **5,5‰** esposto nei testi e grafici | ✅ 100% |
| **Mercato lavoro** | 49.709 assunzioni, 49.273 cessazioni (saldo **+436**) | **+436** nel grafico di bilancio | ✅ 100% |
| **Tasso occupazione** | Da 69,6% (2022) a **68,7%** (2025) | **68,7%** (KPI & chart indicatori) | ✅ 100% |
| **Tasso disoccupazione** | Da 4,9% (2022) a **4,1%** (2025) | **4,1%** (KPI & chart indicatori) | ✅ 100% |
| **Tasso inattività** | Da 26,8% (2022) a **28,3%** (2025) | **28,3%** nei commenti e card | ✅ 100% |
| **Retribuzioni private** | Maschi **103,0 €/die**, Femmine **73,6 €/die** | **103,0 €** e **73,6 €** (`genderPayGapChart`) | ✅ 100% |
| **CIG ore autorizzate** | Da 582.090 h (2022) a **1.145.769 h** (2025) | **1.145.769 h** (`cigHoursChart`) | ✅ 100% |
| **CIG beneficiari** | Da 5.891 (2022) a **8.818** (2025) | **8.818** (6.454 CIGO, `cigBeneficiariesChart`) | ✅ 100% |
| **Tempi erogazione CIG** | CIGO **7 gg** (vs 20 gg Italia); FIS **29 gg** (vs 48 gg Italia) | **7 gg** e **29 gg** (`erogationTimingChart`) | ✅ 100% |
| **Pensionati totali** | **99.246** (47.997 Maschi, 51.249 Femmine) | **99.246** (KPI & `pensionersByTypeChart`) | ✅ 100% |
| **Assegni sociali** | **4.234** titolari di assegno sociale | **4.234** titolari | ✅ 100% |
| **Invalidità civile** | 16.524 indennità accompagnamento, 5.760 pensioni invalidità | **16.524** e **5.760** (`prestazioniVigentiChart`) | ✅ 100% |
| **Liquidate 2025** | **5.751** pensioni liquidate (in calo rispetto a 6.030 del 2022) | **5.751** (`liquidatedPensionsTrendChart`) | ✅ 100% |
| **Inclusione (ADI/SFL)** | **1.557** ADI e **149** SFL (vs 2.299 RdC/PdC nel 2022) | **1.557** ADI e **149** SFL (`sostegnoRedditoChart`) | ✅ 100% |
| **Entrate contributive** | Crescita del **+17,1%** (vs +15,0% Italia) a **€790,8M** | **+17,1%** / **€790,8M** (KPI & chart) | ✅ 100% |
| **Recupero crediti** | Da 50,3M € (2022) a **58.551.088,93 €** (2025) | **58.551.088,93 €** al centesimo | ✅ 100% |
| **Riscossione coattiva** | Da 14,6M € (2022) a **20,3M €** (2025) | **20.279.573,24 €** (20,3 milioni) | ✅ 100% |
| **Vigilanza ispettiva** | Da 185 ispezioni (2024) a **153** (2025) | **153** ispezioni (`chart-vigilanza-ispettiva`) | ✅ 100% |
| **DURC irregolari** | **8,5%** nel 2025 (vs 14,3% Italia) | **8,5%** (`chart-durc`) | ✅ 100% |
| **Tempi invalidità** | Visite medie a **157 gg**; fase amministrativa a **18 gg** | **157 gg** e **18 gg** (`tempiDefinizioneChart`) | ✅ 100% |

---

## ⚡ Performance e Ottimizzazione

La pipeline di ottimizzazione automatica `optimize.py` comprime e mantiene sincronizzate le versioni Gzip degli asset:

```bash
python3 optimize.py
```

- **Riduzione globale**: **81,0%** (da 263 KB a 50 KB compressi per l'intero repository)
- **Supporto Gzip**: Nginx / server HTTP locale servono direttamente i file pre-compressi per tempi di caricamento istantanei (<1s su reti mobili).

---

## 📱 Compatibilità Browser

- ✅ **Google Chrome** 90+
- ✅ **Mozilla Firefox** 88+
- ✅ **Apple Safari** 14+
- ✅ **Microsoft Edge** 90+
- 📱 Pienamente responsive su smartphone (320px+), tablet e schermi desktop 4K.

---

## 📄 Licenza e Proprietà

Sviluppato per la **Provincia di Pesaro e Urbino** — CIV INPS.  
Tutti i dati statistici ed elaborazioni provengono dalle Direzioni Generali e dagli archivi istituzionali INPS.
