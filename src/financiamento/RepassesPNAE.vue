<template>
    <q-layout view="hHh lpR fFf">
    <q-page-container>

  <q-page class="pnae-page bg-grey-1">



    <!-- INDICADORES MINIMALISTAS -->
    <div class="q-pa-lg q-pt-none">
        <q-toolbar-title class="text-weight-medium">
          <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
          Repasses e Auxílios PNAE
        </q-toolbar-title>
            <p class="text-grey-6 q-mb-xl" style="max-width: 600px">
              Acompanhamento dos dos repasses de verbas de agricultura familiar aos municípios.
            </p>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-6 col-md-3" v-for="(stat, idx) in mainStats" :key="idx">
          <div class="stat-mini bg-white q-pa-md rounded-borders">
            <div class="row items-center">
              <div class="col-8">
                <div class="text-caption text-grey-6">{{ stat.label }}</div>
                <div class="text-h4 text-weight-bold q-mt-sm q-mb-xs">{{ stat.value }}</div>
              </div>
              <div class="col-4 text-right">
                <q-icon :name="stat.icon" size="48px" color="blue-8" />
              </div>
            </div>
            <div class="text-caption text-grey-6 q-mt-sm">{{ stat.subtext }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABS SIMPLIFICADAS -->
    <div class="q-px-lg q-mb-md">
      <q-tabs
        v-model="activeTab"

        class="tabs"
        active-color="primary"
        indicator-color="primary"
        align="center"
      >
        <q-tab name="visao-geral" icon="dashboard" label="Visão Geral" />
        <q-tab name="municipios" icon="location_city" label="Verbas por Município" />
        <q-tab name="escolas" icon="school" label="Escolas" />
        <q-tab name="fiscalizacao" icon="verified" label="Secretarias e Fiscalização" />
      </q-tabs>
    </div>

    <!-- CONTEÚDO DAS TABS -->
    <q-tab-panels v-model="activeTab" animated class="q-px-lg q-pb-xl bg-transparent">

      <!-- TAB 1: VISÃO GERAL -->
      <q-tab-panel name="visao-geral" class="q-pa-none">
        <div class="row q-col-gutter-md">
          <!-- GRÁFICO PRINCIPAL COMPACTO -->
          <div class="col-12 col-md-7">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Evolução dos Repasses PNAE - MT</div>
              <div class="text-caption text-grey-6 q-mb-md">Valores em milhões (2020-2026)</div>
              <canvas ref="pnaeChart" height="160"></canvas>
            </div>
          </div>

          <!-- DISTRIBUIÇÃO COMPACTA -->
          <div class="col-12 col-md-5">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">Origem dos Alimentos</div>
              <canvas ref="modalidadeChart" height="140"></canvas>
              <div class="row q-mt-sm text-center">
                <div class="col-6">
                  <div class="text-h6 text-weight-light text-green">47,3%</div>
                  <div class="text-caption text-grey-6">Agricultura Familiar</div>
                </div>
                <div class="col-6">
                  <div class="text-h6 text-weight-light text-blue">52,7%</div>
                  <div class="text-caption text-grey-6">Outros</div>
                </div>
              </div>
            </div>
          </div>

          <!-- LEI 11.947/2009 -->
          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="row items-center q-mb-sm">
                <q-icon name="gavel" size="20px" color="primary" class="q-mr-sm" />
                <span class="text-subtitle2 text-grey-8">Lei 11.947/2009 - Artigo 14</span>
              </div>
              <p class="text-body2 text-grey-7 q-mb-sm">
                No mínimo <strong>30%</strong> dos recursos do PNAE devem ser destinados à compra direta de produtos da agricultura familiar.
              </p>
              <q-linear-progress :value="0.473" color="green" class="q-mb-xs" style="height: 6px;" />
              <div class="text-caption text-grey-6">Média MT: 47,3% • Meta: 50%</div>
            </div>
          </div>

          <!-- CALENDÁRIO SIMPLIFICADO -->
          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="row items-center q-mb-sm">
                <q-icon name="event" size="20px" color="primary" class="q-mr-sm" />
                <span class="text-subtitle2 text-grey-8">Calendário 2026</span>
              </div>
              <div class="row q-col-gutter-xs">
                <div class="col-4" v-for="parcela in calendarioRepasses.slice(0, 6)" :key="parcela.numero">
                  <div class="text-caption text-grey-7">{{ parcela.mes }}</div>
                  <div class="text-body2">{{ formatMoney(parcela.valor / 1000000) }}M</div>
                  <q-badge :color="parcela.status === 'Pago' ? 'green' : 'grey-5'" text-color="white" size="xs">
                    {{ parcela.status }}
                  </q-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- TOP MUNICÍPIOS -->
          <div class="col-12">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-subtitle2 text-grey-8 q-mb-md">Municípios com Maior Execução</div>
              <div class="row q-col-gutter-md">
                <div class="col-6 col-md-4" v-for="(mun, idx) in topMunicipios.slice(0, 6)" :key="idx">
                  <div class="row items-center">
                    <div class="col-2 text-grey-5">{{ idx + 1 }}</div>
                    <div class="col-7 text-body2">{{ mun.nome }}</div>
                    <div class="col-3 text-right">
                      <q-badge :color="getMunicipioColor(mun.percentual)" text-color="white">
                        {{ mun.percentual }}%
                      </q-badge>
                    </div>
                  </div>
                  <q-linear-progress :value="mun.percentual / 100" :color="getMunicipioColor(mun.percentual)" class="q-mt-xs" style="height: 3px;" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- TAB 2: VERBAS POR MUNICÍPIO (FOCO PRINCIPAL) -->
      <q-tab-panel name="municipios" class="q-pa-none">
        <div class="bg-white q-pa-md rounded-borders">
          <!-- FILTROS -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input v-model="filtroMunicipio.nome" outlined dense placeholder="Buscar município..." debounce="300" bg-color="white">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select v-model="filtroMunicipio.cumprimento" :options="['Todos', 'Cumpre 30%', 'Não cumpre 30%']" outlined dense bg-color="white" />
            </div>
            <div class="col-12 col-md-3">
              <q-select v-model="filtroMunicipio.secretaria" :options="['Todos', 'Com Secretaria', 'Sem Secretaria']" outlined dense bg-color="white" />
            </div>
            <div class="col-12 col-md-2">
              <q-btn color="primary" icon="refresh" flat label="Limpar" @click="limparFiltrosMunicipio" />
            </div>
          </div>

          <!-- DESTAQUES -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-caption text-grey-6">Maior Repasse</div>
                <div class="text-h6 text-primary">{{ municipioMaiorRepasse }}</div>
                <div class="text-caption text-grey-6">{{ formatMoney(maiorRepasseValor) }}</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-caption text-grey-6">Maior % AF</div>
                <div class="text-h6 text-green">{{ municipioMaiorAF }}</div>
                <div class="text-caption text-grey-6">{{ maiorAFValor }}%</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-caption text-grey-6">Cumprem 30%</div>
                <div class="text-h6 text-primary">{{ municipiosCumprem30 }}</div>
                <div class="text-caption text-grey-6">de 142 municípios</div>
              </div>
            </div>
          </div>

          <!-- TABELA DE MUNICÍPIOS -->
          <q-table
            :rows="municipiosFiltrados"
            :columns="colunasMunicipios"
            row-key="id"
            :pagination="{ rowsPerPage: 20 }"
            flat
            class="municipios-table"
          >
            <template v-slot:body-cell-secretaria_agricola="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-icon
                    :name="props.value ? 'check_circle' : 'cancel'"
                    :color="props.value ? 'green' : 'grey-5'"
                    size="18px"
                    class="q-mr-xs"
                  />
                  <span class="text-caption">{{ props.value ? 'Possui' : 'Não possui' }}</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-cumprimento_30="props">
              <q-td :props="props">
                <q-badge :color="props.value ? 'green' : 'orange'" text-color="white" size="sm">
                  {{ props.value ? 'Cumpre' : 'Não cumpre' }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-percentual_af="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-linear-progress
                    :value="props.value / 100"
                    :color="props.value >= 30 ? 'green' : 'orange'"
                    class="q-mr-sm"
                    style="width: 60px; height: 4px;"
                  />
                  <span class="text-caption">{{ props.value }}%</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-repasse_total="props">
              <q-td :props="props">
                <span class="text-body2">{{ formatMoney(props.value) }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-detalhes="props">
              <q-td :props="props">
                <q-btn flat round dense color="primary" icon="info" size="sm" @click="verDetalhesMunicipio(props.row)" />
              </q-td>
            </template>
          </q-table>

          <!-- NOTAS -->
          <div class="text-caption text-grey-6 q-mt-md">
            * Dados baseados nos repasses do FNDE para o exercício 2026. Valores podem ser atualizados.
          </div>
        </div>
      </q-tab-panel>

      <!-- TAB 3: ESCOLAS -->
      <q-tab-panel name="escolas" class="q-pa-none">
        <div class="bg-white q-pa-md rounded-borders">
          <!-- FILTROS -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-select v-model="filtrosEscola.municipio" :options="municipiosMT" label="Município" outlined dense clearable bg-color="white" />
            </div>
            <div class="col-12 col-md-3">
              <q-select v-model="filtrosEscola.rede" :options="['Todas', 'Municipal', 'Estadual', 'Federal']" label="Rede" outlined dense bg-color="white" />
            </div>
            <div class="col-12 col-md-3">
              <q-select v-model="filtrosEscola.localizacao" :options="['Todas', 'Urbana', 'Rural', 'Indígena', 'Quilombola']" label="Localização" outlined dense bg-color="white" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="filtrosEscola.nome" outlined dense placeholder="Nome da escola" debounce="300" bg-color="white" />
            </div>
          </div>

          <!-- ESTATÍSTICAS -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-3">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-h6 text-weight-light">{{ escolasMT.length }}</div>
                <div class="text-caption text-grey-6">Escolas</div>
              </div>
            </div>
            <div class="col-3">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-h6 text-weight-light">{{ totalAlunos }}</div>
                <div class="text-caption text-grey-6">Alunos</div>
              </div>
            </div>
            <div class="col-3">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-h6 text-weight-light">{{ escolasUrbanas }}</div>
                <div class="text-caption text-grey-6">Urbanas</div>
              </div>
            </div>
            <div class="col-3">
              <div class="bg-grey-1 q-pa-sm rounded-borders text-center">
                <div class="text-h6 text-weight-light">{{ escolasRurais }}</div>
                <div class="text-caption text-grey-6">Rurais</div>
              </div>
            </div>
          </div>

          <!-- TABELA DE ESCOLAS -->
          <q-table
            :rows="escolasFiltradas"
            :columns="colunasEscolas"
            row-key="id"
            :pagination="{ rowsPerPage: 15 }"
            flat
          >
            <template v-slot:body-cell-agricultura_familiar="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-linear-progress
                    :value="props.value / 100"
                    :color="props.value >= 30 ? 'green' : 'orange'"
                    class="q-mr-sm"
                    style="width: 50px; height: 4px;"
                  />
                  <span class="text-caption">{{ props.value }}%</span>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-detalhes="props">
              <q-td :props="props">
                <q-btn flat round dense color="primary" icon="visibility" size="sm" @click="verDetalhesEscola(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <!-- TAB 4: FISCALIZAÇÃO E SECRETARIAS -->
      <q-tab-panel name="fiscalizacao" class="q-pa-none">
        <div class="row q-col-gutter-md">
          <!-- SECRETARIAS MUNICIPAIS -->
          <div class="col-12">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-subtitle1 text-grey-8 q-mb-md">
                <q-icon name="agriculture" size="20px" color="green" class="q-mr-sm" />
                Secretarias Municipais de Agricultura
              </div>

              <!-- ESTATÍSTICAS -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-4">
                  <div class="bg-green-1 q-pa-md rounded-borders text-center">
                    <div class="text-h4 text-green text-weight-light">{{ secretariasCount.com }}</div>
                    <div class="text-caption">Com Secretaria Específica</div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="bg-orange-1 q-pa-md rounded-borders text-center">
                    <div class="text-h4 text-orange text-weight-light">{{ secretariasCount.sem }}</div>
                    <div class="text-caption">Sem Secretaria Específica</div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="bg-blue-1 q-pa-md rounded-borders">
                    <div class="text-caption text-grey-7">Cumprimento dos 30%:</div>
                    <div class="row q-mt-sm">
                      <div class="col-6 text-center">
                        <div class="text-h6 text-green">{{ secretariasCount.cumpreCom }}%</div>
                        <div class="text-caption">Com secretaria</div>
                      </div>
                      <div class="col-6 text-center">
                        <div class="text-h6 text-orange">{{ secretariasCount.cumpreSem }}%</div>
                        <div class="text-caption">Sem secretaria</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TABELA -->
              <q-markup-table dense flat class="q-mt-md">
                <thead>
                  <tr>
                    <th>Município</th>
                    <th>Secretaria Específica</th>
                    <th>Nome da Pasta</th>
                    <th>Responsável</th>
                    <th>Cumpre 30%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(mun, idx) in secretariasAgricultura" :key="idx">
                    <td>{{ mun.municipio }}</td>
                    <td>
                      <q-icon :name="mun.possui ? 'check_circle' : 'cancel'" :color="mun.possui ? 'green' : 'grey-5'" size="16px" />
                      {{ mun.possui ? 'Sim' : 'Não' }}
                    </td>
                    <td>{{ mun.nome_secretaria || '—' }}</td>
                    <td>{{ mun.responsavel || '—' }}</td>
                    <td>
                      <q-badge :color="mun.cumpre_30 ? 'green' : 'orange'" text-color="white" size="sm">
                        {{ mun.cumpre_30 ? 'Sim' : 'Não' }}
                      </q-badge>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>

          <!-- CAE -->
          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-subtitle1 text-grey-8 q-mb-md">
                <q-icon name="groups" size="20px" color="primary" class="q-mr-sm" />
                Conselhos de Alimentação Escolar (CAE)
              </div>
              <div class="row q-mb-md">
                <div class="col-6 text-center">
                  <div class="text-h4 text-weight-bold text-green q-mt-sm q-mb-xs">134</div>
                  <div class="text-caption">Ativos</div>
                </div>
                <div class="col-6 text-center">
                  <div class="text-h4 text-weight-bold  text-orange q-mt-sm q-mb-xs">8</div>
                  <div class="text-caption">Pendentes</div>
                </div>
              </div>
              <div class="text-caption text-grey-6 q-mb-sm">Municípios com pendência:</div>
              <q-chip v-for="mun in caesPendentes" :key="mun" color="orange-1" text-color="orange-9" size="sm" class="q-ma-xs">
                {{ mun }}
              </q-chip>
            </div>
          </div>

          <!-- ICMS ECOLÓGICO -->
          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-h8 text-weight-bold q-mt-sm q-mb-xs">
                <q-icon name="eco" size="20px" color="green" class="q-mr-sm" />
                ICMS Ecológico e Agricultura Familiar
              </div>
              <p class="text-body2 text-grey-7">
                Lei Complementar nº 73/2000 institui o ICMS Ecológico em MT.
                Municípios que comprovam aquisições da agricultura familiar recebem adicional.
              </p>
              <div class="bg-green-1 q-pa-sm rounded-borders text-center q-mt-md">
                <div class="text-h4 text-weight-bold q-mt-sm q-mb-xs">87</div>
                <div class="text-caption">Municípios recebem ICMS Ecológico-AF</div>
                <div class="text-body2 text-green q-mt-sm">Repasse adicional: R$ 34,5 milhões</div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>

    </q-tab-panels>

    <!-- MODAL DE DETALHES DO MUNICÍPIO -->
    <q-dialog v-model="modalMunicipio">
      <q-card style="min-width: 700px;">
        <q-card-section class="bg-white">
          <div class="text-h6 text-weight-light">{{ municipioSelecionado?.nome }} - MT</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Código IBGE</q-item-label>
                    <q-item-label>{{ municipioSelecionado?.codigo_ibge }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>População</q-item-label>
                    <q-item-label>{{ municipioSelecionado?.populacao?.toLocaleString() }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Secretaria de Agricultura</q-item-label>
                    <q-item-label>
                      <q-icon :name="municipioSelecionado?.secretaria_agricola ? 'check_circle' : 'cancel'" :color="municipioSelecionado?.secretaria_agricola ? 'green' : 'grey-5'" size="16px" />
                      {{ municipioSelecionado?.secretaria_agricola ? 'Possui' : 'Não possui' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Repasse PNAE 2026</q-item-label>
                    <q-item-label>{{ formatMoney(municipioSelecionado?.repasse_total) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Agricultura Familiar</q-item-label>
                    <q-item-label>{{ municipioSelecionado?.percentual_af }}%</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Cumpre 30%</q-item-label>
                    <q-item-label>
                      <q-badge :color="municipioSelecionado?.cumprimento_30 ? 'green' : 'orange'">
                        {{ municipioSelecionado?.cumprimento_30 ? 'Sim' : 'Não' }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="text-subtitle2 q-mb-sm">Escolas no Município</div>
          <q-markup-table dense flat>
            <thead>
              <tr>
                <th>Escola</th>
                <th>Alunos</th>
                <th>% AF</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(esc, idx) in escolasDoMunicipio.slice(0, 5)" :key="idx">
                <td>{{ esc.nome }}</td>
                <td>{{ esc.alunos }}</td>
                <td>{{ esc.agricultura_familiar }}%</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL DE DETALHES DA ESCOLA -->
    <q-dialog v-model="modalEscola">
      <q-card style="min-width: 600px;">
        <q-card-section class="bg-white">
          <div class="text-h6 text-weight-light">{{ escolaSelecionada?.nome }}</div>
          <div class="text-subtitle2 text-grey-6">{{ escolaSelecionada?.municipio }} - MT</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Código INEP</q-item-label>
                    <q-item-label>{{ escolaSelecionada?.codigo_inep }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Rede</q-item-label>
                    <q-item-label>{{ escolaSelecionada?.rede }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Localização</q-item-label>
                    <q-item-label>{{ escolaSelecionada?.localizacao }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Alunos</q-item-label>
                    <q-item-label>{{ escolaSelecionada?.alunos }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Repasse Mensal</q-item-label>
                    <q-item-label>{{ formatMoney(escolaSelecionada?.repasse_mensal) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>% AF</q-item-label>
                    <q-item-label>{{ escolaSelecionada?.agricultura_familiar }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
  </q-page-container>
    </q-layout>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'PnaePage',

  data () {
    return {
      activeTab: 'visao-geral',
      modalEscola: false,
      modalMunicipio: false,
      escolaSelecionada: null,
      municipioSelecionado: null,

      filtrosEscola: {
        municipio: null,
        rede: 'Todas',
        localizacao: 'Todas',
        nome: ''
      },

      filtroMunicipio: {
        nome: '',
        cumprimento: 'Todos',
        secretaria: 'Todos'
      },

      mainStats: [
        { label: 'Municípios', value: '142', icon: 'location_city', subtext: '100% de MT' },
        { label: 'Escolas', value: '2.141', icon: 'school', subtext: '987 mil alunos' },
        { label: 'Agricultores', value: '4.832', icon: 'agriculture', subtext: 'Fornecedores ativos' },
        { label: 'Cumprem 30%', value: '89', icon: 'checklist', subtext: '62,7% dos municípios' }
      ],

      calendarioRepasses: [
        { numero: 1, mes: 'Fev', data: '20/02', valor: 8734256.79, status: 'Pago' },
        { numero: 2, mes: 'Mar', data: '20/03', valor: 8734256.79, status: 'Pago' },
        { numero: 3, mes: 'Abr', data: '20/04', valor: 8734256.79, status: 'Pago' },
        { numero: 4, mes: 'Mai', data: '20/05', valor: 8734256.79, status: 'Pendente' },
        { numero: 5, mes: 'Jun', data: '20/06', valor: 8734256.79, status: 'Pendente' },
        { numero: 6, mes: 'Jul', data: '20/07', valor: 8734256.79, status: 'Pendente' }
      ],

      topMunicipios: [
        { nome: 'Sorriso', percentual: 78.5 },
        { nome: 'Lucas do Rio Verde', percentual: 72.3 },
        { nome: 'Nova Mutum', percentual: 68.7 },
        { nome: 'Primavera do Leste', percentual: 65.2 },
        { nome: 'Campo Verde', percentual: 63.8 },
        { nome: 'Sinop', percentual: 61.4 }
      ],

      colunasMunicipios: [
        { name: 'nome', label: 'Município', field: 'nome', align: 'left', sortable: true },
        { name: 'populacao', label: 'População', field: 'populacao', align: 'right', sortable: true },
        { name: 'secretaria_agricola', label: 'Secretaria Agrícola', field: 'secretaria_agricola', align: 'center' },
        { name: 'repasse_total', label: 'Repasse 2026', field: 'repasse_total', align: 'right', sortable: true },
        { name: 'percentual_af', label: '% AF', field: 'percentual_af', align: 'center', sortable: true },
        { name: 'cumprimento_30', label: 'Status 30%', field: 'cumprimento_30', align: 'center', sortable: true },
        { name: 'detalhes', label: '', field: 'detalhes', align: 'center' }
      ],

      colunasEscolas: [
        { name: 'nome', label: 'Escola', field: 'nome', align: 'left', sortable: true },
        { name: 'municipio', label: 'Município', field: 'municipio', align: 'left', sortable: true },
        { name: 'rede', label: 'Rede', field: 'rede', align: 'left' },
        { name: 'localizacao', label: 'Localização', field: 'localizacao', align: 'left' },
        { name: 'alunos', label: 'Alunos', field: 'alunos', align: 'right' },
        { name: 'agricultura_familiar', label: '% AF', field: 'agricultura_familiar', align: 'center' },
        { name: 'detalhes', label: '', field: 'detalhes', align: 'center' }
      ],

      municipiosMT: [
        'Acorizal', 'Água Boa', 'Alta Floresta', 'Alto Araguaia', 'Alto Boa Vista',
        'Alto Garças', 'Alto Paraguai', 'Alto Taquari', 'Apiacás', 'Araguaiana',
        'Araguainha', 'Araputanga', 'Arenápolis', 'Aripuanã', 'Barão de Melgaço',
        'Barra do Bugres', 'Barra do Garças', 'Bom Jesus do Araguaia', 'Brasnorte',
        'Cáceres', 'Campinápolis', 'Campo Novo do Parecis', 'Campo Verde', 'Campos de Júlio',
        'Canabrava do Norte', 'Canarana', 'Carlinda', 'Castanheira', 'Chapada dos Guimarães',
        'Cláudia', 'Cocalinho', 'Colíder', 'Colniza', 'Comodoro', 'Confresa', 'Conquista D\'Oeste',
        'Cotriguaçu', 'Cuiabá', 'Curvelândia', 'Denise', 'Diamantino', 'Dom Aquino',
        'Feliz Natal', 'Figueirópolis D\'Oeste', 'Gaúcha do Norte', 'General Carneiro',
        'Glória D\'Oeste', 'Guarantã do Norte', 'Guiratinga', 'Indiavaí', 'Ipiranga do Norte',
        'Itanhangá', 'Itaúba', 'Itiquira', 'Jaciara', 'Jangada', 'Jauru', 'Juara', 'Juína',
        'Juruena', 'Juscimeira', 'Lambari D\'Oeste', 'Lucas do Rio Verde', 'Luciara',
        'Marcelândia', 'Matupá', 'Mirassol D\'Oeste', 'Nobres', 'Nortelândia', 'Nossa Senhora do Livramento',
        'Nova Bandeirantes', 'Nova Brasilândia', 'Nova Canaã do Norte', 'Nova Guarita',
        'Nova Lacerda', 'Nova Marilândia', 'Nova Maringá', 'Nova Monte Verde', 'Nova Mutum',
        'Nova Nazaré', 'Nova Olímpia', 'Nova Santa Helena', 'Nova Ubiratã', 'Nova Xavantina',
        'Novo Horizonte do Norte', 'Novo Mundo', 'Novo Santo Antônio', 'Novo São Joaquim',
        'Paranaíta', 'Paranatinga', 'Pedra Preta', 'Peixoto de Azevedo', 'Planalto da Serra',
        'Poconé', 'Pontal do Araguaia', 'Ponte Branca', 'Pontes e Lacerda', 'Porto Alegre do Norte',
        'Porto dos Gaúchos', 'Porto Esperidião', 'Porto Estrela', 'Poxoréu', 'Primavera do Leste',
        'Querência', 'Reserva do Cabaçal', 'Ribeirão Cascalheira', 'Ribeirãozinho', 'Rio Branco',
        'Rondolândia', 'Rondonópolis', 'Rosário Oeste', 'Salto do Céu', 'Santa Carmem',
        'Santa Cruz do Xingu', 'Santa Rita do Trivelato', 'Santa Terezinha', 'Santo Afonso',
        'Santo Antônio do Leste', 'Santo Antônio do Leverger', 'São Félix do Araguaia',
        'São José do Povo', 'São José do Rio Claro', 'São José do Xingu', 'São José dos Quatro Marcos',
        'São Pedro da Cipa', 'Sapezal', 'Serra Nova Dourada', 'Sinop', 'Sorriso', 'Tabaporã',
        'Tangará da Serra', 'Tapurah', 'Terra Nova do Norte', 'Tesouro', 'Torixoréu',
        'União do Sul', 'Vale de São Domingos', 'Várzea Grande', 'Vera', 'Vila Bela da Santíssima Trindade',
        'Vila Rica'
      ],

      caesPendentes: ['Acorizal', 'Alto Paraguai', 'Barão de Melgaço', 'Curvelândia', 'Lambari D\'Oeste', 'Nova Nazaré', 'Santa Terezinha', 'União do Sul'],

      charts: {}
    }
  },

  computed: {
    todosMunicipiosMT () {
      return this.municipiosMT.map((nome, index) => {
        const secretariaInfo = this.secretariasAgricultura.find(s => s.municipio === nome)
        const possuiSecretaria = secretariaInfo?.possui || false
        const percentualAF = this.gerarPercentualAleatorio(possuiSecretaria)
        const cumpre30 = percentualAF >= 30

        return {
          id: index + 1,
          codigo_ibge: `51${String(index + 1).padStart(4, '0')}`,
          nome: nome,
          populacao: Math.floor(Math.random() * 500000) + 5000,
          secretaria_agricola: possuiSecretaria,
          repasse_total: Math.floor(Math.random() * 5000000) + 100000,
          percentual_af: percentualAF,
          cumprimento_30: cumpre30
        }
      })
    },

    municipiosFiltrados () {
      let municipios = [...this.todosMunicipiosMT]

      if (this.filtroMunicipio.nome) {
        const termo = this.filtroMunicipio.nome.toLowerCase()
        municipios = municipios.filter(m => m.nome.toLowerCase().includes(termo))
      }

      if (this.filtroMunicipio.cumprimento === 'Cumpre 30%') {
        municipios = municipios.filter(m => m.cumprimento_30)
      } else if (this.filtroMunicipio.cumprimento === 'Não cumpre 30%') {
        municipios = municipios.filter(m => !m.cumprimento_30)
      }

      if (this.filtroMunicipio.secretaria === 'Com Secretaria') {
        municipios = municipios.filter(m => m.secretaria_agricola)
      } else if (this.filtroMunicipio.secretaria === 'Sem Secretaria') {
        municipios = municipios.filter(m => !m.secretaria_agricola)
      }

      return municipios
    },

    municipioMaiorRepasse () {
      if (this.todosMunicipiosMT.length === 0) return '—'
      const maior = this.todosMunicipiosMT.reduce((a, b) => a.repasse_total > b.repasse_total ? a : b)
      return maior.nome
    },

    maiorRepasseValor () {
      if (this.todosMunicipiosMT.length === 0) return 0
      return this.todosMunicipiosMT.reduce((a, b) => a.repasse_total > b.repasse_total ? a : b).repasse_total
    },

    municipioMaiorAF () {
      if (this.todosMunicipiosMT.length === 0) return '—'
      const maior = this.todosMunicipiosMT.reduce((a, b) => a.percentual_af > b.percentual_af ? a : b)
      return maior.nome
    },

    maiorAFValor () {
      if (this.todosMunicipiosMT.length === 0) return 0
      return this.todosMunicipiosMT.reduce((a, b) => a.percentual_af > b.percentual_af ? a : b).percentual_af
    },

    municipiosCumprem30 () {
      return this.todosMunicipiosMT.filter(m => m.cumprimento_30).length
    },

    secretariasCount () {
      const com = this.secretariasAgricultura.filter(s => s.possui).length
      const sem = this.secretariasAgricultura.length - com
      const cumpreCom = Math.round((this.secretariasAgricultura.filter(s => s.possui && s.cumpre_30).length / com) * 100) || 0
      const cumpreSem = Math.round((this.secretariasAgricultura.filter(s => !s.possui && s.cumpre_30).length / sem) * 100) || 0
      return { com, sem, cumpreCom, cumpreSem }
    },

    escolasMT () {
      return [
        { id: 1, codigo_inep: '51001234', nome: 'EMEB Profª Maria de Lourdes', municipio: 'Cuiabá', rede: 'Municipal', localizacao: 'Urbana', alunos: 876, repasse_mensal: 43800.00, agricultura_familiar: 52.3 },
        { id: 2, codigo_inep: '51004567', nome: 'EE Profº João Batista', municipio: 'Várzea Grande', rede: 'Estadual', localizacao: 'Urbana', alunos: 1234, repasse_mensal: 61700.00, agricultura_familiar: 38.7 },
        { id: 3, codigo_inep: '51007890', nome: 'Escola Municipal Rural São Francisco', municipio: 'Chapada dos Guimarães', rede: 'Municipal', localizacao: 'Rural', alunos: 234, repasse_mensal: 11700.00, agricultura_familiar: 78.9 },
        { id: 4, codigo_inep: '51010123', nome: 'CEI Pequeno Aprendiz', municipio: 'Rondonópolis', rede: 'Municipal', localizacao: 'Urbana', alunos: 345, repasse_mensal: 17250.00, agricultura_familiar: 45.6 },
        { id: 5, codigo_inep: '51013456', nome: 'Escola Indígena Tadarimana', municipio: 'Rondonópolis', rede: 'Estadual', localizacao: 'Indígena', alunos: 156, repasse_mensal: 7800.00, agricultura_familiar: 92.3 },
        { id: 6, codigo_inep: '51016789', nome: 'EE Profª Ana Maria', municipio: 'Sinop', rede: 'Estadual', localizacao: 'Urbana', alunos: 1567, repasse_mensal: 78350.00, agricultura_familiar: 61.4 },
        { id: 7, codigo_inep: '51019012', nome: 'EMEB Vila Rural', municipio: 'Sorriso', rede: 'Municipal', localizacao: 'Rural', alunos: 198, repasse_mensal: 9900.00, agricultura_familiar: 85.2 },
        { id: 8, codigo_inep: '51022345', nome: 'Escola Quilombola Mata Cavalo', municipio: 'Nossa Senhora do Livramento', rede: 'Municipal', localizacao: 'Quilombola', alunos: 87, repasse_mensal: 4350.00, agricultura_familiar: 95.8 },
        { id: 9, codigo_inep: '51025678', nome: 'CEJA Profª Marli', municipio: 'Cáceres', rede: 'Estadual', localizacao: 'Urbana', alunos: 678, repasse_mensal: 33900.00, agricultura_familiar: 32.1 },
        { id: 10, codigo_inep: '51028901', nome: 'EMEB Rural São Benedito', municipio: 'Barra do Garças', rede: 'Municipal', localizacao: 'Rural', alunos: 145, repasse_mensal: 7250.00, agricultura_familiar: 71.4 },
        { id: 11, codigo_inep: '51031234', nome: 'Escola Agrícola de Lucas', municipio: 'Lucas do Rio Verde', rede: 'Estadual', localizacao: 'Rural', alunos: 234, repasse_mensal: 11700.00, agricultura_familiar: 88.9 },
        { id: 12, codigo_inep: '51034567', nome: 'EMEB Profº José Carlos', municipio: 'Tangará da Serra', rede: 'Municipal', localizacao: 'Urbana', alunos: 1234, repasse_mensal: 61700.00, agricultura_familiar: 56.7 },
        { id: 13, codigo_inep: '51037890', nome: 'EE 29 de Julho', municipio: 'Primavera do Leste', rede: 'Estadual', localizacao: 'Urbana', alunos: 987, repasse_mensal: 49350.00, agricultura_familiar: 65.2 },
        { id: 14, codigo_inep: '51040123', nome: 'EMEB Paulo Freire', municipio: 'Campo Verde', rede: 'Municipal', localizacao: 'Urbana', alunos: 876, repasse_mensal: 43800.00, agricultura_familiar: 63.8 },
        { id: 15, codigo_inep: '51043456', nome: 'Escola Rural Vale do Rio', municipio: 'Nova Mutum', rede: 'Municipal', localizacao: 'Rural', alunos: 123, repasse_mensal: 6150.00, agricultura_familiar: 82.7 }
      ]
    },

    escolasFiltradas () {
      let escolas = [...this.escolasMT]

      if (this.filtrosEscola.municipio) {
        escolas = escolas.filter(e => e.municipio === this.filtrosEscola.municipio)
      }
      if (this.filtrosEscola.rede && this.filtrosEscola.rede !== 'Todas') {
        escolas = escolas.filter(e => e.rede === this.filtrosEscola.rede)
      }
      if (this.filtrosEscola.localizacao && this.filtrosEscola.localizacao !== 'Todas') {
        escolas = escolas.filter(e => e.localizacao === this.filtrosEscola.localizacao)
      }
      if (this.filtrosEscola.nome) {
        const termo = this.filtrosEscola.nome.toLowerCase()
        escolas = escolas.filter(e => e.nome.toLowerCase().includes(termo))
      }

      return escolas
    },

    totalAlunos () {
      return this.escolasMT.reduce((sum, e) => sum + e.alunos, 0).toLocaleString()
    },

    escolasUrbanas () {
      return this.escolasMT.filter(e => e.localizacao === 'Urbana').length
    },

    escolasRurais () {
      return this.escolasMT.filter(e => e.localizacao === 'Rural').length
    },

    escolasDoMunicipio () {
      if (!this.municipioSelecionado) return []
      return this.escolasMT.filter(e => e.municipio === this.municipioSelecionado.nome)
    },

    secretariasAgricultura () {
      return this.municipiosMT.map(municipio => {
        const possui = Math.random() > 0.45
        const percentualAF = this.gerarPercentualAleatorio(possui)
        return {
          municipio: municipio,
          possui: possui,
          nome_secretaria: possui ? `Secretaria Municipal de Agricultura${Math.random() > 0.5 ? ' e Desenvolvimento Rural' : ''}` : null,
          responsavel: possui ? `Sr(a). ${this.gerarNomeAleatorio()}` : null,
          cumpre_30: percentualAF >= 30
        }
      })
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.renderizarGraficos()
    })
  },

  methods: {
    formatMoney (value) {
      if (!value) return 'R$ 0'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      }).format(value)
    },

    getMunicipioColor (percentual) {
      if (percentual >= 70) return 'green'
      if (percentual >= 50) return 'light-green-7'
      if (percentual >= 30) return 'orange'
      return 'red'
    },

    limparFiltrosMunicipio () {
      this.filtroMunicipio = { nome: '', cumprimento: 'Todos', secretaria: 'Todos' }
    },

    verDetalhesEscola (escola) {
      this.escolaSelecionada = escola
      this.modalEscola = true
    },

    verDetalhesMunicipio (municipio) {
      this.municipioSelecionado = municipio
      this.modalMunicipio = true
    },

    gerarNomeAleatorio () {
      const nomes = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'José Pereira']
      return nomes[Math.floor(Math.random() * nomes.length)]
    },

    gerarPercentualAleatorio (possuiSecretaria) {
      const base = possuiSecretaria ? 45 : 25
      return Math.floor(base + Math.random() * 40)
    },

    renderizarGraficos () {
      this.renderizarPnaeChart()
      this.renderizarModalidadeChart()
    },

    renderizarPnaeChart () {
      const ctx = this.$refs.pnaeChart?.getContext('2d')
      if (!ctx) return

      this.charts.pnae = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
          datasets: [{
            label: 'Repasses (milhões)',
            data: [45.2, 52.3, 61.8, 68.5, 74.2, 79.8, 87.3],
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.03)',
            tension: 0.3,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          }
        }
      })
    },

    renderizarModalidadeChart () {
      const ctx = this.$refs.modalidadeChart?.getContext('2d')
      if (!ctx) return

      this.charts.modalidade = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Agricultura Familiar', 'Outros'],
          datasets: [{
            data: [47.3, 52.7],
            backgroundColor: ['#4CAF50', '#BDBDBD'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          },
          cutout: '65%'
        }
      })
    }
  },

  beforeUnmount () {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy()
    })
  }
}
</script>

<style lang="scss" scoped>
.pnae-page {
  min-height: 100vh;
  padding: 1.4em;
}

.page-header {
  border-bottom: 1px solid #e0e0e0;
}

.stat-box {
  border: 1px solid #eeeeee;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1976D2;
  }
}

.stat-mini {
  border: 1px solid #eeeeee;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e0e0e0;
  }
}
.tabs {
  background: rgba(0, 0, 255, 0.034);
  border-radius: 30px;
  color: rgb(0, 119, 255);
}
.rounded-borders {
  border-radius: 8px;
}

.municipios-table {
  :deep(.q-table) {
    th {
      font-weight: 500;
      color: #616161;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    td {
      font-size: 14px;
    }
  }
}

.bg-white {
  background: #ffffff !important;
}

.text-weight-light {
  font-weight: 300 !important;
}

// Override Quasar styles for minimalism
:deep(.q-tab) {
  text-transform: none;
  font-weight: 400;
  font-size: 14px;
}

:deep(.q-tab--active) {
  font-weight: 500;
}

:deep(.q-tabs__indicator) {
  height: 2px;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-table__container) {
  border-radius: 8px;
}
</style>
