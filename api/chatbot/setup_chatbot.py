import subprocess
import sys
import os

def install_requirements():
    print("Installation des dépendances...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("Dépendances installées!")

def check_env_variables():
    print("Vérification des variables d'environnement...")
    
    mistral_key = os.getenv("MISTRAL_API_KEY", "xpDQGIUEC8BCHAopm6HnjhM673m2gYWh")
    if mistral_key == "xpDQGIUEC8BCHAopm6HnjhM673m2gYWh":
        print("Clé API Mistral configurée par défaut!")
    else:
        print("Clé API Mistral personnalisée détectée!")
    
    print("Variables d'environnement OK!")
    return True

def test_api():
    print("Test de l'API...")
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("API accessible!")
            return True
    except:
        print("API non accessible")
        return False

def main():
    print("Configuration du Chatbot")
    print("=" * 50)
    
    try:
        install_requirements()
    except Exception as e:
        print(f"Erreur lors de l'installation: {e}")
        return
    
    env_ok = check_env_variables()
    
    print("\nInstructions de démarrage:")
    print("Clé API Mistral déjà configurée!")
    print("\n1. Démarrez l'API:")
    print("   python chatbot_simple.py")
    print("\n2. L'API sera disponible sur http://localhost:8000")
    print("\n3. Testez avec: curl http://localhost:8000/health")
    print("\nPour utiliser votre propre clé:")
    print("   export MISTRAL_API_KEY='votre-cle-mistral'")
    
    print("\nPrêt à démarrer!")

if __name__ == "__main__":
    main()
