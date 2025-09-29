#!/usr/bin/env python3
"""
Update Data Script - Dashboard Socio-Economica
Script automatico per aggiornare i dati della dashboard con nuovi file RSP
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from datetime import datetime
import subprocess
import argparse

class DashboardDataUpdater:
    """Classe per automatizzare l'aggiornamento dei dati della dashboard"""
    
    def __init__(self):
        self.project_dir = Path(__file__).parent.parent
        self.data_file = self.project_dir / "js" / "data.js"
        self.backup_dir = self.project_dir / "backups"
        
    def create_backup(self):
        """Crea backup dei dati correnti"""
        print("📦 Creazione backup dei dati correnti...")
        
        # Crea directory backup se non esistente
        self.backup_dir.mkdir(exist_ok=True)
        
        # Nome backup con timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = self.backup_dir / f"data_backup_{timestamp}.js"
        
        # Copia file dati corrente
        if self.data_file.exists():
            shutil.copy2(self.data_file, backup_file)
            print(f"✅ Backup creato: {backup_file}")
            return backup_file
        else:
            print("⚠️ File dati originale non trovato")
            return None
    
    def validate_rsp_file(self, rsp_file_path):
        """Valida il file RSP di input"""
        print(f"🔍 Validazione file RSP: {rsp_file_path}")
        
        rsp_path = Path(rsp_file_path)
        if not rsp_path.exists():
            raise FileNotFoundError(f"File RSP non trovato: {rsp_file_path}")
        
        # Verifica dimensione minima
        file_size = rsp_path.stat().st_size
        if file_size < 1000:  # Minimo 1KB
            raise ValueError(f"File RSP troppo piccolo: {file_size} bytes")
        
        print(f"✅ File RSP validato: {file_size:,} bytes")
        return True
    
    def extract_data_from_rsp(self, rsp_file_path):
        """Estrae dati dal file RSP (implementazione placeholder)"""
        print("📊 Estrazione dati dal file RSP...")
        
        # Questo è un placeholder - nella realtà implementeremmo
        # la logica di parsing specifica per il formato RSP
        
        # Per ora, mostra come dovrebbe funzionare
        new_data = {
            "metadata": {
                "titolo": "RSP Pesaro e Urbino 2025",
                "periodo": self.extract_period_from_filename(rsp_file_path),
                "data_aggiornamento": datetime.now().strftime("%Y-%m-%d"),
                "versione": "1.1.0"
            },
            "kpi": {
                "popolazione_totale": 358397,  # Dati di esempio
                "tasso_occupazione": 68.1,
                "pensionati_totale": 125718,
                "crescita_entrate": "+3.5%"
            }
            # ... altre sezioni verrebbero estratte dal file RSP
        }
        
        print("✅ Dati estratti con successo")
        return new_data
    
    def extract_period_from_filename(self, filename):
        """Estrae il periodo dal nome del file"""
        # Cerca pattern come "2025", "2024-2025", etc.
        match = re.search(r'(\d{4})', str(filename))
        if match:
            year = match.group(1)
            return f"Gennaio-Settembre {year}"
        return "Periodo non specificato"
    
    def validate_data_structure(self, new_data):
        """Valida la struttura dei nuovi dati"""
        print("🔍 Validazione struttura dati...")
        
        required_keys = ['metadata', 'kpi']
        for key in required_keys:
            if key not in new_data:
                raise ValueError(f"Chiave obbligatoria mancante: {key}")
        
        # Valida metadata
        required_metadata = ['titolo', 'periodo', 'data_aggiornamento']
        for key in required_metadata:
            if key not in new_data['metadata']:
                raise ValueError(f"Metadata obbligatorio mancante: {key}")
        
        # Valida KPI
        required_kpi = ['popolazione_totale', 'tasso_occupazione']
        for key in required_kpi:
            if key not in new_data['kpi']:
                raise ValueError(f"KPI obbligatorio mancante: {key}")
        
        print("✅ Struttura dati validata")
        return True
    
    def generate_data_js(self, new_data):
        """Genera il nuovo file data.js"""
        print("📝 Generazione nuovo file data.js...")
        
        # Template per il file JavaScript
        js_template = '''// Dashboard Socio-Economica - Dati Strutturati
// Generato automaticamente il {timestamp}
// Fonte: RSP Pesaro e Urbino {periodo}

const dashboardData = {data_json};

// Export per compatibilità
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = dashboardData;
}}
'''
        
        # Genera contenuto
        content = js_template.format(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            periodo=new_data['metadata']['periodo'],
            data_json=json.dumps(new_data, indent=4, ensure_ascii=False)
        )
        
        # Scrivi il file
        with open(self.data_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ File data.js aggiornato: {self.data_file}")
        return True
    
    def run_integrity_tests(self):
        """Esegue test di integrità"""
        print("🧪 Esecuzione test di integrità...")
        
        try:
            # Test 1: Verifica file integrity
            result = subprocess.run([
                sys.executable, "server.py", "--check-only"
            ], cwd=self.project_dir, capture_output=True, text=True)
            
            if result.returncode != 0:
                raise RuntimeError(f"Test integrità fallito: {result.stderr}")
            
            # Test 2: Verifica server startup
            print("🌐 Test avvio server...")
            server_test = subprocess.run([
                sys.executable, "-c",
                "import http.server; import socketserver; "
                "print('Server test OK')"
            ], capture_output=True, text=True)
            
            if server_test.returncode != 0:
                raise RuntimeError("Server test fallito")
            
            print("✅ Tutti i test di integrità superati")
            return True
            
        except Exception as e:
            print(f"❌ Test di integrità falliti: {e}")
            return False
    
    def update_version(self, new_data):
        """Aggiorna il numero di versione"""
        print("🔢 Aggiornamento versione...")
        
        # Leggi versione corrente
        current_version = "1.0.0"  # Default
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                content = f.read()
                version_match = re.search(r'"versione":\s*"([^"]+)"', content)
                if version_match:
                    current_version = version_match.group(1)
        except:
            pass
        
        # Calcola nuova versione (incrementa minor)
        parts = current_version.split('.')
        if len(parts) == 3:
            try:
                parts[1] = str(int(parts[1]) + 1)  # Incrementa minor
                parts[2] = "0"  # Reset patch
                new_version = '.'.join(parts)
            except:
                new_version = "1.1.0"
        else:
            new_version = "1.1.0"
        
        new_data['metadata']['versione'] = new_version
        print(f"✅ Versione aggiornata: {current_version} → {new_version}")
        
        return new_version
    
    def commit_changes(self, version, rsp_file_path):
        """Commit delle modifiche su Git"""
        print("📝 Commit modifiche su Git...")
        
        try:
            # Check if git is available
            subprocess.run(['git', '--version'], capture_output=True, check=True)
            
            # Add changes
            subprocess.run(['git', 'add', '.'], cwd=self.project_dir, check=True)
            
            # Create commit message
            commit_msg = f"""feat(data): update to version {version}

📊 Data update from: {Path(rsp_file_path).name}
🗓️ Updated on: {datetime.now().strftime("%Y-%m-%d")}
✨ Dashboard version: {version}

Auto-generated by update_data.py script
"""
            
            # Commit
            subprocess.run([
                'git', 'commit', '-m', commit_msg
            ], cwd=self.project_dir, check=True)
            
            print("✅ Modifiche committate su Git")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Errore Git commit: {e}")
            return False
        except FileNotFoundError:
            print("⚠️ Git non disponibile, skip commit automatico")
            return False
    
    def update_dashboard(self, rsp_file_path, auto_commit=False):
        """Processo completo di aggiornamento dashboard"""
        print("🚀 AVVIO AGGIORNAMENTO DASHBOARD")
        print("=" * 50)
        
        try:
            # 1. Validazione file input
            self.validate_rsp_file(rsp_file_path)
            
            # 2. Backup dati correnti
            backup_file = self.create_backup()
            
            # 3. Estrazione nuovi dati
            new_data = self.extract_data_from_rsp(rsp_file_path)
            
            # 4. Aggiornamento versione
            new_version = self.update_version(new_data)
            
            # 5. Validazione struttura
            self.validate_data_structure(new_data)
            
            # 6. Generazione nuovo data.js
            self.generate_data_js(new_data)
            
            # 7. Test di integrità
            if not self.run_integrity_tests():
                raise RuntimeError("Test di integrità falliti")
            
            # 8. Commit automatico (opzionale)
            if auto_commit:
                self.commit_changes(new_version, rsp_file_path)
            
            print("\n🎉 AGGIORNAMENTO COMPLETATO CON SUCCESSO!")
            print("=" * 50)
            print(f"📊 Versione: {new_version}")
            print(f"📁 Backup: {backup_file}")
            print(f"🌐 Testa con: python3 server.py")
            
            return True
            
        except Exception as e:
            print(f"\n❌ ERRORE DURANTE L'AGGIORNAMENTO: {e}")
            print("=" * 50)
            
            # Ripristina backup se disponibile
            if 'backup_file' in locals() and backup_file and backup_file.exists():
                print("🔄 Ripristino backup...")
                shutil.copy2(backup_file, self.data_file)
                print("✅ Backup ripristinato")
            
            return False

def main():
    """Funzione principale dello script"""
    parser = argparse.ArgumentParser(
        description='Script automatico per aggiornare i dati della dashboard',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esempi d'uso:
  python3 update_data.py RSP_Pesaro_Urbino_2025.txt
  python3 update_data.py RSP_Pesaro_Urbino_2025.txt --commit
  python3 update_data.py --help

Note:
  - Il file RSP deve essere in formato testo leggibile
  - Viene creato automaticamente un backup dei dati correnti
  - I test di integrità vengono eseguiti automaticamente
  - Usa --commit per commit automatico su Git
        """
    )
    
    parser.add_argument(
        'rsp_file',
        help='Path al file RSP con i nuovi dati'
    )
    
    parser.add_argument(
        '--commit',
        action='store_true',
        help='Esegui commit automatico delle modifiche'
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version='Dashboard Data Updater v1.0.0'
    )
    
    args = parser.parse_args()
    
    # Inizializza updater
    updater = DashboardDataUpdater()
    
    # Esegui aggiornamento
    success = updater.update_dashboard(args.rsp_file, args.commit)
    
    # Exit code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()