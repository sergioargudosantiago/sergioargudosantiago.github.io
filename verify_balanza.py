"""Quick verification of the Balanza de Pagos implementation."""

with open(r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\comercio-exterior.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'BALANZA_171_RAW': 'BALANZA_171_RAW' in html,
    'BALANZA_174_RAW': 'BALANZA_174_RAW' in html,
    'BALANZA_174A_RAW': 'BALANZA_174A_RAW' in html,
    'BALANZA_174C_RAW': 'BALANZA_174C_RAW' in html,
    'switchMainTab fn': 'function switchMainTab' in html,
    'initBalanzaDeP fn': 'function initBalanzaDeP' in html,
    'render171KPIs fn': 'function render171KPIs' in html,
    'render171Chart fn': 'function render171Chart' in html,
    'render171Table fn': 'function render171Table' in html,
    'render174KPIs fn': 'function render174KPIs' in html,
    'render174BarChart fn': 'function render174BarChart' in html,
    'render174TourismChart fn': 'function render174TourismChart' in html,
    'render174DonutChart fn': 'function render174DonutChart' in html,
    'render174IngPagChart fn': 'function render174IngPagChart' in html,
    'flujosView div': 'id="flujosView"' in html,
    'balanzaView div': 'id="balanzaView"' in html,
    'bp171Chart canvas': 'id="bp171Chart"' in html,
    'bp174BarChart canvas': 'id="bp174BarChart"' in html,
    'bp174TourismChart canvas': 'id="bp174TourismChart"' in html,
    'bp174DonutChart canvas': 'id="bp174DonutChart"' in html,
    'bp174IngPagChart canvas': 'id="bp174IngPagChart"' in html,
    'main-tab-toggle CSS': 'main-tab-toggle' in html,
    'bp-kpi-card CSS': 'bp-kpi-card' in html,
    'bp-chart-card CSS': 'bp-chart-card' in html,
    'switchBPTab fn': 'function switchBPTab' in html,
}

print("=== Verification Results ===")
all_ok = True
for name, result in checks.items():
    status = "OK" if result else "MISSING"
    if not result:
        all_ok = False
    print(f"  {status}: {name}")

print(f"\nTotal lines: {html.count(chr(10)) + 1}")
print(f"File size: {len(html)} bytes")
print(f"\nAll checks passed: {all_ok}")

# Also check for HTML balance
opens = html.count('<div')
closes = html.count('</div')
print(f"\nDiv balance: {opens} opens, {closes} closes (diff: {opens - closes})")
