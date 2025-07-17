<template>
  <div class="chatbot-container">
    <!-- Bouton flottant pour ouvrir le chat -->
    <q-btn
      fab
      icon="chat"
      :color="isOnline ? 'primary' : 'grey-6'"
      class="chatbot-fab"
      @click="toggleChat"
    >
      <q-badge
        v-if="hasUnreadMessages"
        color="negative"
        floating
        rounded
      >
        {{ unreadCount }}
      </q-badge>
      
      <q-tooltip class="bg-primary">
        {{ isOnline ? 'Assistant IA disponible' : 'Assistant hors ligne' }}
      </q-tooltip>
    </q-btn>

    <!-- Fenêtre de chat -->
    <q-card
      v-if="isOpen"
      class="chatbot-window"
      :class="{ 'chatbot-window--mobile': $q.screen.lt.sm }"
    >
      <!-- Header du chat -->
      <q-card-section class="chatbot-header">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-white">
              🤖 Assistant IA
            </div>
            <div class="text-caption text-grey-3">
              <q-icon 
                :name="isOnline ? 'wifi' : 'wifi_off'" 
                size="12px"
                :color="isOnline ? 'positive' : 'warning'"
              />
              {{ isOnline ? 'En ligne' : 'Mode hors ligne' }}
            </div>
          </div>
          
          <q-btn
            flat
            round
            dense
            icon="minimize"
            color="white"
            @click="toggleChat"
          />
        </div>
      </q-card-section>

      <!-- Messages -->
      <q-card-section class="chatbot-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="message.role === 'user' ? 'message-user' : 'message-bot'"
        >
          <div class="message-bubble">
            <div
              v-if="message.role === 'assistant'"
              class="message-content"
              v-html="formatMessage(message.content)"
            />
            <div v-else class="message-content">
              {{ message.content }}
            </div>
            
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Indicateur de frappe -->
        <div v-if="isTyping" class="message-wrapper message-bot">
          <div class="message-bubble typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Questions suggérées -->
      <q-card-section
        v-if="showSuggestions && suggestedQuestions.length > 0"
        class="chatbot-suggestions"
      >
        <div class="text-caption text-grey-6 q-mb-sm">Questions suggérées :</div>
        <div class="row q-gutter-xs">
          <q-chip
            v-for="(question, index) in suggestedQuestions"
            :key="index"
            clickable
            outline
            color="primary"
            size="sm"
            @click="sendSuggestedQuestion(question)"
          >
            {{ question }}
          </q-chip>
        </div>
      </q-card-section>

      <!-- Zone de saisie -->
      <q-card-section class="chatbot-input">
        <q-input
          v-model="currentMessage"
          placeholder="Tapez votre message..."
          outlined
          dense
          :disable="isTyping"
          @keyup.enter="sendMessage"
        >
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              icon="send"
              color="primary"
              :disable="!currentMessage.trim() || isTyping"
              @click="sendMessage"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick} from 'vue'
import { useQuasar } from 'quasar'
import ChatbotService from '../services/chatbot.service.js'

const $q = useQuasar()

// État du composant
const isOpen = ref(false)
const isOnline = ref(true)
const isTyping = ref(false)
const currentMessage = ref('')
const messages = ref([])
const hasUnreadMessages = ref(false)
const unreadCount = ref(0)
const showSuggestions = ref(true)
const suggestedQuestions = ref([])
const messagesContainer = ref(null)

// Initialisation
onMounted(async () => {
  // Message de bienvenue
  addMessage('assistant', `👋 Bonjour ! Je suis votre assistant pour la gestion de stock.

🤖 Je peux vous aider avec :
• Navigation dans l'application
• Gestion des produits et stocks
• Utilisation des fonctionnalités
• Questions générales

💡 Posez-moi vos questions !`)

  // Charger les questions suggérées
  suggestedQuestions.value = ChatbotService.getSuggestedQuestions()
  
  // Vérifier la connexion
  await checkConnection()
})

// Vérifier la connexion
const checkConnection = async () => {
  isOnline.value = await ChatbotService.checkConnection()
}

// Basculer l'ouverture du chat
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasUnreadMessages.value = false
    unreadCount.value = 0
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// Ajouter un message
const addMessage = (role, content) => {
  messages.value.push({
    role,
    content,
    timestamp: new Date()
  })
  
  if (!isOpen.value && role === 'assistant') {
    hasUnreadMessages.value = true
    unreadCount.value++
  }
  
  nextTick(() => {
    scrollToBottom()
  })
}

// Envoyer un message
const sendMessage = async () => {
  if (!currentMessage.value.trim()) return
  
  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''
  showSuggestions.value = false
  
  // Ajouter le message utilisateur
  addMessage('user', userMessage)
  
  // Indicateur de frappe
  isTyping.value = true
  
  try {
    // Envoyer à l'API
    const response = await ChatbotService.sendMessage([
      ...messages.value.map(m => ({ role: m.role, content: m.content }))
    ])
    
    // Mettre à jour le statut de connexion
    isOnline.value = !response.isOffline
    
    // Ajouter la réponse
    addMessage('assistant', response.message)
    
  } catch (e) {
    console.log('Erreur chatbot:', e)
    addMessage('assistant', '❌ Désolé, une erreur est survenue. Veuillez réessayer.')
  } finally {
    isTyping.value = false
  }
}

// Envoyer une question suggérée
const sendSuggestedQuestion = (question) => {
  currentMessage.value = question
  sendMessage()
}

// Formater un message (markdown basique)
const formatMessage = (content) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;')
}

// Formater l'heure
const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Faire défiler vers le bas
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Vérifier périodiquement la connexion
setInterval(checkConnection, 30000)
</script>

<style lang="scss" scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.chatbot-fab {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.chatbot-window {
  width: 380px;
  height: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  
  &--mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}

.chatbot-header {
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  padding: 16px;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
}

.message-wrapper {
  margin-bottom: 16px;
  
  &.message-user {
    display: flex;
    justify-content: flex-end;
  }
  
  &.message-bot {
    display: flex;
    justify-content: flex-start;
  }
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  
  .message-user & {
    background: $primary;
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  .message-bot & {
    background: white;
    color: $dark;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.message-content {
  line-height: 1.4;
  word-wrap: break-word;
  
  :deep(strong) {
    font-weight: 600;
  }
  
  :deep(em) {
    font-style: italic;
  }
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
  
  .message-bot & {
    text-align: left;
  }
}

.typing-indicator {
  background: white !important;
  padding: 16px !important;
}

.typing-dots {
  display: flex;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $primary;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chatbot-suggestions {
  border-top: 1px solid #e0e0e0;
  background: white;
  padding: 12px 16px;
}

.chatbot-input {
  border-top: 1px solid #e0e0e0;
  background: white;
  padding: 16px;
}

// Responsive
@media (max-width: 600px) {
  .chatbot-container {
    bottom: 10px;
    right: 10px;
  }
  
  .chatbot-window {
    width: calc(100vw - 20px);
    height: 400px;
  }
}
</style>
