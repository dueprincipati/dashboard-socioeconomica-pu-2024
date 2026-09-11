with open('js/main.js', 'r', encoding='utf-8') as f:
    orig = f.read()

# Replace dashboardData with dashboardData2025
code = orig.replace('dashboardData.', 'dashboardData2025.')
code = code.replace('typeof dashboardData !==', 'typeof dashboardData2025 !==')
code = code.replace('dashboardData =', 'dashboardData2025 =')
code = code.replace('if (!dashboardData)', 'if (typeof dashboardData2025 === "undefined" || !dashboardData2025)')

# Update specific chart data points for 2025:
# 1. agePyramidChart
code = code.replace(
    "data: [11.8, 11.6, 12.2]",
    "data: [11.5, 11.3, 11.9]"
).replace(
    "data: [63.0, 62.2, 63.5]",
    "data: [62.8, 62.1, 63.4]"
).replace(
    "data: [25.3, 26.2, 24.4]",
    "data: [25.7, 26.6, 24.7]"
)

# 2. genderDistributionChart
code = code.replace(
    "data: [50.8, 49.2]",
    "data: [50.7, 49.3]"
)

# 3. lifeExpectancyChart
code = code.replace(
    "data: [86.1, 85.9, 85.1]",
    "data: [86.4, 86.2, 85.6]"
).replace(
    "data: [82.2, 81.9, 81.0]",
    "data: [82.8, 82.4, 81.5]"
)

# 4. naturalBalanceChart (2014-2024)
code = code.replace(
    "const years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];",
    "const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];"
)
code = code.replace(
    "data: [-717, -728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883]",
    "data: [-728, -1137, -1089, -1370, -1414, -1666, -2755, -2018, -2270, -1883, -2009]"
)

# 5. migrationFlowChart
code = code.replace(
    "data: [1888, 1774, 1437, 1629, 1700, 1894, 1843, 1618, 1630, 1626, 1758]",
    "data: [1774, 1437, 1629, 1700, 1894, 1843, 1618, 1630, 1626, 1758, 1924]"
).replace(
    "data: [508, 538, 635, 702, 683, 790, 665, 748, 564, 642, 653]",
    "data: [538, 635, 702, 683, 790, 665, 748, 564, 642, 653, 817]"
)

# 6. demographicBalanceChart
code = code.replace(
    "data: [1380, 1236, 802, 927, 1017, 1104, 1178, 870, 1066, 984, 1105]",
    "data: [1236, 802, 927, 1017, 1104, 1178, 870, 1066, 984, 1105, 1107]"
).replace(
    "data: [663, 508, -335, -162, -353, -310, -488, -1885, -952, -1286, -778]",
    "data: [508, -335, -162, -353, -310, -488, -1885, -952, -1286, -778, -902]"
)

# 7. mainIndicatorsChart (2023, 2024, 2025)
code = code.replace(
    "labels: ['2022', '2023', '2024'],\n                datasets: [\n                    { label: 'Tasso Occupazione PU', data: [69.6, 69.2, 70.1]",
    "labels: ['2023', '2024', '2025'],\n                datasets: [\n                    { label: 'Tasso Occupazione PU', data: [69.2, 70.1, 68.7]"
).replace(
    "{ label: 'Tasso Disoccupazione PU', data: [4.9, 5.2, 3.7]",
    "{ label: 'Tasso Disoccupazione PU', data: [5.2, 3.7, 4.1]"
).replace(
    "{ label: 'Tasso Occupazione Italia', data: [60.1, 61.5, 62.2]",
    "{ label: 'Tasso Occupazione Italia', data: [61.5, 62.2, 62.5]"
).replace(
    "{ label: 'Tasso Disoccupazione Italia', data: [8.1, 7.7, 6.5]",
    "{ label: 'Tasso Disoccupazione Italia', data: [7.7, 6.5, 6.2]"
)

# 8. workersCompositionChart (2024)
code = code.replace(
    "data: [138925, 12217, 11987, 7149, 4868, 2744]",
    "data: [140641, 12004, 11235, 7655, 4776, 2694]"
)

# 9. genderPayGapChart (2024)
code = code.replace(
    "data: [78.1, 67.9, 51.3, 58.4, 68.1]",
    "data: [82.7, 70.4, 52.8, 61.1, 71.5]"
).replace(
    "data: [102.6, 89.0, 60.6, 74.6, 90.5]",
    "data: [107.9, 91.5, 61.5, 77.9, 93.1]"
)

# 10. hiresByContractChart (2024 vs 2025)
code = code.replace(
    "label: 'Assunzioni 2023', data: [8613, 19258, 7251, 5716, 11106]",
    "label: 'Assunzioni 2024', data: [7727, 18388, 7595, 5043, 12153]"
).replace(
    "label: 'Assunzioni 2024', data: [7727, 18388, 7595, 5043, 12153]",
    "label: 'Assunzioni 2025', data: [7417, 17611, 7231, 5119, 12331]"
)

# 11. hiresTerminationsBalanceChart (2025)
code = code.replace(
    "label: 'Cessazioni 2024', data: [11130, 14409, 7561, 5114, 11840]",
    "label: 'Cessazioni 2025', data: [11443, 13375, 7257, 5009, 12189]"
)

# 12. partTimeIncidenceChart (2024)
code = code.replace(
    "data: [48.1, 45.6, 44.1]",
    "data: [48.4, 45.8, 44.5]"
).replace(
    "data: [11.5, 12.9, 15.4]",
    "data: [12.1, 13.2, 15.8]"
)

# 13. NASpI
code = code.replace(
    "data: [8934, 8900, 9379]",
    "data: [8900, 9379, 9352]"
).replace(
    "data: [5806, 6367, 7016]",
    "data: [6367, 7016, 7018]"
)
code = code.replace(
    "data: [88.5, 11.5]",
    "data: [89.3, 10.7]"
)

# 14. CIG timing 2025
code = code.replace(
    "data: [11, 12, 21]",
    "data: [7, 10, 18]"
).replace(
    "data: [52, 41, 78]",
    "data: [29, 35, 65]"
)

# 15. Pensioni
code = code.replace(
    "data: [45645, 43460]",
    "data: [45640, 43682]"
).replace(
    "data: [14394, 8566]",
    "data: [14892, 8891]"
)
code = code.replace(
    "data: [42269, 40466, 20684, 9563]",
    "data: [42080, 40170, 21150, 9814]"
)
code = code.replace(
    "data: [5818, 6030, 5508, 5822]",
    "data: [6030, 5508, 5822, 5751]"
).replace(
    "data: [3187, 3231, 2863, 2960]",
    "data: [3231, 2863, 2960, 3109]"
).replace(
    "data: [2631, 2799, 2645, 2862]",
    "data: [2799, 2645, 2862, 2642]"
)

# 16. Assistenza liquidate & tempi
code = code.replace(
    "data: [3906, 3526, 3596, 3540]",
    "data: [3526, 3596, 3540, 4249]"
)
code = code.replace(
    "data: [123, 142, 97, 125]",
    "data: [110, 139, 95, 120]"
).replace(
    "data: [19, 20, 18, 16]",
    "data: [21, 18, 17, 15]"
)

# ADD fasceLiquidazioneChart in renderAssistenzaInvalidita
fasce_chart_code = """
        this.createChart('fasceLiquidazioneChart', {
            type: 'bar',
            data: {
                labels: ['<15gg', '16-30gg', '31-60gg', '61-90gg', '91-120gg', '121-180gg', '181-360gg', '>360gg'],
                datasets: [
                    { label: 'Pesaro Urbino (%)', data: [1.5, 1.4, 6.8, 10.4, 10.4, 19.8, 31.9, 18.0], backgroundColor: colors.sky, borderRadius: 5 },
                    { label: 'Marche (%)', data: [4.9, 6.1, 12.3, 12.9, 11.6, 18.7, 22.9, 10.7], backgroundColor: colors.teal, borderRadius: 5 },
                    { label: 'Italia (%)', data: [6.0, 5.0, 11.2, 10.0, 9.8, 13.4, 20.2, 24.5], backgroundColor: 'rgba(148, 163, 184, 0.5)', borderRadius: 5 }
                ]
            },
            options: { ...commonOptions, plugins: { ...commonOptions.plugins, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.raw}%` } } } }
        });
"""
pos_insert = code.find("this.createChart('tempiDefinizioneChart'")
if pos_insert != -1:
    end_insert = code.find("});", pos_insert) + 3
    code = code[:end_insert] + "\n" + fasce_chart_code + code[end_insert:]

with open('js/main_2025.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("✅ Generated js/main_2025.js successfully")
