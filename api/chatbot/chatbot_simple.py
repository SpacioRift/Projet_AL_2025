from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Management Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    message: str

KNOWLEDGE_BASE = {
    "navigation": """Navigation dans l'application :

Sidebar gauche avec 3 icônes principales :
- Statistiques : Vue d'ensemble et graphiques
- Stock : Gestion des produits (page principale)
- Mouvements : Historique des entrées/sorties

Header : Titre "Gestion de Stock" à gauche et bouton "Déconnexion" à droite

Navigation : Cliquez sur les icônes de la sidebar pour changer de page instantanément""",

    "stock": """Page Stock :

Gérer les produits :
- Ajouter : Bouton "Ajouter un produit" en haut à droite
- Modifier : Icône crayon bleue sur chaque ligne
- Supprimer : Icône poubelle rouge sur chaque ligne

Filtrer et rechercher :
- Recherche : Barre avec icône loupe (nom ou identifiant)
- Catégorie : Menu déroulant (Électronique, Mécanique, etc.)
- Type : Menu déroulant (Composant, Pièce, Module, etc.)
- Réinitialiser : Bouton pour effacer tous les filtres

Tableau : Colonnes Produit, Identifiant, Quantité, Disponible, Réservé, À venir, Catégorie, Type, Actions""",

    "ajouter": """Ajouter un produit :

1. Accéder : Bouton "Ajouter un produit" en haut à droite de la page Stock

2. Remplir le formulaire :
- Nom du produit : Nom descriptif
- Identifiant : Code unique (ex: PA001)
- Quantité : Stock total
- Disponible : Quantité disponible à la vente
- Catégorie : Électronique, Mécanique, Chimique... (ou créer nouvelle)
- Type : Composant, Pièce, Module, Outil... (ou créer nouveau)

3. Valider : Cliquez sur "Ajouter"

Le produit apparaît immédiatement dans le tableau""",

    "mouvements": """Page Mouvements :

Suivre l'historique complet :
- Entrées (flèche verte) : Livraisons, réapprovisionnements
- Sorties (flèche rouge) : Ventes, production, commandes
- Détails : Date, produit, identifiant, quantité, motif

Filtrer précisément :
- Recherche : Par nom de produit ou identifiant
- Type mouvement : Entrée ou Sortie uniquement
- Catégorie : Électronique, Mécanique, etc.
- Type produit : Composant, Pièce, etc.

Résumé automatique (3 cartes en bas) :
- Total Entrées (vert) : Somme de toutes les entrées
- Total Sorties (rouge) : Somme de toutes les sorties
- Nombre mouvements : Total des opérations""",

    "statistiques": """Page Statistiques :

4 cartes de résumé en haut :
- Stock Total : Quantité totale en stock
- Valeur Total : Valeur en euros
- Catégories : Nombre de catégories
- Types : Nombre de types de produits

4 graphiques interactifs :
- Barres quantités : Quantités par catégorie
- Secteurs : Répartition par type (camembert avec pourcentages)
- Barres valeurs : Valeurs en euros par catégorie
- Ligne évolution : Tendance sur 6 mois

Filtres dynamiques :
- Catégorie : Filtre toutes les données
- Type : Filtre par type de produit
- Réinitialiser : Remet tous les filtres
- Mise à jour automatique : Les graphiques changent en temps réel""",

    "filtres": """Filtres disponibles :

Page Stock (zone blanche en haut) :
- Recherche : Icône loupe + champ texte (nom/identifiant)
- Catégorie : Menu déroulant avec toutes les catégories
- Type : Menu déroulant avec tous les types
- Réinitialiser : Bouton gris pour tout effacer

Page Mouvements (5 filtres) :
- Recherche : Par nom de produit ou identifiant
- Type mouvement : Entrée, Sortie ou Tous
- Catégorie : Toutes les catégories disponibles
- Type produit : Tous les types disponibles
- Réinitialiser : Remet tous les filtres à "Tous"

Page Statistiques (3 filtres) :
- Catégorie : "Toutes les catégories" par défaut
- Type : "Tous les types" par défaut
- Réinitialiser : Bouton gris-ardoise

Astuce : Combinez plusieurs filtres pour des recherches ultra-précises""",

    "base_donnees": """Base de données JSON Server :

Configuration :
- Fichier : db.json à la racine du projet
- Port : http://localhost:3001
- API REST : Endpoints CRUD complets

Endpoints disponibles :
- GET /products - Liste tous les produits
- POST /products - Crée un nouveau produit
- PATCH /products/:id - Met à jour un produit
- DELETE /products/:id - Supprime un produit
- GET /movements - Liste tous les mouvements
- GET /categories - Liste toutes les catégories
- GET /types - Liste tous les types

Démarrage :
- npm run db - JSON Server uniquement
- npm run dev:full - Application complète

Avantages :
- Données persistantes (pas de perte au refresh)
- API REST standard
- Développement rapide sans vraie BDD"""
}

@app.get("/")
async def root():
    return {
        "message": "Stock Management Chatbot API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "chatbot-api",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"Received chat request with {len(request.messages)} messages")
        
        if not request.messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        last_message = request.messages[-1]
        user_input = last_message.content.lower()
        logger.info(f"User input: {user_input[:100]}...")
        
        response_message = None
        
        keywords_map = {
            "navigation": ["navigation", "naviguer", "menu", "sidebar", "page"],
            "stock": ["stock", "produit", "tableau", "gérer", "page stock"],
            "ajouter": ["ajouter", "créer", "nouveau produit", "formulaire"],
            "mouvements": ["mouvement", "entrée", "sortie", "historique"],
            "statistiques": ["statistique", "graphique", "analyse", "résumé"],
            "filtres": ["filtre", "recherche", "filtrer", "rechercher"],
            "base_donnees": ["base", "données", "json", "api", "serveur", "endpoint"]
        }
        
        for category, keywords in keywords_map.items():
            if any(keyword in user_input for keyword in keywords):
                response_message = KNOWLEDGE_BASE[category]
                logger.info(f"Found response in category: {category}")
                break
        
        if not response_message:
            response_message = f"""Je comprends votre question sur "{last_message.content}".

Assistant IA

Informations principales sur l'application :

Navigation : Sidebar gauche avec 3 icônes (Statistiques, Stock, Mouvements)
Stock : Gérez vos produits (ajouter, modifier, supprimer, filtrer)
Mouvements : Consultez l'historique des entrées/sorties
Statistiques : Analysez vos données avec des graphiques
Base de données : JSON Server avec API REST complète

Mots-clés utiles : "navigation", "stock", "ajouter", "mouvements", "statistiques", "filtres", "base de données"

Pour démarrer : npm run dev:full"""
        
        return ChatResponse(message=response_message)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return ChatResponse(
            message="Je suis désolé, j'ai rencontré une erreur technique. Pouvez-vous reformuler votre question sur l'application de gestion de stock ?"
        )

if __name__ == "__main__":
    logger.info("Démarrage de l'API Chatbot...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
