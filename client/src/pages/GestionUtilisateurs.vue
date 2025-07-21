<template>
  <q-page class="q-pa-md">
    <!-- Message de connexion si pas connecté -->
    <q-card v-if="!isAuthenticated" class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Connexion requise</div>
        <p>Vous devez vous connecter pour accéder à la gestion des utilisateurs.</p>
        <q-btn color="primary" label="Aller à la connexion" to="/gestionStock" />
      </q-card-section>
    </q-card>

    <!-- Message si pas administrateur -->
    <q-card v-if="isAuthenticated && !isAdmin" class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Accès refusé</div>
        <p>Seuls les administrateurs peuvent accéder à cette page.</p>
        <q-btn color="primary" label="Retour" to="/" />
      </q-card-section>
    </q-card>

    <!-- Interface principale si admin -->
    <q-card v-if="isAuthenticated && isAdmin">
      <q-card-section>
        <div class="text-h6">Gestion des Utilisateurs</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Affichage des erreurs -->
        <div v-if="error" class="text-negative q-mb-md">
          <q-banner class="bg-negative text-white">
            <template v-slot:avatar>
              <q-icon name="error" />
            </template>
            {{ error }}
            <template v-slot:action>
              <q-btn flat label="Réessayer" @click="fetchUsers" />
            </template>
          </q-banner>
        </div>
        
        <!-- Indicateur de chargement -->
        <div v-if="loading" class="q-mt-md text-center">
          <q-spinner color="primary" size="2em" />
          <div class="q-mt-sm">Chargement des utilisateurs...</div>
        </div>
        
        <!-- Tableau des utilisateurs -->
        <div v-if="!loading && !error && users.length > 0" class="q-mt-md">
          <q-table
            :rows="users"
            :columns="columns"
            row-key="id"
            flat
            bordered
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  @click="editUser(props.row)"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="confirmDelete(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
        
        <!-- Message si aucun utilisateur -->
        <div v-if="!loading && !error && users.length === 0" class="q-mt-md text-center">
          <q-icon name="people" size="3em" color="grey-5" />
          <div class="text-grey-6 q-mt-sm">Aucun utilisateur trouvé</div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Ajouter un utilisateur" @click="addUser" />
        <q-btn color="secondary" label="Actualiser" @click="fetchUsers" :loading="loading" />
      </q-card-actions>
    </q-card>

    <!-- Dialog pour ajouter/modifier un utilisateur -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Modifier' : 'Ajouter' }} un utilisateur</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveUser" class="q-gutter-md">
            <q-input
              v-model="userForm.nom"
              label="Nom"
              outlined
              :rules="[val => !!val || 'Nom requis']"
            />
            <q-input
              v-model="userForm.prenom"
              label="Prénom"
              outlined
              :rules="[val => !!val || 'Prénom requis']"
            />
            <q-input
              v-model="userForm.email"
              label="Email"
              type="email"
              outlined
              :rules="[val => !!val || 'Email requis']"
            />
            <q-input
              v-if="!isEditing"
              v-model="userForm.password"
              label="Mot de passe"
              type="password"
              outlined
              :rules="[val => !!val || 'Mot de passe requis']"
            />
            <q-select
              v-model="userForm.privilege"
              :options="privilegeOptions"
              label="Privilège"
              outlined
              :rules="[val => !!val || 'Privilège requis']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="closeDialog" />
          <q-btn 
            color="primary" 
            label="Enregistrer" 
            @click="saveUser"
            :loading="saveLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de confirmation de suppression -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="showDeleteDialog = false" />
          <q-btn 
            color="negative" 
            label="Supprimer" 
            @click="deleteUser"
            :loading="deleteLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Variables réactives
const users = ref([])
const loading = ref(false)
const error = ref(null)
const isAuthenticated = ref(false)
const token = ref(null)
const userRole = ref(null)
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const saveLoading = ref(false)
const deleteLoading = ref(false)
const userToDelete = ref(null)

// Formulaire utilisateur
const userForm = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  privilege: ''
})

// Options de privilèges
const privilegeOptions = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Utilisateur', value: 'user' }
]

// Configuration des colonnes du tableau
const columns = [
  {
    name: 'nom',
    required: true,
    label: 'Nom',
    align: 'left',
    field: 'nom',
    sortable: true
  },
  {
    name: 'prenom',
    label: 'Prénom',
    align: 'left',
    field: 'prenom',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'privilege',
    label: 'Privilège',
    align: 'center',
    field: 'privilege',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center'
  }
]

// Computed pour vérifier si l'utilisateur est admin
const isAdmin = computed(() => {
  return userRole.value === 'admin'
})

// Récupérer les utilisateurs
const fetchUsers = async () => {
  if (!isAuthenticated.value || !isAdmin.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:3000/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        logout()
        throw new Error('Session expirée, veuillez vous reconnecter')
      }
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    users.value = data
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Ajouter un utilisateur
const addUser = () => {
  isEditing.value = false
  userForm.value = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    privilege: 'user'
  }
  showDialog.value = true
}

// Modifier un utilisateur
const editUser = (user) => {
  isEditing.value = true
  userForm.value = {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    password: '',
    privilege: user.privilege
  }
  showDialog.value = true
}

// Sauvegarder un utilisateur
const saveUser = async () => {
  saveLoading.value = true
  
  try {
    const url = isEditing.value 
      ? `http://localhost:3000/user/${userForm.value.id}`
      : 'http://localhost:3000/auth/signin'
    
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const body = isEditing.value 
      ? { user: userForm.value }
      : userForm.value
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    $q.notify({
      type: 'positive',
      message: isEditing.value ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès'
    })
    
    closeDialog()
    await fetchUsers()
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la sauvegarde'
    })
  } finally {
    saveLoading.value = false
  }
}

// Confirmer la suppression
const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

// Supprimer un utilisateur
const deleteUser = async () => {
  deleteLoading.value = true
  
  try {
    const response = await fetch(`http://localhost:3000/user/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    $q.notify({
      type: 'positive',
      message: 'Utilisateur supprimé avec succès'
    })
    
    showDeleteDialog.value = false
    await fetchUsers()
    
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la suppression'
    })
  } finally {
    deleteLoading.value = false
  }
}

// Fermer le dialog
const closeDialog = () => {
  showDialog.value = false
  userForm.value = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    privilege: ''
  }
}

// Déconnexion
const logout = () => {
  token.value = null
  isAuthenticated.value = false
  userRole.value = null
  users.value = []
  localStorage.removeItem('authToken')
}

// Décoder le JWT pour récupérer le rôle
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role
  } catch {
    return null
  }
}

// Vérifier l'authentification au chargement
const checkAuthentication = () => {
  const savedToken = localStorage.getItem('authToken')
  if (savedToken) {
    token.value = savedToken
    isAuthenticated.value = true
    userRole.value = decodeToken(savedToken)
  }
}

onMounted(() => {
  checkAuthentication()
  if (isAuthenticated.value && isAdmin.value) {
    fetchUsers()
  }
})
</script>
