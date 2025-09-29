# Dashboard Socio-Economica Pesaro e Urbino 2024

🏛️ **Dashboard interattiva per l'analisi dei dati socio-economici della Provincia di Pesaro e Urbino**

Una dashboard web moderna e professionale che trasforma i dati grezzi del Rapporto Socio-Economico in visualizzazioni interattive e intuitive.

## 📊 Panoramica

Questa dashboard presenta i dati socio-economici 2024 della Provincia di Pesaro e Urbino attraverso:

- **10 sezioni tematiche** con grafici interattivi
- **Tema dark mode** professionale e moderno  
- **Visualizzazioni Chart.js** responsive e animate
- **Navigazione fluida** tra le sezioni
- **Funzionalità zoom** per analisi dettagliate
- **Design responsive** per tutti i dispositivi

### 🎯 Sezioni della Dashboard

1. **Demografia** - Popolazione, saldo naturale, longevità, flussi migratori
2. **Mercato del Lavoro** - Occupazione, assunzioni, retribuzioni, settori
3. **Entrate e Vigilanza** - Contributi, ispezioni, DURC, accertamenti  
4. **Ammortizzatori Sociali** - NASpI, CIG, tempi di erogazione
5. **Pensioni** - Pensioni vigenti, importi medi, anticipazioni
6. **Assistenza** - Invalidità civile, sostegno al reddito, assegno unico
7. **Relazioni con l'Utenza** - Canali di accesso, cassetto bidirezionale, PEC
8. **Organizzazione** - Personale, strutture territoriali, età media
9. **Contenzioso** - Ricorsi amministrativi, giudiziari, ATP
10. **Patrimonio** - Valore immobiliare e trend evolutivi

## 🚀 Avvio Rapido

### Prerequisiti

- **Python 3.6+** (per il server locale)
- **Browser moderno** (Chrome, Firefox, Safari, Edge)

### Installazione

1. **Scarica i file della dashboard**
   ```bash
   # Se hai Git installato
   git clone <repository-url>
   cd dashboard-provinciale
   
   # Oppure estrai i file da un archivio ZIP
   ```

2. **Verifica la struttura dei file**
   ```
   dashboard-provinciale/
   ├── index.html          # Interfaccia principale
   ├── server.py           # Server di sviluppo
   ├── js/
   │   ├── data.js         # Dati strutturati
   │   └── main.js         # Logica dell'applicazione
   ├── css/
   │   └── style.css       # Stili personalizzati
   └── README.md           # Questa documentazione
   ```

### Esecuzione

1. **Avvia il server**
   ```bash
   python server.py
   ```

2. **La dashboard si aprirà automaticamente** nel browser all'indirizzo:
   ```
   http://localhost:8000
   ```

### Opzioni Avanzate

```bash
# Porta personalizzata
python server.py -p 3000

# Senza apertura automatica del browser  
python server.py --no-browser

# Verifica solo i file senza avviare il server
python server.py --check-only

# Guida completa
python server.py --help
```

## 🛠️ Architettura Tecnica

### Frontend
- **HTML5** con struttura semantica
- **Tailwind CSS** via CDN per lo styling di base
- **CSS personalizzato** per temi e animazioni
- **Chart.js** per visualizzazioni interattive
- **JavaScript ES6+** per la logica applicativa

### Backend
- **Python HTTP Server** per servire i file statici
- **CORS abilitato** per sviluppo locale
- **Auto-detection della porta** libera

### Struttura Dati
```javascript
dashboardData = {
    metadata: {
        titolo: "RSP Pesaro e Urbino 2024",
        periodo: "Gennaio-Settembre 2024",
        data_aggiornamento: "2024-12-01"
    },
    kpi: {
        popolazione_totale: 358397,
        tasso_occupazione: 68.1,
        pensionati_totale: 125718,
        crescita_entrate: "+3.5%"
    },
    // 10 sezioni principali con dati strutturati
    demografia: { ... },
    mercato_lavoro: { ... },
    // ... altre sezioni
}
```

## 🎨 Personalizzazione

### Colori del Tema
```css
:root {
    --primary-color: #f97316;    /* Arancione principale */
    --secondary-color: #06b6d4;  /* Ciano secondario */
    --accent-color: #ec4899;     /* Rosa accento */
    --success-color: #10b981;    /* Verde successo */
    --warning-color: #f59e0b;    /* Giallo avviso */
    --error-color: #ef4444;      /* Rosso errore */
}
```

### Modifica dei Grafici
I grafici sono configurabili in `js/main.js`:

```javascript
// Esempio: modificare i colori di un grafico
this.createChart('chart-id', {
    type: 'bar',
    data: {
        datasets: [{
            backgroundColor: this.colors.primary  // Personalizzabile
        }]
    }
});
```

## 📈 Aggiornamento Dati

### Processo Standardizzato

1. **Prepara i nuovi dati** in formato testo/Excel
2. **Estrai e struttura** i dati in formato JSON
3. **Aggiorna il file** `js/data.js`
4. **Modifica la data** di aggiornamento nei metadata
5. **Testa la dashboard** con `python server.py`

### Formato dei Dati

Per mantenere la compatibilità, rispetta questa struttura:

```javascript
// Esempio per nuova sezione
nuova_sezione: {
    titolo: "Nome Sezione",  
    sottosezioni: {
        dati_numerici: {
            2023: valore1,
            2024: valore2
        },
        serie_temporale: [
            { anno: 2020, valore: 100 },
            { anno: 2021, valore: 110 }
        ]
    }
}
```

### Script di Aggiornamento (Opzionale)

Puoi creare uno script Python per automatizzare l'aggiornamento:

```python
# update_data.py
import json
from datetime import datetime

def update_dashboard_data(new_data):
    # Logica per aggiornare js/data.js
    # con i nuovi dati mantenendo la struttura
    pass
```

## 🧪 Testing e Debug

### Verifica dei File
```bash
python server.py --check-only
```

### Debug nel Browser
1. Apri **DevTools** (F12)
2. Vai alla tab **Console** per errori JavaScript  
3. Vai alla tab **Network** per problemi di caricamento
4. Vai alla tab **Elements** per ispezionare HTML/CSS

### Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| Grafici non si caricano | Verifica connessione CDN Chart.js |
| Errori CORS | Usa sempre `python server.py` invece di aprire direttamente l'HTML |
| Porta occupata | Prova `python server.py -p 8080` |
| Dati non aggiornati | Svuota cache browser (Ctrl+F5) |

## 📱 Compatibilità

### Browser Supportati
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+  
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### Dispositivi
- 💻 **Desktop** - Esperienza completa
- 📱 **Tablet** - Layout adattivo
- 📱 **Mobile** - Versione ottimizzata

### Requisiti Minimi
- **Risoluzione**: 320px di larghezza
- **JavaScript**: Abilitato
- **Connessione**: Per CDN esterni (Tailwind, Chart.js)

## 🔧 Configurazione Avanzata

### Hosting Professionale

Per un deployment in produzione:

1. **Server Web**
   ```nginx
   server {
       listen 80;
       server_name dashboard.example.com;
       root /path/to/dashboard-provinciale;
       index index.html;
       
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

2. **HTTPS e Sicurezza**
   - Configura certificati SSL
   - Abilita headers di sicurezza
   - Minifica file CSS/JS

### Integrazione con CMS

La dashboard può essere integrata in sistemi esistenti:

```html
<!-- Embedding in WordPress/Drupal -->
<iframe src="https://dashboard.inps.gov.it" 
        width="100%" height="800px" 
        frameborder="0">
</iframe>
```

## 📋 Manutenzione

### Backup
Esegui backup regolari di:
- `js/data.js` (dati critici)
- File di configurazione personalizzati
- Documenti sorgente originali

### Aggiornamenti Tecnologici
- **Chart.js**: Verifica nuove versioni semestralmente
- **Tailwind CSS**: Aggiorna annualmente  
- **Browser support**: Testa su nuove versioni

### Log e Monitoraggio
Il server Python genera log automatici:
```
[2024-12-01 10:30:15] GET /index.html - 200
[2024-12-01 10:30:16] GET /js/data.js - 200  
[2024-12-01 10:30:16] GET /css/style.css - 200
```

## 🤝 Contributi

Per migliorare la dashboard:

1. **Segnala bug** e suggerimenti
2. **Proponi nuove funzionalità** 
3. **Migliora la documentazione**
4. **Ottimizza le performance**

### Standard di Codice
- **JavaScript**: ES6+, commenti in italiano
- **CSS**: Nomenclatura BEM, variabili CSS
- **HTML**: Semantico, accessibile (ARIA)

## 📞 Supporto

### Risoluzione Problemi

1. **Consulta i log** del server Python
2. **Verifica la console** del browser  
3. **Testa su browser diversi**
4. **Controlla la connessione** internet per CDN

### FAQ

**Q: La dashboard non si carica**  
A: Verifica che Python sia installato e che il server sia avviato correttamente

**Q: I grafici appaiono vuoti**  
A: Controlla la connessione internet per Chart.js CDN o verifica errori nella console

**Q: Come cambio i colori della dashboard?**  
A: Modifica le variabili CSS in `:root` nel file `css/style.css`

**Q: Posso esportare i grafici?**  
A: Sì, Chart.js supporta l'export. Aggiungi plugin di export se necessario

## 📄 Licenza

Questo progetto è sviluppato per l'INPS - Provincia di Pesaro e Urbino.  
Tutti i dati sono di proprietà dell'Istituto Nazionale della Previdenza Sociale.

---

**🎯 Dashboard Socio-Economica Pesaro e Urbino 2024**  
*Trasformare i dati in insight per decisioni informate*

---

### 📝 Cronologia Versioni

- **v1.0.0** (2024-12-01) - Release iniziale
  - ✅ Dashboard completa con 10 sezioni
  - ✅ Server Python integrato
  - ✅ Tema dark mode professionale
  - ✅ Grafici interattivi Chart.js
  - ✅ Design responsive completo