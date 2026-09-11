#!/usr/bin/env python3
"""
Launcher dedicato per l'Edizione 2025 della Dashboard Socio-Economica PU.
Avvia automaticamente il server web locale aprendo l'Edizione 2025 (index_2025.html).
"""

import sys
import os

# Aggiunge la directory corrente al sys.path se necessario
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import main

if __name__ == "__main__":
    # Se l'utente non ha specificato l'anno esplicitamente, impostiamo 2025 come predefinito
    if '--2025' not in sys.argv and '-y' not in sys.argv and '--year' not in sys.argv and '--2024' not in sys.argv:
        sys.argv.append('--2025')
    main()
