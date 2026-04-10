<template>
  <q-page class="flex flex-center column text-center">

    <!-- Ícone grande triste -->
    <q-icon
      name="sentiment_dissatisfied"
      size="120px"
      color="grey-6"
      class="q-mb-md"
    />

    <!-- Mensagem -->
    <div class="text-h6 text-grey-8">
      Página não encontrada
    </div>

    <div class="text-subtitle2 text-grey-6 q-mt-sm">
      Não conseguimos encontrar o que você procura.
    </div>

    <!-- Botão opcional -->
    <q-btn
      class="q-mt-lg"
      color="primary"
      label="Voltar"
      icon="arrow_back"
      @click="$router.back()"
      unelevated
      rounded
    />

  </q-page>
</template>

<script setup>
</script>
