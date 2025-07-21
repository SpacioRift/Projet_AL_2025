<template>
    <q-page class="q-pa-md">
        <!-- Formulaire de connexion si pas connecté -->
        <q-card v-if="!isAuthenticated" class="q-mb-md">
            <q-card-section>
                <div class="text-h6">Connexion requise</div>
                <p>Vous devez vous connecter pour accéder aux données de stock.</p>
                
                <q-form @submit="login" class="q-gutter-md">
                    <q-input
                        v-model="loginForm.email"
                        label="Email"
                        type="email"
                        outlined
                        :rules="[val => !!val || 'Email requis']"
                    />
                    <q-input
                        v-model="loginForm.password"
                        label="Mot de passe"
                        type="password"
                        outlined
                        :rules="[val => !!val || 'Mot de passe requis']"
                    />
                    <q-btn 
                        type="submit" 
                        color="primary" 
                        label="Se connecter"
                        :loading="loginLoading"
                    />
                </q-form>
                
                <q-separator class="q-my-md" />
                
                <div class="text-caption text-grey-6">
                    Compte de test: jean.dupont@mail.com / test123
                </div>
            </q-card-section>
        </q-card>

        <!-- Interface principale si connecté -->
        <q-card v-if="isAuthenticated">
            <q-card-section>
                <div class="text-h6">Gestion de Stock</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <p>Bienvenue dans la gestion de stock. Vous pouvez ajouter, modifier ou supprimer des articles.</p>
                
                <!-- Affichage conditionnel des erreurs -->
                <div v-if="error" class="text-negative q-mt-md">
                    <q-banner class="bg-negative text-white">
                        <template v-slot:avatar>
                            <q-icon name="error" />
                        </template>
                        {{ error }}
                        <template v-slot:action>
                            <q-btn flat label="Réessayer" @click="fetchStockItems" />
                        </template>
                    </q-banner>
                </div>
                
                <!-- Indicateur de chargement -->
                <div v-if="loading" class="q-mt-md text-center">
                    <q-spinner color="primary" size="2em" />
                    <div class="q-mt-sm">Chargement des données...</div>
                </div>
                
                <!-- Liste des articles -->
                <div v-if="!loading && !error && stockItems.length > 0" class="q-mt-md">
                    <q-table
                        :rows="stockItems"
                        :columns="columns"
                        row-key="id"
                        flat
                        bordered
                    />
                </div>
                
                <!-- Message si aucune donnée -->
                <div v-if="!loading && !error && stockItems.length === 0" class="q-mt-md text-center">
                    <q-icon name="inventory" size="3em" color="grey-5" />
                    <div class="text-grey-6 q-mt-sm">Aucun article en stock</div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="negative" flat label="Déconnexion" @click="logout" />
                <q-btn color="primary" label="Ajouter un article" />
                <q-btn color="secondary" label="Actualiser" @click="fetchStockItems" :loading="loading" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Variables réactives
const stockItems = ref([])
const loading = ref(false)
const error = ref(null)
const isAuthenticated = ref(false)
const token = ref(null)
const loginLoading = ref(false)

// Formulaire de connexion
const loginForm = ref({
    email: 'jean.dupont@mail.com',
    password: 'test123'
})

// Configuration des colonnes du tableau
const columns = [
    {
        name: 'produit_s',
        required: true,
        label: 'Produit',
        align: 'left',
        field: 'produit_s',
        sortable: true
    },
    {
        name: 'quantite_s',
        label: 'Quantité',
        align: 'center',
        field: 'quantite_s',
        sortable: true
    },
    {
        name: 'emplacement_s',
        label: 'Emplacement',
        align: 'center',
        field: 'emplacement_s',
        sortable: true
    },
    {
        name: 'entrepot_s',
        label: 'Entrepôt',
        align: 'center',
        field: 'entrepot_s',
        sortable: true
    }
]

// Fonction de connexion
const login = async () => {
    loginLoading.value = true
    error.value = null
    
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginForm.value.email,
                password: loginForm.value.password
            })
        })
        
        if (!response.ok) {
            throw new Error('Identifiants incorrects')
        }
        
        const data = await response.json()
        token.value = data.token
        isAuthenticated.value = true
        
        // Sauvegarder le token dans le localStorage
        localStorage.setItem('authToken', data.token)
        
        // Charger les données de stock
        await fetchStockItems()
        
    } catch (err) {
        error.value = err.message
    } finally {
        loginLoading.value = false
    }
}

// Fonction de déconnexion
const logout = () => {
    token.value = null
    isAuthenticated.value = false
    stockItems.value = []
    localStorage.removeItem('authToken')
}

// Fonction pour récupérer les données de stock
const fetchStockItems = async () => {
    if (!isAuthenticated.value) return
    
    loading.value = true
    error.value = null
    
    try {
        const response = await fetch('http://localhost:3000/stock', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        })
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expiré
                logout()
                throw new Error('Session expirée, veuillez vous reconnecter')
            }
            throw new Error(`Erreur HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        stockItems.value = data
    } catch (err) {
        console.error('Erreur lors de la récupération des articles de stock:', err)
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// Vérifier si un token existe au chargement
onMounted(() => {
    const savedToken = localStorage.getItem('authToken')
    if (savedToken) {
        token.value = savedToken
        isAuthenticated.value = true
        fetchStockItems()
    }
})
</script>
