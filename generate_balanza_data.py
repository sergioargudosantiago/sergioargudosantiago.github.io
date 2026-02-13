"""
Generate embedded JavaScript data from BdE Balanza de Pagos CSV files.
Outputs a JS snippet to be pasted into comercio-exterior.html.
"""
import os
import csv
import json
import io

BALANZA_DIR = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\balanza'
OUTPUT = r'c:\sergioargudosantiago.github.io\sergioargudosantiago.github.io\balanza_data.js'

def read_bde_csv(filepath):
    """Read a BdE-format CSV: 6 header rows + data rows."""
    with open(filepath, 'rb') as f:
        raw = f.read()
    text = raw.decode('latin-1')
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    
    # Row 0: CODIGO DE LA SERIE (codes)
    # Row 1: NUMERO SECUENCIAL
    # Row 2: ALIAS DE LA SERIE (aliases)
    # Row 3: DESCRIPCION DE LA SERIE (descriptions)
    # Row 4: DESCRIPCION DE LAS UNIDADES
    # Row 5: FRECUENCIA
    # Row 6+: data
    
    aliases = rows[2][1:]  # skip first column header
    descriptions = rows[3][1:]
    frequency = rows[5][1] if len(rows[5]) > 1 else 'UNKNOWN'
    
    data = []
    for row in rows[6:]:
        if not row:
            continue
        period = row[0].strip('"')
        if period in ('FUENTE', 'NOTAS', ''):
            continue
        values = []
        for v in row[1:]:
            v = v.strip()
            if v == '_' or v == '':
                values.append(None)
            else:
                try:
                    values.append(float(v) if '.' in v else int(v))
                except ValueError:
                    values.append(None)
        data.append({'period': period, 'values': values})
    
    return {
        'aliases': aliases,
        'descriptions': descriptions,
        'frequency': frequency,
        'data': data
    }


def format_serie_171(parsed):
    """Format Serie 17.1 - Monthly BoP summary. Only last ~120 months (2015+)."""
    # Columns: 0=Cuenta corriente, 1=Bienes y servicios, 2=Rentas, 
    #           3=Cuenta capital, 4=Cta corriente+capital, 
    #           5=Cta financiera, 6=BdE, 7=Excl BdE, 8=Errores
    labels = [
        'Cuenta Corriente', 'Bienes y Servicios', 'Rentas Primaria y Secundaria',
        'Cuenta de Capital', 'Cta. Corriente + Capital',
        'Cuenta Financiera', 'Banco de España', 'Excl. Banco de España', 'Errores y Omisiones'
    ]
    
    # Filter from 2015 onwards
    months_map = {'ENE':1,'FEB':2,'MAR':3,'ABR':4,'MAY':5,'JUN':6,
                  'JUL':7,'AGO':8,'SEP':9,'OCT':10,'NOV':11,'DIC':12}
    
    result = []
    for row in parsed['data']:
        parts = row['period'].split(' ')
        if len(parts) == 2:
            month_abbr, year_str = parts
            year = int(year_str)
            if year >= 2015:
                month = months_map.get(month_abbr, 0)
                result.append({
                    'year': year,
                    'month': month,
                    'monthName': month_abbr,
                    'values': row['values'][:9]
                })
    
    return {'labels': labels, 'data': result}


def format_serie_174(parsed):
    """Format Serie 17.4 - Quarterly current account detail. From 2015+."""
    labels = [
        'Bienes Saldo', 'Bienes Ingresos', 'Bienes Pagos',
        'Servicios Saldo', 'Turismo Saldo', 'Serv. No Turísticos Saldo', 
        'Servicios Ingresos', 'Turismo Ingresos', 'Serv. No Turísticos Ingresos',
        'Servicios Pagos', 'Turismo Pagos', 'Serv. No Turísticos Pagos'
    ]
    
    quarter_map = {'MAR':1, 'JUN':2, 'SEP':3, 'DIC':4}
    
    result = []
    for row in parsed['data']:
        parts = row['period'].split(' ')
        if len(parts) == 2:
            month_abbr, year_str = parts
            year = int(year_str)
            if year >= 2015:
                q = quarter_map.get(month_abbr, 0)
                result.append({
                    'year': year,
                    'quarter': q,
                    'values': row['values'][:12]
                })
    
    return {'labels': labels, 'data': result}


def format_serie_174a(parsed):
    """Format Serie 17.4A - Non-tourist services by type. From 2015+."""
    # First 13 columns = Ingresos (OS total + 12 sub-types)
    # Next 13 columns = Pagos
    ingresos_labels = [
        'Total No Turísticos', 'Transformación y Reparaciones', 'Transporte',
        'Construcción', 'Seguros y Pensiones', 'Servicios Financieros',
        'Propiedad Intelectual', 'Telecomunicaciones e Informática',
        'Otros Serv. Empresariales', 'I+D', 'Consultoría',
        'Serv. Técnicos y Comerciales', 'Personales y Culturales'
    ]
    
    quarter_map = {'MAR':1, 'JUN':2, 'SEP':3, 'DIC':4}
    
    result = []
    for row in parsed['data']:
        parts = row['period'].split(' ')
        if len(parts) == 2:
            month_abbr, year_str = parts
            year = int(year_str)
            if year >= 2020:
                q = quarter_map.get(month_abbr, 0)
                vals = row['values']
                # Only take ingresos (first 13) and pagos (next 13)
                ingresos = vals[:13] if len(vals) >= 13 else vals
                pagos = vals[13:26] if len(vals) >= 26 else []
                result.append({
                    'year': year,
                    'quarter': q,
                    'ingresos': ingresos,
                    'pagos': pagos
                })
    
    return {'labels': ingresos_labels, 'data': result}


def format_serie_174c(parsed):
    """Format Serie 17.4C - Tourism by country (Ingresos). From 2020+."""
    labels = [
        'Total', 'Europa', 'UE 27', 'UEM 20',
        'Alemania', 'Bélgica', 'Países Bajos', 'Francia',
        'Italia', 'Irlanda', 'Portugal', 'UE27 extra UEM20',
        'Europa extra UE27', 'Reino Unido', 'Rusia', 'Suiza',
        'América', 'Am. Norte y Central', 'EEUU', 'Am. del Sur',
        'África', 'Asia'
    ]
    
    quarter_map = {'MAR':1, 'JUN':2, 'SEP':3, 'DIC':4}
    
    result = []
    for row in parsed['data']:
        parts = row['period'].split(' ')
        if len(parts) == 2:
            month_abbr, year_str = parts
            year = int(year_str)
            if year >= 2020:
                q = quarter_map.get(month_abbr, 0)
                result.append({
                    'year': year,
                    'quarter': q,
                    'values': row['values'][:22]
                })
    
    return {'labels': labels, 'data': result}


def main():
    # Read all CSV files
    s171 = read_bde_csv(os.path.join(BALANZA_DIR, 'be1701.csv'))
    s174 = read_bde_csv(os.path.join(BALANZA_DIR, 'be1704.csv'))
    s174a = read_bde_csv(os.path.join(BALANZA_DIR, 'be174a.csv'))
    s174c = read_bde_csv(os.path.join(BALANZA_DIR, 'be174c.csv'))
    
    # Format the data
    data_171 = format_serie_171(s171)
    data_174 = format_serie_174(s174)
    data_174a = format_serie_174a(s174a)
    data_174c = format_serie_174c(s174c)
    
    # Generate JS
    js = '// ========== BALANZA DE PAGOS DATA ==========\n'
    js += f'const BALANZA_171 = {json.dumps(data_171, ensure_ascii=False)};\n\n'
    js += f'const BALANZA_174 = {json.dumps(data_174, ensure_ascii=False)};\n\n'
    js += f'const BALANZA_174A = {json.dumps(data_174a, ensure_ascii=False)};\n\n'
    js += f'const BALANZA_174C = {json.dumps(data_174c, ensure_ascii=False)};\n\n'
    
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(js)
    
    print(f'Generated {OUTPUT}')
    print(f'Serie 17.1: {len(data_171["data"])} monthly records')
    print(f'Serie 17.4: {len(data_174["data"])} quarterly records')
    print(f'Serie 17.4A: {len(data_174a["data"])} quarterly records')
    print(f'Serie 17.4C: {len(data_174c["data"])} quarterly records')


if __name__ == '__main__':
    main()
