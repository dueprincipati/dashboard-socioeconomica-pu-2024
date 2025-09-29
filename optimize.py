#!/usr/bin/env python3
"""
Performance Optimizer - Dashboard Socio-Economica
Script di ottimizzazione per migliorare le performance della dashboard
"""

import os
import gzip
import json
from pathlib import Path

def optimize_dashboard():
    """Ottimizza la dashboard per performance migliori"""
    
    dashboard_dir = Path(".")
    
    print("🚀 OTTIMIZZAZIONE DASHBOARD - AVVIO")
    print("=" * 50)
    
    # 1. Verifica minify_html disponibile
    try:
        import minify_html
        html_minify_available = True
    except ImportError:
        html_minify_available = False
        print("⚠️  minify_html non disponibile. Installa con: pip install minify-html")
    
    # 2. Ottimizza HTML
    if html_minify_available:
        html_file = dashboard_dir / "index.html"
        if html_file.exists():
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Minifica HTML mantenendo la funzionalità
            minified_html = minify_html.minify(
                html_content,
                minify_css=True,
                minify_js=True,
                remove_processing_instructions=True
            )
            
            # Salva versione minificata
            with open(dashboard_dir / "index.min.html", 'w', encoding='utf-8') as f:
                f.write(minified_html)
            
            reduction = len(html_content) - len(minified_html)
            reduction_pct = (reduction / len(html_content)) * 100
            
            print(f"✅ HTML minificato: {reduction:,} byte risparmiati ({reduction_pct:.1f}%)")
        else:
            print("❌ File index.html non trovato")
    
    # 3. Comprimi file con gzip per server ottimizzati
    files_to_compress = [
        "index.html",
        "js/data.js", 
        "js/main.js",
        "css/style.css"
    ]
    
    total_original = 0
    total_compressed = 0
    
    for file_path in files_to_compress:
        file_full_path = dashboard_dir / file_path
        if file_full_path.exists():
            with open(file_full_path, 'rb') as f:
                content = f.read()
            
            # Comprimi con gzip
            compressed_content = gzip.compress(content, compresslevel=9)
            
            # Salva versione compressa
            gz_path = dashboard_dir / f"{file_path}.gz"
            gz_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(gz_path, 'wb') as f:
                f.write(compressed_content)
            
            original_size = len(content)
            compressed_size = len(compressed_content)
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            total_original += original_size
            total_compressed += compressed_size
            
            print(f"✅ {file_path}: {original_size:,} → {compressed_size:,} byte ({reduction:.1f}% riduzione)")
    
    # 4. Statistiche totali
    total_reduction = ((total_original - total_compressed) / total_original) * 100
    
    print("\n📊 RISULTATI OTTIMIZZAZIONE")
    print("-" * 30)
    print(f"Dimensione originale: {total_original:,} byte")
    print(f"Dimensione compressa: {total_compressed:,} byte")
    print(f"Riduzione totale: {total_reduction:.1f}%")
    
    # 5. Genera report delle performance
    performance_tips = [
        "🌐 Usa server con compressione gzip abilitata",
        "📱 Testa su dispositivi mobili per responsiveness",
        "⚡ Considera CDN per Chart.js e Tailwind CSS",
        "🔍 Monitora Core Web Vitals con Lighthouse",
        "📊 Ottimizza immagini se aggiunte in futuro"
    ]
    
    print("\n💡 CONSIGLI PER PERFORMANCE")
    print("-" * 30)
    for tip in performance_tips:
        print(tip)
    
    # 6. Crea configurazione nginx ottimizzata
    nginx_config = """
# Configurazione Nginx ottimizzata per Dashboard
server {
    listen 80;
    server_name dashboard.example.com;
    root /path/to/dashboard-provinciale;
    index index.html;
    
    # Compressione gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json;
    
    # Cache headers per performance
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Serve pre-compressed files
    location ~* \\.(js|css|html)$ {
        gzip_static on;
    }
}
"""
    
    with open(dashboard_dir / "nginx.conf.example", 'w') as f:
        f.write(nginx_config)
    
    print("\n✅ Creato nginx.conf.example per deployment")
    
    # 7. Test performance con curl se disponibile
    try:
        import subprocess
        result = subprocess.run(['which', 'curl'], capture_output=True)
        if result.returncode == 0:
            print("\n🧪 Per testare le performance:")
            print("   curl -H 'Accept-Encoding: gzip' -v http://localhost:8000")
    except:
        pass
    
    print("\n🎉 OTTIMIZZAZIONE COMPLETATA!")
    print("=" * 50)

if __name__ == "__main__":
    optimize_dashboard()