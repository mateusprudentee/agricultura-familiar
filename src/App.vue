<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Sidebar Lateral Esquerda estilo NamelessMC -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      :width="280"
      :mini="!leftDrawerOpen"
      :mini-width="80"
      class="sidebar-nameless"
      :behavior="'desktop'"
    >
      <div class="sidebar-content">
        <!-- Logo Area -->
        <div class="sidebar-logo">
          <div class="logo-container">
            <router-link to="/">
  <div class="logo-area"></div>
</router-link>
<router-link to="/" custom v-slot="{ navigate }">
  <span class="logo-text" @click="navigate">
    Agricultura Familiar em Mato Grosso
  </span>
</router-link>

          </div>
        </div>

        <!-- Menu de Navegação com Dropdowns -->
        <q-scroll-area class="sidebar-menu">
          <div class="menu-sections">
            <!-- Dashboard -->
            <div class="menu-section">
 <q-expansion-item
  expand-separator
  icon="dashboard"
  :label="leftDrawerOpen ? 'Dashboard' : ''"
  header-class="menu-expansion-header"
  class="menu-expansion dashboard-icon"
  :model-value="activeSection === 'dashboard'"
  @click="toggleSection('dashboard')"
>
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'dashboard'"
                      @click="navigate"
                    >
                      <q-item-section>Visão geral </q-item-section>
                    </q-item>
                  </router-link>

                   <router-link to="/relatorio" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'dashboard-relatorio'"
                      @click="navigate"
                    >
                      <q-item-section>Relatórios</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- Financiamento e Recursos -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="payments"
                :label="leftDrawerOpen ? 'Financiamento' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion financiamento-icon"
                :default-opened="activeSection === 'financiamento' && leftDrawerOpen"
                @click="toggleSection('financiamento')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/verbas-por-municipio" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'verbas'"
                      @click="navigate"
                    >
                      <q-item-section>Verbas por Município</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/repasses-auxilios-pnae" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'repasses'"
                      @click="navigate"
                    >
                      <q-item-section>Repasses e Auxílios PNAE</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/evolucao-2-anos" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'evolucao'"
                      @click="navigate"
                    >
                      <q-item-section>Evolução (2 anos)</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- Capacidade Produtiva -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="agriculture"
                :label="leftDrawerOpen ? 'Capacidade Produtiva' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion capacidade-icon"
                :default-opened="activeSection === 'capacidade' && leftDrawerOpen"
                @click="toggleSection('capacidade')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/capacidade-por-municipio" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'capacidade'"
                      @click="navigate"
                    >
                      <q-item-section>Capacidade por Município</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/associacoes-cooperativas" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'associacoes'"
                      @click="navigate"
                    >
                      <q-item-section>Associações/Cooperativas</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/assistencia-tecnica" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'assistencia'"
                      @click="navigate"
                    >
                      <q-item-section>Assistência Técnica</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- Indicadores Municipais -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="analytics"
                :label="leftDrawerOpen ? 'Indicadores Municipais' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion indicadores-icon"
                :default-opened="activeSection === 'indicadores' && leftDrawerOpen"
                @click="toggleSection('indicadores')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/dependencia-agricultura" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'dependencia'"
                      @click="navigate"
                    >
                      <q-item-section>Dependência da Agricultura</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/secretaria-especifica" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'secretaria'"
                      @click="navigate"
                    >
                      <q-item-section>Secretaria Específica</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/populacao-demanda" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'populacao'"
                      @click="navigate"
                    >
                      <q-item-section>População e Demanda</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/agricultores-ativos-mt" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'agricultores'"
                      @click="navigate"
                    >
                      <q-item-section>Agricultores Ativos (MT)</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- PNAE - Merenda Escolar -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="school"
                :label="leftDrawerOpen ? 'PNAE - Merenda Escolar' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion pnae-icon"
                :default-opened="activeSection === 'pnae' && leftDrawerOpen"
                @click="toggleSection('pnae')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/cumprimento-pnae" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'cumprimento'"
                      @click="navigate"
                    >
                      <q-item-section>Cumprimento do PNAE</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/escolas-beneficiadas" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item escolas-icon"
                      :active="isActive || activePage === 'escolas'"
                      @click="navigate"
                    >
                      <q-item-section>Escolas Beneficiadas</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- ODS -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="flag"
                :label="leftDrawerOpen ? 'ODS' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion ods-icon"
                :default-opened="activeSection === 'ods' && leftDrawerOpen"
                @click="toggleSection('ods')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/ods2-fome-zero" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'ods2'"
                      @click="navigate"
                    >
                      <q-item-section>ODS 2 - Fome Zero</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/ods3-saude-bem-estar" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'ods3'"
                      @click="navigate"
                    >
                      <q-item-section>ODS 3 - Saúde e Bem-Estar</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/ods4-educacao-qualidade" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item "
                      :active="isActive || activePage === 'ods4'"
                      @click="navigate"
                    >
                      <q-item-section>ODS 4 - Educação Qualidade</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>

            <!-- Portal e Integração -->
            <div class="menu-section">
              <q-expansion-item
                expand-separator
                icon="more"
                :label="leftDrawerOpen ? 'Portal' : ''"
                header-class="menu-expansion-header"
                class="menu-expansion portal-icon"
                :default-opened="activeSection === 'portal' && leftDrawerOpen"
                @click="toggleSection('portal')"
              >
                <div class="menu-items" v-if="leftDrawerOpen">
                  <router-link to="/relatorios" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'relatorios'"
                      @click="navigate"
                    >
                      <q-item-section>Relatórios</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/analise-proximos-meses" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'analise'"
                      @click="navigate"
                    >
                      <q-item-section>Análise Próximos Meses</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/infraestrutura" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'infraestrutura'"
                      @click="navigate"
                    >
                      <q-item-section>Infraestrutura</q-item-section>
                    </q-item>
                  </router-link>

                  <router-link to="/integracao-automatica" custom v-slot="{ navigate, isActive }">
                    <q-item
                      clickable
                      v-ripple
                      class="menu-item"
                      :active="isActive || activePage === 'integracao'"
                      @click="navigate"
                    >
                      <q-item-section>Integração Automática</q-item-section>
                    </q-item>
                  </router-link>
                </div>
              </q-expansion-item>
            </div>
          </div>

        </q-scroll-area>

      </div>
      <div class="info">

            Versão 1.0 pre-0
            <br>
             {{ new Date().toLocaleString() }}
            <br>
            UFMT <q-icon name="copyright"></q-icon> Todos os direitos reservados.
          </div>
    </q-drawer>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <q-page>
        <div class="main-content">
          <div class="page-content">
            <div class="content-wrapper">
              <router-view :key="activePage" />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router' // Removido useRouter

const route = useRoute() // Mantido apenas useRoute
const leftDrawerOpen = ref(true)
const activePage = ref('')
const activeSection = ref('')

// Mapeamento de rotas para breadcrumbs e seções
const breadcrumbMap = {
  dashboard: { label: 'Dashboard', section: 'dashboard', parent: null },
  verbas: { label: 'Verbas por Município', section: 'financiamento', parent: 'Financiamento' },
  repasses: { label: 'Repasses e Auxílios PNAE', section: 'financiamento', parent: 'Financiamento' },
  evolucao: { label: 'Evolução (2 anos)', section: 'financiamento', parent: 'Financiamento' },
  capacidade: { label: 'Capacidade por Município', section: 'capacidade', parent: 'Capacidade Produtiva' },
  associacoes: { label: 'Associações/Cooperativas', section: 'capacidade', parent: 'Capacidade Produtiva' },
  assistencia: { label: 'Assistência Técnica', section: 'capacidade', parent: 'Capacidade Produtiva' },
  dependencia: { label: 'Dependência da Agricultura', section: 'indicadores', parent: 'Indicadores Municipais' },
  secretaria: { label: 'Secretaria Específica', section: 'indicadores', parent: 'Indicadores Municipais' },
  populacao: { label: 'População e Demanda', section: 'indicadores', parent: 'Indicadores Municipais' },
  agricultores: { label: 'Agricultores Ativos (MT)', section: 'indicadores', parent: 'Indicadores Municipais' },
  cumprimento: { label: 'Cumprimento do PNAE', section: 'pnae', parent: 'PNAE - Merenda Escolar' },
  escolas: { label: 'Escolas Beneficiadas', section: 'pnae', parent: 'PNAE - Merenda Escolar' },
  ods2: { label: 'ODS 2 - Fome Zero', section: 'ods', parent: 'ODS' },
  ods3: { label: 'ODS 3 - Saúde e Bem-Estar', section: 'ods', parent: 'ODS' },
  ods4: { label: 'ODS 4 - Educação Qualidade', section: 'ods', parent: 'ODS' },
  relatorios: { label: 'Relatórios', section: 'portal', parent: 'Portal' },
  analise: { label: 'Análise Próximos Meses', section: 'portal', parent: 'Portal' },
  infraestrutura: { label: 'Infraestrutura', section: 'portal', parent: 'Portal' },
  integracao: { label: 'Integração Automática', section: 'portal', parent: 'Portal' }
}

const toggleSection = (section) => {
  if (leftDrawerOpen.value) {
    activeSection.value = section
  }
}

// Sincronizar com a rota atual
watch(() => route.name, (newRoute) => {
  if (newRoute) {
    activePage.value = newRoute
    activeSection.value = breadcrumbMap[newRoute]?.section || newRoute
  }
}, { immediate: true })
</script>

<style scoped>
/* Sidebar Styles */
.sidebar-nameless {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Quando o drawer está no modo mini, centraliza os ícones */
.sidebar-nameless:deep(.q-drawer--mini) .q-item {
  justify-content: center;
  padding: 12px;
}

.sidebar-nameless:deep(.q-drawer--mini) .q-expansion-item__container > .q-item {
  justify-content: center;
  padding: 12px;
}

/* Esconde o texto dos itens quando mini */
.sidebar-nameless:deep(.q-drawer--mini) .q-item__label {
  display: none;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Logo Area */
.sidebar-logo {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.info {
  padding:1.5em;
  color: gray;
  font-size: 0.8em;
  text-align: left;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: auto;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  position: absolute;
  bottom: 0;

}
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.logo-area {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-image: url("https://i.imgur.com/MzEVU64.png");
  height: 40px;
  width: 100px;
  border-right: 1px solid rgb(235, 235, 235);
  background-size: cover;
  background-position: center;
}

.logo-text {
  font-size: 15px;
  font-weight: normal;
  background: linear-gradient(135deg, #363636 0%, #0130ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
  line-height: 1.3;
  max-width: 110px;
  transition: opacity 0.3s ease;
}

/* Quando o drawer está mini, esconde o texto da logo */
.sidebar-nameless:deep(.q-drawer--mini) .logo-text {
  display: none;
}

/* Container do ícone de toggle */
.toggle-icon-container {
  position: absolute;
  right: -12px;
  top: 110px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
* {
  font-family: 'Ubuntu', sans-serif;
}
/* Ícone de fechar/abrir */
.close-nav-icon {
  font-size: 20px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  border-radius: 50%;
  padding: 6px;
  display: block;
}

.close-nav-icon:hover {
  color: #000000;
  background-color: #f0f0f0;
  transform: scale(1.1);
}

/* Menu Sections */
.sidebar-menu {
  flex: 1;
  padding: 0.8em;
}

.menu-section {
  margin-bottom: 4px;
}

/* Estilização dos expansion items */
.menu-expansion {
  margin: 0 8px;
}

.menu-expansion-header:hover {
  background-color: #f7f7f7;
}

.menu-expansion :deep(.q-expansion-item__container) {
  border-radius: 10px;
}

.menu-expansion :deep(.q-item) {
  padding: 1em 1em 1em 1em;
  border-radius: 10px;
  color: #494949;
  font-family: 'Ubuntu', sans-serif;
}

/* Quando está no modo mini, centraliza os ícones e remove o padding */
.sidebar-nameless:deep(.q-drawer--mini) .q-expansion-item .q-item {
  justify-content: center;
  padding: 12px;
}

/* Remove o espaço do label quando mini */
.sidebar-nameless:deep(.q-drawer--mini) .q-expansion-item .q-item__section--side {
  margin-right: 0;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0 4px 16px;
}

.menu-item {
  margin: 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 40px;
  color: #4a5568;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item[active="true"] {
  background-color: #e8e8e8 !important;
  color: #000000 !important;
  font-weight: 500;
}

.menu-item.q-item--active {
  background-color: #e8e8e8 !important;
  color: #000000 !important;
}

.dashboard-icon :deep(.q-item__section--avatar .q-icon) {
  color: #1976d2; /* azul */
}

.financiamento-icon :deep(.q-item__section--avatar .q-icon) {
  color: #2e7d32; /* verde */
}

.capacidade-icon :deep(.q-item__section--avatar .q-icon) {
  color: #f57c00; /* laranja */
}

.indicadores-icon :deep(.q-item__section--avatar .q-icon) {
  color: #7b1fa2; /* roxo */
}

.pnae-icon :deep(.q-item__section--avatar .q-icon) {
  color: #c62828; /* vermelho */
}

.ods-icon :deep(.q-item__section--avatar .q-icon) {
  color: #00838f; /* teal */
}

.portal-icon :deep(.q-item__section--avatar .q-icon) {
  color: #455a64; /* cinza escuro */
}

.menu-item .q-icon {
  color: inherit;
}

.menu-item:hover .q-icon {
  color: inherit;
}

.menu-item[active="true"] .q-icon {
  color: inherit;
}

.menu-item :deep(.q-item__section--avatar) {
  min-width: 36px;
}

.menu-item :deep(.q-icon) {
  transition: color 0.2s ease;
}

/* Main Content */
.main-content {
  background: #f8f9fa;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.page-content {
  padding: 24px;
  min-height: calc(100vh - 60px);
}

.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
  transition: all 0.3s ease;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar-nameless {
    width: 260px !important;
  }

  .page-content {
    padding: 16px;
  }

  .logo-text {
    font-size: 11px;
    max-width: 140px;
  }

  .logo-container {
    gap: 8px;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  .content-wrapper {
    max-width: 100%;
  }
}

@media (min-width: 1400px) {
  .content-wrapper {
    max-width: 1400px;
  }
}

/* Scrollbar Styling */
.sidebar-menu :deep(.q-scrollarea__content) {
  scrollbar-width: thin;
}

.sidebar-menu :deep(.q-scrollarea__content::-webkit-scrollbar-thumb) {
  background: #cbd5e0;
  border-radius: 4px;
}

.menu-item :deep(.q-ripple) {
  color: #d0d0d0;
}
</style>
