<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Top Navbar - Mega Responsivo -->
    <q-header elevated class="bg-white text-black" v-if="isMobileView">
      <q-toolbar class="responsive-navbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleMobileDrawer"
          class="mobile-menu-btn"
        />

        <q-toolbar-title class="mobile-logo-container">
          <router-link to="/" class="mobile-logo-link">
            <span class="logo-text-mobile" @click="navigate">
                Agricultura Familiar em Mato Grosso
              </span>

          </router-link>

        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="more_vert"
          aria-label="Menu"
          @click="toggleMobileOptions"
        >
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable @click="navigateTo('/dashboard')">
                <q-item-section>Dashboard</q-item-section>
              </q-item>
              <q-item clickable @click="navigateTo('/repasses-auxilios-pnae')">
                <q-item-section>Repasses PNAE</q-item-section>
              </q-item>
              <q-item clickable @click="navigateTo('/fonte-publica')">
                <q-item-section>Fontes Públicas</q-item-section>
              </q-item>
              <q-item clickable @click="navigateTo('/dados')">
                <q-item-section>Processamento de Dados</q-item-section>
              </q-item>
              <q-item clickable @click="navigateTo('/verbas-por-municipio')">
                <q-item-section>Verbas por Município</q-item-section>
              </q-item>

              <q-separator />

            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <!-- Mobile Drawer -->
      <q-drawer
        v-model="mobileDrawerOpen"
        side="left"
        bordered
        :width="280"
        class="mobile-sidebar"
      >
        <div class="mobile-sidebar-header">
          <div class="mobile-sidebar-logo">

          </div>
          <q-btn flat dense round icon="close" @click="mobileDrawerOpen = false" />
        </div>

        <q-scroll-area class="mobile-sidebar-menu">
          <q-list>
            <!-- Dashboard -->
            <q-expansion-item
              icon="dashboard"
              label="Dashboard"
              group="menu"
              default-opened
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/dashboard')">
                <q-item-section>Visão geral</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/fonte-publica')">
                <q-item-section>Fontes Públicas</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/dados')">
                <q-item-section>Carregar Dados</q-item-section>
              </q-item>
            </q-expansion-item>

            <!-- Financiamento -->
            <q-expansion-item
              icon="payments"
              label="Financiamento"
              group="menu"
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/verbas-por-municipio')">
                <q-item-section>Verbas por Município</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/repasses-auxilios-pnae')">
                <q-item-section>Repasses e Auxílios PNAE</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/evolucao-2-anos')">
                <q-item-section>Evolução (2 anos)</q-item-section>
              </q-item>
            </q-expansion-item>

            <!-- Capacidade Produtiva -->
            <q-expansion-item
              icon="agriculture"
              label="Capacidade Produtiva"
              group="menu"
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/capacidade-por-municipio')">
                <q-item-section>Capacidade por Município</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/associacoes-cooperativas')">
                <q-item-section>Associações/Cooperativas</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/assistencia-tecnica')">
                <q-item-section>Assistência Técnica</q-item-section>
              </q-item>
            </q-expansion-item>

            <!-- Indicadores Municipais -->
            <q-expansion-item
              icon="analytics"
              label="Indicadores Municipais"
              group="menu"
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/dependencia-agricultura')">
                <q-item-section>Dependência da Agricultura</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/secretaria-especifica')">
                <q-item-section>Secretaria Específica</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/populacao-demanda')">
                <q-item-section>População e Demanda</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/agricultores-ativos-mt')">
                <q-item-section>Agricultores Ativos (MT)</q-item-section>
              </q-item>
            </q-expansion-item>



            <!-- ODS -->
            <q-expansion-item
              icon="flag"
              label="ODS"
              group="menu"
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/ods2-fome-zero')">
                <q-item-section>ODS 2 - Fome Zero</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/ods3-saude-bem-estar')">
                <q-item-section>ODS 3 - Saúde e Bem-Estar</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/ods4-educacao-qualidade')">
                <q-item-section>ODS 4 - Educação Qualidade</q-item-section>
              </q-item>
            </q-expansion-item>

            <!-- Portal -->
            <q-expansion-item
              icon="more"
              label="Portal"
              group="menu"
              class="mobile-menu-item"
            >
              <q-item clickable v-ripple @click="navigateTo('/relatorios')">
                <q-item-section>Relatórios</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/analise-proximos-meses')">
                <q-item-section>Análise Próximos Meses</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/infraestrutura')">
                <q-item-section>Infraestrutura</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="navigateTo('/integracao-automatica')">
                <q-item-section>Integração Automática</q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>

        <div class="mobile-sidebar-footer">
          <div v-if="timeLeft !== 'sem sessão ativa' && timeLeft !== 'Expirou!'">
            <span>Sessão expira em <b>{{ timeLeft }}</b></span>
          </div>
          <div class="mobile-version-info">
            Versão 1.0 pre-0 mestrado<br>
            UFMT <q-icon name="copyright"></q-icon> Todos os direitos reservados.
          </div>
        </div>
      </q-drawer>
    </q-header>

    <!-- Sidebar Desktop (sem alterações) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      :width="280"
      :mini="miniState"
      :mini-width="100"
      class="sidebar-nameless"
      :behavior="'desktop'"
      @update:model-value="handleDrawerChange"
      v-if="!isMobileView"
    >
      <!-- Ícone de toggle -->
      <div class="toggle-icon-container">
        <q-icon
          :name="miniState ? 'chevron_right' : 'chevron_left'"
          class="close-nav-icon"
          @click="toggleDrawer"
        />
      </div>

      <div class="sidebar-content">
        <!-- Logo -->
        <div class="sidebar-logo" :class="{ 'sidebar-logo-mini': miniState }">
          <div class="logo-container">
            <router-link to="/">
              <div
                class="logo-area"
                :class="{ 'logo-area-mini': miniState }"
              ></div>
            </router-link>
            <router-link to="/" custom v-slot="{ navigate }">
              <span class="logo-text" @click="navigate">
                Agricultura Familiar em Mato Grosso
              </span>
            </router-link>
          </div>
        </div>

        <!-- Menu -->
        <q-scroll-area class="sidebar-menu">
          <div class="menu-sections">
            <!-- Dashboard (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header dashboard-color"
                @click="toggleSubmenu('dashboard')"
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>Dashboard</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'dashboard' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'dashboard'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/dashboard') }"
                  @click="navigateTo('/dashboard')"
                >
                  <q-item-section>Visão geral</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/fonte-publica') }"
                  @click="navigateTo('/fonte-publica')"
                >
                  <q-item-section>Fontes Públicas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/dados') }"
                  @click="navigateTo('/dados')"
                >
                  <q-item-section>Carregar Dados</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Dashboard (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('dashboard')"
                @mouseleave="closeHoverMenuWithDelay('dashboard')"
              >
                <q-item clickable v-ripple class="menu-expansion-header dashboard-color">
                  <q-item-section avatar>
                    <q-icon name="dashboard" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="dashboardMenuRef"
                  :model-value="hoverMenuActive === 'dashboard'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('dashboard')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/dashboard') }"
                      @click="navigateTo('/dashboard')"
                    >
                      <q-item-section>Visão geral</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/fonte-publica') }"
                      @click="navigateTo('/fonte-publica')"
                    >
                      <q-item-section>Fontes Públicas</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/dados') }"
                      @click="navigateTo('/dados')"
                    >
                      <q-item-section>Carregar Dados</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>

            <!-- Financiamento (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header financiamento-color"
                @click="toggleSubmenu('financiamento')"
              >
                <q-item-section avatar>
                  <q-icon name="payments" />
                </q-item-section>
                <q-item-section>Financiamento</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'financiamento' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'financiamento'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/verbas-por-municipio') }"
                  @click="navigateTo('/verbas-por-municipio')"
                >
                  <q-item-section>Verbas por Município</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/repasses-auxilios-pnae') }"
                  @click="navigateTo('/repasses-auxilios-pnae')"
                >
                  <q-item-section>Repasses e Auxílios PNAE</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/evolucao-2-anos') }"
                  @click="navigateTo('/evolucao-2-anos')"
                >
                  <q-item-section>Evolução (2 anos)</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Financiamento (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('financiamento')"
                @mouseleave="closeHoverMenuWithDelay('financiamento')"
              >
                <q-item clickable v-ripple class="menu-expansion-header financiamento-color">
                  <q-item-section avatar>
                    <q-icon name="payments" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="financiamentoMenuRef"
                  :model-value="hoverMenuActive === 'financiamento'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('financiamento')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/verbas-por-municipio') }"
                      @click="navigateTo('/verbas-por-municipio')"
                    >
                      <q-item-section>Verbas por Município</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/repasses-auxilios-pnae') }"
                      @click="navigateTo('/repasses-auxilios-pnae')"
                    >
                      <q-item-section>Repasses e Auxílios PNAE</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/evolucao-2-anos') }"
                      @click="navigateTo('/evolucao-2-anos')"
                    >
                      <q-item-section>Evolução (2 anos)</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>

            <!-- Capacidade Produtiva (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header capacidade-color"
                @click="toggleSubmenu('capacidade')"
              >
                <q-item-section avatar>
                  <q-icon name="agriculture" />
                </q-item-section>
                <q-item-section>Capacidade Produtiva</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'capacidade' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'capacidade'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/capacidade-por-municipio') }"
                  @click="navigateTo('/capacidade-por-municipio')"
                >
                  <q-item-section>Capacidade por Município</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/associacoes-cooperativas') }"
                  @click="navigateTo('/associacoes-cooperativas')"
                >
                  <q-item-section>Associações/Cooperativas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/assistencia-tecnica') }"
                  @click="navigateTo('/assistencia-tecnica')"
                >
                  <q-item-section>Assistência Técnica</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Capacidade (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('capacidade')"
                @mouseleave="closeHoverMenuWithDelay('capacidade')"
              >
                <q-item clickable v-ripple class="menu-expansion-header capacidade-color">
                  <q-item-section avatar>
                    <q-icon name="agriculture" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="capacidadeMenuRef"
                  :model-value="hoverMenuActive === 'capacidade'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('capacidade')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/capacidade-por-municipio') }"
                      @click="navigateTo('/capacidade-por-municipio')"
                    >
                      <q-item-section>Capacidade por Município</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/associacoes-cooperativas') }"
                      @click="navigateTo('/associacoes-cooperativas')"
                    >
                      <q-item-section>Associações/Cooperativas</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/assistencia-tecnica') }"
                      @click="navigateTo('/assistencia-tecnica')"
                    >
                      <q-item-section>Assistência Técnica</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>

            <!-- Indicadores Municipais (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header indicadores-color"
                @click="toggleSubmenu('indicadores')"
              >
                <q-item-section avatar>
                  <q-icon name="analytics" />
                </q-item-section>
                <q-item-section>Indicadores Municipais</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'indicadores' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'indicadores'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/dependencia-agricultura') }"
                  @click="navigateTo('/dependencia-agricultura')"
                >
                  <q-item-section>Dependência da Agricultura</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/secretaria-especifica') }"
                  @click="navigateTo('/secretaria-especifica')"
                >
                  <q-item-section>Secretaria Específica</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/populacao-demanda') }"
                  @click="navigateTo('/populacao-demanda')"
                >
                  <q-item-section>População e Demanda</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/agricultores-ativos-mt') }"
                  @click="navigateTo('/agricultores-ativos-mt')"
                >
                  <q-item-section>Agricultores Ativos (MT)</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Indicadores (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('indicadores')"
                @mouseleave="closeHoverMenuWithDelay('indicadores')"
              >
                <q-item clickable v-ripple class="menu-expansion-header indicadores-color">
                  <q-item-section avatar>
                    <q-icon name="analytics" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="indicadoresMenuRef"
                  :model-value="hoverMenuActive === 'indicadores'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('indicadores')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/dependencia-agricultura') }"
                      @click="navigateTo('/dependencia-agricultura')"
                    >
                      <q-item-section>Dependência da Agricultura</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/secretaria-especifica') }"
                      @click="navigateTo('/secretaria-especifica')"
                    >
                      <q-item-section>Secretaria Específica</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/populacao-demanda') }"
                      @click="navigateTo('/populacao-demanda')"
                    >
                      <q-item-section>População e Demanda</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/agricultores-ativos-mt') }"
                      @click="navigateTo('/agricultores-ativos-mt')"
                    >
                      <q-item-section>Agricultores Ativos (MT)</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>

            <!-- PNAE (modo normal) -->
            <div v-if="!miniState" class="menu-section">


            </div>

            <!-- PNAE (modo mini hover) -->
            <div v-else class="menu-section">

            </div>

            <!-- ODS (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header ods-color"
                @click="toggleSubmenu('ods')"
              >
                <q-item-section avatar>
                  <q-icon name="flag" />
                </q-item-section>
                <q-item-section>ODS</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'ods' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'ods'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/ods2-fome-zero') }"
                  @click="navigateTo('/ods2-fome-zero')"
                >
                  <q-item-section>ODS 2 - Fome Zero</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/ods3-saude-bem-estar') }"
                  @click="navigateTo('/ods3-saude-bem-estar')"
                >
                  <q-item-section>ODS 3 - Saúde e Bem-Estar</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/ods4-educacao-qualidade') }"
                  @click="navigateTo('/ods4-educacao-qualidade')"
                >
                  <q-item-section>ODS 4 - Educação Qualidade</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- ODS (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('ods')"
                @mouseleave="closeHoverMenuWithDelay('ods')"
              >
                <q-item clickable v-ripple class="menu-expansion-header ods-color">
                  <q-item-section avatar>
                    <q-icon name="flag" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="odsMenuRef"
                  :model-value="hoverMenuActive === 'ods'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('ods')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/ods2-fome-zero') }"
                      @click="navigateTo('/ods2-fome-zero')"
                    >
                      <q-item-section>ODS 2 - Fome Zero</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/ods3-saude-bem-estar') }"
                      @click="navigateTo('/ods3-saude-bem-estar')"
                    >
                      <q-item-section>ODS 3 - Saúde e Bem-Estar</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/ods4-educacao-qualidade') }"
                      @click="navigateTo('/ods4-educacao-qualidade')"
                    >
                      <q-item-section>ODS 4 - Educação Qualidade</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>

            <!-- Portal (modo normal) -->
            <div v-if="!miniState" class="menu-section">
              <q-item
                clickable
                v-ripple
                class="menu-expansion-header portal-color"
                @click="toggleSubmenu('portal')"
              >
                <q-item-section avatar>
                  <q-icon name="more" />
                </q-item-section>
                <q-item-section>Portal</q-item-section>
                <q-item-section side>
                  <q-icon :name="activeMenu === 'portal' ? 'expand_less' : 'expand_more'" />
                </q-item-section>
              </q-item>
              <div v-if="activeMenu === 'portal'" class="menu-items">
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/relatorios') }"
                  @click="navigateTo('/relatorios')"
                >
                  <q-item-section>Relatórios</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/analise-proximos-meses') }"
                  @click="navigateTo('/analise-proximos-meses')"
                >
                  <q-item-section>Análise Próximos Meses</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/infraestrutura') }"
                  @click="navigateTo('/infraestrutura')"
                >
                  <q-item-section>Infraestrutura</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  class="menu-item"
                  :class="{ 'menu-item-active': isActiveRoute('/integracao-automatica') }"
                  @click="navigateTo('/integracao-automatica')"
                >
                  <q-item-section>Integração Automática</q-item-section>
                </q-item>
              </div>
            </div>

            <!-- Portal (modo mini hover) -->
            <div v-else class="menu-section">
              <div
                class="menu-hover-container"
                @mouseenter="openHoverMenu('portal')"
                @mouseleave="closeHoverMenuWithDelay('portal')"
              >
                <q-item clickable v-ripple class="menu-expansion-header portal-color">
                  <q-item-section avatar>
                    <q-icon name="more" />
                  </q-item-section>
                </q-item>
                <q-menu
                  ref="portalMenuRef"
                  :model-value="hoverMenuActive === 'portal'"
                  anchor="top right"
                  self="top left"
                  :offset="[5, 0]"
                  class="hover-menu"
                  @mouseenter="cancelCloseHoverMenu"
                  @mouseleave="closeHoverMenu('portal')"
                >
                  <q-list dense>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/relatorios') }"
                      @click="navigateTo('/relatorios')"
                    >
                      <q-item-section>Relatórios</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/analise-proximos-meses') }"
                      @click="navigateTo('/analise-proximos-meses')"
                    >
                      <q-item-section>Análise Próximos Meses</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/infraestrutura') }"
                      @click="navigateTo('/infraestrutura')"
                    >
                      <q-item-section>Infraestrutura</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="{ 'hover-menu-item-active': isActiveRoute('/integracao-automatica') }"
                      @click="navigateTo('/integracao-automatica')"
                    >
                      <q-item-section>Integração Automática</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>

      <!-- Rodapé com tooltip no hover -->
      <div class="info" v-if="!miniState">
        <span class="info-text">
          <div
            v-if="timeLeft !== 'sem sessão ativa' && timeLeft !== 'Expirou!'"
            style="margin-bottom: -18px;"
          >
            <span>
              Sessão expira em
              <b>
                {{ timeLeft }}
                <q-tooltip>
                  {{ expireDateFormatted }}
                </q-tooltip>
              </b>
            </span>
          </div>
          <br>
          Versão 1.0 pre-0 mestrado<br>
          {{ new Date().toLocaleString() }}<br>
          UFMT <q-icon name="copyright"></q-icon> Todos os direitos reservados.
        </span>
      </div>
      <div class="info-mini" v-else>
        <q-icon name="copyright" size="sm" />
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">
          Versão 1.0 pre-0<br>
          {{ new Date().toLocaleString() }}<br>
          UFMT Todos os direitos reservados.
        </q-tooltip>
      </div>
    </q-drawer>

    <!-- Conteúdo -->
    <q-page-container :style="isMobileView ? { marginTop: '50px' } : {}">
      <q-page>
        <div class="main-content">
          <div class="page-content">
            <div class="content-wrapper">
              <router-view :key="$route.fullPath" />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const leftDrawerOpen = ref(true)
const miniState = ref(false)
const activeMenu = ref(null)
const hoverMenuActive = ref(null)
const mobileDrawerOpen = ref(false)
const isMobileView = ref(false)

let closeTimeout = null
let interval = null

// ======================
// DETECT MOBILE VIEW
// ======================
const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 1024
  if (!isMobileView.value) {
    mobileDrawerOpen.value = false
  }
}

// ======================
// ROUTE ACTIVE
// ======================
const isActiveRoute = (path) => {
  return route.path === path
}

const expireDateFormatted = ref('')

// ======================
// HOVER MENU CONTROL
// ======================
const openHoverMenu = (menu) => {
  if (closeTimeout) clearTimeout(closeTimeout)
  hoverMenuActive.value = menu
}

const closeHoverMenuWithDelay = (menu) => {
  closeTimeout = setTimeout(() => {
    if (hoverMenuActive.value === menu) {
      hoverMenuActive.value = null
    }
  }, 150)
}

const cancelCloseHoverMenu = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const closeHoverMenu = (menu) => {
  if (hoverMenuActive.value === menu) {
    hoverMenuActive.value = null
  }
}

// ======================
// DRAWER CONTROL
// ======================
const toggleDrawer = () => {
  miniState.value = !miniState.value
  if (!miniState.value) {
    leftDrawerOpen.value = true
  }
}

const handleDrawerChange = (val) => {
  if (!val && miniState.value) {
    miniState.value = false
  }
}

const toggleMobileDrawer = () => {
  mobileDrawerOpen.value = !mobileDrawerOpen.value
}

const toggleMobileOptions = () => {
  // Handled by q-menu
}

// ======================
// MENU CONTROL
// ======================
const toggleSubmenu = (menu) => {
  activeMenu.value = activeMenu.value === menu ? null : menu
}

const navigateTo = (path) => {
  router.push(path)
  if (isMobileView.value) {
    mobileDrawerOpen.value = false
  }
}

// ======================
// CAPTCHA TIMER
// ======================
const timeLeft = ref('calculando...')

const updateTimer = () => {
  const expire = localStorage.getItem('captcha_expire')

  if (!expire) {
    timeLeft.value = 'sem sessão ativa'
    expireDateFormatted.value = ''
    return
  }

  const expireTime = Number(expire)
  const diff = expireTime - Date.now()

  if (diff <= 0) {
    timeLeft.value = 'expirada'
    expireDateFormatted.value = ''
    localStorage.removeItem('captcha_expire')
    return
  }

  const date = new Date(expireTime)
  expireDateFormatted.value = date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  timeLeft.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}

// ======================
// TIMER LIFECYCLE
// ======================
onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
  updateTimer()
  interval = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
  if (interval) clearInterval(interval)
  if (closeTimeout) clearTimeout(closeTimeout)
})

const isCaptcha = computed(() => route.path === '/captcha')

watch(
  isCaptcha,
  (val) => {
    if (val && !isMobileView.value) {
      miniState.value = true
      leftDrawerOpen.value = true
    }
  },
  { immediate: true }
)

// ======================
// MENU AUTO EXPAND BASED ON ROUTE
// ======================
watch(
  () => route.path,
  (newPath) => {
    if (!isMobileView.value) {
      if (['/dashboard', '/fonte-publica', '/dados'].includes(newPath)) {
        activeMenu.value = 'dashboard'
      } else if (['/verbas-por-municipio', '/repasses-auxilios-pnae', '/evolucao-2-anos'].includes(newPath)) {
        activeMenu.value = 'financiamento'
      } else if (['/capacidade-por-municipio', '/associacoes-cooperativas', '/assistencia-tecnica'].includes(newPath)) {
        activeMenu.value = 'capacidade'
      } else if (['/dependencia-agricultura', '/secretaria-especifica', '/populacao-demanda', '/agricultores-ativos-mt'].includes(newPath)) {
        activeMenu.value = 'indicadores'
      } else if (['/cumprimento-pnae', '/escolas-beneficiadas'].includes(newPath)) {
        activeMenu.value = 'pnae'
      } else if (['/ods2-fome-zero', '/ods3-saude-bem-estar', '/ods4-educacao-qualidade'].includes(newPath)) {
        activeMenu.value = 'ods'
      } else if (['/relatorios', '/analise-proximos-meses', '/infraestrutura', '/integracao-automatica'].includes(newPath)) {
        activeMenu.value = 'portal'
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* Cores dos ícones - SEM ALTERAÇÕES */
.dashboard-color :deep(.q-icon) { color: #1976d2 !important; }
.financiamento-color :deep(.q-icon) { color: #2e7d32 !important; }
.capacidade-color :deep(.q-icon) { color: #f57c00 !important; }
.indicadores-color :deep(.q-icon) { color: #7b1fa2 !important; }
.pnae-color :deep(.q-icon) { color: #c62828 !important; }
.ods-color :deep(.q-icon) { color: #00838f !important; }
.portal-color :deep(.q-icon) { color: #455a64 !important; }

/* Sidebar Desktop - SEM ALTERAÇÕES */
.sidebar-nameless {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.sidebar-nameless:deep(.q-drawer--mini) {
  width: 100px !important;
}
.sidebar-nameless:deep(.q-drawer--mini) .q-item {
  justify-content: center;
  padding: 12px !important;
}
.sidebar-nameless:deep(.q-drawer--mini) .q-item__section--avatar {
  min-width: auto;
  margin-right: 0;
}
.sidebar-nameless:deep(.q-drawer--mini) .q-item__label {
  display: none;
}

/* Logo no modo normal - SEM ALTERAÇÕES */
.sidebar-logo {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.sidebar-logo-mini {
  padding: 16px 10px;
}
.logo-area {
  background-image: url("https://i.imgur.com/MzEVU64.png");
  background-size: cover;
  background-position: center;
  height: 40px;
  width: 100px;
  border-right: 1px solid rgb(235, 235, 235);
}
.logo-area-mini {
  background-image: url("https://i.imgur.com/7XoXkGb.png") !important;
  width: 80px !important;
  height: 50px !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  border-right: none !important;
}

/* Menu flutuante (hover) - SEM ALTERAÇÕES */
.hover-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 200px;
  z-index: 2000;
}
.hover-menu .q-item {
  padding: 8px 16px;
  font-size: 0.9rem;
}
.hover-menu .q-item:hover {
  background-color: #f5f5f5;
}
.hover-menu-item-active {
  background-color: #e8e8e8 !important;
  color: #000000 !important;
  font-weight: 500;
}
.menu-hover-container {
  display: inline-block;
  width: 100%;
}

/* Rodapé Desktop - SEM ALTERAÇÕES */
.info-mini {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 1em;
  color: gray;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
}
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.info {
  padding: 1.5em;
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
.logo-text-mobile {
  font-size: 15px;
  font-weight: normal;
  background: linear-gradient(135deg, #363636 0%, #0130ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
  line-height: 1.3;
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
}
.sidebar-nameless:deep(.q-drawer--mini) .logo-text {
  display: none !important;
}
.toggle-icon-container {
  position: absolute;
  right: -12px;
  top: 30px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.close-nav-icon {
  font-size: 20px;
  color: #666;
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
.sidebar-menu {
  flex: 1;
  padding: 0.8em;
}
.menu-section {
  margin-bottom: 4px;
}
.menu-expansion-header {
  margin: 0 8px;
  border-radius: 10px;
  color: #494949;
  transition: all 0.2s ease;
}
.menu-expansion-header:hover {
  background-color: #f7f7f7;
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
  padding-left: 48px !important;
}
.menu-item:hover {
  background-color: #f5f5f5;
}
.menu-item-active {
  background-color: #e8e8e8 !important;
  color: #000000 !important;
  font-weight: 500;
}
.main-content {
  background: #f8f9fa;
  min-height: 100vh;
}
.page-content {
  padding: 24px;
  min-height: calc(100vh - 60px);
}
.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
}

/* Media Queries Desktop - SEM ALTERAÇÕES */
@media (max-width: 768px) {
  .sidebar-nameless { width: 260px !important; }
  .page-content { padding: 16px; }
  .logo-text { font-size: 11px; max-width: 140px; }
  .logo-container { gap: 8px; }
}
@media (min-width: 1024px) {
  .content-wrapper { max-width: 100%; }
}
@media (min-width: 1400px) {
  .content-wrapper { max-width: 1400px; }
}
.sidebar-menu :deep(.q-scrollarea__content) {
  scrollbar-width: thin;
}
.sidebar-menu :deep(.q-scrollarea__content::-webkit-scrollbar-thumb) {
  background: #cbd5e0;
  border-radius: 4px;
}

/* ====================== */
/* NAVBAR RESPONSIVO NO TOPO */
/* ====================== */
.responsive-navbar {
  min-height: 50px;
  padding: 0 12px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.mobile-menu-btn {
  color: #494949;
}

.mobile-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mobile-logo-link {
  text-decoration: none;
}

.mobile-logo-area {
  background-image: url("https://i.imgur.com/MzEVU64.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
      height: 75px;
    width: 100px;
}

/* Mobile Sidebar */
.mobile-sidebar {
  background: white;
}

.mobile-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.mobile-sidebar-logo {
  display: flex;
  align-items: center;
}

.mobile-logo-area-sidebar {
  background-image: url("https://i.imgur.com/MzEVU64.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 40px;
  width: 100px;
  display: none;
}

.mobile-sidebar-menu {
  height: calc(100% - 120px);
}

.mobile-menu-item {
  margin: 4px 8px;
  border-radius: 8px;
}

.mobile-menu-item :deep(.q-item) {
  border-radius: 8px;
}

.mobile-menu-item :deep(.q-expansion-item__container) {
  background: transparent;
}

.mobile-sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 0.7rem;
  color: gray;
  background: white;
}

.mobile-version-info {
  margin-top: 8px;
  font-size: 0.65rem;
}

/* Ajuste para telas muito pequenas */
@media (max-width: 480px) {
  .responsive-navbar {
    padding: 0 8px;
  }

  .mobile-logo-area {
    width: 70px;
    height: 30px;
  }

  .mobile-logo-area-sidebar {
    width: 80px;
    height: 35px;
  }
}
</style>
