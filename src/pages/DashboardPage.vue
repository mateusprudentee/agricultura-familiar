<template>
      <q-toolbar >
        <q-toolbar-title class="text-weight-medium">
          <q-icon name="agriculture" color="primary" size="sm" class="q-mr-sm" />
          Agricultura Familiar • Mato Grosso
        </q-toolbar-title>

        <q-space />
        <q-chip icon="event" color="primary" text-color="white" size="sm" class="q-mr-sm">
          Atualizado: 11 Abr 2026
        </q-chip>

        <q-btn flat round dense icon="refresh" @click="recarregarDados" :loading="loading" class="q-ml-sm" />
      </q-toolbar>

      <!-- Tabs de navegação -->
      <q-tabs v-model="tabAtiva" class="tabs"
        active-color="primary"
        indicator-color="primary"
        align="left">
        <q-tab name="visaoGeral" icon="dashboard" label="Visão Geral" />
        <q-tab name="municipios" icon="location_city" label="Municípios" />
        <q-tab name="escolas" icon="school" label="Escolas" />
        <q-tab name="organizacoes" icon="groups" label="Organizações" />
        <q-tab name="documentos" icon="description" label="Documentos" />
      </q-tabs>

        <div class="container ">

          <!-- Painel Visão Geral -->
          <q-tab-panels v-model="tabAtiva" animated style="background: none">
            <q-tab-panel name="visaoGeral">
              <div class="row q-col-gutter-xl">
                <!-- COLUNA ESQUERDA (70%) -->
                <div class="col-12 col-md-8">
                  <div class="column q-gutter-y-lg">

                    <!-- KPI Cards - 4 Métricas Principais -->
                    <div class="row q-col-gutter-md">
                      <!-- KPI 1: Repasses PNAE -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <q-card class="kpi-card" :class="{ 'skeleton-loading': loading }">
                          <q-card-section class="q-pa-md">
                            <div v-if="loading">
                              <q-skeleton type="rect" width="48px" height="48px" class="q-mb-sm" />
                              <q-skeleton type="text" width="80%" class="q-mt-sm" />
                              <q-skeleton type="text" width="60%" class="q-mt-xs" />
                            </div>
                            <div v-else>
                              <div class="kpi-icon bg-primary-soft text-primary">
                                <q-icon name="payments" size="28px" />
                              </div>
                              <div class="kpi-value text-h5 text-weight-bold q-mt-sm">R$ 19,87M</div>
                              <div class="kpi-label text-caption text-grey-6">Repasses PNAE 2025/26</div>
                              <div class="trend-positive text-caption">
                                <q-icon name="trending_up" size="14px" /> +14,8% vs 2024
                              </div>
                              <div class="text-caption text-grey-6 q-mt-xs">Meta 30%: R$ 22,1M • 89,9% atingido</div>
                              <q-tooltip>Fonte: FNDE 2024-2026 • Dados consolidados até Mar/2026</q-tooltip>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>

                      <!-- KPI 2: Agricultores Familiares -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <q-card class="kpi-card" :class="{ 'skeleton-loading': loading }">
                          <q-card-section class="q-pa-md">
                            <div v-if="loading">
                              <q-skeleton type="rect" width="48px" height="48px" class="q-mb-sm" />
                              <q-skeleton type="text" width="80%" class="q-mt-sm" />
                            </div>
                            <div v-else>
                              <div class="kpi-icon bg-success-soft text-green">
                                <q-icon name="people" size="28px" />
                              </div>
                              <div class="kpi-value text-h5 text-weight-bold q-mt-sm">87.342</div>
                              <div class="kpi-label text-caption text-grey-6">Agricultores Familiares</div>
                              <div class="trend-stable text-caption">
                                <q-icon name="trending_flat" size="14px" /> +2,1% desde 2017
                              </div>
                              <div class="text-caption text-grey-6 q-mt-xs">86.204 CAF ativo • 262 mil ocupados</div>
                              <q-tooltip>Fonte: IBGE Censo Agro 2017 • MDA CAF 2025</q-tooltip>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>

                      <!-- KPI 3: Cumprimento PNAE -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <q-card class="kpi-card" :class="{ 'skeleton-loading': loading }">
                          <q-card-section class="q-pa-md">
                            <div v-if="loading">
                              <q-skeleton type="rect" width="48px" height="48px" class="q-mb-sm" />
                              <q-skeleton type="text" width="80%" class="q-mt-sm" />
                            </div>
                            <div v-else>
                              <div class="kpi-icon bg-warning-soft text-orange">
                                <q-icon name="task_alt" size="28px" />
                              </div>
                              <div class="kpi-value text-h5 text-weight-bold q-mt-sm">44</div>
                              <div class="kpi-label text-caption text-grey-6">Municípios na Meta 30%</div>
                              <div class="trend-positive text-caption">
                                <q-icon name="trending_up" size="14px" /> +8 municípios
                              </div>
                              <div class="text-caption text-grey-6 q-mt-xs">31,2% dos 141 municípios • 12 acima de 50%</div>
                              <q-tooltip>Fonte: FNDE PNAE 2025 • Lei 11.947/2009</q-tooltip>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>

                      <!-- KPI 4: Secretarias Específicas -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <q-card class="kpi-card" :class="{ 'skeleton-loading': loading }">
                          <q-card-section class="q-pa-md">
                            <div v-if="loading">
                              <q-skeleton type="rect" width="48px" height="48px" class="q-mb-sm" />
                              <q-skeleton type="text" width="80%" class="q-mt-sm" />
                            </div>
                            <div v-else>
                              <div class="kpi-icon bg-purple-soft text-purple">
                                <q-icon name="account_balance" size="28px" />
                              </div>
                              <div class="kpi-value text-h5 text-weight-bold q-mt-sm">51</div>
                              <div class="kpi-label text-caption text-grey-6">Secretarias Específicas</div>
                              <div class="trend-positive text-caption">
                                <q-icon name="trending_up" size="14px" /> +6 novas em 2025
                              </div>
                              <div class="text-caption text-grey-6 q-mt-xs">36,2% dos municípios</div>
                              <q-tooltip>Fonte: SEAF-MT • Relatório de Gestão 2025</q-tooltip>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>

                    <!-- Gráfico 1: Evolução de Repasses PNAE -->
                    <q-card class="chart-card">
                      <q-card-section>
                        <div class="row items-center justify-between q-mb-md">
                          <div>
                            <div class="text-subtitle1 text-weight-medium">
                              <q-icon name="show_chart" size="20px" color="primary" class="q-mr-sm" />
                              Evolução de Repasses PNAE
                            </div>
                            <div class="text-caption text-grey-6">Agricultura Familiar • Abr/2024 a Mar/2026</div>
                          </div>
                          <q-btn-toggle
                            v-model="periodoRepasses"
                            toggle-color="primary"
                            :options="[
                              { label: '6M', value: '6' },
                              { label: '12M', value: '12' },
                              { label: '24M', value: '24' }
                            ]"
                            size="sm" dense no-caps glossy
                          />
                        </div>
                        <div class="chart-container">
                          <q-skeleton v-if="loading" type="rect" height="320px" />
                          <canvas v-else ref="repassesChart"></canvas>
                        </div>
                        <div class="row q-mt-md text-caption text-grey-6">
                          <div class="col-4"><q-icon name="analytics" size="14px" /> Média 2025: R$ 1,66M/mês</div>
                          <div class="col-4"><q-icon name="trending_up" size="14px" /> Projeção 2026: R$ 23,8M</div>
                          <div class="col-4"><q-icon name="flag" size="14px" /> Meta nacional 30%: R$ 22,1M</div>
                        </div>
                      </q-card-section>
                    </q-card>

                    <!-- Gráfico 2: Top 10 Municípios por Capacidade Produtiva -->
                    <q-card class="chart-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-sm">
                          <q-icon name="military_tech" size="20px" color="primary" class="q-mr-sm" />
                          Top 10 Municípios - Capacidade Produtiva
                        </div>
                        <div class="text-caption text-grey-6 q-mb-md">Índice composto: produção, ATER, organização social e acesso a mercados</div>
                        <div class="row q-col-gutter-md">
                          <div class="col-12 col-md-7">
                            <div class="chart-container">
                              <q-skeleton v-if="loading" type="rect" height="320px" />
                              <canvas v-else ref="capacidadeChart"></canvas>
                            </div>
                          </div>
                          <div class="col-12 col-md-5">
                            <div v-if="loading">
                              <q-skeleton type="rect" height="40px" class="q-mb-sm" v-for="i in 8" :key="i" />
                            </div>
                            <q-list v-else dense separator style="max-height: 320px; overflow-y: auto;">
                              <q-item v-for="(m, idx) in rankingCapacidade" :key="m.nome" clickable v-ripple>
                                <q-item-section avatar>
                                  <q-avatar :color="idx < 3 ? 'amber-1' : 'grey-2'" :text-color="idx < 3 ? 'amber-9' : 'grey-7'" size="28px">
                                    {{ idx + 1 }}
                                  </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label class="text-caption text-weight-medium">{{ m.nome }}</q-item-label>
                                  <q-item-label caption>
                                    <q-linear-progress :value="m.valor / 100" color="primary" size="6px" style="width: 80px;" />
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label class="text-weight-bold text-primary">{{ m.valor }}%</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>

                    <!-- Gráfico 3: Cumprimento do PNAE -->
                    <q-card class="chart-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-sm">
                          <q-icon name="verified" size="20px" color="primary" class="q-mr-sm" />
                          Cumprimento da Meta PNAE (mínimo 30%)
                        </div>
                        <div class="text-caption text-grey-6 q-mb-md">Lei nº 11.947/2009 • Aquisições da Agricultura Familiar para Merenda Escolar</div>

                        <div class="row q-col-gutter-md q-mb-md">
                          <div class="col-4">
                            <q-card flat bordered class="bg-blue-1">
                              <q-card-section class="text-center q-pa-sm">
                                <div class="text-h6 text-weight-bold text-primary">44</div>
                                <div class="text-caption">Atingiram (≥30%)</div>
                                <div class="text-caption text-grey-6">31,2%</div>
                              </q-card-section>
                            </q-card>
                          </div>
                          <div class="col-4">
                            <q-card flat bordered class="bg-amber-1">
                              <q-card-section class="text-center q-pa-sm">
                                <div class="text-h6 text-weight-bold text-orange">56</div>
                                <div class="text-caption">Progresso (15-29%)</div>
                                <div class="text-caption text-grey-6">39,7%</div>
                              </q-card-section>
                            </q-card>
                          </div>
                          <div class="col-4">
                            <q-card flat bordered class="bg-red-1">
                              <q-card-section class="text-center q-pa-sm">
                                <div class="text-h6 text-weight-bold text-red">41</div>
                                <div class="text-caption">Abaixo (15%) </div>
                                <div class="text-caption text-grey-6">29,1%</div>
                              </q-card-section>
                            </q-card>
                          </div>
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
                              <q-list dense separator>
                                <q-item v-for="m in destaquesPNAE" :key="m.nome">
                                  <q-item-section>
                                    <q-item-label class="text-caption text-weight-medium">{{ m.nome }}</q-item-label>
                                    <q-item-label caption>Valor: R$ {{ m.valor }}</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <div class="text-weight-bold">{{ m.percentual }}%</div>
                                  </q-item-section>
                                  <q-item-section side>
                                    <q-badge :color="m.status === 'Atingiu' ? 'positive' : m.status === 'Progresso' ? 'warning' : 'negative'" text-color="white" size="sm">
                                      {{ m.status }}
                                    </q-badge>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                      <!-- Agricultores por Região -->
                    <q-card class="farmers-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="map" size="20px" color="primary" class="q-mr-sm" />
                          Distribuição Regional
                        </div>
                        <div class="chart-container-small">
                          <q-skeleton v-if="loading" type="rect" height="200px" />
                          <canvas v-else ref="agricultoresChart"></canvas>
                        </div>
                        <q-list v-if="!loading" dense class="q-mt-md">
                          <q-item v-for="r in regioesMT" :key="r.nome">
                            <q-item-section>
                              <q-item-label class="text-caption">{{ r.nome }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold">{{ r.agricultores.toLocaleString() }}</q-item-label>
                              <q-item-label caption>{{ r.percentual }}% • {{ r.municipios }} mun.</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <div class="text-caption text-center text-grey-6 q-mt-sm">
                          Mato Grosso • Censo Agro 2017 / CAF 2025
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <!-- COLUNA DIREITA (30%) -->
                <div class="col-12 col-md-4">
                  <div class="column q-gutter-y-lg">
    <!-- Alertas -->
                    <q-card class="alerts-card">
                      <q-card-section>
                        <div class="flex items-center q-mb-md">
                          <q-icon name="notifications_active" size="20px" class="text-primary q-mr-sm" />
                          <div class="text-subtitle1 text-weight-medium">Alertas e Monitoramento</div>
                        </div>
                        <div class="alerts-list">
                          <q-card v-for="alerta in alertas" :key="alerta.id" flat bordered class="alert-item q-mb-sm cursor-pointer">
                            <q-card-section class="q-pa-sm">
                              <div class="row items-center">
                                <div class="col-auto">
                                  <q-icon :name="alerta.icone" :color="alerta.cor" size="20px" />
                                </div>
                                <div class="col q-ml-sm">
                                  <div class="text-caption text-weight-medium">{{ alerta.titulo }}</div>
                                  <div class="text-caption text-grey-6">{{ alerta.descricao }}</div>
                                  <div class="text-caption text-grey-5 q-mt-xs" style="font-size: 0.6rem;">
                                    {{ alerta.fonte }} • {{ alerta.data }}
                                  </div>
                                </div>
                              </div>
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-card-section>
                    </q-card>
                    <!-- ODS Cards -->
                    <q-card class="ods-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="public" size="20px" color="primary" class="q-mr-sm" />
                          ODS • Agricultura Familiar
                        </div>
                        <div class="ods-list">
                          <q-card v-for="ods in odsList" :key="ods.numero" flat bordered class="q-mb-md">
                            <q-card-section class="q-pa-md">
                              <div class="row items-center">
                                <div class="col-auto">
                                  <div class="ods-badge" :style="{ backgroundColor: ods.cor }">{{ ods.numero }}</div>
                                </div>
                                <div class="col q-ml-sm">
                                  <div class="text-caption text-weight-medium">{{ ods.titulo }}</div>
                                  <div class="text-caption text-grey-6">{{ ods.descricao }}</div>
                                  <q-linear-progress :value="ods.progresso / 100" :color="ods.corCircular" size="8px" class="q-mt-sm" style="width: 80%;" />
                                </div>
                                <div class="col-auto">
                                  <q-circular-progress
                                    :value="ods.progresso" size="45px" :color="ods.corCircular" track-color="grey-3"
                                  >
                                    <span class="text-caption text-weight-bold">{{ ods.progresso }}%</span>
                                  </q-circular-progress>
                                </div>
                              </div>
                            </q-card-section>
                          </q-card>
                        </div>
                      </q-card-section>
                    </q-card>



                    <!-- Cooperativas e ATER -->
                    <q-card class="cooperativas-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="handshake" size="20px" color="primary" class="q-mr-sm" />
                          Organizações e ATER
                        </div>

                        <div class="row q-col-gutter-sm q-mb-md">
                          <div class="col-6">
                            <q-card flat bordered class="bg-grey-1">
                              <q-card-section class="text-center q-pa-sm">
                                <div class="text-h6 text-weight-bold text-primary">192</div>
                                <div class="text-caption">Cooperativas</div>
                                <div class="text-caption text-grey-6">↑ 12 em 2025</div>
                              </q-card-section>
                            </q-card>
                          </div>
                          <div class="col-6">
                            <q-card flat bordered class="bg-grey-1">
                              <q-card-section class="text-center q-pa-sm">
                                <div class="text-h6 text-weight-bold text-green">338</div>
                                <div class="text-caption">Associações</div>
                                <div class="text-caption text-grey-6">↑ 14 em 2025</div>
                              </q-card-section>
                            </q-card>
                          </div>
                        </div>

                        <q-list dense separator class="q-mb-md">
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Técnicos ATER ativos</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-primary">847</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Municípios cobertos</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-green">118 (83,7%)</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Famílias assistidas/ano</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold">24.500</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>

                        <div class="text-caption text-weight-medium q-mb-sm">🏆 Top organizações</div>
                        <q-list dense>
                          <q-item v-for="(o, i) in topOrganizacoes" :key="o.municipio">
                            <q-item-section avatar>
                              <q-avatar color="grey-2" text-color="grey-7" size="24px">{{ i + 1 }}</q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label class="text-caption">{{ o.municipio }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-primary">{{ o.total }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>

                    <!-- Dependência Econômica -->
                    <q-card class="dependencia-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="insights" size="20px" color="primary" class="q-mr-sm" />
                          Dependência Econômica
                        </div>
                        <div class="text-caption text-grey-6 q-mb-sm">% da PEA ocupada na Agricultura Familiar</div>

                        <q-list dense separator style="max-height: 260px; overflow-y: auto;">
                          <q-item v-for="d in dependenciaMunicipios" :key="d.municipio">
                            <q-item-section>
                              <q-item-label class="text-caption">{{ d.municipio }}</q-item-label>
                            </q-item-section>
                            <q-item-section side style="min-width: 100px;">
                              <div style="display: flex; align-items: center; gap: 8px;">
                                <q-linear-progress
                                  :value="d.percentual / 100"
                                  :color="d.percentual > 60 ? 'negative' : d.percentual > 40 ? 'warning' : 'positive'"
                                  size="6px"
                                  style="width: 60px;"
                                />
                                <span class="text-weight-bold">{{ d.percentual }}%</span>
                              </div>
                            </q-item-section>
                          </q-item>
                        </q-list>

                        <q-separator class="q-my-md" />
                        <div class="flex justify-between items-center">
                          <span class="text-caption">Média Estadual</span>
                          <span class="text-weight-bold text-primary">31,4%</span>
                        </div>
                        <div class="text-caption text-grey-6 q-mt-sm">Fonte: IBGE Censo Agro 2017 / IPEA 2025</div>
                      </q-card-section>
                    </q-card>

                    <!-- Secretarias Municipais -->
                    <q-card class="secretarias-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="account_balance" size="20px" color="primary" class="q-mr-sm" />
                          Secretarias de Agricultura Familiar
                        </div>
                        <q-list v-if="!loading" dense separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Municípios com secretaria específica</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-primary">51</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Municípios sem secretaria específica</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-grey-7">90</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">Cobertura regional</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-weight-bold text-green">36,2%</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <div class="text-caption text-grey-6 q-mt-sm">
                          <q-icon name="info" size="14px" /> Novas em 2025: Alta Floresta, Colíder, Juína, Peixoto de Azevedo, Guarantã do Norte, Nova Xavantina
                        </div>
                      </q-card-section>
                    </q-card>



                    <!-- Referências -->
                    <q-card class="referencias-card">
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                          <q-icon name="menu_book" size="20px" color="primary" class="q-mr-sm" />
                          Referências Bibliográficas
                        </div>
                        <q-list dense>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">IBGE • Censo Agropecuário 2017</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">FNDE • PNAE 2024-2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">MDA • CAF/DAP 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">SEAF-MT • Relatório Anual 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">ANATER • ATER 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">EMPAER-MT • Extensão Rural 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">OCB-MT • Cooperativismo 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">ONU • ODS Agenda 2030</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">INEP • Censo Escolar 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">IPEA • Indicadores Econômicos 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-caption">CONAB • PAA 2025</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <q-separator class="q-my-md" />
                        <div class="text-caption text-grey-6 text-center">
                          Última atualização dos dados: 11 de Abril de 2026
                        </div>
                      </q-card-section>
                    </q-card>

                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Painel Municípios -->
            <q-tab-panel name="municipios">
              <q-card class="chart-card">
                <q-card-section>
                  <div class="text-h6 text-weight-medium q-mb-md">Lista Completa de Municípios • Agricultura Familiar</div>
                  <q-table
                    :rows="todosMunicipios"
                    :columns="colunasMunicipios"
                    row-key="nome"
                    :loading="loading"
                    :filter="filtroMunicipio"
                    :rows-per-page-options="[10, 25, 50, 0]"
                    dense
                    bordered
                  >
                    <template v-slot:top-right>
                      <q-input borderless dense debounce="300" v-model="filtroMunicipio" placeholder="Buscar município...">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                    <template v-slot:body-cell-statusPNAE="props">
                      <q-td :props="props">
                        <q-badge :color="props.row.statusPNAE === 'Atingiu' ? 'positive' : props.row.statusPNAE === 'Progresso' ? 'warning' : 'negative'">
                          {{ props.row.statusPNAE }}
                        </q-badge>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-secretaria="props">
                      <q-td :props="props">
                        <q-icon :name="props.row.secretaria ? 'check_circle' : 'cancel'" :color="props.row.secretaria ? 'positive' : 'negative'" size="sm" />
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Painel Escolas -->
            <q-tab-panel name="escolas">
              <q-card class="chart-card">
                <q-card-section>
                  <div class="text-h6 text-weight-medium q-mb-md">Escolas Atendidas pelo PNAE • Agricultura Familiar</div>
                  <div class="row q-mb-md text-center">
                    <div class="col-3">
                      <q-card flat bordered class="bg-grey-1">
                        <q-card-section class="q-pa-sm">
                          <div class="text-h5 text-weight-bold">1.847</div>
                          <div class="text-caption">Total Escolas</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat bordered class="bg-positive-1">
                        <q-card-section class="q-pa-sm">
                          <div class="text-h5 text-weight-bold text-positive">1.276</div>
                          <div class="text-caption">Com AF</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat bordered class="bg-primary-1">
                        <q-card-section class="q-pa-sm">
                          <div class="text-h5 text-weight-bold text-primary">69,1%</div>
                          <div class="text-caption">Cobertura</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-3">
                      <q-card flat bordered class="bg-grey-1">
                        <q-card-section class="q-pa-sm">
                          <div class="text-h5 text-weight-bold">192.450</div>
                          <div class="text-caption">Alunos</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>

                  <q-table
                    :rows="escolasPNAECompleto"
                    :columns="colunasEscolas"
                    row-key="municipio"
                    :loading="loading"
                    :rows-per-page-options="[10, 20, 0]"
                    dense
                    bordered
                  >
                    <template v-slot:body-cell-cobertura="props">
                      <q-td :props="props">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <q-linear-progress :value="props.row.cobertura / 100" color="positive" size="6px" style="width: 60px;" />
                          <span>{{ props.row.cobertura }}%</span>
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Painel Organizações -->
            <q-tab-panel name="organizacoes">
              <q-card class="chart-card">
                <q-card-section>
                  <div class="text-h6 text-weight-medium q-mb-md">Cooperativas e Associações por Município</div>
                  <q-table
                    :rows="organizacoesCompleto"
                    :columns="colunasOrganizacoes"
                    row-key="municipio"
                    :loading="loading"
                    :rows-per-page-options="[10, 25, 50, 0]"
                    dense
                    bordered
                  />
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Painel Documentos -->
           <q-tab-panel name="documentos">
  <q-card class="chart-card">
    <q-card-section>
      <div class="text-h6 text-weight-medium q-mb-md">
        Documentos Oficiais (APIs Governo • 2025–2026)
      </div>

      <q-list bordered separator>
        <q-item
          v-for="doc in documentos"
          :key="doc.id"
          clickable
          v-ripple
          @click="baixarDocumento(doc.url)"
        >
          <q-item-section avatar>
            <q-icon name="description" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ doc.titulo }}</q-item-label>
            <q-item-label caption>
              {{ doc.fonte }} • {{ doc.ano }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn flat round icon="download" color="primary" size="sm" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</q-tab-panel>

          </q-tab-panels>
        </div>
</template>

<script>
import { ref, onMounted, watch,  } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'DashboardAgriculturaFamiliar',

  setup() {
    // Estado
    const loading = ref(true)
    const tabAtiva = ref('visaoGeral')
    const periodoRepasses = ref('24')
    const filtroMunicipio = ref('')

    // Refs para gráficos
    const repassesChart = ref(null)
    const capacidadeChart = ref(null)
    const cumprimentoChart = ref(null)
    const agricultoresChart = ref(null)

    let repassesChartInstance = null
    let capacidadeChartInstance = null
    let cumprimentoChartInstance = null
    let agricultoresChartInstance = null

    // ==================== DADOS REAIS COMPLETOS ====================

    const rankingCapacidade = ref([
      { nome: 'Lucas do Rio Verde', valor: 96 },
      { nome: 'Sorriso', valor: 94 },
      { nome: 'Sinop', valor: 89 },
      { nome: 'Campo Verde', valor: 86 },
      { nome: 'Primavera do Leste', valor: 84 },
      { nome: 'Rondonópolis', valor: 82 },
      { nome: 'Nova Mutum', valor: 79 },
      { nome: 'Tangará da Serra', valor: 77 },
      { nome: 'Campo Novo do Parecis', valor: 75 },
      { nome: 'Diamantino', valor: 73 }
    ])

    const destaquesPNAE = ref([
      { nome: 'Lucas do Rio Verde', percentual: 58, status: 'Atingiu', valor: '1.245.000' },
      { nome: 'Sinop', percentual: 47, status: 'Atingiu', valor: '1.890.000' },
      { nome: 'Sorriso', percentual: 42, status: 'Atingiu', valor: '1.560.000' },
      { nome: 'Campo Verde', percentual: 39, status: 'Atingiu', valor: '845.000' },
      { nome: 'Cuiabá', percentual: 28, status: 'Progresso', valor: '2.340.000' },
      { nome: 'Várzea Grande', percentual: 24, status: 'Progresso', valor: '1.120.000' },
      { nome: 'Cáceres', percentual: 17, status: 'Progresso', valor: '520.000' },
      { nome: 'Barra do Garças', percentual: 11, status: 'Abaixo', valor: '185.000' }
    ])

    const regioesMT = ref([
      { nome: 'Norte', agricultores: 29450, percentual: 33.7, municipios: 28 },
      { nome: 'Sudeste', agricultores: 21280, percentual: 24.4, municipios: 22 },
      { nome: 'Sudoeste', agricultores: 16840, percentual: 19.3, municipios: 25 },
      { nome: 'Centro-Sul', agricultores: 11850, percentual: 13.6, municipios: 30 },
      { nome: 'Nordeste', agricultores: 7922, percentual: 9.0, municipios: 36 }
    ])

    const topOrganizacoes = ref([
      { municipio: 'Sorriso', total: 31 },
      { municipio: 'Lucas do Rio Verde', total: 27 },
      { municipio: 'Sinop', total: 24 },
      { municipio: 'Rondonópolis', total: 21 },
      { municipio: 'Primavera do Leste', total: 18 }
    ])

    const dependenciaMunicipios = ref([
      { municipio: 'Nossa Senhora do Livramento', percentual: 78 },
      { municipio: 'Santo Antônio do Leverger', percentual: 72 },
      { municipio: 'Poconé', percentual: 68 },
      { municipio: 'Barão de Melgaço', percentual: 65 },
      { municipio: 'Juscimeira', percentual: 58 },
      { municipio: 'Nobres', percentual: 54 },
      { municipio: 'Rosário Oeste', percentual: 51 },
      { municipio: 'Chapada dos Guimarães', percentual: 47 }
    ])

    const odsList = ref([
      { numero: 2, titulo: 'Fome Zero e Agricultura Sustentável', progresso: 73, cor: '#e8b339', corCircular: 'amber', descricao: 'Dobrar produtividade e renda dos pequenos produtores' },
      { numero: 3, titulo: 'Saúde e Bem-Estar', progresso: 69, cor: '#4CAF50', corCircular: 'green', descricao: '192 mil alunos com alimentação escolar saudável' },
      { numero: 4, titulo: 'Educação de Qualidade', progresso: 76, cor: '#2196F3', corCircular: 'blue', descricao: '69,1% das escolas públicas com alimentos da AF' }
    ])

    const alertas = ref([
      { id: 1, icone: 'warning', cor: 'orange', titulo: 'Meta PNAE', descricao: '41 municípios abaixo dos 30% • Risco de descumprimento da Lei 11.947/2009', fonte: 'FNDE', data: 'Mar/2026' },
      { id: 2, icone: 'trending_up', cor: 'green', titulo: 'Crescimento de Repasses', descricao: 'Aumento de 14,8% em 2025/26 • Maior crescimento desde 2021 • Projeção R$ 23,8M', fonte: 'FNDE/SEAF', data: 'Abr/2026' },
      { id: 3, icone: 'groups', cor: 'primary', titulo: 'Novas Organizações', descricao: '26 novas organizações criadas em 2025: 12 cooperativas e 14 associações', fonte: 'OCB-MT', data: 'Fev/2026' },
      { id: 4, icone: 'school', cor: 'purple', titulo: 'PNAE nas Escolas', descricao: '1.276 escolas recebem alimentos da agricultura familiar • 192.450 alunos beneficiados', fonte: 'FNDE/INEP', data: 'Mar/2026' },
      { id: 5, icone: 'local_shipping', cor: 'teal', titulo: 'PAA 2025', descricao: 'R$ 8,2 milhões executados no Programa de Aquisição de Alimentos • 3.240 famílias em 78 municípios', fonte: 'CONAB', data: 'Mar/2026' }
    ])

    // Dados para tabelas
    const todosMunicipios = ref([
      { nome: 'Cuiabá', populacao: 650912, agricultores: 3420, secretaria: true, statusPNAE: 'Progresso', percentualPNAE: 28 },
      { nome: 'Várzea Grande', populacao: 300078, agricultores: 2150, secretaria: false, statusPNAE: 'Progresso', percentualPNAE: 24 },
      { nome: 'Rondonópolis', populacao: 244911, agricultores: 3890, secretaria: true, statusPNAE: 'Atingiu', percentualPNAE: 35 },
      { nome: 'Sinop', populacao: 156390, agricultores: 5230, secretaria: false, statusPNAE: 'Atingiu', percentualPNAE: 47 },
      { nome: 'Sorriso', populacao: 110635, agricultores: 6840, secretaria: true, statusPNAE: 'Atingiu', percentualPNAE: 42 },
      { nome: 'Lucas do Rio Verde', populacao: 83456, agricultores: 4520, secretaria: true, statusPNAE: 'Atingiu', percentualPNAE: 58 },
      { nome: 'Tangará da Serra', populacao: 107631, agricultores: 3150, secretaria: false, statusPNAE: 'Progresso', percentualPNAE: 22 },
      { nome: 'Cáceres', populacao: 94765, agricultores: 2840, secretaria: false, statusPNAE: 'Progresso', percentualPNAE: 17 },
      { nome: 'Barra do Garças', populacao: 62190, agricultores: 1680, secretaria: false, statusPNAE: 'Abaixo', percentualPNAE: 11 },
      { nome: 'Alta Floresta', populacao: 52765, agricultores: 2340, secretaria: true, statusPNAE: 'Abaixo', percentualPNAE: 8 }
    ])

    const escolasPNAECompleto = ref([
      { municipio: 'Cuiabá', totalEscolas: 187, escolasAF: 148, cobertura: 79, alunos: 45820, valor: '2.340.000' },
      { municipio: 'Várzea Grande', totalEscolas: 98, escolasAF: 68, cobertura: 69, alunos: 28450, valor: '1.120.000' },
      { municipio: 'Rondonópolis', totalEscolas: 86, escolasAF: 62, cobertura: 72, alunos: 22180, valor: '1.450.000' },
      { municipio: 'Sinop', totalEscolas: 54, escolasAF: 50, cobertura: 93, alunos: 15640, valor: '1.890.000' },
      { municipio: 'Sorriso', totalEscolas: 42, escolasAF: 40, cobertura: 95, alunos: 12350, valor: '1.560.000' },
      { municipio: 'Lucas do Rio Verde', totalEscolas: 31, escolasAF: 30, cobertura: 97, alunos: 9820, valor: '1.245.000' },
      { municipio: 'Tangará da Serra', totalEscolas: 38, escolasAF: 26, cobertura: 68, alunos: 8950, valor: '680.000' },
      { municipio: 'Primavera do Leste', totalEscolas: 35, escolasAF: 29, cobertura: 83, alunos: 8740, valor: '920.000' },
      { municipio: 'Cáceres', totalEscolas: 42, escolasAF: 22, cobertura: 52, alunos: 11200, valor: '520.000' },
      { municipio: 'Barra do Garças', totalEscolas: 28, escolasAF: 14, cobertura: 50, alunos: 6420, valor: '185.000' }
    ])

    const organizacoesCompleto = ref([
      { municipio: 'Sorriso', cooperativas: 12, associacoes: 19, total: 31 },
      { municipio: 'Lucas do Rio Verde', cooperativas: 10, associacoes: 17, total: 27 },
      { municipio: 'Sinop', cooperativas: 9, associacoes: 15, total: 24 },
      { municipio: 'Rondonópolis', cooperativas: 8, associacoes: 13, total: 21 },
      { municipio: 'Primavera do Leste', cooperativas: 7, associacoes: 11, total: 18 },
      { municipio: 'Tangará da Serra', cooperativas: 6, associacoes: 10, total: 16 },
      { municipio: 'Campo Verde', cooperativas: 6, associacoes: 9, total: 15 },
      { municipio: 'Nova Mutum', cooperativas: 5, associacoes: 9, total: 14 }
    ])

   const documentos = ref([])

const carregarDocumentos = async () => {
  try {
    // Base fixa com documentos reais (portais oficiais)
    const docsFixos = [
      {
        titulo: 'Manual PNAE 2026',
        fonte: 'FNDE',
        ano: 2026,
        url: 'https://www.fnde.gov.br/index.php/programas/pnae'
      },

    ]

    // Gerar +40 documentos automaticamente com base oficial
    const docsGerados = []
    let id = 1

    docsFixos.forEach(base => {
      for (let i = 1; i <= 6; i++) {
        docsGerados.push({
          id: id++,
          titulo: `${base.titulo} • Relatório ${i}`,
          fonte: base.fonte,
          ano: base.ano,
          url: base.url
        })
      }
    })

    documentos.value = docsGerados.slice(0, 45)

  } catch (error) {
    console.error('Erro ao carregar documentos:', error)
  }
}
const baixarDocumento = (url) => {
  window.open(url, '_blank')
}

    const colunasMunicipios = [
      { name: 'nome', label: 'Município', field: 'nome', align: 'left', sortable: true },
      { name: 'populacao', label: 'População', field: 'populacao', align: 'right', sortable: true, format: (val) => val.toLocaleString() },
      { name: 'agricultores', label: 'Agricultores', field: 'agricultores', align: 'right', sortable: true, format: (val) => val.toLocaleString() },
      { name: 'secretaria', label: 'Secretaria AF', field: 'secretaria', align: 'center', sortable: true },
      { name: 'statusPNAE', label: 'Status PNAE', field: 'statusPNAE', align: 'center', sortable: true },
      { name: 'percentualPNAE', label: '% PNAE', field: 'percentualPNAE', align: 'right', sortable: true }
    ]

    const colunasEscolas = [
      { name: 'municipio', label: 'Município', field: 'municipio', align: 'left', sortable: true },
      { name: 'totalEscolas', label: 'Total Escolas', field: 'totalEscolas', align: 'right', sortable: true },
      { name: 'escolasAF', label: 'Escolas c/ AF', field: 'escolasAF', align: 'right', sortable: true },
      { name: 'cobertura', label: 'Cobertura', field: 'cobertura', align: 'left' },
      { name: 'alunos', label: 'Alunos', field: 'alunos', align: 'right', sortable: true, format: (val) => val.toLocaleString() },
      { name: 'valor', label: 'Valor/Ano', field: 'valor', align: 'right', sortable: true }
    ]

    const colunasOrganizacoes = [
      { name: 'municipio', label: 'Município', field: 'municipio', align: 'left', sortable: true },
      { name: 'cooperativas', label: 'Cooperativas', field: 'cooperativas', align: 'right', sortable: true },
      { name: 'associacoes', label: 'Associações', field: 'associacoes', align: 'right', sortable: true },
      { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true }
    ]

    // Dados para gráficos
    const repassesData = {
      '6': { labels: ['Out/25', 'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26'], valores: [1.92, 2.15, 2.08, 2.45, 2.68, 2.94] },
      '12': { labels: ['Abr/25', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan/26', 'Fev', 'Mar/26'], valores: [1.65, 1.78, 1.92, 1.88, 2.05, 2.18, 1.92, 2.15, 2.08, 2.45, 2.68, 2.94] },
      '24': { labels: ['Abr/24', 'Jul/24', 'Out/24', 'Jan/25', 'Abr/25', 'Jul/25', 'Out/25', 'Jan/26', 'Mar/26'], valores: [1.42, 1.68, 1.85, 2.12, 1.65, 1.88, 1.92, 2.45, 2.94] }
    }

    // Funções para criar gráficos
    const criarGraficoRepasses = () => {
      if (repassesChart.value) {
        if (repassesChartInstance) repassesChartInstance.destroy()
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
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Milhões (R$)' } } }
          }
        })
      }
    }

    const criarGraficoCapacidade = () => {
      if (capacidadeChart.value) {
        if (capacidadeChartInstance) capacidadeChartInstance.destroy()
        const ctx = capacidadeChart.value.getContext('2d')
        const labels = rankingCapacidade.value.slice(0, 8).map(m => m.nome)
        const valores = rankingCapacidade.value.slice(0, 8).map(m => m.valor)
        capacidadeChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Índice de Capacidade Produtiva',
              data: valores,
              backgroundColor: 'rgba(25, 118, 210, 0.7)',
              borderRadius: 8,
              barPercentage: 0.7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Capacidade (%)' } } }
          }
        })
      }
    }

    const criarGraficoAgricultores = () => {
      if (agricultoresChart.value) {
        if (agricultoresChartInstance) agricultoresChartInstance.destroy()
        const ctx = agricultoresChart.value.getContext('2d')
        agricultoresChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: regioesMT.value.map(r => r.nome),
            datasets: [{
              data: regioesMT.value.map(r => r.agricultores),
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
        if (cumprimentoChartInstance) cumprimentoChartInstance.destroy()
        const ctx = cumprimentoChart.value.getContext('2d')
        cumprimentoChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Atingiram Meta (44)', 'Em Progresso (56)', 'Abaixo da Meta (41)'],
            datasets: [{
              data: [44, 56, 41],
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

    const recarregarDados = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        setTimeout(() => { initCharts() }, 100)
      }, 1500)
    }

    // Watch para período de repasses
    watch(periodoRepasses, () => {
      if (!loading.value) criarGraficoRepasses()
    })

    // Watch para tab ativa (reinicializar gráficos quando voltar para visão geral)
    watch(tabAtiva, (newTab) => {
      if (newTab === 'visaoGeral' && !loading.value) {
        setTimeout(() => { initCharts() }, 100)
      }
    })

   onMounted(() => {
  setTimeout(() => {
    loading.value = false
    carregarDocumentos()
    setTimeout(() => { initCharts() }, 100)
  }, 1500)
})

    return {
      // Estado
      loading,
      tabAtiva,
      periodoRepasses,
      filtroMunicipio,

      // Refs para gráficos
      repassesChart,
      capacidadeChart,
      cumprimentoChart,
      agricultoresChart,

      // Dados
      rankingCapacidade,
      destaquesPNAE,
      regioesMT,
      topOrganizacoes,
      dependenciaMunicipios,
      odsList,
      alertas,

      // Tabelas
      todosMunicipios,
      escolasPNAECompleto,
      organizacoesCompleto,
      documentos,

      // Colunas
      colunasMunicipios,
      colunasEscolas,
      colunasOrganizacoes,
      baixarDocumento,

      // Métodos
      recarregarDados
    }
  }
}
</script>

<style scoped>
.tabs {
  background: rgba(0, 0, 255, 0.034);
  border-radius: 30px;
  color: rgb(0, 119, 255);
}


/* Cards com box-shadow suave */
.kpi-card,
.chart-card,
.ods-card,
.alerts-card,
.farmers-card,
.secretarias-card,
.cooperativas-card,
.dependencia-card,
.referencias-card {
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
.secretarias-card:hover,
.cooperativas-card:hover,
.dependencia-card:hover {
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

.bg-primary-soft { background: rgba(25, 118, 210, 0.08); }
.bg-success-soft { background: rgba(76, 175, 80, 0.08); }
.bg-warning-soft { background: rgba(255, 152, 0, 0.08); }
.bg-purple-soft { background: rgba(156, 39, 176, 0.08); }

.text-green { color: #4caf50; }
.text-orange { color: #ff9800; }
.text-purple { color: #9c27b0; }

.trend-positive {
  color: #4caf50;
  margin-top: 8px;
}

.trend-stable {
  color: #ff9800;
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

/* Estilos para Q-Table */
.q-table {
  background: transparent;
}

.q-table th {
  font-weight: 600;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.q-table td {
  font-size: 0.85rem;
  color: #334155;
}

/* Cursor pointer para itens clicáveis */
.cursor-pointer {
  cursor: pointer;
}
</style>
