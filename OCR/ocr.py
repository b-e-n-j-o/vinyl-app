import ssl
import certifi
import easyocr
import os
import logging
import gc
from pathlib import Path
from typing import Dict, List, Optional
from PIL import Image
import cv2
import numpy as np
from matplotlib import pyplot as plt

# Configuration SSL
ssl_context = ssl.create_default_context(cafile=certifi.where())
ssl._create_default_https_context = ssl._create_unverified_context

# Configuration du dossier des modèles
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
os.environ['EASYOCR_MODULE_PATH'] = MODELS_DIR
Path(MODELS_DIR).mkdir(parents=True, exist_ok=True)

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ocr_process.log'),
        logging.StreamHandler()
    ]
)

def initialize_reader(languages=['en'], force_download=False):
    """
    Initialise le lecteur OCR avec gestion du cache des modèles
    """
    try:
        logging.info(f"Initialisation du lecteur OCR avec les modèles stockés dans : {MODELS_DIR}")
        
        # Vérifie si les modèles existent déjà
        model_file = os.path.join(MODELS_DIR, 'craft_mlt_25k.pth')
        download_enabled = force_download or not os.path.exists(model_file)
        
        if download_enabled:
            logging.info("Modèles non trouvés, téléchargement en cours...")
        
        reader = easyocr.Reader(
            languages,
            model_storage_directory=MODELS_DIR,
            download_enabled=download_enabled  # Active le téléchargement si nécessaire
        )
        return reader
    except Exception as e:
        logging.error(f"Erreur lors de l'initialisation du lecteur : {str(e)}")
        return None

def process_ocr_results(text_results: List, confidence_threshold: float = 0.7) -> Dict:
    """
    Traite et filtre les résultats de l'OCR et combine les textes
    """
    filtered_results = []
    combined_text = []
    
    for bbox, text, confidence in text_results:
        if confidence >= confidence_threshold:
            filtered_results.append({
                'text': text.strip(),
                'confidence': confidence,
                'position': bbox
            })
            combined_text.append(text.strip())
    
    # Tri par niveau de confiance
    filtered_results = sorted(filtered_results, key=lambda x: x['confidence'], reverse=True)
    
    return {
        'detailed_results': filtered_results,
        'combined_text': ' '.join(combined_text)
    }

def analyze_vinyl_text(results: List[Dict]) -> Dict:
    """
    Analyse les résultats pour identifier les informations spécifiques aux vinyles
    """
    analyzed_data = {
        'artist': None,
        'title': None,
        'label': None,
        'catalog_number': None,
        'year': None,
        'confidence_score': 0
    }
    
    # Analyse uniquement les résultats avec la plus haute confiance
    high_confidence_texts = [r['text'] for r in results if r['confidence'] > 0.85]
    
    if high_confidence_texts:
        # Simple heuristique - peut être améliorée
        analyzed_data['artist'] = high_confidence_texts[0]
        if len(high_confidence_texts) > 1:
            analyzed_data['title'] = high_confidence_texts[1]
            
        analyzed_data['confidence_score'] = max(r['confidence'] for r in results)
    
    return analyzed_data

def optimize_image(image_path: str, max_size: int = 1600) -> str:
    """
    Optimise la taille de l'image avant traitement OCR
    """
    try:
        with Image.open(image_path) as img:
            # Convertir en RGB si nécessaire
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Redimensionner si l'image est trop grande
            if max(img.size) > max_size:
                ratio = max_size / max(img.size)
                new_size = tuple(int(dim * ratio) for dim in img.size)
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Créer un dossier temporaire si nécessaire
            temp_dir = os.path.join(os.path.dirname(image_path), 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Sauvegarder l'image optimisée
            temp_path = os.path.join(temp_dir, f"opt_{os.path.basename(image_path)}")
            img.save(temp_path, 'JPEG', quality=85)
            
            return temp_path
    except Exception as e:
        logging.error(f"Erreur lors de l'optimisation de l'image : {str(e)}")
        return image_path

def select_roi(image_path: str) -> tuple:
    """
    Permet à l'utilisateur de sélectionner la zone de texte sur l'image en définissant 4 points
    Retourne les coordonnées du polygone sous forme de numpy array
    """
    # Lecture de l'image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Création de la fenêtre et sélection du ROI
    plt.figure(figsize=(12, 8))
    plt.imshow(image)
    plt.title("Sélectionnez 4 points pour définir la zone à analyser\nAppuyez sur 'Entrée' pour confirmer")
    plt.axis('off')
    
    # Récupération des 4 points
    points = plt.ginput(4, timeout=30)
    plt.close()
    
    if len(points) == 4:
        # Conversion des points en array numpy
        pts = np.array(points, dtype=np.int32)
        x, y, w, h = cv2.boundingRect(pts)
        return (x, y, w, h), pts
    return None, None

def process_images(folder_path: str, languages: List[str] = ['en'], 
                  confidence_threshold: float = 0.7,
                  batch_size: int = 2) -> Optional[Dict]:
    """
    Traite les images par lots pour optimiser la mémoire
    """
    try:
        reader = initialize_reader(languages)
        if not reader:
            raise Exception("Échec de l'initialisation du lecteur OCR")
            
        results_dict = {}
        image_files = [f for f in os.listdir(folder_path) 
                      if not f.startswith('.') and f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        for i in range(0, len(image_files), batch_size):
            batch = image_files[i:i + batch_size]
            
            for image_file in batch:
                image_path = os.path.join(folder_path, image_file)
                logging.info(f"\nTraitement de l'image : {image_file}")
                
                try:
                    # Optimisation de l'image
                    optimized_path = optimize_image(image_path)
                    
                    # Sélection de la région d'intérêt
                    roi, points = select_roi(optimized_path)
                    if roi:
                        # Lecture de l'image
                        image = cv2.imread(optimized_path)
                        x, y, w, h = roi
                        
                        # Création d'un masque pour la zone sélectionnée
                        mask = np.zeros(image.shape[:2], dtype=np.uint8)
                        pts = points.reshape((-1, 1, 2))
                        cv2.fillPoly(mask, [pts], (255))
                        
                        # Application du masque
                        masked_image = cv2.bitwise_and(image, image, mask=mask)
                        cropped_image = masked_image[y:y+h, x:x+w]
                        
                        # Sauvegarde temporaire de l'image recadrée
                        crop_path = os.path.join(os.path.dirname(optimized_path), f"crop_{os.path.basename(image_file)}")
                        cv2.imwrite(crop_path, cropped_image)
                        
                        # Lecture du texte sur la zone sélectionnée
                        text_results = reader.readtext(crop_path)
                        os.remove(crop_path)  # Nettoyage
                    else:
                        text_results = reader.readtext(optimized_path)
                    
                    # Traitement des résultats
                    processed_results = process_ocr_results(text_results, confidence_threshold)
                    vinyl_info = analyze_vinyl_text(processed_results['detailed_results'])
                    
                    results_dict[image_file] = {
                        'raw_results': processed_results['detailed_results'],
                        'vinyl_info': vinyl_info,
                        'combined_text': processed_results['combined_text']
                    }
                    
                    # Logging des résultats
                    for result in processed_results['detailed_results']:
                        logging.info(f'Texte détecté : "{result["text"]}" '
                                   f'(Probabilité: {result["confidence"]:.2f})')
                    
                    logging.info(f"\nTexte combiné pour {image_file}:")
                    logging.info(processed_results['combined_text'])
                    
                    # Nettoyage du fichier temporaire
                    if optimized_path != image_path:
                        os.remove(optimized_path)
                        
                except Exception as e:
                    logging.error(f"Erreur lors du traitement de {image_file}: {str(e)}")
                    results_dict[image_file] = {'error': str(e)}
            
            # Nettoyage de la mémoire après chaque lot
            gc.collect()
        
        return results_dict
                    
    except Exception as e:
        logging.error(f"Erreur générale : {str(e)}")
        return None

if __name__ == "__main__":
    folder_path = "/Volumes/T7/DIG/vinyl-app/OCR/images_vinyles"
    results = process_images(
        folder_path, 
        languages=['en', 'fr'],
        confidence_threshold=0.7,
        batch_size=2
    )
    
    if results:
        logging.info("\n" + "="*50)
        logging.info("RÉSULTATS DU TRAITEMENT OCR")
        logging.info("="*50)
        
        for image_file, result in results.items():
            if 'error' not in result:
                logging.info("\n" + "-"*50)
                logging.info(f"Image : {image_file}")
                logging.info(f"Texte détecté : {result['combined_text']}")
                
                # Affichage des informations vinyle si disponibles
                vinyl_info = result['vinyl_info']
                if vinyl_info['artist'] or vinyl_info['title']:
                    logging.info("\nInformations vinyle détectées :")
                    if vinyl_info['artist']:
                        logging.info(f"- Artiste : {vinyl_info['artist']}")
                    if vinyl_info['title']:
                        logging.info(f"- Titre  : {vinyl_info['title']}")
                logging.info("-"*50)
        
        success_count = sum(1 for r in results.values() if 'error' not in r)
        total_count = len(results)
        logging.info(f"\nImages traitées avec succès : {success_count}/{total_count}")
    else:
        logging.error("Le traitement OCR a échoué")