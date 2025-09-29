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
    
    def do_OPTIONS(self):
        """Gestisce le richieste OPTIONS per CORS"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Gestisce le richieste GET con redirect automatico all'index"""
        if self.path == '/':
            self.path = '/index.html'
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
    """Verifica che tutti i file necessari siano presenti"""
    required_files = [
        'index.html',
        'js/data.js',
        'js/main.js',
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
        print("\nAssicurati di essere nella directory corretta e che tutti i file siano stati creati.")
        return False
    
    print("✅ Tutti i file della dashboard sono presenti")
    return True

def print_dashboard_info(port, auto_open=True):
    """Stampa le informazioni della dashboard"""
    url = f"http://localhost:{port}"
    
    print("\n" + "="*60)
    print("🏛️  DASHBOARD SOCIO-ECONOMICA PESARO E URBINO 2024")
    print("="*60)
    print(f"📊 Server avviato sulla porta: {port}")
    print(f"🌐 URL locale: {url}")
    print(f"📁 Directory: {os.getcwd()}")
    print("="*60)
    
    if auto_open:
        print("🚀 Apertura automatica del browser in corso...")
    else:
        print("💡 Apri il browser e naviga all'URL sopra indicato")
    
    print("\n📋 COMANDI DISPONIBILI:")
    print("   • Ctrl+C     - Ferma il server")
    print("   • F5         - Ricarica la pagina")
    print("   • F12        - Apri DevTools")
    
    print("\n🎯 FUNZIONALITÀ DASHBOARD:")
    print("   • 10 sezioni tematiche interattive")
    print("   • Grafici Chart.js responsive")
    print("   • Tema dark mode professionale")
    print("   • Zoom delle card per dettagli")
    print("   • Navigazione a schede fluida")
    print("="*60)

def main():
    """Funzione principale del server"""
    parser = argparse.ArgumentParser(
        description='Server di sviluppo per Dashboard Socio-Economica',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Esempi d'uso:
  python server.py                    # Avvia sulla prima porta libera (default 8000+)
  python server.py -p 8080           # Avvia sulla porta 8080
  python server.py --no-browser      # Avvia senza aprire il browser
  python server.py -p 3000 --no-browser  # Porta personalizzata senza browser

Note:
  - Il server si avvia nella directory corrente
  - Assicurati che index.html sia presente
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
        '--check-only',
        action='store_true',
        help='Verifica solo la presenza dei file senza avviare il server'
    )
    
    args = parser.parse_args()
    
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
            print_dashboard_info(port, not args.no_browser)
            
            # Avvia il browser in un thread separato
            if not args.no_browser:
                browser_thread = threading.Thread(
                    target=open_browser,
                    args=(f"http://localhost:{port}",),
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