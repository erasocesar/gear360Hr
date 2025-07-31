import requests
import csv
from io import StringIO

# Fetch the CSV file
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Servicios%20de%20Gestion%20Humana-4YO7xfpociFw3gbGevZi59kliVXW0a.csv"
response = requests.get(url)

if response.status_code == 200:
    # Parse CSV content
    csv_content = StringIO(response.text)
    csv_reader = csv.reader(csv_content)
    
    print("SERVICIOS DE GESTIÓN HUMANA - GEAR360HR")
    print("=" * 60)
    
    rows = list(csv_reader)
    if len(rows) > 0:
        headers = rows[0]
        print("COLUMNAS ENCONTRADAS:")
        for i, header in enumerate(headers):
            print(f"{i+1}. {header}")
        print("-" * 60)
        
        print("SERVICIOS DETALLADOS:")
        for i, row in enumerate(rows[1:], 1):
            print(f"\nSERVICIO {i}:")
            for j, value in enumerate(row):
                if j < len(headers):
                    print(f"  {headers[j]}: {value}")
        
        # Buscar servicios de IA específicamente
        print("\n" + "=" * 60)
        print("SERVICIOS DE IA IDENTIFICADOS:")
        print("=" * 60)
        
        for i, row in enumerate(rows[1:], 1):
            service_text = " ".join(row).lower()
            if "ia" in service_text or "inteligencia artificial" in service_text or "ai" in service_text or "automatiz" in service_text or "chatbot" in service_text or "virtual" in service_text:
                print(f"\nSERVICIO DE IA #{i}:")
                for j, value in enumerate(row):
                    if j < len(headers) and value.strip():
                        print(f"  {headers[j]}: {value}")
    else:
        print("No se encontraron datos en el archivo CSV")
        
else:
    print(f"Error al obtener el archivo: {response.status_code}")
