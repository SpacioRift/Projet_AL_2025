<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gestion des stocks
        </q-toolbar-title>

        <!-- Bouton de déconnexion si connecté -->
        <q-btn
          v-if="isAuthenticated"
          flat
          label="Déconnexion"
          @click="logout"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Navigation
        </q-item-label>

        <EssentialLink
          v-for="link in visibleLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- This is where the Pages are injected -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Chatbot -->
    <ChatBot />

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import ChatBot from 'components/ChatBot.vue'

const leftDrawerOpen = ref(false)
const isAuthenticated = ref(false)
const userRole = ref(null)

// Tous les liens disponibles
const allLinks = [
  {
    title: 'Statistiques',
    caption: 'Analyses et graphiques',
    icon: 'analytics',
    link: '',
    to: '/statistiques'
  },
  {
    title: 'Niveau des stocks',
    caption: 'Gestion des stocks',
    icon: 'inventory',
    link: '',
    to: '/gestionStock'
  },
  {
    title: 'Gestion des utilisateurs',
    caption: 'Administration des comptes',
    icon: 'people',
    link: '',
    to: '/gestionUtilisateurs',
    adminOnly: true
  }
]

// Liens visibles selon le rôle de l'utilisateur
const visibleLinks = computed(() => {
  return allLinks.filter(link => {
    if (link.adminOnly) {
      return isAuthenticated.value && userRole.value === 'admin'
    }
    return true
  })
})

// Décoder le JWT pour récupérer le rôle
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role
  } catch {
    return null
  }
}

// Vérifier l'authentification
const checkAuth = () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    isAuthenticated.value = true
    userRole.value = decodeToken(token)
  } else {
    isAuthenticated.value = false
    userRole.value = null
  }
}

// Déconnexion
const logout = () => {
  localStorage.removeItem('authToken')
  isAuthenticated.value = false
  userRole.value = null
  // Rediriger vers la page d'accueil
  window.location.href = '/'
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Vérifier l'auth au montage et écouter les changements
onMounted(() => {
  checkAuth()
  
  // Écouter les changements de localStorage pour mettre à jour l'état
  window.addEventListener('storage', checkAuth)
  
  // Vérifier périodiquement l'état d'authentification
  setInterval(checkAuth, 5000)
})
</script>
