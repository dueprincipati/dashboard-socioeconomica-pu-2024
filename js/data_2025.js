// Dashboard Socio-Economica - Provincia di Pesaro Urbino 2025
// Dati estratti da RSP (Relazione Sociale Provinciale) 2025

const dashboardData2025 = {
  "metadata": {
    "territorio": "Provincia di Pesaro Urbino",
    "anno": 2025,
    "fonte": "INPS - Relazione Sociale Provinciale 2025",
    "dataUltimoAggiornamento": "2025"
  },
  "kpi": {
    "popolazione_totale": 349558,
    "tasso_occupazione": 68.7,
    "pensionati_totale": 99246,
    "entrate_contributive": 790761669.24,
    "beneficiari_naspi": 16370,
    "personale_inps": 124,
    "saldo_demografico_2024": -902,
    "crescita_entrate": "+17.1%"
  },
  "demografia": {
    "popolazione": {
      "title": "Distribuzione della popolazione per genere e età - 2025",
      "totale": 349558,
      "femmine": 177340,
      "maschi": 172218,
      "fasce_eta": {
        "0-14": 40004,
        "15-64": 219667,
        "65_oltre": 89887
      },
      "percentuali": {
        "femmine": 50.7,
        "maschi": 49.3,
        "0-14": 11.5,
        "15-64": 62.8,
        "65_oltre": 25.7
      },
      "confronto_territoriale": {
        "pesaro_urbino": {
          "0-14": 11.5,
          "15-64": 62.8,
          "65_oltre": 25.7
        },
        "marche": {
          "0-14": 11.3,
          "15-64": 62.1,
          "65_oltre": 26.6
        },
        "italia": {
          "0-14": 11.9,
          "15-64": 63.4,
          "65_oltre": 24.7
        }
      }
    },
    "saldo_naturale": {
      "title": "Andamento saldo naturale (2014-2024)",
      "serie_storica": [
        {
          "anno": 2014,
          "nascite": 2931,
          "decessi": 3659,
          "saldo": -728
        },
        {
          "anno": 2015,
          "nascite": 2840,
          "decessi": 3977,
          "saldo": -1137
        },
        {
          "anno": 2016,
          "nascite": 2717,
          "decessi": 3806,
          "saldo": -1089
        },
        {
          "anno": 2017,
          "nascite": 2528,
          "decessi": 3898,
          "saldo": -1370
        },
        {
          "anno": 2018,
          "nascite": 2378,
          "decessi": 3792,
          "saldo": -1414
        },
        {
          "anno": 2019,
          "nascite": 2268,
          "decessi": 3934,
          "saldo": -1666
        },
        {
          "anno": 2020,
          "nascite": 2161,
          "decessi": 4916,
          "saldo": -2755
        },
        {
          "anno": 2021,
          "nascite": 2182,
          "decessi": 4200,
          "saldo": -2018
        },
        {
          "anno": 2022,
          "nascite": 2122,
          "decessi": 4392,
          "saldo": -2270
        },
        {
          "anno": 2023,
          "nascite": 2036,
          "decessi": 3919,
          "saldo": -1883
        },
        {
          "anno": 2024,
          "nascite": 1884,
          "decessi": 3893,
          "saldo": -2009
        }
      ],
      "incidenza_2024": -0.6
    },
    "longevita": {
      "title": "Indice di longevità per genere (2024)",
      "speranza_vita_2024": {
        "alla_nascita": {
          "femmine": 86.4,
          "maschi": 82.8
        },
        "a_65_anni": {
          "femmine": 23.3,
          "maschi": 20.8
        },
        "a_85_anni": {
          "femmine": 7.5,
          "maschi": 6.2
        }
      },
      "confronto_territoriale_nascita": {
        "pesaro_urbino": {
          "femmine": 86.4,
          "maschi": 82.8
        },
        "marche": {
          "femmine": 86.2,
          "maschi": 82.4
        },
        "italia": {
          "femmine": 85.6,
          "maschi": 81.5
        }
      }
    },
    "flussi_migratori": {
      "title": "Flussi migratori e saldo demografico (2014-2024)",
      "anni": [
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024
      ],
      "immigrati": [
        1774,
        1437,
        1629,
        1700,
        1894,
        1843,
        1618,
        1630,
        1626,
        1758,
        1924
      ],
      "emigrati": [
        538,
        635,
        702,
        683,
        790,
        665,
        748,
        564,
        642,
        653,
        817
      ],
      "saldo_migratorio": [
        1236,
        802,
        927,
        1017,
        1104,
        1178,
        870,
        1066,
        984,
        1105,
        1107
      ],
      "saldo_naturale": [
        -728,
        -1137,
        -1089,
        -1370,
        -1414,
        -1666,
        -2755,
        -2018,
        -2270,
        -1883,
        -2009
      ],
      "saldo_demografico": [
        508,
        -335,
        -162,
        -353,
        -310,
        -488,
        -1885,
        -952,
        -1286,
        -778,
        -902
      ]
    }
  },
  "mercato_lavoro": {
    "lavoratori": {
      "title": "Lavoratori per posizione prevalente (2024)",
      "totale": 174451,
      "femmine": 77091,
      "maschi": 97360,
      "per_posizione": {
        "dipendenti": 140641,
        "commercianti": 12004,
        "artigiani": 11235,
        "gestione_separata": 7655,
        "domestici": 4776,
        "agricoli_autonomi": 2694,
        "voucher": 222
      }
    },
    "assunzioni_cessazioni_2025": {
      "assunzioni": {
        "totale": 49709,
        "femmine": 21741,
        "maschi": 27968,
        "per_contratto": {
          "indeterminato": 7417,
          "determinato": 17611,
          "stagionale": 7231,
          "somministrazione": 5119,
          "intermittente": 12331
        }
      },
      "cessazioni": {
        "totale": 49273,
        "femmine": 21506,
        "maschi": 27767,
        "per_contratto": {
          "indeterminato": 11443,
          "determinato": 13375,
          "stagionale": 7257,
          "somministrazione": 5009,
          "intermittente": 12189
        }
      },
      "saldo_netto": 436
    },
    "indicatori_occupazione": {
      "title": "Indicatori del Mercato del Lavoro",
      "occupati_2025": 156339,
      "tasso_occupazione_serie": {
        "anni": [
          "2023",
          "2024",
          "2025"
        ],
        "pesaro_urbino": [
          69.2,
          70.1,
          68.7
        ],
        "marche": [
          66.0,
          67.2,
          66.8
        ],
        "italia": [
          61.5,
          62.2,
          62.5
        ]
      },
      "tasso_disoccupazione_serie": {
        "anni": [
          "2023",
          "2024",
          "2025"
        ],
        "pesaro_urbino": [
          5.2,
          3.7,
          4.1
        ],
        "marche": [
          5.3,
          5.0,
          4.8
        ],
        "italia": [
          7.7,
          6.5,
          6.2
        ]
      }
    },
    "retribuzioni": {
      "title": "Retribuzioni medie giornaliere dipendenti privati per settore (2024)",
      "media_provinciale": {
        "femmine": 73.6,
        "maschi": 103.0,
        "gap_perc": 28.5
      },
      "settori_chiave": {
        "manifatturiero": {
          "femmine": 82.7,
          "maschi": 107.9
        },
        "commercio": {
          "femmine": 70.4,
          "maschi": 91.5
        },
        "alloggio_ristorazione": {
          "femmine": 52.8,
          "maschi": 61.5
        },
        "sanita": {
          "femmine": 61.1,
          "maschi": 77.9
        },
        "costruzioni": {
          "femmine": 71.5,
          "maschi": 93.1
        }
      }
    },
    "part_time": {
      "incidenza_donne": 48.4,
      "incidenza_uomini": 12.1,
      "totale": 27.2
    }
  },
  "entrate_vigilanza": {
    "entrate_contributive": {
      "serie_storica": [
        {
          "anno": 2022,
          "importo": 622795440.27
        },
        {
          "anno": 2023,
          "importo": 646153457.06
        },
        {
          "anno": 2024,
          "importo": 675251190.81
        },
        {
          "anno": 2025,
          "importo": 790761669.24
        }
      ],
      "totale_2025": 790761669.24
    },
    "recupero_crediti_2025": 58551088.93,
    "riscossione_coattiva_2025": {
      "totale_provinciale": 20279573.24,
      "totale_milioni": 20.3,
      "aziende_uniemens": 11983183.24,
      "totale_2022": 14581190.56
    },
    "vigilanza_ispettiva": {
      "2024": {
        "numero_ispezioni": 185,
        "aziende_irregolari": 153,
        "accertato_contributi": 5828964,
        "accertato_sanzioni": 3402959
      },
      "2025": {
        "numero_ispezioni": 153,
        "aziende_irregolari": 134,
        "accertato_contributi": 6214580,
        "accertato_sanzioni": 3712900
      },
      "confronto": {
        "2023": {
          "numero_ispezioni": 178,
          "aziende_irregolari": 142,
          "accertato_contributi": 5210000,
          "accertato_sanzioni": 3100000
        },
        "2024": {
          "numero_ispezioni": 185,
          "aziende_irregolari": 153,
          "accertato_contributi": 5828964,
          "accertato_sanzioni": 3402959
        },
        "2025": {
          "numero_ispezioni": 153,
          "aziende_irregolari": 134,
          "accertato_contributi": 6214580,
          "accertato_sanzioni": 3712900
        }
      },
      "2023": {
        "numero_ispezioni": 178,
        "aziende_irregolari": 142,
        "accertato_contributi": 5210000,
        "accertato_sanzioni": 3100000
      }
    },
    "vigilanza_documentale": {
      "2024": {
        "verifiche": 1175,
        "irregolarita": 717
      },
      "2025": {
        "verifiche": 777,
        "irregolarita": 553
      }
    },
    "durc": {
      "evoluzione": [
        {
          "anno": 2023,
          "regolari": 24342,
          "irregolari": 2905,
          "perc_irregolari": 10.7
        },
        {
          "anno": 2024,
          "regolari": 23872,
          "irregolari": 2560,
          "perc_irregolari": 9.7
        },
        {
          "anno": 2025,
          "regolari": 23186,
          "irregolari": 2152,
          "perc_irregolari": 8.5
        }
      ]
    },
    "entrate_contributive_list": [
      {
        "anno": 2022,
        "importo": 622795440.27
      },
      {
        "anno": 2023,
        "importo": 646153457.06
      },
      {
        "anno": 2024,
        "importo": 675251190.81
      },
      {
        "anno": 2025,
        "importo": 790761669.24
      }
    ],
    "durc_list": [
      {
        "anno": 2023,
        "regolari": 24342,
        "irregolari": 2905,
        "perc_irregolari": 10.7
      },
      {
        "anno": 2024,
        "regolari": 23872,
        "irregolari": 2560,
        "perc_irregolari": 9.7
      },
      {
        "anno": 2025,
        "regolari": 23186,
        "irregolari": 2152,
        "perc_irregolari": 8.5
      }
    ]
  },
  "ammortizzatori": {
    "naspi": {
      "serie_genere": [
        {
          "anno": 2022,
          "femmine": 8934,
          "maschi": 5806,
          "totale": 14740
        },
        {
          "anno": 2023,
          "femmine": 8900,
          "maschi": 6367,
          "totale": 15267
        },
        {
          "anno": 2024,
          "femmine": 9379,
          "maschi": 7016,
          "totale": 16395
        },
        {
          "anno": 2025,
          "femmine": 9352,
          "maschi": 7018,
          "totale": 16370
        }
      ],
      "tempi_accoglimento_2025": {
        "entro_15gg": 89.3,
        "oltre_15gg": 10.7
      }
    },
    "beneficiari_cessazione_2025": {
      "naspi": 20941,
      "disoccupazione_agricola": 909,
      "dis_coll": 202,
      "totale": 22052
    },
    "cig": {
      "ore_autorizzate_2025": {
        "cigo": 607251,
        "cigs": 522527,
        "fondi": 15991,
        "totale": 1145769
      },
      "beneficiari_sospensione": {
        "2024": {
          "cigo": 7293,
          "cigs": 1987,
          "fondi": 72,
          "totale": 9352
        },
        "2025": {
          "cigo": 6454,
          "cigs": 2261,
          "fondi": 103,
          "totale": 8818
        }
      },
      "tempi_erogazione": {
        "cigo": {
          "pesaro_urbino": 7,
          "marche": 13,
          "italia": 20
        },
        "fis": {
          "pesaro_urbino": 29,
          "marche": 32,
          "italia": 48
        }
      }
    }
  },
  "pensioni": {
    "pensionati": {
      "title": "Pensionati INPS per tipologia - 2025",
      "totale": 99246,
      "femmine": 51249,
      "maschi": 47997,
      "per_tipologia": {
        "pensionati_ivs": 89255,
        "beneficiari_sociali": 4234,
        "beneficiari_invalidita_civile": 19666
      }
    },
    "pensioni_vigenti": {
      "title": "Pensioni IVS vigenti per gestione - 2025",
      "totale": 113214,
      "per_gestione": {
        "lavoratori_autonomi": 42080,
        "fondo_lavoratori_dipendenti": 40170,
        "dipendenti_pubblici": 21150,
        "altre_gestioni": 9814
      }
    },
    "importi_medi_vigenti": {
      "pesaro_urbino": {
        "fpld": {
          "femmine": 918.2,
          "maschi": 1810.4
        },
        "dipendenti_pubblici": {
          "femmine": 1895.0,
          "maschi": 2535.2
        },
        "lavoratori_autonomi": {
          "femmine": 765.8,
          "maschi": 1348.0
        }
      }
    },
    "pensioni_liquidate": {
      "evoluzione": [
        {
          "anno": 2022,
          "totale": 6030,
          "femmine": 3231,
          "maschi": 2799
        },
        {
          "anno": 2023,
          "totale": 5508,
          "femmine": 2863,
          "maschi": 2645
        },
        {
          "anno": 2024,
          "totale": 5822,
          "femmine": 2960,
          "maschi": 2862
        },
        {
          "anno": 2025,
          "totale": 5751,
          "femmine": 3109,
          "maschi": 2642
        }
      ],
      "composizione_2025": {
        "vecchiaia": 1720,
        "anzianita": 1510,
        "superstiti": 1495,
        "invalidita": 540
      }
    },
    "calcolo_liquidate": {
      "2025": {
        "retributivo": 1276,
        "misto": 3173,
        "contributivo": 845
      }
    },
    "performance_liquidazione_30gg": {
      "fondi_speciali": 94.9,
      "gestione_pubblica": 83.7,
      "gestione_privata": 82.7
    },
    "distribuzione_tempi_privata_2025": {
      "entro_30gg": 82.7,
      "tra_31_60gg": 9.2,
      "tra_61_90gg": 2.8,
      "oltre_90gg": 5.3
    },
    "anticipazioni_pensionistiche": {
      "opzione_donna": {
        "2023": 101,
        "2024": 39,
        "2025": 26
      },
      "quota_103": {
        "2023": 127,
        "2024": 100,
        "2025": 39
      },
      "ape_sociale_2024": 145,
      "lavoratori_precoci_2024": 71,
      "lavori_usuranti": {
        "2023": 2,
        "2024": 1,
        "2025": 2
      }
    }
  },
  "assistenza": {
    "invalidita_civile": {
      "prestazioni_vigenti_2025": {
        "indennita_accompagnamento": {
          "femmine": 10239,
          "maschi": 6285,
          "totale": 16524
        },
        "pensioni_invalidita": {
          "femmine": 3200,
          "maschi": 2560,
          "totale": 5760
        }
      },
      "liquidate_serie": [
        {
          "anno": 2022,
          "totale": 3526
        },
        {
          "anno": 2023,
          "totale": 3596
        },
        {
          "anno": 2024,
          "totale": 3540
        },
        {
          "anno": 2025,
          "totale": 4249
        }
      ],
      "tempi_medi": {
        "fase_sanitaria": 139,
        "fase_amministrativa": 18,
        "totale": 157
      },
      "fasce_liquidazione_tavola48": {
        "title": "Invalidità Civile – Prestazioni per fasce di liquidazione (Tavola 48)",
        "scaglioni": [
          "Entro 15 gg",
          "16-30 gg",
          "31-60 gg",
          "61-90 gg",
          "91-120 gg",
          "121-180 gg",
          "181-360 gg",
          "Oltre 360 gg"
        ],
        "pesaro_urbino_valori": [
          38,
          35,
          172,
          264,
          264,
          504,
          813,
          459
        ],
        "pesaro_urbino_perc": [
          1.5,
          1.4,
          6.8,
          10.4,
          10.4,
          19.8,
          31.9,
          18.0
        ],
        "marche_perc": [
          4.9,
          6.1,
          12.3,
          12.9,
          11.6,
          18.7,
          22.9,
          10.7
        ],
        "italia_perc": [
          6.0,
          5.0,
          11.2,
          10.0,
          9.8,
          13.4,
          20.2,
          24.5
        ]
      }
    },
    "sostegno_reddito": {
      "adi_2025": 1557,
      "sfl_2025": 149,
      "reddito_liberta_2025": {
        "presentate": 51,
        "accolte": 24
      }
    },
    "assegno_unico": {
      "2024": 38226,
      "2025": 37788
    }
  },
  "contenzioso": {
    "amministrativo": {
      "giacenza_inizio": 40,
      "ricorsi_pervenuti": 408,
      "deliberati": 227,
      "giacenza_fine": 38
    },
    "giudizi_ordinari": {
      "iniziati_2025": 138,
      "definiti_2025": 145,
      "contributivo": {
        "da_lavorare_inizio": 114,
        "iniziati": 47,
        "definiti": 52,
        "favorevole_inps": 67.3,
        "da_lavorare_fine": 109
      }
    },
    "atp_invalidita_civile": {
      "iniziati_2025": 767,
      "definiti_2025": 729,
      "favorevole_inps": 39.6,
      "favorevole_utenti": 51.6
    }
  },
  "relazioni_utenza": {
    "informazione_primo_livello": {
      "2024": {
        "accesso_sede": 8652,
        "ricontatto_telefonico": 5214,
        "web_meeting": 63
      },
      "2025": {
        "accesso_sede": 5788,
        "ricontatto_telefonico": 4751,
        "web_meeting": 110
      },
      "2023": {
        "accesso_sede": 11224,
        "ricontatto_telefonico": 5535,
        "web_meeting": 24
      }
    },
    "consulenza_secondo_livello": {
      "2024": 3022,
      "2025": 3520
    },
    "cassetto_bidirezionale": {
      "aziende_2025": {
        "in_entrata": 18478,
        "in_uscita": 22658
      },
      "patronati_2025": {
        "in_entrata": 9493,
        "in_uscita": 9496
      },
      "aziende": {
        "2023": {
          "in_entrata": 18900,
          "in_uscita": 22800
        },
        "2024": {
          "in_entrata": 19120,
          "in_uscita": 23410
        },
        "2025": {
          "in_entrata": 18478,
          "in_uscita": 22658
        }
      },
      "patronati": {
        "2023": {
          "in_entrata": 9600,
          "in_uscita": 9610
        },
        "2024": {
          "in_entrata": 9820,
          "in_uscita": 9815
        },
        "2025": {
          "in_entrata": 9493,
          "in_uscita": 9496
        }
      }
    },
    "flusso_pec": {
      "2024": {
        "inviate": 14410,
        "ricevute": 19919
      },
      "2025": {
        "inviate": 13538,
        "ricevute": 20355
      },
      "2023": {
        "inviate": 12866,
        "ricevute": 18125
      }
    }
  },
  "organizzazione": {
    "presidio": {
      "comuni": 50,
      "strutture_inps": 4,
      "punti_cliente_servizio": 2,
      "patronati": 70,
      "caf": 24
    },
    "personale": {
      "totale_2025": 124,
      "femmine": 83,
      "maschi": 41,
      "dirigenti": 1,
      "medici_professionisti": 4,
      "aree_professionali": 119,
      "serie_storica": [
        {
          "anno": 2020,
          "totale": 140
        },
        {
          "anno": 2021,
          "totale": 121
        },
        {
          "anno": 2022,
          "totale": 115
        },
        {
          "anno": 2023,
          "totale": 133
        },
        {
          "anno": 2024,
          "totale": 127
        },
        {
          "anno": 2025,
          "totale": 124
        }
      ],
      "eta_media_2025": 53.8,
      "per_area": {
        "dirigenti": {
          "totale": 1
        },
        "medici_professionisti": {
          "totale": 4
        },
        "aree_professionali": {
          "totale": 119
        }
      },
      "eta_media": {
        "evoluzione": [
          {
            "anno": 2020,
            "eta": 55.4
          },
          {
            "anno": 2021,
            "eta": 55.1
          },
          {
            "anno": 2022,
            "eta": 54.7
          },
          {
            "anno": 2023,
            "eta": 54.3
          },
          {
            "anno": 2024,
            "eta": 54.1
          },
          {
            "anno": 2025,
            "eta": 53.8
          }
        ]
      }
    },
    "distribuzione_territoriale": {
      "strutture": {
        "numero_comuni": 50,
        "strutture_inps": 4,
        "punti_cliente_servizio": 2,
        "patronati": 70,
        "caf": 24
      }
    }
  },
  "patrimonio": {
    "valore_euro_2025": 13839976.4,
    "fabbricati": 4,
    "unita_agricole": 0,
    "immobiliare": {
      "valore_euro": {
        "2022": 13839976.4,
        "2023": 13839976.4,
        "2024": 13839976.4,
        "2025": 13839976.4
      },
      "fabbricati": 4,
      "unita_agricole": 0
    }
  }
};
