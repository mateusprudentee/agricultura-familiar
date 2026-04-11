<template>
  <q-layout view="hHh Lpr lff">
    <q-page-container>
      <q-page class="bg-grey-1">
        <div class="container q-pa-lg-md">
          <!-- Layout em grid -->
          <div class="row q-col-gutter-xl">
            <!-- COLUNA ESQUERDA (70%) -->
            <div class="col-12 col-md-8">
              <div class="column q-gutter-y-lg">
                <!-- KPI Cards - Métricas Principais -->
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-3" v-for="i in 4" :key="i">
                    <q-card class="kpi-card" :class="{ 'skeleton-loading': loading }">
                      <q-card-section class="q-pa-md">
                        <div v-if="loading">
                          <q-skeleton type="rect" width="48px" height="48px" class="q-mb-sm" />
                          <q-skeleton type="text" width="80%" class="q-mt-sm" />
                          <q-skeleton type="text" width="60%" class="q-mt-xs" />
                          <q-skeleton type="text" width="40%" class="q-mt-xs" />
                        </div>
                        <div v-else>
                          <div class="kpi-icon bg-primary-soft text-primary">
                            <q-icon name="payments" size="28px" />
                          </div>
                          <div class="kpi-value text-h5 text-weight-bold q-mt-sm">00,00</div>
                          <div class="kpi-label text-caption text-grey-6">Repasses PNAE (2025)</div>
                          <div class="trend-positive text-caption">
                            <q-icon name="trending_up" size="14px" /> +12.5%
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <!-- Gráfico 1: Evolução de Repasses -->
                <q-card class="chart-card">
                  <q-card-section>
                    <div class="row items-center justify-between q-mb-md">
                      <div>
                        <div class="text-subtitle1 text-weight-medium">Evolução de Repasses PNAE</div>
                        <div class="text-caption text-grey-6">Últimos 24 meses | Agricultura Familiar</div>
                      </div>
                      <q-btn-toggle
                        v-model="periodoRepasses"
                        toggle-color="primary"
                        :options="[
                          { label: '6M', value: '6' },
                          { label: '12M', value: '12' },
                          { label: '24M', value: '24' }
                        ]"
                        size="sm"
                        dense
                        no-caps
                      />
                    </div>
                    <div class="chart-container">
                      <q-skeleton v-if="loading" type="rect" height="320px" />
                      <canvas v-else ref="repassesChart"></canvas>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Gráfico 2: Top 10 Municípios por Capacidade Produtiva -->
                <q-card class="chart-card">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">
                      Top 10 Municípios - Capacidade Produtiva
                    </div>
                    <div class="chart-container">
                      <q-skeleton v-if="loading" type="rect" height="320px" />
                      <canvas v-else ref="capacidadeChart"></canvas>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Gráfico 3: Cumprimento do PNAE -->
                <q-card class="chart-card">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">
                      Cumprimento da Meta PNAE (30%)
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <div class="chart-container-small">
                          <q-skeleton v-if="loading" type="rect" height="200px" />
                          <canvas v-else ref="cumprimentoChart"></canvas>
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div v-if="loading">
                          <q-skeleton type="rect" height="60px" class="q-mb-md" />
                          <q-skeleton type="rect" height="60px" class="q-mb-md" />
                          <q-skeleton type="rect" height="60px" />
                        </div>
                        <div v-else class="compliance-stats">
                          <div class="stat-item q-mb-md">
                            <div class="flex justify-between items-center q-mb-xs">
                              <span class="text-caption">Municípios que atingiram a meta</span>
                              <span class="text-weight-bold text-primary">32</span>
                            </div>
                            <q-linear-progress :value="0.32" color="primary" class="q-mb-sm" />
                          </div>
                          <div class="stat-item q-mb-md">
                            <div class="flex justify-between items-center q-mb-xs">
                              <span class="text-caption">Municípios em progresso</span>
                              <span class="text-weight-bold text-orange">48</span>
                            </div>
                            <q-linear-progress :value="0.48" color="orange" class="q-mb-sm" />
                          </div>
                          <div class="stat-item">
                            <div class="flex justify-between items-center q-mb-xs">
                              <span class="text-caption">Municípios abaixo da meta</span>
                              <span class="text-weight-bold text-red">20</span>
                            </div>
                            <q-linear-progress :value="0.20" color="red" class="q-mb-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- COLUNA DIREITA (30%) -->
            <div class="col-12 col-md-4">
              <div class="column q-gutter-y-lg">
                <!-- ODS Cards -->
                <q-card class="ods-card">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">
                      Objetivos de Desenvolvimento Sustentável
                    </div>
                    <div class="ods-list">
                      <div class="ods-item q-mb-md" v-for="ods in odsList" :key="ods.numero">
                        <div v-if="loading">
                          <q-skeleton type="rect" height="60px" />
                        </div>
                        <div v-else class="row items-center">
                          <div class="col-auto">
                            <div class="ods-badge" :style="{ backgroundColor: ods.cor }">
                              {{ ods.numero }}
                            </div>
                          </div>
                          <div class="col q-ml-sm">
                            <div class="text-caption text-weight-medium">{{ ods.titulo }}</div>
                            <div class="text-caption text-grey-6">Progresso: {{ ods.progresso }}%</div>
                          </div>
                          <div class="col-auto">
                            <q-circular-progress
                              :value="ods.progresso"
                              size="40px"
                              :color="ods.corCircular"
                              track-color="grey-3"
                              class="q-ml-sm"
                            >
                              <span class="text-caption text-weight-bold">{{ ods.progresso }}%</span>
                            </q-circular-progress>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Destaques e Alertas -->
                <q-card class="alerts-card">
                  <q-card-section>
                    <div class="flex items-center q-mb-md">
                      <q-icon name="notifications_active" size="20px" class="text-primary q-mr-sm" />
                      <div class="text-subtitle1 text-weight-medium">Alertas e Destaques</div>
                    </div>
                    <div class="alerts-list">
                      <div class="alert-item q-pa-sm q-mb-sm" v-for="alerta in alertas" :key="alerta.id">
                        <div v-if="loading">
                          <q-skeleton type="rect" height="50px" />
                        </div>
                        <div v-else class="row items-center">
                          <div class="col-auto">
                            <q-icon :name="alerta.icone" :color="alerta.cor" size="20px" />
                          </div>
                          <div class="col q-ml-sm">
                            <div class="text-caption text-weight-medium">{{ alerta.titulo }}</div>
                            <div class="text-caption text-grey-6">{{ alerta.descricao }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Agricultores Ativos por Região -->
                <q-card class="farmers-card">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">
                      Agricultores Familiares Ativos
                    </div>
                    <div class="chart-container-small">
                      <q-skeleton v-if="loading" type="rect" height="200px" />
                      <canvas v-else ref="agricultoresChart"></canvas>
                    </div>
                    <div class="text-caption text-center text-grey-6 q-mt-sm">
                      Mato Grosso | Dados atualizados 2025
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Secretarias Municipais -->
                <q-card class="secretarias-card">
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">
                      Secretarias de Agricultura Familiar
                    </div>
                    <div v-if="loading">
                      <q-skeleton type="rect" height="40px" class="q-mb-sm" />
                      <q-skeleton type="rect" height="40px" class="q-mb-sm" />
                      <q-skeleton type="rect" height="40px" />
                    </div>
                    <div v-else class="stats-mini">
                      <div class="stat-mini-item flex justify-between items-center q-mb-sm">
                        <span class="text-caption">Municípios com secretaria específica</span>
                        <span class="text-weight-bold text-primary">45</span>
                      </div>
                      <div class="stat-mini-item flex justify-between items-center q-mb-sm">
                        <span class="text-caption">Municípios sem secretaria específica</span>
                        <span class="text-weight-bold text-grey-7">83</span>
                      </div>
                      <q-separator class="q-my-sm" />
                      <div class="stat-mini-item flex justify-between items-center">
                        <span class="text-caption">Cobertura regional</span>
                        <span class="text-weight-bold text-green">35.2%</span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'DashboardAgriculturaFamiliar',
  setup() {
    const loading = ref(true)
    const periodoRepasses = ref('24')
    const repassesChart = ref(null)
    const capacidadeChart = ref(null)
    const cumprimentoChart = ref(null)
    const agricultoresChart = ref(null)

    let repassesChartInstance = null
    let capacidadeChartInstance = null
    let cumprimentoChartInstance = null
    let agricultoresChartInstance = null

    // Dados para os gráficos
    const repassesData = {
      '6': {
        labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        valores: [1.8, 2.1, 2.4, 2.2, 2.5, 2.8]
      },
      '12': {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        valores: [1.5, 1.7, 1.9, 2.0, 2.1, 2.3, 2.4, 2.6, 2.5, 2.7, 2.9, 3.1]
      },
      '24': {
        labels: ['2023-01', '2023-04', '2023-07', '2023-10', '2024-01', '2024-04', '2024-07', '2024-10', '2025-01'],
        valores: [1.2, 1.4, 1.6, 1.8, 2.0, 2.3, 2.6, 2.9, 3.2]
      }
    }

    const municipiosCapacidade = {
      labels: ['Cuiabá', 'Rondonópolis', 'Sinop', 'Sorriso', 'Tangará', 'Lucas Rio Verde', 'Primavera', 'Campo Verde', 'Nova Mutum', 'Sapezal'],
      valores: [85, 78, 92, 88, 76, 95, 72, 82, 79, 74]
    }

    const agricultoresRegiao = {
      labels: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'],
      valores: [3250, 4280, 2890, 3940, 2450]
    }

    const odsList = [
      { numero: 2, titulo: 'Fome Zero e Agricultura Sustentável', progresso: 68, cor: '#DAA520', corCircular: 'amber' },
      { numero: 3, titulo: 'Saúde e Bem-Estar', progresso: 72, cor: '#4CAF50', corCircular: 'green' },
      { numero: 4, titulo: 'Educação de Qualidade', progresso: 65, cor: '#2196F3', corCircular: 'blue' }
    ]

    const alertas = [
      { id: 1, icone: 'warning', cor: 'orange', titulo: 'Meta PNAE', descricao: '20 municípios abaixo dos 30%' },
      { id: 2, icone: 'trending_up', cor: 'green', titulo: 'Crescimento', descricao: 'Repasses aumentaram 12.5% em 2025' },
      { id: 3, icone: 'groups', cor: 'primary', titulo: 'Novas Cooperativas', descricao: '8 novas associações criadas' },
      { id: 4, icone: 'school', cor: 'purple', titulo: 'Educação', descricao: '247 escolas recebem PNAE' }
    ]

    const criarGraficoRepasses = () => {
      if (repassesChart.value) {
        if (repassesChartInstance) {
          repassesChartInstance.destroy()
        }
        const ctx = repassesChart.value.getContext('2d')
        const data = repassesData[periodoRepasses.value]

        repassesChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Repasses (R$ milhões)',
              data: data.valores,
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#1976d2',
              pointBorderColor: '#fff',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => `R$ ${ctx.raw} milhões` } }
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Milhões (R$)' } }
            }
          }
        })
      }
    }

    const criarGraficoCapacidade = () => {
      if (capacidadeChart.value) {
        if (capacidadeChartInstance) {
          capacidadeChartInstance.destroy()
        }
        const ctx = capacidadeChart.value.getContext('2d')
        capacidadeChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: municipiosCapacidade.labels,
            datasets: [{
              label: 'Índice de Capacidade Produtiva',
              data: municipiosCapacidade.valores,
              backgroundColor: 'rgba(25, 118, 210, 0.7)',
              borderRadius: 8,
              barPercentage: 0.7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, title: { display: true, text: 'Capacidade (%)' } }
            }
          }
        })
      }
    }

    const criarGraficoAgricultores = () => {
      if (agricultoresChart.value) {
        if (agricultoresChartInstance) {
          agricultoresChartInstance.destroy()
        }
        const ctx = agricultoresChart.value.getContext('2d')
        agricultoresChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: agricultoresRegiao.labels,
            datasets: [{
              data: agricultoresRegiao.valores,
              backgroundColor: ['#1976d2', '#4caf50', '#ff9800', '#9c27b0', '#f44336'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
          }
        })
      }
    }

    const criarGraficoCumprimento = () => {
      if (cumprimentoChart.value) {
        if (cumprimentoChartInstance) {
          cumprimentoChartInstance.destroy()
        }
        const ctx = cumprimentoChart.value.getContext('2d')
        cumprimentoChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Atingiram Meta (32)', 'Em Progresso (48)', 'Abaixo da Meta (20)'],
            datasets: [{
              data: [32, 48, 20],
              backgroundColor: ['#1976d2', '#ff9800', '#f44336'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
          }
        })
      }
    }

    const initCharts = () => {
      criarGraficoRepasses()
      criarGraficoCapacidade()
      criarGraficoCumprimento()
      criarGraficoAgricultores()
    }

    // Simular loading
    setTimeout(() => {
      loading.value = false
      setTimeout(() => {
        initCharts()
      }, 100)
    }, 1500)

    watch(periodoRepasses, () => {
      if (!loading.value) {
        criarGraficoRepasses()
      }
    })

    onMounted(() => {
      // Aguarda o DOM estar pronto
      setTimeout(() => {
        if (!loading.value) {
          initCharts()
        }
      }, 100)
    })

    return {
      loading,
      periodoRepasses,
      repassesChart,
      capacidadeChart,
      cumprimentoChart,
      agricultoresChart,
      odsList,
      alertas
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Cards com box-shadow suave ao invés de bordas */
.kpi-card,
.chart-card,
.ods-card,
.alerts-card,
.farmers-card,
.secretarias-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  overflow: hidden;
}

.kpi-card:hover,
.chart-card:hover,
.ods-card:hover,
.alerts-card:hover,
.farmers-card:hover,
.secretarias-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* KPI Cards */
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-soft {
  background: rgba(25, 118, 210, 0.08);
}

.text-green {
  color: #4caf50;
}

.text-orange {
  color: #ff9800;
}

.text-purple {
  color: #9c27b0;
}

.trend-positive {
  color: #4caf50;
  margin-top: 8px;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.kpi-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Chart Containers */
.chart-container {
  height: 320px;
  position: relative;
}

.chart-container-small {
  height: 200px;
  position: relative;
}

/* ODS Cards */
.ods-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  color: white;
}

/* Alerts */
.alert-item {
  border-radius: 12px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.alert-item:hover {
  background: #f5f5f5;
}

/* Stats */
.stats-mini {
  padding: 8px 0;
}

.stat-mini-item {
  padding: 4px 0;
}

.compliance-stats {
  padding: 8px 0;
}

.stat-item {
  padding: 4px 0;
}

/* Skeleton Loading */
.skeleton-loading {
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 12px;
  }

  .kpi-value {
    font-size: 1.25rem;
  }

  .chart-container {
    height: 240px;
  }

  .chart-container-small {
    height: 180px;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  background: #f0f2f5;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}
</style>
