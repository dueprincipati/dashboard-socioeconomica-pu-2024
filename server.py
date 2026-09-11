#!/usr/bin/env python3
"""
Dashboard Socio-Economica - Server di Sviluppo
Avvia un server HTTP locale per servire la dashboard ed evitare problemi CORS
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path
import argparse
import threading
import time

class DashboardHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personalizzato per la dashboard con CORS e logging migliorato"""
    
    def end_headers(self):
        # Abilita CORS per sviluppo locale
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Headers di sicurezza e performance
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        
        super().end_headers()
    
    default_page = 'index.html'
    
    def do_OPTIONS(self):
        """Gestisce le richieste OPTIONS per CORS"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Gestisce le richieste GET con redirect automatico all'index dell'edizione attiva"""
        if self.path == '/' or self.path == '':
            self.path = '/' + self.default_page
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Log personalizzato con timestamp e colori"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        message = format % args
        
        # Codici colore ANSI
        GREEN = '\033[92m'
        BLUE = '\033[94m'
        YELLOW = '\033[93m'
        RED = '\033[91m'
        RESET = '\033[0m'
        
        # Colora in base al codice di stato
        if '200' in message:
            color = GREEN
        elif '404' in message:
            color = YELLOW
        elif any(code in message for code in ['500', '403', '400']):
            color = RED
        else:
            color = BLUE
            
        print(f"{BLUE}[{timestamp}]{RESET} {color}{message}{RESET}")

def find_free_port(start_port=8000, max_port=8999):
    """Trova la prima porta libera nell'intervallo specificato"""
    import socket
    
    for port in range(start_port, max_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"Nessuna porta libera trovata nell'intervallo {start_port}-{max_port}")

def open_browser(url, delay=1.5):
    """Apre il browser dopo un breve delay"""
    time.sleep(delay)
    try:
        webbrowser.open(url)
        print(f"\n🌐 Browser aperto automaticamente su: {url}")
    except Exception as e:
        print(f"\n⚠️  Errore nell'apertura automatica del browser: {e}")
        print(f"   Apri manualmente: {url}")

def check_dashboard_files():
    """Verifica che tutti i file necessari siano presenti per entrambe le edizioni"""
    required_files = [
        'index.html',
        'js/data.js',
        'js/main.js',
        'index_2025.html',
        'js/data_2025.js',
        'js/main_2025.js',
        'css/style.css'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ File mancanti per la dashboard:")
        for file in missing_files:
            print(f"   - {file}")
        print("\nAssicurati di essere nella directory corretta e che tutti i file siano presenti.")
        return False
    
    print("✅ Tutti i file delle edizioni 2024 e 2025 sono presenti")
    return True

def print_dashboard_info(port, auto_open=True, year='2024'):
    """Stampa le informazioni delle dashboard"""
    url_2024 = f"http://localhost:{port}/index.html"
    url_2025 = f"http://localhost:{port}/index_2025.html"
    active_url = url_2025 if year == '2025' else url_2024
    
    print("\n" + "="*60)
    print("🏛️  DASHBOARD SOCIO-ECONOMICA PESARO E URBINO (2024 & 2025)")
    print("="*60)
    print(f"📊 Server avviato sulla porta: {port}")
    print(f"🌐 Edizione 2024: {url_2024}")
    print(f"🌐 Edizione 2025: {url_2025}")
    print(f"📁 Directory:     {os.getcwd()}")
    print("="*60)
    
    if auto_open:
        print(f"🚀 Apertura automatica del browser (Edizione {year}) su: {active_url}")
    else:
        print("💡 Apri il browser e naviga a uno degli URL sopra indicati")
    
    print("\n📋 COMANDI DISPONIBILI:")
    print("   • Ctrl+C     - Ferma il server")
    print("   • F5         - Ricarica la pagina")
    print("   • F12        - Apri DevTools")
    
    print("\n🎯 EDIZIONI DISPONIBILI:")
    print("   • Edizione 2024: Dati RSP 2024 (index.html)")
    print("   • Edizione 2025: Dati RSP 2025 & Tavola 48 (index_2025.html)")
    print("   • Moduli Standalone in dashboard/ e dashboard_2025/")
    print("="*60)

def main():
    """Funzione principale del server"""
    parser = argparse.ArgumentParser(
        description='Server di sviluppo per Dashboard Socio-Economica',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esempi d'uso:
  python server.py                    # Avvia l'Edizione 2024 (default 8000+)
  python server.py --2025            # Avvia l'Edizione 2025
  python server.py -y 2025           # Avvia l'Edizione 2025
  python server.py -p 8080           # Avvia sulla porta 8080
  python server.py --no-browser      # Avvia senza aprire il browser

Note:
  - Il server si avvia nella directory corrente
  - Edizione 2024: index.html
  - Edizione 2025: index_2025.html
  - Usa Ctrl+C per fermare il server
        """
    )
    
    parser.add_argument(
        '-p', '--port',
        type=int,
        help='Porta del server (default: prima porta libera da 8000)'
    )
    
    parser.add_argument(
        '--no-browser',
        action='store_true',
        help='Non aprire automaticamente il browser'
    )
    
    parser.add_argument(
        '-y', '--year',
        choices=['2024', '2025'],
        default='2024',
        help='Edizione della dashboard da aprire automaticamente (2024 o 2025, default: 2024)'
    )
    
    parser.add_argument(
        '--2025',
        dest='is_2025',
        action='store_true',
        help='Scorciatoia per avviare direttamente l\'edizione 2025'
    )
    
    parser.add_argument(
        '--2024',
        dest='is_2024',
        action='store_true',
        help='Scorciatoia per avviare direttamente l\'edizione 2024'
    )
    
    parser.add_argument(
        '--check-only',
        action='store_true',
        help='Verifica solo la presenza dei file senza avviare il server'
    )
    
    args = parser.parse_args()
    
    # Gestione scorciatoie --2025 e --2024
    if args.is_2025:
        args.year = '2025'
    elif args.is_2024:
        args.year = '2024'
    
    # Imposta la pagina predefinita del server in base all'anno selezionato
    target_page = "index_2025.html" if args.year == "2025" else "index.html"
    DashboardHTTPRequestHandler.default_page = target_page
    
    # Verifica i file della dashboard
    if not check_dashboard_files():
        sys.exit(1)
    
    if args.check_only:
        print("✅ Verifica completata. Tutti i file sono presenti.")
        return
    
    # Determina la porta
    try:
        if args.port:
            port = args.port
        else:
            port = find_free_port()
    except Exception as e:
        print(f"❌ Errore nella determinazione della porta: {e}")
        sys.exit(1)
    
    # Configura il server
    handler = DashboardHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("localhost", port), handler) as httpd:
            # Mostra le informazioni
            print_dashboard_info(port, not args.no_browser, year=args.year)
            
            # Avvia il browser in un thread separato
            if not args.no_browser:
                browser_thread = threading.Thread(
                    target=open_browser,
                    args=(f"http://localhost:{port}/{target_page}",),
                    daemon=True
                )
                browser_thread.start()
            
            print(f"\n🎯 Server in ascolto... (Premi Ctrl+C per fermare)")
            print("-" * 60)
            
            # Avvia il server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server fermato dall'utente")
        print("👋 Grazie per aver utilizzato la Dashboard Socio-Economica!")
        
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Errore: La porta {port} è già in uso")
            print("💡 Suggerimenti:")
            print("   • Prova con una porta diversa: python server.py -p 8080")
            print("   • Verifica se altri server sono attivi")
            print("   • Aspetta qualche secondo e riprova")
        else:
            print(f"❌ Errore del server: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Errore imprevisto: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()