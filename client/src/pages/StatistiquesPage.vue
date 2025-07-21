<template>
  <q-page class="q-pa-md">
    <!-- En-tête avec filtres -->
    <div class="row q-mb-md">
      <div class="col">
        <div class="text-h5 q-mb-md">Statistiques</div>
      </div>
    </div>

    <!-- Filtres -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <div class="col-md-3 col-12">
            <q-select
              v-model="selectedPeriod"
              :options="periodOptions"
              label="Période"
              outlined
              dense
              @update:model-value="loadStatistics"
            />
          </div>
          <div class="col-md-3 col-12">
            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              label="Catégorie"
              outlined
              dense
              @update:model-value="loadStatistics"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="grey-6"
              outline
              label="Réinitialiser"
              @click="resetFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Cartes de résumé -->
    <div class="row q-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ totalEntries }}</div>
            <div class="text-caption text-positive">Total Entrées</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ totalExits }}</div>
            <div class="text-caption text-negative">Total Sorties</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ totalProducts }}</div>
            <div class="text-caption text-grey-6">Produits Actifs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ totalValue }}€</div>
            <div class="text-caption text-grey-6">Valeur Stock</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Première ligne de graphiques : Barres et Camembert côte à côte -->
    <div class="row q-gutter-md q-mb-md">
      <!-- Graphique en barres - Entrées/Sorties -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Entrées vs Sorties</div>
            <div class="chart-container">
              <canvas ref="barChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Camembert - Produits les plus vendus -->
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Produits les Plus Vendus</div>
            <div class="chart-container">
              <canvas ref="pieChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Deuxième ligne : Graphique linéaire en pleine largeur -->
    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Évolution des Ventes</div>
            <div class="chart-container-large">
              <canvas ref="lineChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Variables réactives
const selectedPeriod = ref('30j')
const selectedCategory = ref('Toutes')
const totalEntries = ref(0)
const totalExits = ref(0)
const totalProducts = ref(0)
const totalValue = ref(0)

// Références des canvas
const barChart = ref(null)
const pieChart = ref(null)
const lineChart = ref(null)

// Instances des graphiques
let barChartInstance = null
let pieChartInstance = null
let lineChartInstance = null

// Options des filtres
const periodOptions = [
  { label: '7 derniers jours', value: '7j' },
  { label: '30 derniers jours', value: '30j' },
  { label: '3 derniers mois', value: '3m' },
  { label: '6 derniers mois', value: '6m' },
  { label: '1 an', value: '1a' }
]

const categoryOptions = ref([
  { label: 'Toutes les catégories', value: 'Toutes' }
])

// Données des graphiques
const chartData = ref({
  entries: [],
  exits: [],
  topProducts: [],
  salesEvolution: []
})

onMounted(async () => {
  await loadCategories()
  await loadStatistics()
  await nextTick()
  initializeCharts()
})

onBeforeUnmount(() => {
  // Détruire les graphiques pour éviter les fuites mémoire
  if (barChartInstance) {
    barChartInstance.destroy()
  }
  if (pieChartInstance) {
    pieChartInstance.destroy()
  }
  if (lineChartInstance) {
    lineChartInstance.destroy()
  }
})

// Charger les catégories disponibles
const loadCategories = async () => {
  try {
    const response = await fetch('/product')
    const products = await response.json()

    const categories = [...new Set(products.map(p => p.categorie_p).filter(Boolean))]
    categoryOptions.value = [
      { label: 'Toutes les catégories', value: 'Toutes' },
      ...categories.map(cat => ({ label: cat, value: cat }))
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

// Charger les statistiques
const loadStatistics = async () => {
  try {
    await loadSummaryStats()
    await loadChartData()
    updateCharts()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

// Charger les statistiques de résumé
const loadSummaryStats = async () => {
  try {
    const response = await fetch('/stat/summary')
    const data = await response.json()

    totalEntries.value = data.totalEntries
    totalExits.value = data.totalExits
    totalProducts.value = data.totalProducts
    totalValue.value = data.totalValue
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    // Fallback vers données simulées
    totalEntries.value = Math.floor(Math.random() * 1000) + 500
    totalExits.value = Math.floor(Math.random() * 800) + 300
    totalProducts.value = Math.floor(Math.random() * 50) + 20
    totalValue.value = Math.floor(Math.random() * 50000) + 25000
  }
}

const loadChartData = async () => {
  try {
    const [entriesExitsRes, topProductsRes, evolutionRes] = await Promise.all([
      fetch(`/stat/entries-exits?period=${selectedPeriod.value}&category=${selectedCategory.value}`),
      fetch(`/stat/top-products?period=${selectedPeriod.value}&category=${selectedCategory.value}`),
      fetch(`/stat/sales-evolution?period=${selectedPeriod.value}&category=${selectedCategory.value}`)
    ])

    const entriesExitsData = await entriesExitsRes.json()
    const topProductsData = await topProductsRes.json()
    const evolutionData = await evolutionRes.json()

    chartData.value.entries = entriesExitsData.entries
    chartData.value.exits = entriesExitsData.exits
    chartData.value.topProducts = topProductsData.slice(0, Math.min(6, topProductsData.length))
    chartData.value.salesEvolution = evolutionData

  } catch (error) {
    console.error('Erreur lors du chargement des données graphiques:', error)
    // Données simulées en fallback
    chartData.value.entries = [120, 150, 180, 200, 170, 190]
    chartData.value.exits = [100, 130, 160, 180, 150, 170]
    chartData.value.topProducts = [
      { name: 'Clavier', sales: 45 },
      { name: 'Souris', sales: 38 },
      { name: 'Écran', sales: 32 },
      { name: 'Processeur', sales: 28 },
      { name: 'RAM', sales: 25 },
      { name: 'Disque SSD', sales: 22 }
    ]
    chartData.value.salesEvolution = [
      { month: 'Jan', sales: 120 },
      { month: 'Fév', sales: 150 },
      { month: 'Mar', sales: 180 },
      { month: 'Avr', sales: 200 },
      { month: 'Mai', sales: 170 },
      { month: 'Jun', sales: 190 },
      { month: 'Jul', sales: 220 },
      { month: 'Aoû', sales: 210 },
      { month: 'Sep', sales: 240 },
      { month: 'Oct', sales: 260 },
      { month: 'Nov', sales: 280 },
      { month: 'Déc', sales: 300 }
    ]
  }
}

// Initialiser les graphiques
const initializeCharts = () => {
  createBarChart()
  createPieChart()
  createLineChart()
}

// Créer le graphique en barres
const createBarChart = () => {
  if (!barChart.value) return

  const ctx = barChart.value.getContext('2d')

  barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Entrées',
          data: chartData.value.entries,
          backgroundColor: '#21BA45',
          borderColor: '#21BA45',
          borderWidth: 1
        },
        {
          label: 'Sorties',
          data: chartData.value.exits,
          backgroundColor: '#C10015',
          borderColor: '#C10015',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// Créer le camembert
const createPieChart = () => {
  if (!pieChart.value) return

  const ctx = pieChart.value.getContext('2d')

  const colors = [
    '#7f9ba5', '#3d4c58', '#becacf', '#9ec4d2', '#a3b1bb', '#21BA45'
  ]

  pieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartData.value.topProducts.map(p => p.name),
      datasets: [{
        data: chartData.value.topProducts.map(p => p.sales),
        backgroundColor: colors.slice(0, chartData.value.topProducts.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

// Créer le graphique linéaire
const createLineChart = () => {
  if (!lineChart.value) return

  const ctx = lineChart.value.getContext('2d')

  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.salesEvolution.map(s => s.month),
      datasets: [{
        label: 'Ventes',
        data: chartData.value.salesEvolution.map(s => s.sales),
        borderColor: '#7f9ba5',
        backgroundColor: 'rgba(127, 155, 165, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// Mettre à jour les graphiques
const updateCharts = () => {
  if (barChartInstance) {
    barChartInstance.data.datasets[0].data = chartData.value.entries
    barChartInstance.data.datasets[1].data = chartData.value.exits
    barChartInstance.update()
  }

  if (pieChartInstance) {
    pieChartInstance.data.labels = chartData.value.topProducts.map(p => p.name)
    pieChartInstance.data.datasets[0].data = chartData.value.topProducts.map(p => p.sales)
    pieChartInstance.update()
  }

  if (lineChartInstance) {
    lineChartInstance.data.labels = chartData.value.salesEvolution.map(s => s.month)
    lineChartInstance.data.datasets[0].data = chartData.value.salesEvolution.map(s => s.sales)
    lineChartInstance.update()
  }
}

// Réinitialiser les filtres
const resetFilters = () => {
  selectedPeriod.value = '30j'
  selectedCategory.value = 'Toutes'
  loadStatistics()
}
</script>

<style scoped>
.q-page {
  background: #fff;
  min-height: 100vh;
}

.text-h5, .text-h6 {
  font-family: 'Montserrat', 'Roboto', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.q-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(127,155,165,0.06);
  border: 1.5px solid #dbe5ea;
  background: #f7fafc;
  color: #3d4c58;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.q-card:hover {
  box-shadow: 0 4px 24px 0 rgba(127,155,165,0.12);
  border-color: #b7c7d1;
}

.q-card-section {
  padding: 22px 18px;
}

.chart-card {
  height: 370px;
  background: linear-gradient(120deg, #f7fafc 0%, #eaf1f5 100%);
  border: 1.5px solid #dbe5ea;
  color: #3d4c58;
}

.chart-container, .chart-container-large {
  position: relative;
  width: 100%;
  background: #f7fafc;
  border-radius: 12px;
  box-shadow: 0 1px 8px 0 rgba(127,155,165,0.04);
  border: 1.5px solid #dbe5ea;
  padding: 10px;
  overflow: hidden;
  color: #3d4c58;
}

.chart-container {
  height: 260px;
}

.chart-container-large {
  height: 300px;
  border: 2px solid #b7c7d1;
  box-shadow: 0 2px 16px 0 rgba(127,155,165,0.08);
}

.chart-container canvas,
.chart-container-large canvas {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: transparent;
}

.text-positive {
  color: #7f9ba5 !important;
}

.text-negative {
  color: #C10015 !important;
}

.text-grey-6 {
  color: #7f9ba5 !important;
}

.q-select, .q-btn {
  font-family: 'Montserrat', 'Roboto', sans-serif;
}

.q-btn[outline] {
  border-radius: 8px;
  border: 1px solid #7f9ba5;
  color: #7f9ba5;
  background: #f7fafc;
  transition: background 0.2s;
}

.q-btn[outline]:hover {
  background: #eaf1f5;
  color: #3d4c58;
}

@media (max-width: 768px) {
  .chart-card {
    height: 240px;
  }
  .chart-container {
    height: 120px;
  }
  .chart-container-large {
    height: 160px;
    border-width: 1.5px;
  }
  .q-card-section {
    padding: 12px 8px;
  }
}
</style>
