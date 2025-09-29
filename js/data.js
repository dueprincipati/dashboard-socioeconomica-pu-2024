// Dashboard Socio-Economica - Provincia di Pesaro e Urbino 2024
// Data extracted from RSP (Relazione Sociale Provinciale) 2024

const dashboardData = {
  metadata: {
    territorio: "Provincia di Pesaro e Urbino",
    anno: 2024,
    fonte: "INPS - Relazione Sociale Provinciale 2024",
    dataUltimoAggiornamento: "2024"
  },

  // 1. PANORAMA SOCIODEMOGRAFICO
  demografia: {
    popolazione: {
      title: "Distribuzione della popolazione per genere e età - 2024",
      totale: 349882,
      femmine: 177833,
      maschi: 172049,
      fasce_eta: {
        "0-14": 41180,
        "15-64": 220289,
        "65_e_oltre": 88413
      },
      percentuali: {
        femmine: 50.8,
        maschi: 49.2,
        "0-14": 11.8,
        "15-64": 63.0,
        "65_e_oltre": 25.3
      },
      confronti: {
        regione_marche: {
          totale: 1482746,
          femmine_perc: 51.0,
          maschi_perc: 49.0,
          "0-14_perc": 11.6,
          "15-64_perc": 62.2,
          "65_e_oltre_perc": 26.2
        },
        italia: {
          totale: 58971230,
          femmine_perc: 51.1,
          maschi_perc: 48.9,
          "0-14_perc": 12.2,
          "15-64_perc": 63.5,
          "65_e_oltre_perc": 24.4
        }
      }
    },

    saldo_naturale: {
      title: "Andamento saldo naturale - Serie storica",
      serie_storica: [
        { anno: 2013, nascite: 3076, decessi: 3793, saldo: -717 },
        { anno: 2014, nascite: 2931, decessi: 3659, saldo: -728 },
        { anno: 2015, nascite: 2840, decessi: 3977, saldo: -1137 },
        { anno: 2016, nascite: 2717, decessi: 3806, saldo: -1089 },
        { anno: 2017, nascite: 2528, decessi: 3898, saldo: -1370 },
        { anno: 2018, nascite: 2378, decessi: 3792, saldo: -1414 },
        { anno: 2019, nascite: 2268, decessi: 3934, saldo: -1666 },
        { anno: 2020, nascite: 2161, decessi: 4916, saldo: -2755 },
        { anno: 2021, nascite: 2182, decessi: 4200, saldo: -2018 },
        { anno: 2022, nascite: 2122, decessi: 4392, saldo: -2270 },
        { anno: 2023, nascite: 2036, decessi: 3919, saldo: -1883 }
      ],
      incidenza_2023: {
        saldo_naturale: -1883,
        popolazione: 350335,
        incidenza_percentuale: -0.5
      }
    },

    longevita: {
      title: "Speranza di vita - Confronto 2013-2023",
      data: {
        2013: {
          alla_nascita: { femmine: 85.8, maschi: 80.5 },
          a_65_anni: { femmine: 23.1, maschi: 18.9 },
          a_85_anni: { femmine: 7.3, maschi: 5.7 }
        },
        2023: {
          alla_nascita: { femmine: 86.1, maschi: 82.2 },
          a_65_anni: { femmine: 23.0, maschi: 20.1 },
          a_85_anni: { femmine: 7.1, maschi: 6.0 }
        }
      },
      confronti_2023: {
        regione_marche: {
          alla_nascita: { femmine: 85.9, maschi: 81.9 },
          a_65_anni: { femmine: 22.9, maschi: 20.0 },
          a_85_anni: { femmine: 7.2, maschi: 6.1 }
        },
        italia: {
          alla_nascita: { femmine: 85.1, maschi: 81.0 },
          a_65_anni: { femmine: 22.3, maschi: 19.4 },
          a_85_anni: { femmine: 7.1, maschi: 6.0 }
        }
      }
    },

    flussi_migratori: {
      title: "Flussi migratori - Emigrati e Immigrati",
      emigrati: {
        serie_storica: [
          { anno: 2003, femmine: 87, maschi: 124, totale: 211 },
          { anno: 2013, femmine: 224, maschi: 284, totale: 508 },
          { anno: 2023, femmine: 295, maschi: 358, totale: 653 }
        ],
        dettaglio_2023: {
          femmine: {
            "0-17": 48, "18-39": 159, "40-64": 76, "oltre_65": 12
          },
          maschi: {
            "0-17": 63, "18-39": 176, "40-64": 99, "oltre_65": 20
          }
        },
        incidenza_percentuale: 0.2
      },
      immigrati: {
        serie_storica: [
          { anno: 2003, femmine: 619, maschi: 850, totale: 1469 },
          { anno: 2013, femmine: 1082, maschi: 806, totale: 1888 },
          { anno: 2023, femmine: 816, maschi: 942, totale: 1758 }
        ],
        dettaglio_2023: {
          femmine: {
            "0-17": 125, "18-39": 315, "40-64": 323, "oltre_65": 53
          },
          maschi: {
            "0-17": 119, "18-39": 536, "40-64": 272, "oltre_65": 15
          }
        },
        incidenza_percentuale: 0.5
      },
      saldo_demografico: {
        serie_storica: [
          { anno: 2013, saldo_migratorio: 1380, saldo_naturale: -717, saldo_demografico: 663 },
          { anno: 2014, saldo_migratorio: 1236, saldo_naturale: -728, saldo_demografico: 508 },
          { anno: 2015, saldo_migratorio: 802, saldo_naturale: -1137, saldo_demografico: -335 },
          { anno: 2016, saldo_migratorio: 927, saldo_naturale: -1089, saldo_demografico: -162 },
          { anno: 2017, saldo_migratorio: 1017, saldo_naturale: -1370, saldo_demografico: -353 },
          { anno: 2018, saldo_migratorio: 1104, saldo_naturale: -1414, saldo_demografico: -310 },
          { anno: 2019, saldo_migratorio: 1178, saldo_naturale: -1666, saldo_demografico: -488 },
          { anno: 2020, saldo_migratorio: 870, saldo_naturale: -2755, saldo_demografico: -1885 },
          { anno: 2021, saldo_migratorio: 1066, saldo_naturale: -2018, saldo_demografico: -952 },
          { anno: 2022, saldo_migratorio: 984, saldo_naturale: -2270, saldo_demografico: -1286 },
          { anno: 2023, saldo_migratorio: 1105, saldo_naturale: -1883, saldo_demografico: -778 }
        ]
      }
    }
  },

  // 2. MERCATO DEL LAVORO
  mercato_lavoro: {
    lavoratori: {
      title: "Lavoratori per genere, nazionalità e posizione - 2023",
      totale: 173233,
      dipendenti: {
        totale: 138925,
        comunitari: { femmine: 57627, maschi: 62301, totale: 119928 },
        extracomunitari: { femmine: 7511, maschi: 11486, totale: 18997 },
        suddivisione: {
          privati: 111352,
          pubblici: 20788,
          agricoli: 1917,
          domestici: 4868
        }
      },
      autonomi: {
        artigiani: 11987,
        commercianti: 12217,
        agricoli: 2744
      },
      gestione_separata: 7149,
      part_time: {
        totale_dipendenti: 100236,
        part_time: 26827,
        percentuale_pu: 26.8,
        percentuale_marche: 27.0,
        percentuale_italia: 27.4,
        dettaglio_genere: {
          femmine: { totale: 41826, part_time: 20127, percentuale: 48.1 },
          maschi: { totale: 58409, part_time: 6700, percentuale: 11.5 }
        }
      }
    },

    assunzioni: {
      title: "Confronto Assunzioni 2023-2024",
      confronto: {
        2023: {
          tempo_indeterminato: 8613,
          tempo_determinato: 19258,
          stagionale: 7251,
          somministrazione: 5716,
          intermittente: 11106,
          totale: 51944
        },
        2024: {
          tempo_indeterminato: 7727,
          tempo_determinato: 18388,
          stagionale: 7595,
          somministrazione: 5043,
          intermittente: 12153,
          totale: 50906
        }
      },
      dettaglio_2024: {
        italiani: {
          femmine: 16662,
          maschi: 17131,
          totale: 33793
        },
        stranieri: {
          femmine: 4702,
          maschi: 8697,
          totale: 13399
        }
      },
      part_time_fasce_eta_2024: {
        "fino_29": { femmine: 3960, maschi: 3275, totale: 7235 },
        "30_50": { femmine: 4347, maschi: 2013, totale: 6360 },
        "51_oltre": { femmine: 2286, maschi: 1375, totale: 3661 }
      }
    },

    cessazioni: {
      title: "Confronto Cessazioni 2023-2024",
      confronto: {
        2023: {
          tempo_indeterminato: 11532,
          tempo_determinato: 13868,
          stagionale: 7145,
          somministrazione: 5771,
          intermittente: 10872,
          totale: 49188
        },
        2024: {
          tempo_indeterminato: 11130,
          tempo_determinato: 14409,
          stagionale: 7561,
          somministrazione: 5114,
          intermittente: 11840,
          totale: 50054
        }
      }
    },

    retribuzioni: {
      title: "Retribuzioni medie giornaliere per settore - 2023",
      settore_privato: {
        manifatturiero: { femmine: 78.1, maschi: 102.6 },
        costruzioni: { femmine: 68.1, maschi: 90.5 },
        commercio: { femmine: 67.9, maschi: 89.0 },
        turismo_ristorazione: { femmine: 51.3, maschi: 60.6 },
        attivita_finanziarie: { femmine: 129.5, maschi: 178.0 },
        sanita_assistenza: { femmine: 58.4, maschi: 74.6 },
        media_totale: { femmine: 70.5, maschi: 98.6 }
      },
      settore_pubblico: {
        amministrazioni_centrali: { femmine: 132.6, maschi: 150.4 },
        amministrazioni_locali: { femmine: 95.9, maschi: 104.3 },
        forze_armate: { femmine: 136.1, maschi: 155.8 },
        scuola: { femmine: 94.1, maschi: 97.6 },
        servizio_sanitario: { femmine: 119.9, maschi: 151.0 },
        universita: { femmine: 134.9, maschi: 164.1 },
        media_totale: { femmine: 104.8, maschi: 131.0 }
      }
    },

    indicatori_occupazione: {
      title: "Indicatori del mercato del lavoro - 2024",
      occupati: {
        totale: 159000,
        femmine: 74000,
        maschi: 85000
      },
      tasso_occupazione: {
        totale: 70.1,
        femmine: {
          "15-24": 29.1, "25-34": 70.2, "35-49": 82.4, "50-64": 64.8
        },
        maschi: {
          "15-24": 30.4, "25-34": 82.6, "35-49": 90.9, "50-64": 75.7
        },
        confronti: {
          regione_marche: 67.2,
          italia: 62.2
        },
        evoluzione: {
          2022: 69.6,
          2023: 69.2,
          2024: 70.1
        }
      },
      disoccupati: {
        totale: 7000,
        femmine: 4000,
        maschi: 3000
      },
      tasso_disoccupazione: {
        totale: 3.7,
        evoluzione: {
          2022: 4.9,
          2023: 5.2,
          2024: 3.7
        },
        confronti: {
          regione_marche: 5.1,
          italia: 6.5
        }
      },
      inattivi: {
        totale: 142000,
        femmine: 80000,
        maschi: 62000
      },
      tasso_inattivita: {
        totale: 27.4,
        evoluzione: {
          2022: 26.8,
          2023: 26.9,
          2024: 27.4
        }
      }
    }
  },

  // 3. ENTRATE CONTRIBUTIVE E VIGILANZA
  entrate_vigilanza: {
    entrate_contributive: {
      title: "Entrate contributive ordinarie - Aziende Uniemens",
      serie_storica: [
        { anno: 2022, importo: 622795440.27 },
        { anno: 2023, importo: 646153457.06 },
        { anno: 2024, importo: 675251190.81 }
      ],
      confronti_2024: {
        regione_marche: 2532627422.36,
        italia: 127262994462.03
      }
    },

    recupero_crediti: {
      title: "Recupero crediti in fase amministrativa",
      serie_storica: [
        { anno: 2022, importo: 50333324.69 },
        { anno: 2023, importo: 53825366.72 },
        { anno: 2024, importo: 49134238.67 }
      ]
    },

    riscossione_coattiva: {
      title: "Riscossione coattiva AdER per gestione - 2024",
      gestioni: {
        aziende_uniemens: 12253147.94,
        gestione_agricola_datori: 234408.15,
        gestione_agricola_autonomi: 706827.14,
        gestione_artigiani: 3717533.06,
        gestione_commercianti: 5080377.02,
        gestione_pescatori: 330120.55,
        totale_provinciale: 22418626.81
      }
    },

    vigilanza_ispettiva: {
      title: "Vigilanza ispettiva - Confronto 2023-2024",
      confronto: {
        2023: {
          numero_ispezioni: 128,
          aziende_irregolari: 108,
          lavoratori_interessati: 1133,
          accertato_contributi: 3225438,
          accertato_sanzioni: 1507327
        },
        2024: {
          numero_ispezioni: 185,
          aziende_irregolari: 153,
          lavoratori_interessati: 2205,
          accertato_contributi: 5828964,
          accertato_sanzioni: 3402959
        }
      }
    },

    vigilanza_documentale: {
      title: "Vigilanza documentale - 2023-2024",
      2023: {
        verifiche: 739,
        irregolarita: 376,
        rapporti_fittizi: 9
      },
      2024: {
        verifiche: 1175,
        irregolarita: 717,
        rapporti_fittizi: 0
      }
    },

    durc: {
      title: "DURC - Documento Unico di Regolarità Contributiva",
      evoluzione: [
        { anno: 2022, regolari: 24300, irregolari: 3093, perc_irregolari: 11.3 },
        { anno: 2023, regolari: 24342, irregolari: 2905, perc_irregolari: 10.7 },
        { anno: 2024, regolari: 23872, irregolari: 2560, perc_irregolari: 9.7 }
      ]
    }
  },

  // 4. AMMORTIZZATORI SOCIALI
  ammortizzatori: {
    naspi: {
      title: "NASpI - Nuova Assicurazione Sociale per l'Impiego",
      evoluzione: [
        { anno: 2022, femmine: 8934, maschi: 5806, totale: 14740 },
        { anno: 2023, femmine: 8900, maschi: 6367, totale: 15267 },
        { anno: 2024, femmine: 9379, maschi: 7016, totale: 16395 }
      ],
      confronti_2024: {
        regione_marche: 63635,
        italia: 2267212
      }
    },

    beneficiari_cessazione: {
      title: "Beneficiari ammortizzatori per cessazione rapporto di lavoro",
      2023: {
        naspi: 19543,
        disoccupazione_agricola: 937,
        dis_coll: 110,
        totale: 20590
      },
      2024: {
        naspi: 20464,
        disoccupazione_agricola: 902,
        dis_coll: 126,
        totale: 21492
      }
    },

    cig: {
      title: "Cassa Integrazione Guadagni - Ore utilizzate",
      evoluzione: [
        { anno: 2021, cigo: 1233742, cigd: 1503663, cigs: 115336, fis: 1014495, totale: 3867236 },
        { anno: 2022, cigo: 365795, cigd: 0, cigs: 126111, fis: 90184, totale: 582090 },
        { anno: 2023, cigo: 720750, cigd: 0, cigs: 97009, fis: 17793, totale: 835552 },
        { anno: 2024, cigo: 681287, cigd: 0, cigs: 437841, fis: 4034, totale: 1123162 }
      ]
    },

    beneficiari_sospensione: {
      title: "Beneficiari ammortizzatori per sospensione rapporto di lavoro",
      2023: {
        cigo: 7694,
        cigs: 1025,
        fis: 130,
        totale: 8849
      },
      2024: {
        cigo: 7293,
        cigs: 1987,
        fis: 72,
        totale: 9352
      }
    },

    tempi_erogazione: {
      title: "Tempi medi di erogazione (giorni)",
      cigo: {
        2023: 17,
        2024: 11,
        confronti_2024: {
          regione_marche: 12,
          italia: 21
        }
      },
      fis: {
        2023: 39,
        2024: 52,
        confronti_2024: {
          regione_marche: 41,
          italia: 78
        }
      }
    }
  },

  // 5. PRESTAZIONI PENSIONISTICHE
  pensioni: {
    pensionati: {
      title: "Pensionati INPS per tipologia - 2024",
      totale: 98502,
      femmine: 50961,
      maschi: 47541,
      per_tipologia: {
        pensionati_ivs: 89105,
        beneficiari_sociali: 4061,
        beneficiari_invalidita_civile: 18899
      }
    },

    pensioni_vigenti: {
      title: "Pensioni IVS vigenti per gestione - 2024",
      totale: 112982,
      per_gestione: {
        fondo_lavoratori_dipendenti: {
          totale: 40466,
          anticipate: 14320,
          vecchiaia: 10975,
          invalidita: 4656,
          superstiti: 10515
        },
        dipendenti_pubblici: {
          totale: 20684,
          anticipate: 12353,
          vecchiaia: 2650,
          invalidita: 1726,
          superstiti: 3955
        },
        lavoratori_autonomi: {
          totale: 42269,
          anticipate: 17694,
          vecchiaia: 12747,
          invalidita: 2390,
          superstiti: 9438
        },
        altre_previdenziali: {
          totale: 4434,
          anticipate: 2172,
          vecchiaia: 1449,
          invalidita: 153,
          superstiti: 660
        }
      }
    },

    importi_medi_vigenti: {
      title: "Importi medi mensili pensioni vigenti - 2024 (Euro)",
      confronto_territori: {
        pesaro_urbino: {
          fondo_dipendenti: { femmine: 905.5, maschi: 1789.1 },
          dipendenti_pubblici: { femmine: 1875.4, maschi: 2511.7 },
          lavoratori_autonomi: { femmine: 754.4, maschi: 1330.4 },
          altre_previdenziali: { femmine: 1384.1, maschi: 1979.8 }
        },
        italia: {
          fondo_dipendenti: { femmine: 1047.7, maschi: 1982.9 },
          dipendenti_pubblici: { femmine: 1915.8, maschi: 2674.3 },
          lavoratori_autonomi: { femmine: 772.9, maschi: 1352.7 },
          altre_previdenziali: { femmine: 1479.9, maschi: 2244.2 }
        }
      }
    },

    pensioni_liquidate: {
      title: "Pensioni IVS liquidate - Evoluzione 2021-2024",
      evoluzione: [
        { anno: 2021, femmine: 3187, maschi: 2631, totale: 5818 },
        { anno: 2022, femmine: 3231, maschi: 2799, totale: 6030 },
        { anno: 2023, femmine: 2863, maschi: 2645, totale: 5508 },
        { anno: 2024, femmine: 2960, maschi: 2862, totale: 5822 }
      ]
    },

    anticipazioni_pensionistiche: {
      title: "Anticipazioni pensionistiche - Domande accolte",
      opzione_donna: {
        2022: 218,
        2023: 101,
        2024: 39
      },
      quota_103: {
        2023: { femmine: 24, maschi: 103, totale: 127 },
        2024: { femmine: 18, maschi: 82, totale: 100 }
      },
      ape_sociale: {
        2024: 145
      },
      lavoratori_precoci: {
        2024: 71
      },
      lavori_usuranti: {
        2022: 3,
        2023: 2,
        2024: 1
      }
    }
  },

  // 6. PRESTAZIONI ASSISTENZIALI
  assistenza: {
    invalidita_civile: {
      title: "Invalidità Civile - Prestazioni vigenti 2024",
      prestazioni_vigenti: {
        indennita_accompagnamento: { femmine: 9916, maschi: 5958, totale: 15874 },
        pensioni_invalidita: { femmine: 3155, maschi: 2501, totale: 5656 },
        totale: { femmine: 13071, maschi: 8459, totale: 21530 }
      },
      prestazioni_liquidate: {
        2023: { domande_presentate: 15764, domande_accolte: 15909 },
        2024: { domande_presentate: 16109, domande_accolte: 14487 }
      },
      tempi_medi: {
        2023: { fase_sanitaria: 123, fase_amministrativa: 19, totale: 142 },
        2024: { fase_sanitaria: 142, fase_amministrativa: 20, totale: 162 }
      }
    },

    sostegno_reddito: {
      title: "Misure di sostegno al reddito",
      rdc_pdc_2023: {
        domande_presentate: { femmine: 1099, maschi: 716, totale: 1815 },
        domande_accolte: { femmine: 560, maschi: 382, totale: 942 }
      },
      adi_sfl_2024: {
        adi_accolte: 1737,
        sfl_accolte: 185
      },
      evoluzione_accolte: {
        2022: { rdc_pdc: 2299 },
        2023: { rdc_pdc: 942, sfl: 143 },
        2024: { adi: 1737, sfl: 185 }
      }
    },

    assegno_unico: {
      title: "Assegno Unico Universale - Nuclei beneficiari",
      2023: {
        nuclei_au_domanda: 37537,
        nuclei_au_rdc: 764
      },
      2024: {
        nuclei_au_domanda: 38226,
        nuclei_au_rdc: 0
      }
    }
  },

  // 7. RELAZIONI CON L'UTENZA
  relazioni_utenza: {
    informazione_primo_livello: {
      title: "Informazione di I livello - Prenotazioni per tipologia",
      2023: {
        accesso_sede: 11224,
        ricontatto_telefonico: 5535,
        web_meeting: 24
      },
      2024: {
        accesso_sede: 8652,
        ricontatto_telefonico: 5214,
        web_meeting: 63
      }
    },

    consulenza_secondo_livello: {
      title: "Consulenza di II livello - Prenotazioni",
      2023: 2694,
      2024: 3022
    },

    cassetto_bidirezionale: {
      title: "Cassetto Bidirezionale - Comunicazioni",
      aziende: {
        2023: { in_entrata: 12465, in_uscita: 13287 },
        2024: { in_entrata: 15916, in_uscita: 13834 }
      },
      patronati: {
        2023: { in_entrata: 7277, in_uscita: 8072 },
        2024: { in_entrata: 8191, in_uscita: 8206 }
      }
    },

    flusso_pec: {
      title: "Flusso PEC - Posta Elettronica Certificata",
      2023: { inviate: 12866, ricevute: 18125 },
      2024: { inviate: 14410, ricevute: 19919 }
    }
  },

  // 8. ORGANIZZAZIONE E RISORSE UMANE
  organizzazione: {
    distribuzione_territoriale: {
      title: "Distribuzione presenze nei comuni - 2024",
      strutture: {
        numero_comuni: 50,
        strutture_inps: 4,
        punti_inps: 0,
        punti_cliente_servizio: 2,
        patronati: 68,
        caf: 23
      }
    },

    personale: {
      title: "Personale INPS per area e genere - 2024",
      totale: 127,
      femmine: 83,
      maschi: 44,
      per_area: {
        dirigenti: { femmine: 0, maschi: 1, totale: 1 },
        medici_professionisti: { femmine: 3, maschi: 1, totale: 4 },
        aree_professionali: { femmine: 80, maschi: 42, totale: 122 }
      },
      evoluzione: [
        { anno: 2019, totale: 144 },
        { anno: 2020, totale: 140 },
        { anno: 2021, totale: 121 },
        { anno: 2022, totale: 115 },
        { anno: 2023, totale: 133 },
        { anno: 2024, totale: 127 }
      ],
      eta_media: {
        evoluzione: [
          { anno: 2019, eta: 58.4 },
          { anno: 2020, eta: 58.3 },
          { anno: 2021, eta: 57.6 },
          { anno: 2022, eta: 56.0 },
          { anno: 2023, eta: 53.4 },
          { anno: 2024, eta: 53.1 }
        ]
      }
    }
  },

  // 9. CONTENZIOSO
  contenzioso: {
    amministrativo: {
      title: "Contenzioso amministrativo - 2024",
      ricorsi_pervenuti: 514,
      ricorsi_pervenuti_2023: 458,
      giacenza_inizio_anno: 25,
      giacenza_fine_anno: 40,
      risolti_amministrativamente: "12%",
      trasmessi_comitato: 340,
      deliberati: 322
    },

    giudiziario_ordinario: {
      title: "Contenzioso giudiziario ordinario - 2024",
      giudizi_pendenti_totali: 330,
      giudizi_definiti: "37.5%",
      principali_materie: {
        contenzioso_contributivo: {
          da_lavorare_inizio: 85,
          giudizi_iniziati: 71,
          da_lavorare_fine: 114,
          definiti: 42,
          favorevole_inps: "52.4%"
        },
        prestazioni_pensionistiche: {
          da_lavorare_inizio: 21,
          giudizi_iniziati: 25,
          da_lavorare_fine: 20,
          definiti: 26,
          favorevole_inps: "61.5%"
        },
        invalidita_civile_legale: {
          da_lavorare_inizio: 28,
          giudizi_iniziati: 41,
          da_lavorare_fine: 38,
          definiti: 31,
          favorevole_inps: "64.5%"
        }
      }
    },

    atp_invalidita_civile: {
      title: "Contenzioso ATP Invalidità Civile - 2024",
      giudizi_iniziati: 557,
      giudizi_definiti: 572,
      favorevole_inps: "33.2%",
      favorevole_utenti: "58.2%"
    }
  },

  // 10. PATRIMONIO A REDDITO
  patrimonio: {
    immobiliare: {
      title: "Patrimonio immobiliare da reddito",
      valore_euro: {
        2022: 13839976.4,
        2023: 13839976.4,
        2024: 13839976.4
      },
      confronti_2024: {
        regione_marche: 29269926.3,
        italia: 1810304663.0
      },
      distribuzione: {
        numero_fabbricati: 4,
        numero_unita_agricole: 0
      }
    }
  },

  // KPI PRINCIPALI (per il dashboard header)
  kpi: {
    popolazione_totale: 349882,
    tasso_occupazione: 70.1,
    pensionati_totale: 98502,
    entrate_contributive: 675251190.81,
    beneficiari_naspi: 16395,
    personale_inps: 127,
    saldo_demografico_2023: -778,
    crescita_entrate: "+4.5%"
  }
};

// Esporta i dati per l'uso nell'applicazione
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dashboardData;
}