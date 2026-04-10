<template>
  <q-page class="home-page">

    <!-- HERO -->
    <div class="hero">

      <div class="hero-content">

        <div class="title">
          Portal de Agricultura Familiar
        </div>

        <div class="subtitle">
          Explore dados, análises e indicadores dos municípios de Mato Grosso
        </div>

        <!-- SEARCH -->
        <div class="search-box">

          <q-input
            v-model="search"
            placeholder="Digite o que deseja pesquisar..."
            outlined
            rounded
            bg-color="white"
            class="search-input"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- SUGESTÕES -->
          <q-card v-if="filteredSuggestions.length && showSuggestions" class="suggestions">
            <q-list separator>

              <q-item
                v-for="(item, index) in filteredSuggestions"
                :key="index"
                clickable
                v-ripple
                @mousedown="selectSuggestion(item)"
              >
                <q-item-section avatar>
                  <q-icon name="insights" color="primary" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>

              </q-item>

            </q-list>
          </q-card>

        </div>

      </div>

    </div>

    <!-- ATALHOS -->
    <div class="quick-actions row q-col-gutter-md " style="margin-top: -30px;">

      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="(item, i) in quickActions"
        :key="i"
      >
       <q-card class="action-card" clickable @click="$router.push(item.to)">
          <q-card-section>
            <q-icon :name="item.icon" size="32px" class="q-mb-sm" color="blue"/>
            <div class="text-subtitle1 text-weight-medium">{{ item.title }}</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script>
export default {
  name: 'HomePage',

  data () {
    return {
      search: '',
      showSuggestions: false,
      recentSearches: [],

      popularSearches: [
        'Verbas para agricultura familiar',
        'Produção por município',
        'Indicadores PNAE',
        'Capacidade produtiva'
      ],

      suggestions: [
        'Verbas destinadas a municípios com agricultura familiar',
        'Verbas destinadas a municípios sem agricultura familiar',
        'Comparativo de verbas por município',
        'Ranking de repasses por município',
        'Histórico de repasses agrícolas',
        'Capacidade produtiva dos municípios',
        'Capacidade produtiva por cultura',
        'Produção agrícola por município',
        'Produção por hectare',
        'Eficiência produtiva municipal',
        'Associações agrícolas por município',
        'Cooperativas agrícolas ativas',
        'Assistência técnica disponível',
        'Cobertura de assistência rural',
        'Apoio técnico por região',
        'Dependência da agricultura familiar',
        'Municípios mais dependentes',
        'Municípios menos dependentes',
        'Impacto econômico da agricultura familiar',
        'Participação no PIB municipal',
        'Municípios com secretaria agrícola',
        'Municípios sem secretaria agrícola',
        'Estrutura administrativa agrícola',
        'Gestão pública rural',
        'Políticas públicas agrícolas locais',
        'População rural por município',
        'Demanda por produção familiar',
        'Consumo local de alimentos',
        'Segurança alimentar municipal',
        'Indicadores populacionais rurais',
        'Repasses ao PNAE por município',
        'Municípios que cumprem o PNAE',
        'Municípios que não cumprem o PNAE',
        'Percentual de execução do PNAE',
        'Distribuição de recursos do PNAE',
        'Escolas atendidas pelo PNAE',
        'Cobertura escolar do PNAE',
        'Alimentação escolar por município',
        'Impacto do PNAE na economia local',
        'Rede escolar beneficiada',
        'Número de agricultores familiares',
        'Agricultores por região',
        'Crescimento de agricultores',
        'Distribuição de agricultores',
        'Perfil dos agricultores familiares',
        'Evolução de repasses últimos 2 anos',
        'Evolução histórica de investimentos',
        'Tendência de crescimento agrícola',
        'Análise temporal de dados',
        'Comparativo anual de investimentos',
        'ODS 2 - Fome Zero',
        'ODS 3 - Saúde e Bem-estar',
        'ODS 4 - Educação de qualidade',
        'Indicadores ODS por município',
        'Cumprimento dos ODS',
        'Impacto social dos ODS',
        'Infraestrutura agrícola municipal',
        'Estradas rurais',
        'Logística de produção agrícola',
        'Armazenamento de produção',
        'Tecnologia no campo',
        'Análise de dados do portal',
        'Indicadores estratégicos',
        'Relatórios analíticos',
        'Dashboard agrícola',
        'Mapeamento agrícola',
        'Comparativo entre municípios',
        'Ranking geral agrícola',
        'Eficiência de políticas públicas',
        'Impacto de investimentos',
        'Cadeia produtiva local',
        'Diversificação agrícola',
        'Produção sustentável',
        'Sustentabilidade rural',
        'Uso de tecnologia no campo',
        'Agricultura de precisão',
        'Dados climáticos e produção',
        'Impacto do clima na produção',
        'Regiões mais produtivas',
        'Regiões menos produtivas',
        'Análise regional agrícola',
        'Desempenho por região',
        'Exportação agrícola municipal',
        'Consumo interno agrícola',
        'Mercado agrícola local',
        'Preço médio de produção',
        'Rentabilidade agrícola',
        'Custos de produção',
        'Financiamento agrícola',
        'Crédito rural disponível',
        'Programas de incentivo agrícola',
        'Políticas de incentivo rural',
        'Impacto social da agricultura',
        'Geração de emprego rural',
        'Renda média agrícola',
        'Qualidade de vida rural',
        'Educação no campo',
        'Saúde no meio rural',
        'Inclusão social rural'
      ],

      quickActions: [
        { title: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
        { title: 'Financiamento', icon: 'payments', to: '/verbas-por-municipio' },
        { title: 'Capacidade Produtiva', icon: 'agriculture', to: '/capacidade-por-municipio' },
        { title: 'Indicadores Municipais', icon: 'analytics', to: '/dependencia-agricultura' },
        { title: 'PNAE - Merenda Escolar', icon: 'school', to: '/cumprimento-pnae' },
        { title: 'ODS', icon: 'flag', to: '/ods2-fome-zero' },
        { title: 'Portal', icon: 'more', to: '/relatorios' }
      ]
    }
  },

  mounted() {
    this.loadRecentSearches()
  },

  computed: {
    filteredSuggestions() {
      if (!this.search) {
        // Quando vazio, mostra pesquisas recentes e populares
        return this.getInitialSuggestions()
      }

      const searchTerm = this.search.toLowerCase().trim()
      const words = searchTerm.split(/\s+/)

      // Sistema de pontuação para ordenação inteligente
      const scoredSuggestions = this.suggestions.map(item => {
        const itemText = item.toLowerCase()
        let score = 0

        // Correspondência exata
        if (itemText === searchTerm) score += 100

        // Começa com o termo
        if (itemText.startsWith(searchTerm)) score += 50

        // Contém o termo
        if (itemText.includes(searchTerm)) score += 30

        // Correspondência por palavras
        words.forEach(word => {
          if (word.length > 2) {
            if (itemText.includes(word)) score += 15
            if (itemText.startsWith(word)) score += 10
          }
        })

        // Bônus para pesquisas recentes
        if (this.recentSearches.includes(item)) score += 20

        // Similaridade fonética básica
        const similarity = this.calculateSimilarity(searchTerm, itemText)
        score += similarity * 40

        return {
          text: item,
          score: score
        }
      })

      // Filtra e ordena por relevância
      return scoredSuggestions
        .filter(item => item.score > 20)
        .sort((a, b) => b.score - a.score)
        .map(item => item.text)
        .slice(0, 8)
    }
  },

  methods: {
    getInitialSuggestions() {
      const suggestions = []

      // Primeiro pesquisas recentes
      this.recentSearches.slice(0, 3).forEach(item => {
        if (!suggestions.includes(item)) {
          suggestions.push(item)
        }
      })

      // Depois pesquisas populares
      this.popularSearches.forEach(item => {
        if (!suggestions.includes(item) && suggestions.length < 6) {
          suggestions.push(item)
        }
      })

      return suggestions
    },

    calculateSimilarity(str1, str2) {
      const s1 = str1.toLowerCase()
      const s2 = str2.toLowerCase()

      if (s1 === s2) return 1
      if (s1.length === 0 || s2.length === 0) return 0

      let matches = 0
      const minLength = Math.min(s1.length, s2.length)

      for (let i = 0; i < minLength; i++) {
        if (s1[i] === s2[i]) matches++
      }

      return matches / Math.max(s1.length, s2.length)
    },

    selectSuggestion(item) {
      this.search = item
      this.showSuggestions = false

      // Salva no histórico
      this.saveToRecentSearches(item)

      this.$router.push({
        path: '/pesquisa',
        query: { q: item }
      })
    },

    saveToRecentSearches(text) {
      this.recentSearches = [
        text,
        ...this.recentSearches.filter(s => s !== text)
      ].slice(0, 10)

      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
    },

    loadRecentSearches() {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          this.recentSearches = JSON.parse(saved)
        } catch (e) {
          console.error('Erro ao carregar histórico:', e)
        }
      }
    },

    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false
      }, 150)
    }
  }
}
</script>

<style scoped>


/* HERO */
.hero {
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;

  .title {
  font-size: 32px;
  font-weight: 700;

  background: linear-gradient(135deg, #0011ff, #00d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
}

.hero-content {
  width: 100%;
  max-width: 700px;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin-top: 5px;
  font-size: 14px;
  color: rgb(75, 75, 75);
  opacity: 0.9;
}

/* SEARCH */
.search-box {
  margin-top: 30px;
  position: relative;
}

.search-input {
  font-size: 16px;
}

.suggestions {
  position: absolute;
  width: 100%;
  text-align: left;
  margin-top: 8px;
  border-radius: 12px;
  z-index: 10;
}

/* CARDS */
.quick-actions {
  max-width: 800px;
  margin: 0 auto;
}

.action-card {
  border-radius: 16px;
  transition: 0.25s;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.034);
}
</style>
