"""
Update comercio-exterior.html with:
1. New embedded CSV data including Industrial sector with lv4
2. Level 4 HTML structure
3. Level 4 JavaScript functions
"""
import re

html_path = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\comercio-exterior.html'
csv_path = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\full_embed_data.csv'

# Read the new CSV data
with open(csv_path, 'r', encoding='utf-8') as f:
    new_csv_data = f.read()

# Read the HTML file
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

print("[INFO] HTML file size:", len(html_content), "bytes")
print("[INFO] CSV data size:", len(new_csv_data), "bytes")

# 1. Replace the EMBEDDED_CSV_DATA content
pattern = r"const EMBEDDED_CSV_DATA = `[^`]+`"
replacement = f"const EMBEDDED_CSV_DATA = `{new_csv_data}`"

if re.search(pattern, html_content):
    html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    print("[OK] Updated EMBEDDED_CSV_DATA")
else:
    print("[ERROR] Could not find EMBEDDED_CSV_DATA pattern")

# 2. Add Level 4 HTML structure (after level3View)
level4_html = '''
                <!-- Level 4 View (for Industrial sector) -->
                <div id="level4View" class="hidden">
                    <h3 id="level4Title" class="text-xl font-semibold text-slate-200 mb-4"></h3>
                    <div id="level4Grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <!-- Level 4 items will be inserted here -->
                    </div>
                </div>
'''

if 'id="level4View"' not in html_content:
    analytics_pattern = r'(<!-- Analytics Section -->)'
    html_content = re.sub(analytics_pattern, level4_html + r'\n                \1', html_content)
    print("[OK] Added Level 4 HTML structure")
else:
    print("[INFO] Level 4 HTML structure already exists")

# 3. Update navigationState to include lv4
nav_state_pattern = r'let navigationState = \{[^}]+\}'
new_nav_state = '''let navigationState = {
            macroSector: null,
            lv1: null,
            lv2: null,
            lv3: null,
            lv4: null
        }'''

if 'lv4: null' not in html_content:
    html_content = re.sub(nav_state_pattern, new_nav_state, html_content)
    print("[OK] Updated navigationState with lv4")
else:
    print("[INFO] navigationState already has lv4")

# 4. Add showLevel4 function
show_level4_function = '''
        // ========== LEVEL 4 NAVIGATION (Industrial sector only) ==========
        function showLevel4() {
            console.log('Mostrando Level 4');
            const filtered = allData.filter(row =>
                row.macro_sector === navigationState.macroSector &&
                row.flujo === currentFlow &&
                row.lv1 === navigationState.lv1.code &&
                row.lv2 === navigationState.lv2.code &&
                row.lv3 === navigationState.lv3.code &&
                row.lv4 && row.lv4 !== 'NA'
            );

            console.log('Datos filtrados para Level 4:', filtered.length, 'registros');

            // Get unique Level 4 items with totals
            const lv4Items = {};
            filtered.forEach(row => {
                const key = row.lv4;
                if (!lv4Items[key]) {
                    lv4Items[key] = {
                        code: row.lv4,
                        name: row.lit_lv4,
                        total: 0
                    };
                }
                if (row.year === '2025') {
                    lv4Items[key].total += parseNumericValue(row.total_millones);
                }
            });

            const grid = document.getElementById('level4Grid');
            grid.innerHTML = '';

            const sortedItems = Object.values(lv4Items).sort((a, b) => b.total - a.total);

            sortedItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all cursor-pointer';
                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <h4 class="text-slate-200 font-medium text-sm">${item.name}</h4>
                        <span class="text-cyan-400 font-bold ml-2">${formatNumber(item.total)}M</span>
                    </div>
                `;
                card.onclick = () => selectLevel4(item);
                grid.appendChild(card);
            });

            // Update title
            document.getElementById('level4Title').textContent = navigationState.lv3.name + ' - Detalle';

            // Update analytics for Level 4
            updateDashboardMetrics(filtered, navigationState.lv3.name, 'lv4');

            showView('level4View');
            updateBreadcrumbs();
        }

        function selectLevel4(item) {
            console.log('Seleccionando Level 4:', item.name);
            navigationState.lv4 = { code: item.code, name: item.name };

            const filtered = allData.filter(row =>
                row.macro_sector === navigationState.macroSector &&
                row.flujo === currentFlow &&
                row.lv1 === navigationState.lv1.code &&
                row.lv2 === navigationState.lv2.code &&
                row.lv3 === navigationState.lv3.code &&
                row.lv4 === item.code
            );

            // Show final analytics view with lv4 data
            updateDashboardMetrics(filtered, item.name, 'lv4');
            showView('level4View');
            updateBreadcrumbs();
        }
'''

if 'function showLevel4()' not in html_content:
    show_view_pattern = r'(function showView\(viewId\))'
    html_content = re.sub(show_view_pattern, show_level4_function + r'\n        \1', html_content)
    print("[OK] Added showLevel4 function")
else:
    print("[INFO] showLevel4 function already exists")

# 5. Update showView to handle level4View
views_pattern = r"const views = \['homeView', 'level1View', 'level2View', 'level3View'\]"
new_views = "const views = ['homeView', 'level1View', 'level2View', 'level3View', 'level4View']"
if "'level4View'" not in html_content:
    html_content = html_content.replace(views_pattern, new_views)
    print("[OK] Updated views array with level4View")
else:
    print("[INFO] views array already has level4View")

# 6. Update updateDashboardMetrics to handle lv4
metrics_lv3_pattern = r"} else \{ // Assumes level === 'lv3'"
metrics_lv4_handling = '''} else if (level === 'lv3') {
            tvaValue = latestRecord.tva_lv3;
            countriesString = latestRecord.top_paises_lv3;
        } else { // level === 'lv4'
            tvaValue = latestRecord.tva_lv4 || latestRecord.tva_lv3;
            countriesString = latestRecord.top_paises_lv4 || latestRecord.top_paises_lv3;'''

if "level === 'lv4'" not in html_content:
    html_content = html_content.replace(metrics_lv3_pattern, metrics_lv4_handling)
    print("[OK] Updated updateDashboardMetrics for lv4")
else:
    print("[INFO] updateDashboardMetrics already handles lv4")

# 7. Update updateBreadcrumbs to show lv4
breadcrumb_lv4_code = '''
        // Add lv4 if present (Industrial sector only)
        if (navigationState.lv4) {
            const lv4Name = navigationState.lv4.name;
            if (lv4Name && lv4Name !== navigationState.lv3?.name) {
                crumbs.push({
                    label: lv4Name,
                    action: null
                });
            }
        }'''

if 'navigationState.lv4' not in html_content:
    breadcrumb_render_pattern = r"(container\.innerHTML = crumbs\.map)"
    html_content = re.sub(breadcrumb_render_pattern, breadcrumb_lv4_code + r'\n\n        \1', html_content)
    print("[OK] Added lv4 to breadcrumbs")
else:
    print("[INFO] Breadcrumbs already handle lv4")

# Write the updated HTML
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("[DONE] HTML file updated successfully!")
print("[INFO] New file size:", len(html_content), "bytes")
