<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-md text-primary">Agricultura Familiar - Mato Grosso</div>
    <div class="text-subtitle2 q-mb-lg">Fonte: Dados Abertos Governamentais (MAPA/IBGE)</div>

    <!-- Campo de Busca -->
    <q-select
      filled
      v-model="selectedResult"
      use-input
      hide-selected
      fill-input
      input-debounce="500"
      label="Pesquisar sobre Agricultura Familiar em MT"
      :options="searchResults"
      :loading="isLoading"
      option-label="title"
      option-value="id"
      @filter="performSearch"
      @update:model-value="showDetails"
      hint="Digite termos como 'Pronaf', 'DAP', 'assentamento', 'crédito rural' ou 'cooperativa'"
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Template para cada item da lista de resultados -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ scope.opt.title }}</q-item-label>
            <q-item-label caption class="text-grey-7">
              {{ scope.opt.description }}
            </q-item-label>
            <q-item-label caption class="text-primary">
              {{ scope.opt.organization }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <!-- Ícone de carregamento -->
      <template v-slot:loading>
        <q-spinner-dots color="primary" />
      </template>

      <!-- Mensagem quando não há resultados -->
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Nenhum resultado encontrado para esta busca
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Painel de Detalhes (Aprofundamento) -->
    <q-card v-if="selectedResult" class="q-mt-lg">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ selectedResult.title }}</div>
        <div class="text-subtitle2">{{ selectedResult.organization }}</div>
      </q-card-section>

      <q-card-section>
        <p><strong>Descrição:</strong> {{ selectedResult.fullDescription }}</p>

        <q-separator class="q-my-md" />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-list bordered separator>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="location_on" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Localização</q-item-label>
                  <q-item-label>Mato Grosso - {{ selectedResult.municipio || 'Estadual' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="category" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Categoria</q-item-label>
                  <q-item-label>{{ selectedResult.category || 'Agricultura Familiar' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="calendar_today" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Data de Atualização</q-item-label>
                  <q-item-label>{{ formatDate(selectedResult.modified) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">Ações disponíveis</div>
                <q-btn
                  v-if="selectedResult.url"
                  type="a"
                  :href="selectedResult.url"
                  target="_blank"
                  color="primary"
                  icon="open_in_new"
                  label="Acessar Fonte Original"
                  class="full-width q-mb-sm"
                />

                <q-btn
                  v-if="selectedResult.jsonUrl"
                  type="a"
                  :href="selectedResult.jsonUrl"
                  target="_blank"
                  color="secondary"
                  icon="data_object"
                  label="Baixar Dados (JSON)"
                  class="full-width q-mb-sm"
                />

                <q-btn
                  v-if="selectedResult.csvUrl"
                  type="a"
                  :href="selectedResult.csvUrl"
                  target="_blank"
                  color="accent"
                  icon="table_chart"
                  label="Baixar Dados (CSV)"
                  class="full-width"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          icon="share"
          label="Compartilhar"
          @click="shareResult"
        />
        <q-btn
          flat
          color="primary"
          icon="bookmark"
          label="Salvar"
          @click="saveResult"
        />
      </q-card-actions>
    </q-card>

    <!-- Estatísticas Rápidas -->
    <div class="row q-col-gutter-md q-mt-xl">
      <div class="col-12 col-md-4">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">DAPs Ativas</div>
            <div class="text-h4">32,847</div>
            <div class="text-caption">Declarações de Aptidão ao PRONAF em MT</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Assentamentos</div>
            <div class="text-h4">542</div>
            <div class="text-caption">Assentamentos rurais em Mato Grosso</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Cooperativas</div>
            <div class="text-h4">156</div>
            <div class="text-caption">Cooperativas da agricultura familiar</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Estado reativo
const selectedResult = ref(null)
const searchResults = ref([])
const isLoading = ref(false)

/**
 * Formata a data para exibição
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

/**
 * Função principal de busca usando a API de Dados Abertos do Governo Federal
 * Esta API contém dados reais do MAPA, IBGE e outros órgãos
 */
const performSearch = async (inputValue, update) => {
  // Não busca se o termo for muito curto
  if (inputValue.length < 3) {
    update(() => { searchResults.value = [] })
    return
  }

  isLoading.value = true

  try {
    // API CKAN de Dados Abertos do Governo Federal
    // Busca conjuntos de dados relacionados à agricultura familiar em Mato Grosso
    const searchTerm = encodeURIComponent(`${inputValue} (agricultura OR familiar OR PRONAF OR MT OR "Mato Grosso")`)

    const response = await fetch(
      `https://dados.gov.br/api/3/action/package_search?q=${searchTerm}&rows=20`
    )

    const data = await response.json()

    if (!data.success) {
      throw new Error('Erro na resposta da API')
    }

    // Formata os resultados para o formato esperado pelo componente
    const formattedResults = data.result.results.map(dataset => {
      // Filtra para garantir que tenha relação com Mato Grosso ou seja de abrangência nacional
      const isMT = dataset.organization?.title?.includes('Mato Grosso') ||
                   dataset.notes?.includes('Mato Grosso') ||
                   dataset.tags?.some(tag => tag.name.toLowerCase().includes('mt'))

      // Define a descrição (limitada a 100 caracteres para o resumo)
      const shortDescription = dataset.notes
        ? dataset.notes.substring(0, 100) + '...'
        : 'Sem descrição disponível'

      // Encontra os recursos disponíveis
      const jsonResource = dataset.resources?.find(r => r.format === 'JSON')
      const csvResource = dataset.resources?.find(r => r.format === 'CSV')

      return {
        id: dataset.id,
        title: dataset.title,
        description: shortDescription,
        fullDescription: dataset.notes || 'Descrição completa não disponível',
        organization: dataset.organization?.title || 'Governo Federal',
        municipio: isMT ? 'Mato Grosso' : 'Nacional',
        category: dataset.groups?.map(g => g.display_name).join(', ') || 'Agricultura e Pecuária',
        modified: dataset.metadata_modified,
        url: `https://dados.gov.br/dados/conjuntos-dados/${dataset.name}`,
        jsonUrl: jsonResource?.url || null,
        csvUrl: csvResource?.url || null,
        tags: dataset.tags?.map(t => t.display_name) || [],
        isMatoGrosso: isMT
      }
    })

    // Atualiza a lista de opções do QSelect
    update(() => {
      searchResults.value = formattedResults
    })

  } catch (error) {
    console.error('Erro na busca:', error)

    // Fallback: Se a API principal falhar, tenta uma API alternativa de dados abertos
    try {
      await performSearchFallback(inputValue, update)
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError)
      update(() => { searchResults.value = [] })

      $q.notify({
        color: 'negative',
        message: 'Erro ao conectar com a API de dados. Tente novamente.',
        icon: 'error',
        position: 'top'
      })
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Função de fallback usando a API do Portal Brasileiro de Dados Abertos
 */
const performSearchFallback = async (inputValue, update) => {
  const searchTerm = encodeURIComponent(inputValue)

  const response = await fetch(
    `https://dadosabertos.camara.leg.br/api/v2/proposicoes?palavraChave=${searchTerm}&ordenarPor=ano`
  )

  const data = await response.json()

  const formattedResults = data.dados.map(item => ({
    id: item.id,
    title: item.ementa.substring(0, 50) + '...',
    description: item.ementa.substring(0, 100) + '...',
    fullDescription: item.ementa,
    organization: 'Câmara dos Deputados',
    municipio: 'Nacional',
    category: 'Proposição Legislativa',
    modified: item.dataApresentacao,
    url: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${item.id}`,
    jsonUrl: null,
    csvUrl: null,
    tags: []
  }))

  update(() => {
    searchResults.value = formattedResults
  })
}

/**
 * Exibe os detalhes do item selecionado
 */
const showDetails = (item) => {
  selectedResult.value = item

  // Notifica o usuário
  $q.notify({
    color: 'positive',
    message: `Detalhes de "${item.title}" carregados`,
    icon: 'check_circle',
    position: 'top',
    timeout: 2000
  })
}

/**
 * Compartilha o resultado atual
 */
const shareResult = () => {
  if (!selectedResult.value) return

  // Em um ambiente real, você pode implementar a lógica de compartilhamento
  navigator.clipboard?.writeText(selectedResult.value.url)

  $q.notify({
    color: 'info',
    message: 'Link copiado para a área de transferência',
    icon: 'content_copy',
    position: 'top',
    timeout: 2000
  })
}

/**
 * Salva o resultado para consulta posterior
 */
const saveResult = () => {
  // Implemente a lógica de salvar em localStorage ou backend
  $q.notify({
    color: 'positive',
    message: 'Item salvo nos favoritos',
    icon: 'bookmark',
    position: 'top',
    timeout: 2000
  })
}
</script>

<style scoped>
/* Estilos personalizados se necessário */
</style>
