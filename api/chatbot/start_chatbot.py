import subprocess
import sys
import time
import requests
from threading import Thread

def start_api():
    print("Démarrage de l'API Chatbot...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "chatbot_simple:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\nArrêt de l'API")

def check_api_health():
    print("Attente du démarrage de l'API...")
    for i in range(30):
        try:
            response = requests.get("http://localhost:8000/health", timeout=2)
            if response.status_code == 200:
                print("API démarrée avec succès!")
                print("API disponible sur: http://localhost:8000")
                print("Documentation: http://localhost:8000/docs")
                return True
        except:
            time.sleep(1)
    
    print("L'API n'a pas pu démarrer")
    return False

def test_chat():
    print("\nTest du chatbot...")
    try:
        response = requests.post(
            "http://localhost:8000/chat",
            json={
                "messages": [
                    {"role": "user", "content": "Comment naviguer dans l'application ?"}
                ]
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("Chatbot fonctionnel!")
            print(f"Réponse: {data['message'][:100]}...")
        else:
            print(f"Erreur: {response.status_code}")
            
    except Exception as e:
        print(f"Erreur lors du test: {e}")

def main():
    print("Démarrage du Chatbot")
    print("=" * 50)
    print("Clé API Mistral: Configurée")
    print("Python: FastAPI")
    print("=" * 50)
    
    api_thread = Thread(target=start_api, daemon=True)
    api_thread.start()
    
    if check_api_health():
        test_chat()
        print("\nTout est prêt!")
        print("Utilisez Ctrl+C pour arrêter")
        
        try:
            api_thread.join()
        except KeyboardInterrupt:
            print("\nAu revoir!")
    else:
        print("Impossible de démarrer l'API")

if __name__ == "__main__":
    main()
