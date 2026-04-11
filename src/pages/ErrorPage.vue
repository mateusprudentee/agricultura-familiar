<template>
  <div class="flex flex-center column text-center q-pa-md q-gutter-y-md q-mt-xl q-mb-xl q-mx-auto w-100 ">

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

  </div>
</template>

<script setup>
</script>
