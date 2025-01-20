import json
import uuid
from datetime import datetime
import os

def transform_vinyles_stores():
    input_file = 'paris-from-api.json'
    
    # Vérifier que le fichier existe
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Le fichier {input_file} n'existe pas dans le répertoire courant.")
    
    # Charger les données
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            stores = json.load(f)
    except json.JSONDecodeError as e:
        raise Exception(f"Erreur lors du décodage du JSON: {e}")
    
    transformed_stores = []
    
    for store in stores:
        transformed_store = {
            "store_id": str(uuid.uuid4()),
            "metadata": {
                "name": store["nom"],
                "address": store["adresse"],
                "city": "Paris",
                "coordinates": {
                    "latitude": store["latitude"],
                    "longitude": store["longitude"]
                },
                "contact": {
                    "phone": store["telephone"],
                    "website": store["site_web"]
                },
                "business_info": {
                    "rating": store["note"],
                    "review_count": store["nombre_avis"],
                    "status": store["statut"],
                    "opening_hours": store["horaires"] if store.get("horaires") else []
                }
            },
            "vinyl_collection": {
                "current_inventory": [],
                "has_been_digged": []
            },
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "last_inventory_update": None
        }
        transformed_stores.append(transformed_store)
    
    # Sauvegarder le fichier transformé
    output_file = 'paris_transformed.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(transformed_stores, f, ensure_ascii=False, indent=2)
    
    print(f"Transformation terminée. {len(transformed_stores)} magasins traités.")
    print(f"Fichier de sortie créé : {output_file}")
    return output_file

if __name__ == "__main__":
    try:
        output_file = transform_vinyles_stores()
        
        # Afficher un exemple de résultat
        with open(output_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print("\nExemple de structure pour le premier magasin:")
            print(json.dumps(data[0], indent=2))
            
    except Exception as e:
        print(f"Une erreur est survenue : {e}")