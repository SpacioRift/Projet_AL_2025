<template>
  <q-page class="dashboard q-pa-md">
    <!-- Stocks critiques en haut, prend toute la largeur -->
    <q-card class="q-mb-xl full-width">
      <q-card-section>
        <div class="text-h5">Stocks les plus critiques</div>
        <q-list bordered>
          <q-item v-for="stock in criticalStocks.slice(0, 5)" :key="stock.id">
            <q-item-section>
              {{ stock.nom }} - <span class="text-negative">{{ stock.quantite }}</span> restant(s)
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Résumé des stocks globaux et commandes récentes côte à côte -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h5">Résumé des stocks globaux</div>
            <div v-if="globalStocks">
              <div class="q-mt-sm">Total articles : <b>{{ globalStocks.total }}</b></div>
              <div>Valeur totale : <b>{{ globalStocks.value }} €</b></div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h5">Commandes récentes</div>
            <q-list bordered>
              <q-item v-for="commande in commandes" :key="commande.id">
                <q-item-section>
                  {{ commande.reference }} - {{ commande.date }} -
                  <span :class="commande.status === 'livrée' ? 'text-positive' : 'text-warning'">
                    {{ commande.status }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const globalStocks = ref(null)
const criticalStocks = ref([])
const commandes = ref([])

onMounted(async () => {
  const stocksRes = await fetch(process.env.URL + 'stock')
  globalStocks.value = await stocksRes.json()

  const criticalRes = await fetch(process.env.URL + 'stock/critical')
  criticalStocks.value = await criticalRes.json()

  const commandesRes = await fetch(process.env.URL + 'commande')
  commandes.value = await commandesRes.json()
})
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: auto;
}
.full-width {
  width: 100%;
}
</style>
