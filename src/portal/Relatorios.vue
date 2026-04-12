<template>
  <div class="full-width q-pa-md">

    <!-- Cabeçalho com Título e Contador -->
    <div class="row items-center justify-between q-mb-md">
      <q-toolbar-title class="text-weight-medium">
          <q-icon name="description" color="primary" size="sm" class="q-mr-sm" />
          Relatórios
        </q-toolbar-title>
      <q-badge outline color="primary" :label="`${filteredReports.length} documentos`" />
    </div>

    <!-- Filtros -->
    <q-card flat  class="bg-white q-mb-lg filter-card">
      <q-card-section>
        <div class="row q-col-gutter-md items-end">

          <!-- Busca por texto -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              dense
              outlined
              placeholder="Buscar por título, fonte ou palavras-chave..."
              debounce="300"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Filtro por Fonte -->
          <div class="col-6 col-md-3">
            <q-select
              v-model="filters.source"
              dense
              outlined
              :options="sourceOptions"
              label="Fonte"
              clearable
              emit-value
              map-options
            />
          </div>

          <!-- Filtro por Categoria -->
          <div class="col-6 col-md-3">
            <q-select
              v-model="filters.category"
              dense
              outlined
              :options="categoryOptions"
              label="Categoria"
              clearable
              emit-value
              map-options
            />
          </div>

          <!-- Botão Limpar Filtros -->
          <div class="col-12 col-md-2">
            <q-btn
              flat
              color="grey-7"
              icon="clear_all"
              label="Limpar filtros"
              @click="clearFilters"
              class="full-width"
            />
          </div>
        </div>

        <!-- Chips de Filtros Ativos -->
        <div v-if="activeFiltersCount > 0" class="row q-mt-sm q-gutter-sm">
          <q-chip
            v-if="filters.search"
            removable
            color="primary"
            text-color="white"
            @remove="filters.search = ''"
          >
            Busca: {{ filters.search }}
          </q-chip>
          <q-chip
            v-if="filters.source"
            removable
            color="primary"
            text-color="white"
            @remove="filters.source = null"
          >
            Fonte: {{ filters.source }}
          </q-chip>
          <q-chip
            v-if="filters.category"
            removable
            color="primary"
            text-color="white"
            @remove="filters.category = null"
          >
            Categoria: {{ filters.category }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de Relatórios Expansíveis -->
    <q-card flat bordered class="bg-white">

      <!-- Cabeçalho da Tabela -->
      <div class="row items-center q-pa-md bg-primary text-white table-header">
        <div class="col-5 text-subtitle2 text-weight-bold">Título do Relatório</div>
        <div class="col-2 text-subtitle2 text-weight-bold">Categoria</div>
        <div class="col-2 text-subtitle2 text-weight-bold">Fonte</div>
        <div class="col-2 text-subtitle2 text-weight-bold">Período</div>
        <div class="col-1 text-subtitle2 text-weight-bold text-center">Download</div>
      </div>

      <q-separator />

      <!-- Resultados Vazios -->
      <div v-if="paginatedReports.length === 0" class="text-center q-py-xl text-grey-7">
        <q-icon name="search_off" size="48px" class="q-mb-sm" />
        <div class="text-h6">Nenhum documento encontrado</div>
        <div class="text-body2">Tente ajustar os filtros de busca</div>
      </div>

      <!-- Linhas da Tabela -->
      <template v-for="(report, index) in paginatedReports" :key="report.id">
        <div>
          <!-- Linha Principal (Sempre visível) -->
          <div
            class="row items-center q-pa-md cursor-pointer table-row"
            :class="{ 'bg-grey-2': expandedId === report.id }"
            @click="toggleReport(report.id)"
          >
            <div class="col-5">
              <div class="row items-center q-gutter-x-sm">
                <q-icon
                  :name="expandedId === report.id ? 'folder_open' : 'folder'"
                  color="primary"
                  size="sm"
                />
                <div>
                  <div class="text-body1 text-weight-medium">{{ report.title }}</div>
                  <div class="text-caption text-grey-7">{{ report.subtitle }}</div>
                </div>
              </div>
            </div>
            <div class="col-2">
              <q-badge outline color="primary" :label="report.category" />
            </div>
            <div class="col-2 text-body2">{{ report.source }}</div>
            <div class="col-2 text-body2">{{ report.period }}</div>
            <div class="col-1 text-center">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="download"
                @click.stop="downloadReport(report)"
              >
                <q-tooltip>Baixar {{ report.title }}</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Área Expansível com Detalhes -->
          <q-slide-transition>
            <div v-show="expandedId === report.id">
              <q-separator />
              <div class="bg-grey-1 q-pa-lg">

                <!-- Grid de Metadados -->
                <div class="row q-col-gutter-lg q-mb-lg">
                  <div class="col-12 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Fonte</div>
                    <div class="text-body1 text-weight-medium">{{ report.source }}</div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Período</div>
                    <div class="text-body1 text-weight-medium">{{ report.period }}</div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Abrangência</div>
                    <div class="text-body1 text-weight-medium">{{ report.coverage }}</div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-caption text-grey-7 text-uppercase">Última Atualização</div>
                    <div class="text-body1 text-weight-medium">{{ report.lastUpdate }}</div>
                  </div>
                </div>

                <!-- Resumo -->
                <div class="q-mb-lg">
                  <div class="text-caption text-grey-7 text-uppercase q-mb-xs">Resumo Executivo</div>
                  <div class="text-body2 text-grey-9" style="line-height: 1.7;">
                    {{ report.abstract }}
                  </div>
                </div>

                <!-- Variáveis -->
                <div class="q-mb-lg">
                  <div class="text-caption text-grey-7 text-uppercase q-mb-sm">Variáveis Disponíveis</div>
                  <div class="row q-gutter-sm">
                    <q-chip
                      v-for="(variable, vIdx) in report.variables"
                      :key="vIdx"
                      dense
                      outline
                      color="primary"
                      size="sm"
                    >
                      {{ variable }}
                    </q-chip>
                  </div>
                </div>

                <!-- Botão Download -->
                <div class="row justify-end">
                  <q-btn
                    @click="downloadReport(report)"
                    unelevated
                    color="primary"
                    icon="cloud_download"
                    label="Baixar Documento Completo"
                    size="md"
                    padding="md lg"
                  />
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
        <q-separator v-if="index < paginatedReports.length - 1" />
      </template>

      <!-- Paginação -->
      <div v-if="filteredReports.length > 0" class="q-pa-md row justify-center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          color="primary"
          active-design="unelevated"
          active-color="primary"
          active-text-color="white"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'RelatoriosAgriculturaFamiliar',
  setup() {
    const expandedId = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 10

    // Filtros
    const filters = ref({
      search: '',
      source: null,
      category: null
    })

    // Opções
    const sourceOptions = [
      { label: 'IBGE/SIDRA', value: 'IBGE/SIDRA' },
      { label: 'Banco Central/MDA', value: 'Banco Central/MDA' },
      { label: 'ICMBio/ICV', value: 'ICMBio/ICV' },
      { label: 'INCRA/UNEMAT', value: 'INCRA/UNEMAT' },
      { label: 'SEDEC/UFMT', value: 'SEDEC/UFMT' },
      { label: 'CONAB/FNDE', value: 'CONAB/FNDE' },
      { label: 'EMPAER', value: 'EMPAER' },
      { label: 'SEAF-MT', value: 'SEAF-MT' },
      { label: 'EMBRAPA', value: 'EMBRAPA' }
    ]

    const categoryOptions = [
      { label: 'Censo e Estatísticas', value: 'Censo e Estatísticas' },
      { label: 'Crédito Rural', value: 'Crédito Rural' },
      { label: 'Sociobiodiversidade', value: 'Sociobiodiversidade' },
      { label: 'Reforma Agrária', value: 'Reforma Agrária' },
      { label: 'Comercialização', value: 'Comercialização' },
      { label: 'Políticas Públicas', value: 'Políticas Públicas' },
      { label: 'Produção e Produtividade', value: 'Produção e Produtividade' },
      { label: 'Sustentabilidade', value: 'Sustentabilidade' },
      { label: 'Gênero e Juventude', value: 'Gênero e Juventude' }
    ]

    // Gerador
    const generateReports = () => {
      const baseReports = []
      const sources = ['IBGE/SIDRA', 'Banco Central/MDA', 'ICMBio/ICV', 'INCRA/UNEMAT', 'SEDEC/UFMT', 'CONAB/FNDE', 'EMPAER', 'SEAF-MT', 'EMBRAPA']
      const categories = ['Censo e Estatísticas', 'Crédito Rural', 'Sociobiodiversidade', 'Reforma Agrária', 'Comercialização', 'Políticas Públicas', 'Produção e Produtividade', 'Sustentabilidade', 'Gênero e Juventude']
      const coverages = ['Municipal', 'Microrregional', 'Estadual', 'Territórios da Cidadania', 'Amazônia Legal MT', 'Cerrado MT', 'Pantanal MT', 'Baixada Cuiabana', 'Médio Norte', 'Vale do Araguaia']

      const publicUrls = [
        'https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/21814-2017-censo-agropecuario.html',
        'https://www.bcb.gov.br/estabilidadefinanceira/pronaf',
        'https://www.gov.br/icmbio/pt-br/assuntos/pesquisa',
        'https://www.gov.br/incra/pt-br/assuntos/reforma-agraria',
        'https://www.sedec.mt.gov.br/agricultura-familiar',
        'https://www.conab.gov.br/agricultura-familiar',
        'https://www.empaer.mt.gov.br/publicacoes',
        'https://www.seaf.mt.gov.br/relatorios',
        'https://www.embrapa.br/biblioteca'
      ]

      const titles = [
        { main: 'Censo Agropecuário 2017', sub: 'Agricultura Familiar no MT - Análise Completa' },
        { main: 'PRONAF 2020-2024', sub: 'Análise de Contratos e Inadimplência por Território' },
        { main: 'Sociobiodiversidade 2022-2024', sub: 'Extrativismo e Comunidades Tradicionais' },
        { main: 'Reforma Agrária 2023-2024', sub: 'Assentamentos Rurais em Mato Grosso' },
        { main: 'Feiras Livres 2024', sub: 'Circuitos Curtos de Comercialização' },
        { main: 'PAA e PNAE 2021-2024', sub: 'Compras Institucionais da Agricultura Familiar' },
        { main: 'Produção Leiteira 2023', sub: 'Cadeia Produtiva Familiar no MT' },
        { main: 'Mandiocultura 2022-2024', sub: 'Agricultura Familiar e Agroindústria' },
        { main: 'Agroecologia 2023-2024', sub: 'Práticas Sustentáveis e Certificação' },
        { main: 'Juventude Rural 2024', sub: 'Sucessão Familiar e Permanência no Campo' },
        { main: 'Mulheres Rurais 2023', sub: 'Protagonismo e Autonomia Econômica' },
        { main: 'Acesso à Água 2022-2024', sub: 'Cisternas e Irrigação para Produção' },
        { main: 'Assistência Técnica 2023', sub: 'ATER para Agricultura Familiar no MT' },
        { main: 'Cooperativismo 2024', sub: 'Organização Social e Produtiva' },
        { main: 'Agroindústria Familiar 2023', sub: 'Processamento e Agregação de Valor' },
        { main: 'Sementes Crioulas 2022-2024', sub: 'Guardiões da Agrobiodiversidade' },
        { main: 'Quintais Produtivos 2023', sub: 'Segurança Alimentar e Nutricional' },
        { main: 'Piscicultura Familiar 2024', sub: 'Produção em Viveiros Escavados' },
        { main: 'Avicultura Caipira 2023', sub: 'Sistemas Alternativos de Produção' },
        { main: 'Apicultura 2022-2024', sub: 'Mel e Derivados no Cerrado e Amazônia' },
        { main: 'Turismo Rural 2024', sub: 'Roteiros da Agricultura Familiar' },
        { main: 'Mudanças Climáticas 2023', sub: 'Adaptação e Resiliência no Campo' },
        { main: 'Regularização Fundiária 2022-2024', sub: 'Titulação de Terras e Segurança Jurídica' },
        { main: 'Educação do Campo 2023', sub: 'Escolas Família Agrícola no MT' },
        { main: 'Saúde Rural 2024', sub: 'Saneamento Básico e Qualidade de Vida' },
        { main: 'Energia Renovável 2023', sub: 'Biodigestores e Energia Solar no Campo' },
        { main: 'Certificação Orgânica 2022-2024', sub: 'Sistemas Participativos de Garantia' },
        { main: 'Economia Solidária 2023', sub: 'Redes de Comercialização e Consumo' },
        { main: 'Territórios Indígenas 2024', sub: 'Produção Agrícola e Segurança Alimentar' },
        { main: 'Comunidades Quilombolas 2023', sub: 'Saberes Tradicionais e Práticas Agrícolas' }
      ]

      const periods = Array(30).fill('2023-2024')
      const lastUpdates = Array(30).fill('01/01/2025')

      for (let i = 0; i < 30; i++) {
        baseReports.push({
          id: i + 1,
          title: titles[i].main,
          subtitle: titles[i].sub,
          category: categories[i % categories.length],
          source: sources[i % sources.length],
          period: periods[i],
          coverage: coverages[i % coverages.length],
          lastUpdate: lastUpdates[i],
          abstract: 'Relatório detalhado...',
          variables: ['Famílias', 'Área', 'Produção'],
          downloadUrl: publicUrls[i % publicUrls.length]
        })
      }

      return baseReports
    }

    const reports = ref(generateReports())

    // ✅ COMPUTED LIMPO (SEM SIDE EFFECT)
    const filteredReports = computed(() => {
      return reports.value.filter(report => {
        if (filters.value.search) {
          const term = filters.value.search.toLowerCase()
          const text = `${report.title} ${report.subtitle} ${report.source} ${report.category} ${report.abstract}`.toLowerCase()
          if (!text.includes(term)) return false
        }

        if (filters.value.source && report.source !== filters.value.source) return false
        if (filters.value.category && report.category !== filters.value.category) return false

        return true
      })
    })

    // ✅ WATCH PARA RESETAR PAGINA (CORRETO)
    watch(filters, () => {
      currentPage.value = 1
    }, { deep: true })

    const paginatedReports = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return filteredReports.value.slice(start, start + itemsPerPage)
    })

    const totalPages = computed(() =>
      Math.ceil(filteredReports.value.length / itemsPerPage)
    )

    const activeFiltersCount = computed(() => {
      let count = 0
      if (filters.value.search) count++
      if (filters.value.source) count++
      if (filters.value.category) count++
      return count
    })

    const toggleReport = (id) => {
      expandedId.value = expandedId.value === id ? null : id
    }

    const downloadReport = (report) => {
      window.open(report.downloadUrl, '_blank')
    }

    const clearFilters = () => {
      filters.value = {
        search: '',
        source: null,
        category: null
      }
      currentPage.value = 1
    }

    return {
      reports,
      filteredReports,
      paginatedReports,
      filters,
      sourceOptions,
      categoryOptions,
      expandedId,
      currentPage,
      totalPages,
      activeFiltersCount,
      toggleReport,
      downloadReport,
      clearFilters
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-card {
  border-radius: 12px;
  transition: all 0.25s ease;
}

.table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.table-row {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.bg-grey-1 {
  background: #fafafa !important;
}

.bg-grey-2 {
  background: #f5f5f5 !important;
}

:deep(.q-badge) {
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
}

:deep(.q-chip) {
  border-radius: 6px;
  font-size: 0.75rem;
}

.text-body2 {
  line-height: 1.7;
}

// Responsividade
@media (max-width: 768px) {
  .table-header {
    display: none;
  }

  .table-row {
    flex-wrap: wrap;

    > div {
      padding: 4px 0;
    }
  }
}
</style>
