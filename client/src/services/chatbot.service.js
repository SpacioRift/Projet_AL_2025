// Service pour gérer les interactions avec le chatbot
class ChatbotService {
  constructor() {
    this.apiUrl = "http://localhost:8000"
    this.isOnline = true
    this.offlineResponses = this.getOfflineResponses()
  }

  // Réponses hors ligne pré-enregistrées
  getOfflineResponses() {
    return {
      navigation: {
        keywords: ["navigation", "naviguer", "menu", "sidebar", "page"],
        response: `🧭 **Navigation dans l'application** :

🔹 **Sidebar gauche** : 3 icônes principales
   • 📊 **Statistiques** : Vue d'ensemble et graphiques  
   • 📦 **Stock** : Gestion des produits (page principale)
   • 📈 **Mouvements** : Historique des entrées/sorties

🔹 **Header** : Titre "Gestion de Stock" et bouton déconnexion

💡 Cliquez sur les icônes pour naviguer entre les pages !`,
      },
      stock: {
        keywords: ["stock", "produit", "tableau", "gérer"],
        response: `📦 **Gestion des stocks** :

✅ **Actions disponibles** :
   • Ajouter un nouveau produit
   • Modifier les informations
   • Supprimer des produits
   • Filtrer par catégorie/type

🔍 **Recherche** : Utilisez la barre de recherche pour trouver rapidement vos produits

📋 Le tableau affiche toutes les informations importantes de vos produits`,
      },
      help: {
        keywords: ["aide", "help", "bonjour", "salut", "comment"],
        response: `👋 **Bienvenue dans l'assistant de gestion de stock !**

🤖 Je peux vous aider avec :
   • Navigation dans l'application
   • Gestion des stocks et produits  
   • Utilisation des filtres
   • Questions générales

💡 **Mode hors ligne** : Réponses de base disponibles même sans connexion

❓ Posez-moi vos questions sur l'utilisation de l'application !`,
      },
      default: {
        keywords: [],
        response: `🤖 **Assistant hors ligne**

Je suis actuellement en mode hors ligne avec des réponses de base.

📋 **Sujets disponibles** :
   • Navigation dans l'application
   • Gestion des stocks
   • Aide générale

💡 **Mots-clés utiles** : "navigation", "stock", "aide", "comment"

🔄 La connexion sera rétablie automatiquement dès que possible.`,
      },
    }
  }

  // Vérifier la connexion à l'API
  async checkConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: "GET",
        timeout: 3000,
      })
      this.isOnline = response.ok
      return this.isOnline
    } catch (error) {
      this.isOnline = false
      return false
    }
  }

  // Trouver une réponse hors ligne
  findOfflineResponse(message) {
    const lowerMessage = message.toLowerCase()

    for (const [key, data] of Object.entries(this.offlineResponses)) {
      if (key === "default") continue

      const hasKeyword = data.keywords.some((keyword) => lowerMessage.includes(keyword))

      if (hasKeyword) {
        return data.response
      }
    }

    return this.offlineResponses.default.response
  }

  // Envoyer un message au chatbot
  async sendMessage(messages) {
    // Vérifier la connexion
    const isConnected = await this.checkConnection()

    if (!isConnected) {
      // Mode hors ligne
      const lastMessage = messages[messages.length - 1]
      const offlineResponse = this.findOfflineResponse(lastMessage.content)

      return {
        message: offlineResponse,
        isOffline: true,
      }
    }

    try {
      // Mode en ligne
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
        timeout: 10000,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        message: data.message,
        isOffline: false,
      }
    } catch (error) {
      console.error("Erreur API chatbot:", error)

      // Fallback vers mode hors ligne
      const lastMessage = messages[messages.length - 1]
      const offlineResponse = this.findOfflineResponse(lastMessage.content)

      return {
        message: offlineResponse,
        isOffline: true,
      }
    }
  }

  // Questions suggérées
  getSuggestedQuestions() {
    return [
      "Comment naviguer dans l'application ?",
      "Comment ajouter un nouveau produit ?",
      "Comment utiliser les filtres ?",
      "Où voir les statistiques ?",
      "Comment gérer les mouvements de stock ?",
    ]
  }
}

export default new ChatbotService()
