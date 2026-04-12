<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="q-pa-xl">
        <div class="row q-col-gutter-xl">
          <div class="col-12">
            <q-toolbar-title class="text-weight-medium">
          <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
          Verbas por Município
        </q-toolbar-title>
            <p class="text-grey-6 q-mb-xl" style="max-width: 600px">
              Acompanhamento dos investimentos do Governo de Mato Grosso e repasses do ICMS via IAF (Índice Municipal da Agricultura Familiar) para o fortalecimento da produção rural.
            </p>
          </div>
        </div>

        <!-- Cards de Resumo -->
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="card-minimal full-height">
              <q-card-section>
                <div class="text-overline text-grey-5">Total Estadual (2025)</div>
                <div class="text-h4 text-weight-bold q-mt-sm q-mb-xs">R$ 705 Mi</div>
                <div class="text-caption text-grey-5">
                  Investimento total em agricultura familiar
                </div>
                <q-separator class="q-my-md text-grey-3" />
                <div class="row items-center text-grey-6">
                  <q-icon name="info" size="14px" class="q-mr-xs" />
                  <span class="text-caption">Fundaaf Inclusão Rural: R$ 21,4 Mi</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="card-minimal full-height">
              <q-card-section>
                <div class="text-overline text-grey-5">Municípios Beneficiados</div>
                <div class="text-h4 text-weight-bold q-mt-sm q-mb-xs">142</div>
                <div class="text-caption text-grey-5">
                  Cobertura total dos municípios de Mato Grosso
                </div>
                <q-separator class="q-my-md text-grey-3" />
                <div class="row items-center text-grey-6">
                  <q-icon name="agriculture" size="14px" class="q-mr-xs" />
                  <span class="text-caption">103 termos ativos Empaer + Prefeituras</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="card-minimal full-height">
              <q-card-section>
                <div class="text-overline text-grey-5">Índice de Repasse</div>
                <div class="text-h4 text-weight-bold q-mt-sm q-mb-xs">ICMS via IAF</div>
                <div class="text-caption text-grey-5">
                  Novo indicador para repasse municipal
                </div>
                <q-separator class="q-my-md text-grey-3" />
                <q-chip outline color="grey-6" size="sm" icon="check_circle" class="bg-white">
                  Cobertura ATER como critério
                </q-chip>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Tabela de Repasses por Município -->
        <div class="row q-col-gutter-lg">
          <div class="col-12">
            <q-card flat class="card-minimal bg-white">
              <q-card-section class="q-pb-none">
                <div class="row items-center q-mb-md">
                  <div class="text-h6 text-weight-light">Repasses por Município</div>
                  <q-space />
                  <q-input
                    v-model="filter"
                    dense
                    outlined
                    rounded
                    placeholder="Filtrar município..."
                    class="input-minimal"
                    style="width: 260px"
                  >
                    <template v-slot:append>
                      <q-icon name="search" class="text-grey-5" />
                    </template>
                  </q-input>
                </div>
                <p class="text-caption text-grey-5 q-mb-lg">
                  Valores baseados nos programas Fundaaf e IAF. Dados consolidados pela SEAF-MT.
                </p>
              </q-card-section>

              <q-table
                :rows="filteredRows"
                :columns="columns"
                row-key="municipio"
                flat
                hide-pagination
                :pagination="initialPagination"
                class="table-minimal"
                :rows-per-page-options="[0]"
              >
                <template v-slot:header="props">
                  <q-tr :props="props" class="bg-white">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-left text-weight-medium text-grey-7">
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" class="row-minimal" @click="onRowClick(props.row)">
                    <q-td key="municipio" :props="props">
                      <div class="row items-center">
                        <q-icon name="location_on" size="14px" class="q-mr-sm text-grey-5" />
                        <span class="text-weight-medium">{{ props.row.municipio }}</span>
                      </div>
                    </q-td>
                    <q-td key="fundaaf" :props="props">
                      {{ formatCurrency(props.row.fundaaf) }}
                    </q-td>
                    <q-td key="iaf" :props="props">
                      {{ formatCurrency(props.row.iaf) }}
                    </q-td>
                    <q-td key="total" :props="props">
                      <span class="text-weight-medium text-positive">{{ formatCurrency(props.row.total) }}</span>
                    </q-td>
                    <q-td key="familias" :props="props">
                      {{ props.row.familias.toLocaleString('pt-BR') }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>

              <q-card-section class="q-pt-none text-caption text-grey-5">
                <div class="row items-center">
                  <q-icon name="touch_app" size="14px" class="q-mr-xs" />
                  <span>Clique em qualquer linha para ver detalhes do município</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const municipiosData = [
  { municipio: 'Cuiabá', fundaaf: 1240000, iaf: 3120000, total: 4360000, familias: 212 },
  { municipio: 'Várzea Grande', fundaaf: 980000, iaf: 2450000, total: 3430000, familias: 168 },
  { municipio: 'Rondonópolis', fundaaf: 1120000, iaf: 2890000, total: 4010000, familias: 195 },
  { municipio: 'Sinop', fundaaf: 1560000, iaf: 3780000, total: 5340000, familias: 260 },
  { municipio: 'Sorriso', fundaaf: 890000, iaf: 2340000, total: 3230000, familias: 157 },
  { municipio: 'Tangará da Serra', fundaaf: 760000, iaf: 1980000, total: 2740000, familias: 133 },
  { municipio: 'Cáceres', fundaaf: 680000, iaf: 1760000, total: 2440000, familias: 119 },
  { municipio: 'Barra do Garças', fundaaf: 540000, iaf: 1450000, total: 1990000, familias: 97 },
  { municipio: 'Lucas do Rio Verde', fundaaf: 620000, iaf: 1670000, total: 2290000, familias: 112 },
  { municipio: 'Primavera do Leste', fundaaf: 710000, iaf: 1820000, total: 2530000, familias: 123 },
  { municipio: 'Alta Floresta', fundaaf: 480000, iaf: 1280000, total: 1760000, familias: 86 },
  { municipio: 'Pontes e Lacerda', fundaaf: 390000, iaf: 1050000, total: 1440000, familias: 70 },
  { municipio: 'Juína', fundaaf: 420000, iaf: 1120000, total: 1540000, familias: 75 },
  { municipio: 'Guarantã do Norte', fundaaf: 510000, iaf: 1360000, total: 1870000, familias: 91 },
  { municipio: 'Nova Mutum', fundaaf: 450000, iaf: 1210000, total: 1660000, familias: 81 },
  { municipio: 'Campo Verde', fundaaf: 570000, iaf: 1520000, total: 2090000, familias: 102 },
  { municipio: 'Colíder', fundaaf: 360000, iaf: 980000, total: 1340000, familias: 65 },
  { municipio: 'Jaciara', fundaaf: 440000, iaf: 1180000, total: 1620000, familias: 79 },
  { municipio: 'Poconé', fundaaf: 330000, iaf: 890000, total: 1220000, familias: 59 },
  { municipio: 'Nova Guarita', fundaaf: 74000, iaf: 210000, total: 284000, familias: 13 }
]

const columns = [
  { name: 'municipio', label: 'Município', field: 'municipio', align: 'left', sortable: true },
  { name: 'fundaaf', label: 'Fundaaf (R$)', field: 'fundaaf', align: 'left', sortable: true },
  { name: 'iaf', label: 'IAF (R$)', field: 'iaf', align: 'left', sortable: true },
  { name: 'total', label: 'Total (R$)', field: 'total', align: 'left', sortable: true },
  { name: 'familias', label: 'Famílias', field: 'familias', align: 'left', sortable: true }
]

const filter = ref('')
const initialPagination = { rowsPerPage: 0 }

const filteredRows = computed(() => {
  if (!filter.value) return municipiosData
  const term = filter.value.toLowerCase()
  return municipiosData.filter(m => m.municipio.toLowerCase().includes(term))
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const onRowClick = (row) => {
  $q.dialog({
    title: row.municipio,
    message: `
      <div class="q-gutter-y-sm" style="font-family: system-ui;">
        <div style="margin-bottom: 12px;">
          <strong style="color: #2c7a3e;">Fundaaf Inclusão Rural:</strong>
          <span style="color: #4a5568;"> ${formatCurrency(row.fundaaf)}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #2c7a3e;">Repasse via IAF (ICMS):</strong>
          <span style="color: #4a5568;"> ${formatCurrency(row.iaf)}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #2c7a3e;">Total estimado:</strong>
          <span style="color: #4a5568;"> ${formatCurrency(row.total)}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <strong style="color: #2c7a3e;">Famílias beneficiadas:</strong>
          <span style="color: #4a5568;"> ${row.familias.toLocaleString('pt-BR')}</span>
        </div>
        <div style="font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 8px;">
          Dados baseados nos programas estaduais para agricultura familiar.
        </div>
      </div>
    `,
    html: true,
    ok: {
      label: 'Fechar',
      flat: true,
      color: 'grey-7',
      class: 'dialog-close-btn'
    }
  })
}
</script>

<style scoped>
/* Card Minimalista */
.card-minimal {
  border-radius: 16px !important;
  transition: all 0.25s ease !important;
  cursor: pointer !important;
  background-color: #ffffff !important;
  border: 1px solid #eef2f6 !important;
}

.card-minimal:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
  border-color: #e2e8f0 !important;
  transform: translateY(-2px);
}

/* Input Minimalista */
.input-minimal :deep(.q-field__control) {
  border-radius: 40px !important;
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
}

.input-minimal :deep(.q-field__control:hover) {
  border-color: #cbd5e0 !important;
}

.input-minimal :deep(.q-field__control:focus) {
  border-color: #2c7a3e !important;
}

/* Tabela Minimalista */
.table-minimal {
  border-radius: 16px;
}

.table-minimal :deep(.q-table) {
  border-radius: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.table-minimal :deep(th) {
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  padding: 16px 12px;
  border-bottom: 1px solid #eef2f6;
}

.table-minimal :deep(td) {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

/* Row com hover minimalista */
.row-minimal {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.row-minimal:hover {
  background-color: #fafcff !important;
}

.row-minimal:hover td {
  background-color: #fafcff !important;
}

/* Cores e textos */
.text-grey-5 {
  color: #a0aec0 !important;
}

.text-grey-6 {
  color: #718096 !important;
}

.text-grey-7 {
  color: #4a5568 !important;
}

.text-positive {
  color: #2c7a3e !important;
}

.bg-white {
  background-color: #ffffff !important;
}

/* Removendo sombras extras */
.q-card {
  box-shadow: none !important;
}

.q-separator {
  background-color: #eef2f6;
}

/* Dialog minimalista */
:deep(.q-dialog__title) {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2d3748;
  padding-bottom: 8px;
}

:deep(.dialog-close-btn) {
  text-transform: none;
  font-weight: 400;
}

/* Scroll suave */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
