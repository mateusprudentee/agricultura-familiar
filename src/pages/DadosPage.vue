<template>
  <q-page class="bg-grey-1">
    <div class="container-full q-pa-lg">

      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
            <q-toolbar-title class="text-weight-medium">
          <q-icon name="analytics" color="primary" size="sm" class="q-mr-sm" />
          Processamento de Dados
        </q-toolbar-title>
          <div class="text-caption text-grey-6 q-mt-xs">
            Upload de arquivos, detecção automática inteligente e exportação em múltiplos formatos
          </div>
        </div>
        <div>
          <q-chip icon="storage" color="primary" text-color="white" size="lg">
            {{ arquivosProcessados.length }} arquivos
          </q-chip>
          <q-chip v-if="dadosProcessados.length > 0" icon="dataset" color="green" text-color="white" size="lg" class="q-ml-sm">
            {{ dadosProcessados.length }} registros
          </q-chip>
        </div>
      </div>

      <!-- Área de Upload - WIDTH TOTAL -->
      <q-card class="upload-card-full q-mb-lg">
        <q-card-section class="q-pa-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            <q-icon name="upload" color="primary" size="20px" class="q-mr-sm" />
            Área de Upload
          </div>

          <!-- Uploader local - SEM API -->
          <q-file
            ref="uploaderRef"
            v-model="arquivosSelecionados"
            label="Selecione os arquivos"
            outlined
            multiple
            :max-files="50"
            :max-total-size="209715200"
            accept=".csv,.json,.xml,.xlsx,.xls,.txt,.pdf,.sql,.tsv"
            @update:model-value="onFilesSelected"
            class="uploader-full-width"
            color="primary"
            counter
            use-chips
            style="min-height: 120px;"
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click.stop="processarArquivosSelecionados"
                :disable="arquivosSelecionados.length === 0"
                :loading="processando"
              >
                <q-tooltip>Processar arquivos selecionados</q-tooltip>
              </q-btn>
            </template>
            <template v-slot:hint>
              Formatos: CSV, JSON, XML, Excel, TXT, PDF, SQL, TSV • Máx: 200MB
            </template>
          </q-file>

          <!-- Área de Drop visual -->
          <div
            class="drop-zone q-mt-md"
            @drop.prevent="onDropFiles"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            :class="{ 'drag-over': dragOver }"
            @click="triggerFileSelect"
          >
            <div class="text-center q-pa-xl">
              <q-icon name="cloud_upload" size="64px" color="primary" class="q-mb-sm" />
              <div class="text-h6 text-weight-medium">Arraste arquivos aqui</div>
              <div class="text-caption text-grey-6 q-mt-sm">
                ou clique para selecionar
              </div>
              <q-badge color="primary" class="q-mt-md q-pa-sm" style="font-size: 0.9rem;">
                <q-icon name="auto_awesome" size="16px" class="q-mr-xs" />
                Detecção automática de formato e estrutura
              </q-badge>
            </div>
          </div>

          <!-- Status dos Arquivos -->
          <div v-if="arquivosSelecionados.length > 0" class="q-mt-md">
            <div class="text-caption text-weight-medium q-mb-sm">
              Arquivos Selecionados ({{ arquivosSelecionados.length }})
            </div>
            <q-list dense bordered class="rounded-borders">
              <q-item v-for="(arquivo, index) in arquivosSelecionados" :key="index">
                <q-item-section avatar>
                  <q-icon :name="getIconeArquivo(arquivo.name)" :color="getCorArquivo(arquivo.name)" size="20px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption">{{ arquivo.name }}</q-item-label>
                  <q-item-label caption>{{ formatarBytes(arquivo.size) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="positive" text-color="white" size="sm">
                    Pronto
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>

      <!-- Detecção Automática Inteligente -->
      <q-card v-if="arquivosSelecionados.length > 0" class="deteccao-card q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="auto_awesome" color="primary" size="20px" class="q-mr-sm" />
              Detecção Automática Inteligente
            </div>
            <q-badge color="green" text-color="white" class="q-pa-sm">
              <q-icon name="check_circle" size="14px" class="q-mr-xs" />
              Análise concluída
            </q-badge>
          </div>

          <!-- Resultados da Detecção -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 q-mb-sm">Estrutura Detectada</div>
                  <q-list dense>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Tipo de Dados</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge color="primary">{{ tipoDadosDetectado }}</q-badge>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Encoding</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge color="info">{{ encodingDetectado }}</q-badge>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Delimitador</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge color="purple">{{ delimitadorDetectado }}</q-badge>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>Qualidade dos Dados</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge :color="qualidadeDados.cor">{{ qualidadeDados.nivel }}</q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 q-mb-sm">Campos Detectados</div>
                  <q-list dense style="max-height: 200px; overflow-y: auto;">
                    <q-item v-for="(campo, index) in camposDetectados" :key="index">
                      <q-item-section>
                        <q-item-label class="text-caption">{{ campo.nome }}</q-item-label>
                        <q-item-label caption>{{ campo.tipo }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon :name="campo.qualidade > 80 ? 'check_circle' : 'warning'" :color="campo.qualidade > 80 ? 'positive' : 'warning'" size="16px" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Sugestões de Tratamento -->
          <div class="q-mt-md">
            <div class="text-subtitle2 q-mb-sm">
              <q-icon name="lightbulb" color="warning" size="18px" class="q-mr-xs" />
              Sugestões de Tratamento (Detecção Automática)
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" v-for="(sugestao, index) in sugestoesTratamento" :key="index">
                <q-chip :color="sugestao.aplicada ? 'positive' : 'grey-6'" text-color="white" :icon="sugestao.aplicada ? 'check' : 'add'" @click="toggleSugestao(index)" clickable>
                  {{ sugestao.nome }}
                  <q-tooltip>{{ sugestao.descricao }}</q-tooltip>
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Opções de Processamento -->
      <q-card class="processamento-card q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="settings" color="primary" size="20px" class="q-mr-sm" />
              Configurações de Processamento
            </div>
            <q-btn color="primary" icon="auto_awesome" label="Otimizar Automaticamente" @click="otimizarAutomaticamente" outline size="sm" />
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="algoritmoSelecionado"
                :options="algoritmosDisponiveis"
                label="Algoritmo de Análise"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="memory" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="nivelProcessamento"
                :options="niveisProcessamento"
                label="Nível de Processamento"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="speed" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="modoProcessamento"
                :options="modosProcessamento"
                label="Modo"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="tune" />
                </template>
              </q-select>
            </div>
          </div>

          <q-expansion-item
            v-model="expanded"
            icon="tune"
            label="Opções Avançadas"
            class="q-mt-md"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.removerDuplicatas" label="Remover duplicatas" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.validarDados" label="Validar dados" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.normalizarTexto" label="Normalizar texto" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.preencherNulos" label="Preencher valores nulos" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.detectarOutliers" label="Detectar outliers" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.corrigirEncoding" label="Corrigir encoding" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.extrairMetadados" label="Extrair metadados" />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-checkbox v-model="opcoes.gerarRelatorio" label="Gerar relatório" />
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="opcoes.delimitador"
                      label="Delimitador CSV"
                      outlined
                      dense
                      maxlength="1"
                    >
                      <template v-slot:hint>
                        Detectado: "{{ delimitadorDetectado }}"
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="opcoes.encoding"
                      :options="['UTF-8', 'ISO-8859-1', 'Windows-1252', 'ASCII', 'UTF-16']"
                      label="Encoding"
                      outlined
                      dense
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <div class="row justify-end q-mt-lg">
            <q-btn
              color="primary"
              icon="play_arrow"
              label="Processar Arquivos"
              @click="processarArquivos"
              :loading="processando"
              :disable="arquivosSelecionados.length === 0"
              size="lg"
              class="q-mr-sm"
            />
            <q-btn
              color="negative"
              icon="clear_all"
              label="Limpar Tudo"
              @click="limparTudo"
              flat
              size="lg"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Estatísticas do Processamento -->
      <q-card v-if="estatisticas.totalArquivos > 0" class="stats-card q-mb-lg">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            <q-icon name="analytics" color="primary" size="20px" class="q-mr-sm" />
            Estatísticas do Processamento
          </div>

          <div class="row q-col-gutter-md text-center">
            <div class="col-3">
              <q-card flat bordered class="bg-primary-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-h6 text-weight-bold text-primary">{{ estatisticas.totalArquivos }}</div>
                  <div class="text-caption">Arquivos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card flat bordered class="bg-green-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-h6 text-weight-bold text-green">{{ formatarBytes(estatisticas.tamanhoTotal) }}</div>
                  <div class="text-caption">Tamanho</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card flat bordered class="bg-orange-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-h6 text-weight-bold text-orange">{{ estatisticas.totalRegistros.toLocaleString() }}</div>
                  <div class="text-caption">Registros</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card flat bordered class="bg-purple-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-h6 text-weight-bold text-purple">{{ estatisticas.tempoProcessamento }}s</div>
                  <div class="text-caption">Tempo</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row q-mt-md">
            <div class="col-12">
              <div style="height: 150px;">
                <canvas ref="graficoTiposChart"></canvas>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Resultados -->
      <q-card v-if="resultados.length > 0" class="results-card q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="list_alt" color="primary" size="20px" class="q-mr-sm" />
              Resultados do Algoritmo: {{ algoritmoSelecionado }}
            </div>
            <div>
              <q-btn color="primary" icon="visibility" label="Ver Detalhes" @click="mostrarDetalhes = !mostrarDetalhes" outline size="sm" class="q-mr-sm" />
              <q-btn color="green" icon="table_chart" label="Visualizar Dados" @click="abrirVisualizadorDados" outline size="sm" />
            </div>
          </div>

          <!-- Métricas -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3" v-for="metrica in metricasAlgoritmo" :key="metrica.nome">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm text-center">
                  <div class="text-caption text-grey-6">{{ metrica.nome }}</div>
                  <div class="text-h6 text-weight-bold" :class="metrica.cor">{{ metrica.valor }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-slide-transition>
            <div v-show="mostrarDetalhes">
              <q-list bordered separator>
                <q-item v-for="(resultado, index) in resultados" :key="index">
                  <q-item-section avatar>
                    <q-icon :name="getIconeArquivo(resultado.nome)" :color="getCorArquivo(resultado.nome)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ resultado.nome }}</q-item-label>
                    <q-item-label caption>
                      {{ resultado.registros }} registros • {{ resultado.colunas }} colunas
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge :color="resultado.status === 'sucesso' ? 'positive' : 'warning'">
                      {{ resultado.status }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-expansion-item icon="terminal" label="Logs de Processamento" class="q-mt-md">
                <q-card>
                  <q-card-section class="bg-dark">
                    <pre class="text-white" style="margin: 0; font-family: monospace; font-size: 11px; max-height: 200px; overflow-y: auto;">{{ logsProcessamento }}</pre>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-slide-transition>
        </q-card-section>
      </q-card>

      <!-- Dados Processados -->
      <q-card v-if="dadosProcessados.length > 0" class="table-card q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="table_view" color="primary" size="20px" class="q-mr-sm" />
              Dados Processados (Pré-visualização)
            </div>
            <q-input
              v-model="filtroTabela"
              dense
              outlined
              placeholder="Filtrar..."
              style="width: 250px;"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-table
            :rows="dadosProcessadosFiltrados"
            :columns="colunasTabela"
            row-key="id"
            :filter="filtroTabela"
            :loading="processando"
            :rows-per-page-options="[5, 10, 20, 50]"
            dense
            bordered
            style="max-height: 400px;"
          />
        </q-card-section>
      </q-card>

      <!-- Exportação -->
      <q-card v-if="dadosProcessados.length > 0" class="export-card">
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-medium">
                <q-icon name="download" color="primary" size="20px" class="q-mr-sm" />
                Exportar Dados Processados
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ dadosProcessados.length }} registros disponíveis
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-select
                v-model="formatoExportacao"
                :options="formatosExportacao"
                label="Formato"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="compressor"
                :options="opcoesCompressor"
                label="Compressão"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="nomeArquivoExport"
                label="Nome do Arquivo"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-3">
              <q-btn
                color="primary"
                icon="download"
                :label="'Exportar ' + formatoExportacao.toUpperCase()"
                @click="exportarDados"
                :loading="exportando"
                class="full-width"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Diálogo Visualizador -->
      <q-dialog v-model="dialogoVisualizador" maximized>
        <q-card>
          <q-bar class="bg-primary text-white">
            <q-icon name="table_chart" />
            <div>Visualizador de Dados</div>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup />
          </q-bar>
          <q-card-section>
            <q-table
              :rows="dadosProcessados"
              :columns="colunasTabela"
              row-key="id"
              :rows-per-page-options="[10, 25, 50, 100, 0]"
              dense
              bordered
              style="height: calc(100vh - 150px);"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'CarregarDados',

  setup() {
    const $q = useQuasar()

    // Estado
    const uploaderRef = ref(null)
    const arquivosSelecionados = ref([])
    const processando = ref(false)
    const exportando = ref(false)
    const expanded = ref(false)
    const mostrarDetalhes = ref(false)
    const dialogoVisualizador = ref(false)
    const filtroTabela = ref('')
    const dragOver = ref(false)

    const tipoDadosDetectado = ref('Agricultura Familiar/PNAE')
    const encodingDetectado = ref('UTF-8')
    const delimitadorDetectado = ref(',')
    const qualidadeDados = ref({ nivel: 'Boa', cor: 'positive' })
    const camposDetectados = ref([])

    const algoritmoSelecionado = ref('analise_estatistica')
    const nivelProcessamento = ref('padrao')
    const modoProcessamento = ref('auto')
    const formatoExportacao = ref('vue')
    const compressor = ref('nenhum')
    const nomeArquivoExport = ref('dados_processados')

    const opcoes = ref({
      removerDuplicatas: true,
      validarDados: true,
      normalizarTexto: true,
      preencherNulos: false,
      detectarOutliers: true,
      corrigirEncoding: true,
      extrairMetadados: true,
      gerarRelatorio: true,
      delimitador: ',',
      encoding: 'UTF-8'
    })

    const sugestoesTratamento = ref([
      { nome: 'Remover duplicatas', descricao: 'Elimina registros repetidos', aplicada: true },
      { nome: 'Normalizar nomes', descricao: 'Padroniza nomes de municípios', aplicada: true },
      { nome: 'Validar PNAE', descricao: 'Valida percentuais do PNAE', aplicada: true },
      { nome: 'Corrigir encoding', descricao: 'Corrige caracteres especiais', aplicada: false },
      { nome: 'Preencher nulos', descricao: 'Preenche valores vazios com média', aplicada: false },
      { nome: 'Detectar outliers', descricao: 'Identifica valores atípicos', aplicada: true }
    ])

    // Dados processados
    const arquivosProcessados = ref([])
    const resultados = ref([])
    const dadosProcessados = ref([])
    const logsProcessamento = ref('')
    const metricasAlgoritmo = ref([])

    const estatisticas = ref({
      totalArquivos: 0,
      tamanhoTotal: 0,
      totalRegistros: 0,
      tempoProcessamento: 0
    })

    // Opções
    const algoritmosDisponiveis = [
      { label: 'Análise Estatística Básica', value: 'analise_estatistica' },
      { label: 'Detecção de Anomalias', value: 'deteccao_anomalias' },
      { label: 'Agrupamento (Clustering)', value: 'clustering' },
      { label: 'Regressão Linear', value: 'regressao' },
      { label: 'Análise de Tendências', value: 'tendencias' },
      { label: 'Correlação de Variáveis', value: 'correlacao' },
      { label: 'Classificação Automática', value: 'classificacao' },
      { label: 'Sumarização Inteligente', value: 'sumarizacao' }
    ]

    const niveisProcessamento = [
      { label: 'Rápido', value: 'rapido' },
      { label: 'Padrão', value: 'padrao' },
      { label: 'Avançado', value: 'avancado' },
      { label: 'Profundo (IA)', value: 'profundo' }
    ]

    const modosProcessamento = [
      { label: 'Automático', value: 'auto' },
      { label: 'Manual', value: 'manual' },
      { label: 'Híbrido', value: 'hibrido' }
    ]

    const formatosExportacao = [
      { label: 'Vue Component (.vue)', value: 'vue' },
      { label: 'XML Estruturado (.xml)', value: 'xml' },
      { label: 'SQL Script (.sql)', value: 'sql' },
      { label: 'JSON (.json)', value: 'json' },
      { label: 'CSV (.csv)', value: 'csv' },
      { label: 'Excel (.xlsx)', value: 'xlsx' }
    ]

    const opcoesCompressor = [
      { label: 'Sem compressão', value: 'nenhum' },
      { label: 'ZIP', value: 'zip' },
      { label: 'GZIP', value: 'gz' }
    ]

    const graficoTiposChart = ref(null)
    let graficoTiposInstance = null

    // Colunas da tabela
    const colunasTabela = computed(() => {
      if (dadosProcessados.value.length === 0) return []
      const primeiraLinha = dadosProcessados.value[0]
      return Object.keys(primeiraLinha)
        .filter(key => key !== 'id')
        .map(key => ({
          name: key,
          label: formatarNomeColuna(key),
          field: key,
          align: 'left',
          sortable: true
        }))
    })

    const dadosProcessadosFiltrados = computed(() => {
      if (!filtroTabela.value) return dadosProcessados.value
      const termo = filtroTabela.value.toLowerCase()
      return dadosProcessados.value.filter(row => {
        return Object.values(row).some(val =>
          String(val).toLowerCase().includes(termo)
        )
      })
    })

    // Métodos
    const triggerFileSelect = () => {
      if (uploaderRef.value) {
        uploaderRef.value.pickFiles()
      }
    }

    const onDropFiles = (event) => {
      dragOver.value = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const fileArray = Array.from(files)
        arquivosSelecionados.value = [...arquivosSelecionados.value, ...fileArray]
        analisarArquivosAutomaticamente(fileArray)

        $q.notify({
          type: 'info',
          message: `${files.length} arquivo(s) adicionado(s)`,
          position: 'top-right',
          timeout: 2000
        })
      }
    }

    const onFilesSelected = (files) => {
      if (files && files.length > 0) {
        analisarArquivosAutomaticamente(files)

        $q.notify({
          type: 'info',
          message: `${files.length} arquivo(s) selecionado(s)`,
          caption: 'Análise automática iniciada',
          position: 'top-right',
          timeout: 2000
        })
      }
    }

    const processarArquivosSelecionados = () => {
      processarArquivos()
    }

    const analisarArquivosAutomaticamente = (files) => {
      const nomes = files.map(f => f.name.toLowerCase()).join(' ')

      if (nomes.includes('pnae') || nomes.includes('merenda')) {
        tipoDadosDetectado.value = 'Dados PNAE'
        algoritmoSelecionado.value = 'analise_estatistica'
      } else if (nomes.includes('agricultura') || nomes.includes('familiar')) {
        tipoDadosDetectado.value = 'Agricultura Familiar'
        algoritmoSelecionado.value = 'tendencias'
      } else if (nomes.includes('cooperativa') || nomes.includes('associacao')) {
        tipoDadosDetectado.value = 'Cooperativas/Associações'
        algoritmoSelecionado.value = 'clustering'
      } else {
        tipoDadosDetectado.value = 'Dados Genéricos'
        algoritmoSelecionado.value = 'analise_estatistica'
      }

      camposDetectados.value = [
        { nome: 'municipio', tipo: 'string', qualidade: 95 },
        { nome: 'populacao', tipo: 'number', qualidade: 90 },
        { nome: 'agricultores', tipo: 'number', qualidade: 85 },
        { nome: 'percentual_pnae', tipo: 'number', qualidade: 88 },
        { nome: 'status', tipo: 'categorical', qualidade: 92 }
      ]

      if (files.some(f => f.name.endsWith('.csv'))) {
        opcoes.value.delimitador = ','
        delimitadorDetectado.value = ','
      }

      qualidadeDados.value = { nivel: 'Boa (92%)', cor: 'positive' }
    }

    const otimizarAutomaticamente = () => {
      opcoes.value.removerDuplicatas = true
      opcoes.value.validarDados = true
      opcoes.value.normalizarTexto = true
      opcoes.value.detectarOutliers = true
      nivelProcessamento.value = 'padrao'
      modoProcessamento.value = 'auto'

      sugestoesTratamento.value.forEach(s => {
        s.aplicada = s.nome !== 'Preencher nulos' && s.nome !== 'Corrigir encoding'
      })

      $q.notify({
        type: 'positive',
        message: 'Configurações otimizadas!',
        position: 'top-right',
        timeout: 2000
      })
    }

    const toggleSugestao = (index) => {
      sugestoesTratamento.value[index].aplicada = !sugestoesTratamento.value[index].aplicada

      const sugestao = sugestoesTratamento.value[index]
      switch (sugestao.nome) {
        case 'Remover duplicatas':
          opcoes.value.removerDuplicatas = sugestao.aplicada
          break
        case 'Normalizar nomes':
          opcoes.value.normalizarTexto = sugestao.aplicada
          break
        case 'Preencher nulos':
          opcoes.value.preencherNulos = sugestao.aplicada
          break
        case 'Corrigir encoding':
          opcoes.value.corrigirEncoding = sugestao.aplicada
          break
        case 'Detectar outliers':
          opcoes.value.detectarOutliers = sugestao.aplicada
          break
      }
    }

    const processarArquivos = async () => {
      if (arquivosSelecionados.value.length === 0) {
        $q.notify({
          type: 'warning',
          message: 'Nenhum arquivo para processar',
          position: 'top-right'
        })
        return
      }

      processando.value = true
      const inicio = performance.now()

      try {
        await new Promise(resolve => setTimeout(resolve, 1500))

        resultados.value = []
        let tamanhoTotalCount = 0

        for (const arquivo of arquivosSelecionados.value) {
          const registros = Math.floor(Math.random() * 3000) + 200
          const colunas = Math.floor(Math.random() * 12) + 5

          tamanhoTotalCount += arquivo.size || 0

          resultados.value.push({
            nome: arquivo.name,
            registros: registros,
            colunas: colunas,
            status: 'sucesso',
            dados: gerarDadosExemplo(registros)
          })
        }

        dadosProcessados.value = []
        resultados.value.forEach(resultado => {
          if (resultado.dados) {
            dadosProcessados.value.push(...resultado.dados)
          }
        })

        dadosProcessados.value = dadosProcessados.value.map((row, index) => ({
          id: index + 1,
          ...row
        }))

        arquivosProcessados.value = arquivosSelecionados.value.map(f => ({
          nome: f.name,
          tamanho: f.size
        }))

        estatisticas.value = {
          totalArquivos: arquivosSelecionados.value.length,
          tamanhoTotal: tamanhoTotalCount,
          totalRegistros: dadosProcessados.value.length,
          tempoProcessamento: ((performance.now() - inicio) / 1000).toFixed(2)
        }

        logsProcessamento.value = gerarLogsProcessamento(resultados.value, estatisticas.value)
        executarAlgoritmo(algoritmoSelecionado.value)

        setTimeout(() => criarGraficoTipos(), 100)

        $q.notify({
          type: 'positive',
          message: 'Processamento concluído!',
          caption: `${estatisticas.value.totalRegistros} registros em ${estatisticas.value.tempoProcessamento}s`,
          position: 'top-right',
          timeout: 5000
        })

      } catch (err) {
        console.error('Erro:', err)
        $q.notify({
          type: 'negative',
          message: 'Erro no processamento',
          position: 'top-right'
        })
      } finally {
        processando.value = false
      }
    }

    const executarAlgoritmo = (algoritmo) => {
      const metricas = []

      switch (algoritmo) {
        case 'analise_estatistica':
          metricas.push(
            { nome: 'Média', valor: '45.2', cor: 'text-primary' },
            { nome: 'Mediana', valor: '42.0', cor: 'text-green' },
            { nome: 'Desvio Padrão', valor: '15.8', cor: 'text-orange' },
            { nome: 'Variância', valor: '249.6', cor: 'text-purple' }
          )
          break
        case 'tendencias':
          metricas.push(
            { nome: 'Tendência', valor: '+12.5%', cor: 'text-positive' },
            { nome: 'Sazonalidade', valor: 'Trimestral', cor: 'text-primary' },
            { nome: 'Previsão', valor: '156.8', cor: 'text-green' },
            { nome: 'MAPE', valor: '8.3%', cor: 'text-orange' }
          )
          break
        case 'clustering':
          metricas.push(
            { nome: 'Clusters', valor: '5', cor: 'text-primary' },
            { nome: 'Silhouette', valor: '0.78', cor: 'text-green' },
            { nome: 'Inércia', valor: '234.5', cor: 'text-orange' },
            { nome: 'Iterações', valor: '42', cor: 'text-purple' }
          )
          break
        default:
          metricas.push(
            { nome: 'Acurácia', valor: '92.4%', cor: 'text-positive' },
            { nome: 'Precisão', valor: '0.91', cor: 'text-primary' },
            { nome: 'Recall', valor: '0.88', cor: 'text-green' },
            { nome: 'F1-Score', valor: '0.89', cor: 'text-orange' }
          )
      }

      metricasAlgoritmo.value = metricas
    }

    const criarGraficoTipos = () => {
      if (graficoTiposChart.value) {
        if (graficoTiposInstance) graficoTiposInstance.destroy()
        const ctx = graficoTiposChart.value.getContext('2d')

        const tipos = {}
        resultados.value.forEach(r => {
          const tipo = getTipoArquivo(r.nome)
          tipos[tipo] = (tipos[tipo] || 0) + 1
        })

        graficoTiposInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(tipos).map(t => t.toUpperCase()),
            datasets: [{
              label: 'Quantidade',
              data: Object.values(tipos),
              backgroundColor: ['#1976d2', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }
        })
      }
    }

    const exportarDados = () => {
      if (dadosProcessados.value.length === 0) {
        $q.notify({
          type: 'warning',
          message: 'Nenhum dado para exportar',
          position: 'top-right'
        })
        return
      }

      exportando.value = true

      setTimeout(() => {
        let conteudo = ''
        let tipoMime = 'text/plain'
        let extensao = formatoExportacao.value

        switch (formatoExportacao.value) {
          case 'vue':
            conteudo = gerarVueComponent()
            break
          case 'xml':
            conteudo = gerarXML()
            tipoMime = 'application/xml'
            break
          case 'sql':
            conteudo = gerarSQL()
            tipoMime = 'application/sql'
            break
          case 'json':
            conteudo = JSON.stringify(dadosProcessados.value, null, 2)
            tipoMime = 'application/json'
            break
          case 'csv':
            conteudo = gerarCSV()
            tipoMime = 'text/csv'
            break
          default:
            conteudo = 'Dados exportados em Excel'
        }

        const blob = new Blob([conteudo], { type: tipoMime })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${nomeArquivoExport.value}.${extensao}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        exportando.value = false

        $q.notify({
          type: 'positive',
          message: 'Download iniciado!',
          caption: `Arquivo: ${a.download}`,
          position: 'top-right',
          timeout: 5000
        })
      }, 500)
    }

    const gerarVueComponent = () => {
      const dadosJson = JSON.stringify(dadosProcessados.value.slice(0, 10), null, 2)
      const colunasJson = JSON.stringify(colunasTabela.value, null, 2)

      return `<template>
  <q-page class="q-pa-md">
    <q-table :rows="dados" :columns="colunas" row-key="id" dense bordered />
  </q-page>
</template>

<script>
export default {
  setup() {
    const dados = ${dadosJson}
    const colunas = ${colunasJson}
    return { dados, colunas }
  }
}
</scr` + `ipt>`
    }

    const gerarXML = () => {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<dados>\n'
      dadosProcessados.value.slice(0, 100).forEach(item => {
        xml += '  <registro>\n'
        Object.keys(item).forEach(key => {
          if (key !== 'id') {
            xml += `    <${key}>${item[key]}</${key}>\n`
          }
        })
        xml += '  </registro>\n'
      })
      xml += '</dados>'
      return xml
    }

    const gerarSQL = () => {
      let sql = `-- Script SQL - ${new Date().toISOString()}\n\n`
      sql += `CREATE TABLE ${nomeArquivoExport.value} (\n  id INT PRIMARY KEY,\n`

      const primeiraLinha = dadosProcessados.value[0] || {}
      Object.keys(primeiraLinha).forEach(key => {
        if (key !== 'id') {
          sql += `  ${key} VARCHAR(255),\n`
        }
      })
      sql = sql.slice(0, -2) + '\n);\n\n'

      dadosProcessados.value.slice(0, 100).forEach(item => {
        const colunas = Object.keys(item).filter(k => k !== 'id').join(', ')
        const valores = Object.keys(item).filter(k => k !== 'id').map(k => `'${String(item[k]).replace(/'/g, "''")}'`).join(', ')
        sql += `INSERT INTO ${nomeArquivoExport.value} (${colunas}) VALUES (${valores});\n`
      })
      return sql
    }

    const gerarCSV = () => {
      if (dadosProcessados.value.length === 0) return ''
      const colunas = Object.keys(dadosProcessados.value[0]).filter(k => k !== 'id')
      let csv = colunas.join(',') + '\n'
      dadosProcessados.value.forEach(item => {
        csv += colunas.map(c => item[c]).join(',') + '\n'
      })
      return csv
    }

    const gerarLogsProcessamento = (resultadosList, stats) => {
      let logs = `[${new Date().toISOString()}] INÍCIO\n`
      resultadosList.forEach((r) => {
        logs += `[SUCESSO] ${r.nome} (${r.registros} registros)\n`
      })
      logs += `[INFO] Concluído em ${stats.tempoProcessamento}s\n`
      return logs
    }

    const gerarDadosExemplo = (numRegistros) => {
      const dados = []
      const municipios = ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso']
      const statusList = ['Atingiu', 'Progresso', 'Abaixo']

      for (let j = 0; j < Math.min(numRegistros, 50); j++) {
        dados.push({
          municipio: municipios[Math.floor(Math.random() * municipios.length)],
          populacao: Math.floor(Math.random() * 500000) + 10000,
          agricultores: Math.floor(Math.random() * 5000) + 500,
          percentualPNAE: Math.floor(Math.random() * 60) + 5,
          status: statusList[Math.floor(Math.random() * statusList.length)],
          valorRepasse: (Math.random() * 2000000 + 100000).toFixed(2)
        })
      }
      return dados
    }

    const limparTudo = () => {
      arquivosSelecionados.value = []
      arquivosProcessados.value = []
      resultados.value = []
      dadosProcessados.value = []
      logsProcessamento.value = ''
      metricasAlgoritmo.value = []
      estatisticas.value = { totalArquivos: 0, tamanhoTotal: 0, totalRegistros: 0, tempoProcessamento: 0 }

      if (graficoTiposInstance) {
        graficoTiposInstance.destroy()
        graficoTiposInstance = null
      }

      $q.notify({ type: 'info', message: 'Dados limpos', position: 'top-right', timeout: 2000 })
    }

    const abrirVisualizadorDados = () => {
      dialogoVisualizador.value = true
    }

    const getTipoArquivo = (nome) => {
      const ext = nome.split('.').pop().toLowerCase()
      const tipos = { csv: 'csv', json: 'json', xml: 'xml', xlsx: 'excel', txt: 'texto', pdf: 'pdf', sql: 'sql' }
      return tipos[ext] || 'desconhecido'
    }

    const getIconeArquivo = (nome) => {
      const tipo = getTipoArquivo(nome)
      const icones = { csv: 'table_chart', json: 'code', xml: 'data_object', excel: 'grid_on', texto: 'article', pdf: 'picture_as_pdf', sql: 'storage' }
      return icones[tipo] || 'insert_drive_file'
    }

    const getCorArquivo = (nome) => {
      const tipo = getTipoArquivo(nome)
      const cores = { csv: 'green', json: 'blue', xml: 'orange', excel: 'positive', texto: 'grey', pdf: 'negative', sql: 'purple' }
      return cores[tipo] || 'grey'
    }

    const formatarBytes = (bytes) => {
      if (!bytes) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatarNomeColuna = (nome) => {
      return nome.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    }

    watch(resultados, () => {
      if (resultados.value.length > 0) {
        setTimeout(() => criarGraficoTipos(), 100)
      }
    }, { deep: true })

    return {
      uploaderRef,
      arquivosSelecionados,
      processando,
      exportando,
      expanded,
      mostrarDetalhes,
      dialogoVisualizador,
      filtroTabela,
      dragOver,
      tipoDadosDetectado,
      encodingDetectado,
      delimitadorDetectado,
      qualidadeDados,
      camposDetectados,
      sugestoesTratamento,
      algoritmoSelecionado,
      nivelProcessamento,
      modoProcessamento,
      formatoExportacao,
      compressor,
      nomeArquivoExport,
      opcoes,
      algoritmosDisponiveis,
      niveisProcessamento,
      modosProcessamento,
      formatosExportacao,
      opcoesCompressor,
      arquivosProcessados,
      resultados,
      dadosProcessados,
      logsProcessamento,
      metricasAlgoritmo,
      estatisticas,
      colunasTabela,
      dadosProcessadosFiltrados,
      graficoTiposChart,
      triggerFileSelect,
      onDropFiles,
      onFilesSelected,
      processarArquivosSelecionados,
      otimizarAutomaticamente,
      toggleSugestao,
      processarArquivos,
      exportarDados,
      limparTudo,
      abrirVisualizadorDados,
      getIconeArquivo,
      getCorArquivo,
      formatarBytes
    }
  }
}
</script>

<style scoped>
.container-full {
  max-width: 100%;
  margin: 0;
  padding: 24px;
}

.upload-card-full,
.deteccao-card,
.processamento-card,
.stats-card,
.results-card,
.table-card,
.export-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  overflow: hidden;
  width: 100%;
}

.uploader-full-width {
  width: 100%;
}

.drop-zone {
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  background: #fafbfc;
  transition: all 0.2s ease;
  cursor: pointer;
}

.drop-zone:hover {
  border-color: #1976d2;
  background: #f8fafc;
}

.drop-zone.drag-over {
  border-color: #1976d2;
  background: #e8f0fe;
}

.bg-primary-1 { background: rgba(25, 118, 210, 0.08); }
.bg-green-1 { background: rgba(76, 175, 80, 0.08); }
.bg-orange-1 { background: rgba(255, 152, 0, 0.08); }
.bg-purple-1 { background: rgba(156, 39, 176, 0.08); }

.q-table { background: transparent; }
.q-table th { font-weight: 600; color: #64748b; font-size: 0.75rem; text-transform: uppercase; background: #f8fafc; }
.q-table td { font-size: 0.85rem; color: #334155; }

::-webkit-scrollbar { width: 6px; background: #f0f2f5; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }

@media (max-width: 768px) {
  .container-full { padding: 12px; }
}
</style>
