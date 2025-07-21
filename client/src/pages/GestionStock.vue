<template>
    <q-page class="q-pa-md">
        <q-card>
        <q-card-section>
            <div class="text-h6">Gestion de Stock</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
            <p>Bienvenue dans la gestion de stock. Vous pouvez ajouter, modifier ou supprimer des articles.</p>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn color="primary" label="Ajouter un article" />
        </q-card-actions>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
require('dotenv').config();

const stockItems = ref([]);

fetch(process.env.URL + 'stock')
  .then(response => response.json())
  .then(data => {
    stockItems.value = data;
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des articles de stock:', error);
  });
</script>
