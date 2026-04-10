<template>
  <q-layout view="hHh Lpr lFf" style="font-family: 'Ubuntu', sans-serif;">
    <!-- NAVBAR APRIMORADA -->
    <q-header elevated class="bg-green-9 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="text-white">
          <q-tooltip>Abrir/fechar painel lateral</q-tooltip>
        </q-btn>

        <q-toolbar-title class="text-weight">
          <q-icon name="forest" class="q-mr-sm" />
          SAF Monitor - Análise de Sistemas Agroflorestais em MT
          <q-badge color="yellow-8" text-color="black" class="q-ml-sm">MESTRADO</q-badge>
        </q-toolbar-title>

        <!-- BARRA DE PESQUISA -->
        <q-input
          dense
          dark
          borderless
          v-model="searchQuery"
          placeholder="Buscar cidade, rio ou coordenadas..."
          class="q-mx-md"
          style="width: 350px"
          @keyup.enter="searchLocation"
        >
          <template v-slot:append>
            <q-btn flat dense round icon="search" @click="searchLocation">
              <q-tooltip>Pesquisar localização</q-tooltip>
            </q-btn>
          </template>

        </q-input>

        <!-- FERRAMENTAS DE DEMARCAÇÃO -->
        <q-btn
          dense
          flat
          :color="drawingMode ? 'yellow' : 'white'"
          :icon="drawingMode ? 'edit' : 'edit_location'"
          @click="toggleDrawingMode"
        >
          <q-tooltip>{{ drawingMode ? 'Sair do modo de desenho (mantém desenho)' : 'Ativar modo de desenho (clique para marcar pontos)' }}</q-tooltip>
        </q-btn>

        <q-btn
          dense
          flat
          icon="undo"
          :disable="!drawingPoints.length"
          @click="undoLastPoint"
        >
          <q-tooltip>Desfazer último ponto</q-tooltip>
        </q-btn>

        <q-btn
          dense
          flat
          icon="check"
          :disable="drawingPoints.length < 3"
          @click="completeDrawing"
          color="white"
        >
          <q-tooltip>Finalizar polígono</q-tooltip>
        </q-btn>

        <q-btn
          dense
          flat
          icon="delete"
          @click="clearDrawings"
        >
          <q-tooltip>Limpar todos os desenhos</q-tooltip>
        </q-btn>

        <!-- BOTÕES DE INFORMAÇÃO -->
        <q-btn dense flat icon="satellite_alt" @click="satelliteDialog = true">
          <q-tooltip>Fontes de satélite</q-tooltip>
        </q-btn>

        <q-btn dense flat icon="layers" @click="layerDialog = true">
          <q-tooltip>Camadas temáticas</q-tooltip>
        </q-btn>

        <q-btn dense flat icon="analytics" @click="showAreaAnalysis">
          <q-tooltip>Analisar área selecionada</q-tooltip>
        </q-btn>

        <q-btn dense flat icon="save" @click="saveArea">
          <q-tooltip>Salvar área demarcada</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- DRAWER LATERAL ESQUERDO -->
    <q-drawer v-model="leftDrawerOpen" bordered :width="420" side="left">
      <q-scroll-area style="height: calc(100vh - 50px)">
        <q-list padding>
          <!-- INFORMAÇÕES DA ÁREA SELECIONADA -->
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="info" class="q-mr-sm" />
            Informações da Área
          </q-item-label>

          <q-item v-if="selectedArea">
            <q-item-section>
              <q-item-label class="text-h6 text-black">{{ selectedArea.name }}</q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="place" size="xs" /> Centro: {{ selectedArea.center?.lat?.toFixed(6) || 'N/A' }}, {{ selectedArea.center?.lng?.toFixed(6) || 'N/A' }}
              </q-item-label>
              <q-item-label caption class="text-grey-8 q-mt-xs">
                <q-icon name="square_foot" size="xs" /> Área: {{ selectedArea.area?.toFixed(2) || '0' }} ha
              </q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="timeline" size="xs" /> Perímetro: {{ selectedArea.perimeter?.toFixed(2) || '0' }} m
              </q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="location_on" size="xs" /> {{ selectedArea.address || 'Local não identificado' }}
              </q-item-label>
              <q-btn
                flat
                color="green-9"
                icon="analytics"
                label="Analisar Área"
                class="q-mt-md full-width"
                @click="showAreaAnalysis"
              />
            </q-item-section>
          </q-item>

          <q-item v-else>
            <q-item-section>
              <q-item-label class="text-grey-7">Nenhuma área selecionada</q-item-label>
              <q-item-label caption>Ative o modo de desenho e clique no mapa para marcar pontos</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- MODO DE DESENHO -->
          <q-item-label v-if="drawingMode" header class="text-orange-8 text-weight-bold">
            <q-icon name="edit" class="q-mr-sm" />
            Modo de Desenho Ativo
          </q-item-label>

          <q-item v-if="drawingMode">
            <q-item-section>
              <q-item-label class="text-black">Pontos marcados: {{ drawingPoints.length }}</q-item-label>
              <q-item-label caption>Clique no mapa para adicionar pontos. Mínimo de 3 pontos para finalizar.</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- MÉTRICAS DETALHADAS -->
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="equalizer" class="q-mr-sm" />
            Índices de Vegetação
          </q-item-label>

          <q-item v-for="(value, name) in metrics" :key="name">
            <q-item-section>
              <q-item-label class="text-black">
                {{ name }}
                <q-badge :color="getMetricColor(value)" class="q-ml-sm" :label="getMetricStatus(value)" />
              </q-item-label>
              <q-linear-progress
                :value="value / 1"
                :color="getMetricColor(value)"
                rounded
                size="20px"
                class="q-mt-xs"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="black" :label="value.toFixed(3)" />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- CLASSIFICAÇÃO DE COBERTURA -->
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="pie_chart" class="q-mr-sm" />
            Cobertura do Solo
          </q-item-label>

          <q-item v-for="item in landCover" :key="item.type">
            <q-item-section>
              <q-item-label class="text-black">{{ item.type }}</q-item-label>
              <q-linear-progress :value="item.percentage / 100" :color="item.color" rounded size="20px">
                <div class="absolute-full flex flex-center text-white text-caption text-weight-bold">
                  {{ item.percentage }}%
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- SAFs DETECTADOS NA ÁREA -->
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="park" class="q-mr-sm" />
            SAFs na Área ({{ detectedSAFs.length }})
          </q-item-label>

          <q-item
            v-for="saf in detectedSAFs"
            :key="saf.id"
            clickable
            @click="focusOnSAF(saf)"
            class="cursor-pointer"
          >
            <q-item-section>
              <q-item-label class="text-black">{{ saf.name }}</q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="square_foot" size="xs" /> {{ saf.area.toFixed(2) }} ha |
                <q-icon name="grass" size="xs" /> {{ saf.productivity.toFixed(1) }} t/ha
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                :color="getProductivityColor(saf.productivityLevel)"
                text-color="white"
                size="sm"
              >
                {{ saf.productivityLevel }}
              </q-chip>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- DADOS AMBIENTAIS -->
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="cloud" class="q-mr-sm" />
            Dados Ambientais
          </q-item-label>

          <q-item>
            <q-item-section>
              <q-item-label class="text-black">Temperatura Média</q-item-label>
              <q-item-label caption class="text-h6 text-grey-8">{{ weather.temperature }}°C</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="thermostat" color="red" size="md" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-black">Precipitação Anual</q-item-label>
              <q-item-label caption class="text-h6 text-grey-8">{{ weather.rainfall }} mm</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="water_drop" color="blue" size="md" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-black">Altitude Média</q-item-label>
              <q-item-label caption class="text-h6 text-grey-8">{{ weather.elevation }} m</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="terrain" color="brown" size="md" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-black">Umidade do Solo</q-item-label>
              <q-item-label caption class="text-h6 text-grey-8">{{ weather.soilMoisture }}%</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="opacity" color="light-blue" size="md" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- DRAWER DIREITO PARA ÁREAS SALVAS -->
    <q-drawer v-model="rightDrawerOpen" bordered :width="320" side="right">
      <q-scroll-area style="height: calc(100vh - 50px)">
        <q-list padding>
          <q-item-label header class="text-green-9 text-weight-bold">
            <q-icon name="bookmark" class="q-mr-sm" />
            Áreas Salvas ({{ savedAreas.length }})
          </q-item-label>

          <q-item v-for="(area, index) in savedAreas" :key="index" class="q-mb-sm">
            <q-item-section>
              <q-item-label class="text-black text-weight-bold">{{ area.name }}</q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="square_foot" size="xs" /> {{ area.area.toFixed(2) }} ha
              </q-item-label>
              <q-item-label caption class="text-grey-8">
                <q-icon name="timeline" size="xs" /> {{ area.perimeter.toFixed(2) }} m
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="visibility" color="green-9" size="sm" @click="focusOnSavedArea(area)">
                <q-tooltip>Centralizar nesta área</q-tooltip>
              </q-btn>
              <q-btn flat round icon="analytics" color="orange" size="sm" @click="analyzeSavedArea(area)">
                <q-tooltip>Analisar esta área</q-tooltip>
              </q-btn>
              <q-btn flat round icon="delete" color="red" size="sm" @click="deleteArea(index)">
                <q-tooltip>Remover área</q-tooltip>
              </q-btn>
              <q-btn flat round icon="download" color="blue" size="sm" @click="exportAreaToExcel(area)">
                <q-tooltip>Exportar para Excel</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item v-if="savedAreas.length === 0">
            <q-item-section>
              <q-item-label class="text-grey-7 text-center">Nenhuma área salva</q-item-label>
              <q-item-label caption class="text-center">Desenhe uma área e clique em salvar</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- MAPA PRINCIPAL -->
    <q-page-container>
      <q-page class="relative-position">
        <div id="map" class="map"></div>

        <!-- CONTROLES DO MAPA -->
        <div class="absolute-top-right q-pa-md" style="z-index: 1000;">
          <q-btn-group class="bg-white shadow-3">
            <q-btn icon="zoom_in" @click="zoomIn">
              <q-tooltip>Aumentar zoom</q-tooltip>
            </q-btn>
            <q-btn icon="zoom_out" @click="zoomOut">
              <q-tooltip>Diminuir zoom</q-tooltip>
            </q-btn>
            <q-btn icon="my_location" @click="getCurrentLocation">
              <q-tooltip>Minha localização</q-tooltip>
            </q-btn>
            <q-btn icon="menu_open" @click="rightDrawerOpen = !rightDrawerOpen">
              <q-tooltip>Áreas salvas</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <!-- LEGENDA -->
        <div class="absolute-bottom-left q-pa-md" style="z-index: 1000; max-width: 280px;">
          <q-card bordered class="bg-white">
            <q-card-section class="q-pa-sm">
              <div class="text-caption text-weight-bold text-green-9 flex items-center">
                <q-icon name="legend_toggle" class="q-mr-sm" /> LEGENDA
              </div>
              <div class="row q-col-gutter-sm q-mt-xs">
                <div class="col-6" v-for="item in legendItems" :key="item.label">
                  <div class="row items-center">
                    <div :style="{backgroundColor: item.color, width: '14px', height: '14px'}" class="rounded-sm"></div>
                    <div class="q-ml-xs text-caption text-black">{{ item.label }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- COORDENADAS DO MOUSE E STATUS -->
        <div class="coords">
          <q-icon name="location_on" size="14px" class="q-mr-xs" />
          Lat: {{ mouseLat.toFixed(6) }} | Lng: {{ mouseLng.toFixed(6) }}
          <q-badge v-if="drawingMode" color="orange" class="q-ml-sm">
            <q-icon name="edit" size="12px" class="q-mr-xs" />
            Pontos: {{ drawingPoints.length }}
          </q-badge>
          <q-badge v-if="selectedArea && !drawingMode" color="green" class="q-ml-sm">
            <q-icon name="check_circle" size="12px" class="q-mr-xs" />
            Área selecionada
          </q-badge>
        </div>
      </q-page>
    </q-page-container>

    <!-- DIALOG DE FONTES -->
    <q-dialog v-model="satelliteDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="bg-green-9 text-white">
          <div class="text-h6 flex items-center">
            <q-icon name="satellite" class="q-mr-sm" /> Fontes de Satélite
          </div>
        </q-card-section>

        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="source in satelliteSources" :key="source.name" clickable @click="changeSatellite(source)">
              <q-item-section avatar>
                <q-radio v-model="currentSatellite" :val="source.name" color="green-9" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black text-weight-bold">{{ source.name }}</q-item-label>
                <q-item-label caption>{{ source.description }}</q-item-label>
                <q-item-label caption class="text-grey-7">Resolução: {{ source.resolution }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="source.active ? 'green-9' : 'grey-6'">
                  {{ source.active ? 'Ativo' : 'Inativo' }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="green-9" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG DE CAMADAS -->
    <q-dialog v-model="layerDialog">
      <q-card style="min-width: 450px">
        <q-card-section class="bg-green-9 text-white">
          <div class="text-h6 flex items-center">
            <q-icon name="layers" class="q-mr-sm" /> Camadas Temáticas
          </div>
        </q-card-section>

        <q-card-section>
          <q-list bordered>
            <q-item v-for="layer in availableLayers" :key="layer.name">
              <q-item-section>
                <q-item-label class="text-black text-weight-bold">{{ layer.name }}</q-item-label>
                <q-item-label caption>{{ layer.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="layer.visible"
                  color="green-9"
                  @update:model-value="toggleLayer(layer)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="green-9" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG DE ANÁLISE DA ÁREA -->
    <q-dialog v-model="analysisDialog" maximized persistent>
      <q-card>
        <q-card-section class="bg-green-9 text-white">
          <div class="text-h5 flex items-center justify-between">
            <div class="flex items-center">
              <q-icon name="analytics" class="q-mr-sm" size="md" />
              Análise Técnica: {{ analysisData?.name || selectedArea?.name || 'Área Selecionada' }}
            </div>
            <q-btn flat round icon="close" v-close-popup class="text-white" />
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Coluna 1: Informações Básicas -->
            <div class="col-4">
              <q-card bordered flat>
                <q-card-section class="bg-green-1">
                  <div class="text-h6 text-green-9 flex items-center">
                    <q-icon name="info" class="q-mr-sm" /> Informações da Área
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Nome</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ analysisData?.name || selectedArea?.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Área Total</q-item-label>
                        <q-item-label class="text-h5 text-green-9">{{ (analysisData?.area || selectedArea?.area || 0).toFixed(2) }} ha</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Perímetro</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ (analysisData?.perimeter || selectedArea?.perimeter || 0).toFixed(2) }} m</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Localização</q-item-label>
                        <q-item-label class="text-black">{{ analysisData?.address || selectedArea?.address || 'Não identificado' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Coordenadas</q-item-label>
                        <q-item-label class="text-black">
                          Lat: {{ (analysisData?.center?.lat || selectedArea?.center?.lat || 0).toFixed(6) }}<br>
                          Lng: {{ (analysisData?.center?.lng || selectedArea?.center?.lng || 0).toFixed(6) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>

              <q-card bordered flat class="q-mt-md">
                <q-card-section class="bg-green-1">
                  <div class="text-h6 text-green-9 flex items-center">
                    <q-icon name="cloud" class="q-mr-sm" /> Condições Ambientais
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Temperatura Média</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ analysisData?.weather?.temperature || weather.temperature }}°C</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Precipitação Anual</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ analysisData?.weather?.rainfall || weather.rainfall }} mm</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Altitude Média</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ analysisData?.weather?.elevation || weather.elevation }} m</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Umidade do Solo</q-item-label>
                        <q-item-label class="text-h6 text-black">{{ analysisData?.weather?.soilMoisture || weather.soilMoisture }}%</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Coluna 2: Índices e Cobertura -->
            <div class="col-4">
              <q-card bordered flat>
                <q-card-section class="bg-green-1">
                  <div class="text-h6 text-green-9 flex items-center">
                    <q-icon name="equalizer" class="q-mr-sm" /> Índices de Vegetação
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-list dense>
                    <q-item v-for="(value, name) in analysisData?.metrics || metrics" :key="name">
                      <q-item-section>
                        <q-item-label class="text-grey-7">{{ name }}</q-item-label>
                        <q-linear-progress
                          :value="value / 1"
                          :color="getMetricColor(value)"
                          rounded
                          size="25px"
                          class="q-mt-xs"
                        >
                          <div class="absolute-full flex flex-center">
                            <q-badge color="white" text-color="black" :label="value.toFixed(3)" />
                          </div>
                        </q-linear-progress>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>

              <q-card bordered flat class="q-mt-md">
                <q-card-section class="bg-green-1">
                  <div class="text-h6 text-green-9 flex items-center">
                    <q-icon name="pie_chart" class="q-mr-sm" /> Cobertura do Solo
                  </div>
                </q-card-section>
                <q-card-section>
                  <apexchart type="pie" :options="pieOptions" :series="analysisData?.pieSeries || pieSeries" height="250" />
                  <q-list dense class="q-mt-md">
                    <q-item v-for="item in analysisData?.landCover || landCover" :key="item.type">
                      <q-item-section>
                        <q-item-label class="text-grey-7">{{ item.type }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge :color="item.color" :label="item.percentage + '%'" class="q-px-md q-py-xs" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Coluna 3: Predições e Recomendações -->
            <div class="col-4">
              <q-card bordered flat>
                <q-card-section class="bg-green-1">
                  <div class="text-h6 text-green-9 flex items-center">
                    <q-icon name="trending_up" class="q-mr-sm" /> Predição de Produtividade
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Produtividade Atual</q-item-label>
                        <q-item-label class="text-h4 text-green-9">{{ analysisData?.currentProductivity || calculateCurrentProductivity().toFixed(1) }} t/ha</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-grey-7">Produtividade Prevista (12 meses)</q-item-label>
                        <q-item-label class="text-h4 text-orange-8">{{ analysisData?.predictedProductivity || (calculateCurrentProductivity() * 1.15).toFixed(1) }} t/ha</q-item-label>
                        <q-item-label caption class="text-green-9">+15% de aumento potencial</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <apexchart type="line" :options="chartOptions" :series="analysisData?.ndviSeries || ndviSeries" height="200" class="q-mt-md" />

                  <q-separator class="q-my-md" />

                  <div class="text-subtitle1 text-green-9 flex items-center">
                    <q-icon name="lightbulb" class="q-mr-sm" /> Recomendações Técnicas
                  </div>

                  <q-list bordered class="q-mt-sm">
                    <q-item v-for="(rec, index) in analysisData?.recommendations || getRecommendations()" :key="index">
                      <q-item-section avatar>
                        <q-icon :name="rec.icon" :color="rec.color" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-black">{{ rec.text }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Fechar" color="grey-7" v-close-popup />
          <q-btn flat label="Exportar para Excel" color="green-9" icon="download" @click="exportAnalysisToExcel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG PARA SALVAR ÁREA -->
    <q-dialog v-model="saveAreaDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-green-9 text-white">
          <div class="text-h6 flex items-center">
            <q-icon name="save" class="q-mr-sm" /> Salvar Área Demarcada
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newAreaName"
            label="Nome da área *"
            dense
            autofocus
            :rules="[val => !!val || 'Nome é obrigatório']"
            class="q-mb-md"
          />

          <div class="bg-grey-2 q-pa-md rounded-borders">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <div class="text-caption text-grey-7">Área</div>
                <div class="text-h6 text-black">{{ selectedArea?.area?.toFixed(2) || '0' }} ha</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-7">Perímetro</div>
                <div class="text-h6 text-black">{{ selectedArea?.perimeter?.toFixed(2) || '0' }} m</div>
              </div>
              <div class="col-12">
                <div class="text-caption text-grey-7">Localização</div>
                <div class="text-body2 text-black">{{ selectedArea?.address || 'Não identificado' }}</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Salvar" color="green-9" @click="confirmSaveArea" v-close-popup />
          <q-btn flat label="Salvar e Analisar" color="green-9" @click="confirmSaveAndAnalyze" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG DE CONFIRMAÇÃO -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-green-9 text-white">
          <div class="text-h6 flex items-center">
            <q-icon name="check_circle" class="q-mr-sm" /> {{ confirmTitle }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-body1 text-black">{{ confirmMessage }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="green-9" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref, onMounted, reactive } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"
import VueApexCharts from "vue3-apexcharts"
import * as XLSX from 'xlsx'

export default {
  name: "SAFMonitor",
  components: {
    apexchart: VueApexCharts
  },

  setup() {
    // Estados dos drawers
    const leftDrawerOpen = ref(true)
    const rightDrawerOpen = ref(false)

    // Estados dos diálogos
    const satelliteDialog = ref(false)
    const layerDialog = ref(false)
    const metricsDialog = ref(false)
    const saveAreaDialog = ref(false)
    const analysisDialog = ref(false)
    const confirmDialog = ref(false)
    const confirmTitle = ref("")
    const confirmMessage = ref("")

    // Estados do mapa
    const map = ref(null)
    const mouseLat = ref(-11.8)
    const mouseLng = ref(-55.5)
    const searchQuery = ref("")
    const drawingMode = ref(false)
    const drawingPoints = ref([])
    const selectedArea = ref(null)
    const savedAreas = ref([])
    const newAreaName = ref("")
    const analysisData = ref(null)
    const finalPolygon = ref(null)

    // Elementos do mapa
    let markerLayer = null
    let polygonLayer = null
    let currentPolygon = null
    let markers = []

    // Camadas adicionais
    let safLayer = null
    let landUseLayer = null
    let fireLayer = null

    // Fontes de satélite
    const currentSatellite = ref("ESRI World Imagery")
    const satelliteSources = ref([
      {
        name: "ESRI World Imagery",
        description: "Alta resolução - Ideal para visualização geral",
        resolution: "0.3m - 1m",
        active: true,
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      },
      {
        name: "Sentinel-2 L2A",
        description: "10m - Multiespectral, ideal para índices de vegetação",
        resolution: "10m",
        active: false,
        url: "https://tiles.maps.eox.at/wmts/1.0.0/s2a_l2a/default/g/{z}/{y}/{x}.jpg"
      },
      {
        name: "Google Satellite",
        description: "Satélite Google Maps - Alta resolução",
        resolution: "0.5m - 1m",
        active: false,
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      },
      {
        name: "OpenStreetMap",
        description: "Mapa base vetorial",
        resolution: "Vetorial",
        active: false,
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      }
    ])

    // Camadas disponíveis
    const availableLayers = ref([
      {
        name: "Classificação SAF",
        description: "Sistemas Agroflorestais detectados",
        visible: true,
        layer: null,
        icon: "park"
      },
      {
        name: "Uso do Solo",
        description: "Classificação de cobertura do solo",
        visible: false,
        layer: null,
        icon: "map"
      },
      {
        name: "Focos de Calor",
        description: "Monitoramento de queimadas",
        visible: false,
        layer: null,
        icon: "whatshot"
      }
    ])

    // Métricas
    const metrics = reactive({
      NDVI: 0.72,
      EVI: 0.56,
      SAVI: 0.58,
      NDMI: 0.31
    })

    // Cobertura do solo
    const landCover = ref([
      { type: "Floresta Densa", percentage: 45, color: "green-9" },
      { type: "SAF/Agricultura", percentage: 30, color: "green-6" },
      { type: "Pastagem", percentage: 15, color: "orange-8" },
      { type: "Solo Exposto", percentage: 5, color: "brown-7" },
      { type: "Água", percentage: 5, color: "blue-6" }
    ])

    // SAFs detectados
    const detectedSAFs = ref([
      {
        id: 1,
        name: "SAF Rio Verde - Sinop",
        area: 2.4,
        productivity: 3.2,
        productivityLevel: "Alta",
        lat: -11.85,
        lng: -55.45,
        description: "Sistema agroflorestal com cacau e banana"
      },
      {
        id: 2,
        name: "SAF Cacau Amazônico - Sorriso",
        area: 5.1,
        productivity: 2.8,
        productivityLevel: "Média",
        lat: -12.02,
        lng: -55.72,
        description: "Cultivo de cacau sob sombra de árvores nativas"
      },
      {
        id: 3,
        name: "SAF Mandioca-Babaçu - Cláudia",
        area: 1.8,
        productivity: 4.1,
        productivityLevel: "Alta",
        lat: -11.48,
        lng: -55.32,
        description: "Consórcio de mandioca com babaçu"
      },
      {
        id: 4,
        name: "SAF Cupuaçu - Alta Floresta",
        area: 2.7,
        productivity: 3.5,
        productivityLevel: "Alta",
        lat: -9.92,
        lng: -56.08,
        description: "Cupuaçu com espécies florestais nativas"
      },
      {
        id: 5,
        name: "SAF Recuperação - Colíder",
        area: 3.2,
        productivity: 1.5,
        productivityLevel: "Baixa",
        lat: -10.78,
        lng: -55.45,
        description: "Área em processo de recuperação com espécies nativas"
      }
    ])

    // Dados climáticos
    const weather = reactive({
      temperature: 24.5,
      rainfall: 1950,
      elevation: 420,
      soilMoisture: 62
    })

    // Legenda
    const legendItems = ref([
      { color: "#2e7d32", label: "Floresta Densa" },
      { color: "#4caf50", label: "SAF Alta Prod." },
      { color: "#ffb74d", label: "SAF Média Prod." },
      { color: "#ef5350", label: "SAF Baixa Prod." },
      { color: "#42a5f5", label: "Corpos d'água" }
    ])

    // Configurações dos gráficos
    const chartOptions = ref({
      chart: {
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      xaxis: {
        categories: ["Jan/24", "Mar", "Mai", "Jul", "Set", "Nov", "Jan/25", "Mar", "Mai", "Jul", "Set", "Nov"],
        labels: { style: { colors: "#000" } }
      },
      yaxis: {
        labels: { style: { colors: "#000" } },
        min: 0.4,
        max: 0.9
      },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#2e7d32"],
      grid: { borderColor: "#e0e0e0" }
    })

    const ndviSeries = ref([{
      name: "NDVI",
      data: [0.65, 0.68, 0.72, 0.75, 0.73, 0.7, 0.68, 0.72, 0.76, 0.74, 0.71, 0.69]
    }])

    const pieOptions = ref({
      chart: { type: "pie" },
      labels: ["Floresta", "SAF", "Pastagem", "Solo", "Água"],
      colors: ["#2e7d32", "#4caf50", "#ffb74d", "#bcaaa4", "#42a5f5"],
      dataLabels: { style: { colors: ["#fff"] } },
      legend: { position: "bottom" }
    })

    const pieSeries = ref([45, 30, 15, 5, 5])

    // Funções de utilidade
    const getMetricColor = (value) => {
      if (value > 0.7) return "green-9"
      if (value > 0.5) return "green-6"
      if (value > 0.3) return "orange-8"
      return "red-7"
    }

    const getMetricStatus = (value) => {
      if (value > 0.7) return "Excelente"
      if (value > 0.5) return "Bom"
      if (value > 0.3) return "Regular"
      return "Ruim"
    }

    const getProductivityColor = (level) => {
      switch(level) {
        case "Alta": return "green-9"
        case "Média": return "orange-8"
        case "Baixa": return "red-7"
        default: return "grey-7"
      }
    }

    const calculateCurrentProductivity = () => {
      return (metrics.NDVI * 4.5 + weather.soilMoisture * 0.02).toFixed(1) * 1
    }

    const getRecommendations = () => {
      const recommendations = []
      if (metrics.NDVI < 0.5) {
        recommendations.push({
          icon: "spa",
          color: "green-9",
          text: "Recomenda-se plantio de espécies nativas para recuperação"
        })
      }
      if (metrics.NDMI < 0.4) {
        recommendations.push({
          icon: "water_drop",
          color: "blue",
          text: "Irrigação complementar recomendada devido à baixa umidade"
        })
      }
      if (weather.soilMoisture < 50) {
        recommendations.push({
          icon: "opacity",
          color: "light-blue",
          text: "Sistema de irrigação por gotejamento pode aumentar produtividade"
        })
      }
      if (detectedSAFs.value.length > 0) {
        recommendations.push({
          icon: "park",
          color: "green-9",
          text: "Integrar com SAFs existentes na região para otimizar recursos"
        })
      }
      if (recommendations.length === 0) {
        recommendations.push({
          icon: "check_circle",
          color: "green-9",
          text: "Condições ideais para SAF. Manter manejo atual."
        })
      }
      return recommendations
    }

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    // Inicialização do mapa
    const initMap = () => {
      map.value = L.map("map", {
        zoomControl: false
      }).setView([-11.8, -55.5], 7)

      L.tileLayer(satelliteSources.value[0].url, {
        maxZoom: 19,
        attribution: "© ESRI, Maxar, Earthstar Geographics"
      }).addTo(map.value)

      markerLayer = L.layerGroup().addTo(map.value)
      polygonLayer = L.layerGroup().addTo(map.value)

      map.value.on("mousemove", (e) => {
        mouseLat.value = e.latlng.lat
        mouseLng.value = e.latlng.lng
      })

      map.value.on("click", (e) => {
        if (drawingMode.value) {
          addDrawingPoint(e.latlng)
        }
      })

      loadSAFs()
    }

    // Funções de desenho
    const toggleDrawingMode = () => {
      drawingMode.value = !drawingMode.value
    }

    const addDrawingPoint = (latlng) => {
      drawingPoints.value.push(latlng)

      const marker = L.marker(latlng, {
        icon: L.divIcon({
          className: 'drawing-marker',
          html: '<div style="background-color: #2e7d32; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div><div style="position: absolute; top: -20px; left: 10px; background: #2e7d32; color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; white-space: nowrap;">Ponto ' + drawingPoints.value.length + '</div>',
          iconSize: [20, 20]
        })
      }).addTo(markerLayer)

      markers.push(marker)

      if (drawingPoints.value.length >= 2) {
        if (currentPolygon) {
          polygonLayer.removeLayer(currentPolygon)
        }
        currentPolygon = L.polygon(drawingPoints.value, {
          color: "#2e7d32",
          weight: 3,
          fillOpacity: 0.2,
          dashArray: "5, 5"
        }).addTo(polygonLayer)
      }
    }

    const undoLastPoint = () => {
      if (drawingPoints.value.length > 0) {
        drawingPoints.value.pop()
        const lastMarker = markers.pop()
        if (lastMarker) {
          markerLayer.removeLayer(lastMarker)
        }
        if (currentPolygon) {
          polygonLayer.removeLayer(currentPolygon)
          if (drawingPoints.value.length >= 2) {
            currentPolygon = L.polygon(drawingPoints.value, {
              color: "#2e7d32",
              weight: 3,
              fillOpacity: 0.2,
              dashArray: "5, 5"
            }).addTo(polygonLayer)
          }
        }
      }
    }

    const completeDrawing = async () => {
      if (drawingPoints.value.length < 3) {
        showConfirm("Atenção", "Mínimo de 3 pontos para criar uma área")
        return
      }

      polygonLayer.clearLayers()
      finalPolygon.value = L.polygon(drawingPoints.value, {
        color: "#2e7d32",
        weight: 4,
        fillOpacity: 0.3
      }).addTo(polygonLayer)

      const latlngs = drawingPoints.value
      const area = L.GeometryUtil.geodesicArea(latlngs) / 10000
      let perimeter = 0
      for (let i = 0; i < latlngs.length - 1; i++) {
        perimeter += latlngs[i].distanceTo(latlngs[i + 1])
      }
      perimeter += latlngs[latlngs.length - 1].distanceTo(latlngs[0])

      const bounds = L.latLngBounds(latlngs)
      const center = bounds.getCenter()
      const address = await reverseGeocode(center.lat, center.lng)

      selectedArea.value = {
        name: `Área ${savedAreas.value.length + 1}`,
        area: area,
        perimeter: perimeter,
        center: center,
        points: [...drawingPoints.value],
        address: address,
        polygon: finalPolygon.value
      }

      updateMetricsForArea(center.lat, center.lng)

      markerLayer.clearLayers()
      drawingPoints.value = []
      markers = []
      currentPolygon = null
      drawingMode.value = false

      showConfirm("Sucesso", "Área demarcada com sucesso! Clique em 'Analisar' para ver as predições.")
    }

    const clearDrawings = () => {
      markerLayer.clearLayers()
      polygonLayer.clearLayers()
      drawingPoints.value = []
      markers = []
      currentPolygon = null
      finalPolygon.value = null
      selectedArea.value = null
    }

    // Reverse geocoding
    const reverseGeocode = async (lat, lng) => {
      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: {
            lat: lat,
            lon: lng,
            format: "json"
          },
          headers: {
            "User-Agent": "SAFMonitor/1.0"
          }
        })

        if (response.data && response.data.display_name) {
          return response.data.display_name.split(",").slice(0, 3).join(",")
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error)
      }
      return "Local não identificado"
    }

    // Atualizar métricas
    const updateMetricsForArea = (lat, lng) => {
      const baseValue = 0.5 + (Math.sin(lat) * 0.2) + (Math.cos(lng) * 0.2)

      metrics.NDVI = Math.min(0.95, Math.max(0.2, baseValue + Math.random() * 0.2))
      metrics.EVI = Math.min(0.9, Math.max(0.1, baseValue * 0.8 + Math.random() * 0.15))
      metrics.SAVI = Math.min(0.9, Math.max(0.1, baseValue * 0.85 + Math.random() * 0.15))
      metrics.NDMI = Math.min(0.8, Math.max(0.1, baseValue * 0.6 + Math.random() * 0.2))

      weather.temperature = (22 + Math.random() * 5 + Math.sin(lat) * 2).toFixed(1)
      weather.rainfall = Math.round(1500 + Math.random() * 500 + Math.cos(lng) * 200)
      weather.elevation = Math.round(300 + Math.random() * 200 + Math.sin(lat) * 50)
      weather.soilMoisture = Math.round(50 + Math.random() * 30 + Math.cos(lng) * 10)
    }

    // Carregar SAFs
    const loadSAFs = () => {
      safLayer = L.layerGroup()

      detectedSAFs.value.forEach(saf => {
        const color = saf.productivityLevel === "Alta" ? "#4caf50" :
                     saf.productivityLevel === "Média" ? "#ffb74d" : "#ef5350"

        const marker = L.circleMarker([saf.lat, saf.lng], {
          radius: 12,
          fillColor: color,
          color: "#fff",
          weight: 3,
          fillOpacity: 0.9
        }).bindPopup(`
          <div style="font-family: 'Ubuntu', sans-serif; min-width: 200px;">
            <b style="color: #2e7d32; font-size: 14px;">${saf.name}</b><br>
            <i style="color: #666;">${saf.description}</i><br>
            <hr style="margin: 8px 0;">
            <div style="display: flex; justify-content: space-between;">
              <span><b>Produtividade:</b></span>
              <span style="color: ${color};">${saf.productivity} t/ha (${saf.productivityLevel})</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><b>Área:</b></span>
              <span>${saf.area} ha</span>
            </div>
            <button onclick="window.focusOnSAF(${saf.lat}, ${saf.lng})"
                    style="background:#2e7d32; color:white; border:none; padding:8px; border-radius:4px; margin-top:10px; cursor:pointer; width:100%; font-weight:bold;">
              Centralizar neste SAF
            </button>
          </div>
        `)

        marker.on('click', () => {
          focusOnSAF(saf)
        })

        safLayer.addLayer(marker)
      })

      safLayer.addTo(map.value)
      availableLayers.value.find(l => l.name === "Classificação SAF").layer = safLayer
    }

    // Focar em SAF
    const focusOnSAF = (saf) => {
      map.value.setView([saf.lat, saf.lng], 14)
      selectedArea.value = {
        name: saf.name,
        area: saf.area,
        productivity: saf.productivity,
        productivityLevel: saf.productivityLevel,
        center: { lat: saf.lat, lng: saf.lng },
        address: saf.description
      }
      updateMetricsForArea(saf.lat, saf.lng)
    }

    // Salvar área
    const saveArea = () => {
      if (selectedArea.value) {
        if (selectedArea.value.area > 0) {
          saveAreaDialog.value = true
        } else {
          showConfirm("Atenção", "A área selecionada não possui dimensões válidas para salvar.")
        }
      } else {
        showConfirm("Atenção", "Desenhe uma área primeiro!")
      }
    }

    const confirmSaveArea = () => {
      if (newAreaName.value && selectedArea.value) {
        savedAreas.value.push({
          ...selectedArea.value,
          name: newAreaName.value,
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          metrics: { ...metrics },
          weather: { ...weather },
          productivity: calculateCurrentProductivity()
        })
        newAreaName.value = ""
        showConfirm("Sucesso", "Área salva com sucesso!")
      }
    }

    const confirmSaveAndAnalyze = () => {
      confirmSaveArea()
      if (selectedArea.value) {
        prepareAnalysisData(selectedArea.value)
        analysisDialog.value = true
      }
    }

    const focusOnSavedArea = (area) => {
      if (area.points) {
        const bounds = L.latLngBounds(area.points)
        map.value.fitBounds(bounds)
        selectedArea.value = area
      } else if (area.center) {
        map.value.setView([area.center.lat, area.center.lng], 14)
        selectedArea.value = area
      }
    }

    const analyzeSavedArea = (area) => {
      focusOnSavedArea(area)
      prepareAnalysisData(area)
      analysisDialog.value = true
    }

    const deleteArea = (index) => {
      savedAreas.value.splice(index, 1)
      showConfirm("Sucesso", "Área removida com sucesso!")
    }

    // Exportar para Excel
    const exportAreaToExcel = (area) => {
      const worksheetData = [
        ['RELATÓRIO DE ANÁLISE DE ÁREA - SAF MONITOR'],
        ['Data de Exportação', new Date().toLocaleString()],
        [],
        ['INFORMAÇÕES DA ÁREA'],
        ['Nome', area.name],
        ['Área (ha)', area.area.toFixed(2)],
        ['Perímetro (m)', area.perimeter.toFixed(2)],
        ['Localização', area.address || 'N/A'],
        ['Centro (Lat)', area.center?.lat?.toFixed(6) || 'N/A'],
        ['Centro (Lng)', area.center?.lng?.toFixed(6) || 'N/A'],
        ['Data de Criação', area.date || 'N/A'],
        [],
        ['ÍNDICES DE VEGETAÇÃO'],
        ['NDVI', area.metrics?.NDVI?.toFixed(3) || metrics.NDVI.toFixed(3)],
        ['EVI', area.metrics?.EVI?.toFixed(3) || metrics.EVI.toFixed(3)],
        ['SAVI', area.metrics?.SAVI?.toFixed(3) || metrics.SAVI.toFixed(3)],
        ['NDMI', area.metrics?.NDMI?.toFixed(3) || metrics.NDMI.toFixed(3)],
        [],
        ['DADOS AMBIENTAIS'],
        ['Temperatura Média (°C)', area.weather?.temperature || weather.temperature],
        ['Precipitação Anual (mm)', area.weather?.rainfall || weather.rainfall],
        ['Altitude Média (m)', area.weather?.elevation || weather.elevation],
        ['Umidade do Solo (%)', area.weather?.soilMoisture || weather.soilMoisture],
        [],
        ['PRODUTIVIDADE'],
        ['Produtividade Atual (t/ha)', area.productivity?.toFixed(1) || calculateCurrentProductivity().toFixed(1)],
        ['Produtividade Prevista (t/ha)', (area.productivity ? area.productivity * 1.15 : calculateCurrentProductivity() * 1.15).toFixed(1)],
        [],
        ['RECOMENDAÇÕES TÉCNICAS']
      ]

      const recommendations = area.recommendations || getRecommendations()
      recommendations.forEach(rec => {
        worksheetData.push([rec.text])
      })

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Análise SAF')

      const fileName = `SAF_${area.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.xlsx`
      XLSX.writeFile(workbook, fileName)

      showConfirm("Sucesso", "Arquivo Excel exportado com sucesso!")
    }

    const exportAnalysisToExcel = () => {
      if (analysisData.value) {
        exportAreaToExcel(analysisData.value)
      } else if (selectedArea.value) {
        exportAreaToExcel(selectedArea.value)
      }
    }

    // Busca de localização
    const searchLocation = async () => {
      if (!searchQuery.value) return

      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: searchQuery.value + ", Mato Grosso, Brasil",
            format: "json",
            limit: 1
          },
          headers: {
            "User-Agent": "SAFMonitor/1.0"
          }
        })

        if (response.data && response.data.length > 0) {
          const result = response.data[0]
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)

          map.value.setView([lat, lng], 12)

          const address = await reverseGeocode(lat, lng)
          selectedArea.value = {
            name: result.display_name.split(",")[0],
            center: { lat, lng },
            address: address
          }

          updateMetricsForArea(lat, lng)
          showConfirm("Sucesso", `Localização encontrada: ${result.display_name.split(",")[0]}`)
        } else {
          showConfirm("Atenção", "Local não encontrado")
        }
      } catch (error) {
        console.error("Erro na busca:", error)
        showConfirm("Erro", "Erro ao buscar localização")
      }
    }

    // Geolocalização
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        showConfirm("Atenção", "Geolocalização não suportada pelo navegador")
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          map.value.setView([lat, lng], 14)

          const address = await reverseGeocode(lat, lng)
          selectedArea.value = {
            name: "Minha Localização",
            center: { lat, lng },
            address: address
          }

          updateMetricsForArea(lat, lng)
          showConfirm("Sucesso", "Localização atual encontrada!")
        },
        (err) => {
          console.log(err)
          showConfirm("Erro", "Erro ao obter localização")
        }
      )
    }

    // Controles de zoom
    const zoomIn = () => map.value.zoomIn()
    const zoomOut = () => map.value.zoomOut()

    // Trocar satélite
    const changeSatellite = (source) => {
      satelliteSources.value.forEach(s => s.active = false)
      source.active = true
      currentSatellite.value = source.name

      map.value.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.value.removeLayer(layer)
        }
      })

      L.tileLayer(source.url, {
        maxZoom: 19,
        attribution: "© " + source.name
      }).addTo(map.value)

      availableLayers.value.forEach(layer => {
        if (layer.visible && layer.layer) {
          layer.layer.addTo(map.value)
        }
      })

      showConfirm("Sucesso", `Fonte alterada para ${source.name}`)
    }

    // Toggle camadas
    const toggleLayer = (layer) => {
      if (layer.visible) {
        if (layer.name === "Classificação SAF" && safLayer) {
          safLayer.addTo(map.value)
        } else if (layer.name === "Uso do Solo" && !landUseLayer) {
          createLandUseLayer()
        } else if (layer.name === "Focos de Calor" && !fireLayer) {
          createFireLayer()
        }
      } else {
        if (layer.name === "Classificação SAF" && safLayer) {
          map.value.removeLayer(safLayer)
        } else if (layer.name === "Uso do Solo" && landUseLayer) {
          map.value.removeLayer(landUseLayer)
        } else if (layer.name === "Focos de Calor" && fireLayer) {
          map.value.removeLayer(fireLayer)
        }
      }
    }

    const createLandUseLayer = () => {
      landUseLayer = L.layerGroup()
      L.polygon([
        [-11.8, -55.8],
        [-11.5, -55.8],
        [-11.5, -55.3],
        [-11.8, -55.3]
      ], {
        color: "#2e7d32",
        fillOpacity: 0.3,
        weight: 2
      }).addTo(landUseLayer).bindPopup("Área de Floresta Densa")
      landUseLayer.addTo(map.value)
    }

    const createFireLayer = () => {
      fireLayer = L.layerGroup()
      const firePoints = [
        [-11.2, -55.1],
        [-12.5, -55.8],
        [-10.8, -56.2],
        [-11.9, -54.9]
      ]
      firePoints.forEach(point => {
        L.circleMarker(point, {
          radius: 8,
          fillColor: "#ff4444",
          color: "#fff",
          weight: 2,
          fillOpacity: 0.8
        }).addTo(fireLayer).bindPopup("Foco de Calor Detectado")
      })
      fireLayer.addTo(map.value)
    }

    const showConfirm = (title, message) => {
      confirmTitle.value = title
      confirmMessage.value = message
      confirmDialog.value = true
    }

    const showAreaAnalysis = () => {
      if (!selectedArea.value) {
        showConfirm("Atenção", "Selecione uma área no mapa primeiro!")
        return
      }
      prepareAnalysisData(selectedArea.value)
      analysisDialog.value = true
    }

    const prepareAnalysisData = (area) => {
      const currentProductivity = area.productivity || calculateCurrentProductivity()
      analysisData.value = {
        ...area,
        metrics: { ...metrics },
        landCover: [...landCover.value],
        weather: { ...weather },
        currentProductivity: currentProductivity,
        predictedProductivity: (currentProductivity * 1.15).toFixed(1),
        ndviSeries: [...ndviSeries.value],
        pieSeries: [...pieSeries.value],
        recommendations: getRecommendations()
      }
    }

    onMounted(() => {
      initMap()
      window.focusOnSAF = (lat, lng) => {
        map.value.setView([lat, lng], 14)
      }
    })

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      satelliteDialog,
      layerDialog,
      metricsDialog,
      saveAreaDialog,
      analysisDialog,
      confirmDialog,
      confirmTitle,
      confirmMessage,
      mouseLat,
      mouseLng,
      searchQuery,
      drawingMode,
      drawingPoints,
      selectedArea,
      savedAreas,
      newAreaName,
      analysisData,
      currentSatellite,
      satelliteSources,
      availableLayers,
      metrics,
      landCover,
      detectedSAFs,
      weather,
      legendItems,
      chartOptions,
      ndviSeries,
      pieOptions,
      pieSeries,
      toggleLeftDrawer,
      zoomIn,
      zoomOut,
      getCurrentLocation,
      searchLocation,
      toggleDrawingMode,
      undoLastPoint,
      completeDrawing,
      clearDrawings,
      saveArea,
      confirmSaveArea,
      confirmSaveAndAnalyze,
      focusOnSAF,
      focusOnSavedArea,
      analyzeSavedArea,
      deleteArea,
      changeSatellite,
      toggleLayer,
      showAreaAnalysis,
      exportAreaToExcel,
      exportAnalysisToExcel,
      getMetricColor,
      getMetricStatus,
      getProductivityColor,
      calculateCurrentProductivity,
      getRecommendations
    }
  }
}
</script>

<style scoped>
.map {
  height: 100vh;
  width: 100%;
}

.coords {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  color: black;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.rounded-sm {
  border-radius: 2px;
}

:deep(.q-drawer) {
  background: white;
}

:deep(.q-item-label) {
  color: black;
}

:deep(.q-item-label.caption) {
  color: #666;
}

:deep(.leaflet-popup-content) {
  color: black;
  font-size: 13px;
  min-width: 200px;
}

:deep(.leaflet-popup-content strong) {
  color: #2e7d32;
}

:deep(.q-linear-progress) {
  margin: 4px 0;
}

:deep(.drawing-marker) {
  background: transparent;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

<style>
.leaflet-container {
  font-family: 'Ubuntu', sans-serif;
}

.leaflet-popup-content button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: background 0.3s;
}

.leaflet-popup-content button:hover {
  background: #1b5e20;
}
</style>
