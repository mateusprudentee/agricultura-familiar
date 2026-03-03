<template>
  <q-layout view="hHh LpR lff" class="bg-grey-1">
    <!-- Navbar Moderno com Bordas Arredondadas -->
    <q-header
      elevated
      class="modern-navbar bg-white text-black"
      style="border-radius: 0 0 30px 30px; margin-top: 10px;"
    >
      <div class="container" style="max-width: 1250px; margin: 0 auto; padding: 8px 24px;">

        <!-- Linha Principal do Navbar -->
        <div class="row items-center justify-between">

          <!-- Logo com efeito gradiente -->
          <div class="col-auto">
            <div class="logo-container cursor-pointer" @click="$router.push('/')">
              <span class="logo-text text-h5 text-weight-bold">inovação</span>
              <div class="logo-dot"></div>
            </div>
          </div>

          <!-- Menu Central com bordas arredondadas -->
          <div class="col-5">
            <div class="menu-center-container">
              <div class="row items-center justify-around menu-items">
                <q-btn
                  v-for="item in menuItems"
                  :key="item.label"
                  flat
                  dense
                  no-caps
                  :label="item.label"
                  class="menu-btn text-grey-8"
                  :class="{ 'active-menu': item.active }"
                />
              </div>
            </div>
          </div>

          <!-- Ações do usuário com design arredondado -->
          <div class="col-auto">
            <div class="row items-center q-gutter-sm">

              <!-- Botão de busca com borda arredondada -->
              <q-btn
                flat
                round
                dense
                icon="search"
                class="action-btn text-grey-7"
                size="md"
              >
                <q-tooltip>Buscar</q-tooltip>
              </q-btn>

              <!-- Notificações com badge -->
              <q-btn
                flat
                round
                dense
                icon="notifications_none"
                class="action-btn text-grey-7"
                size="md"
              >
                <q-badge color="pink" floating rounded>3</q-badge>
                <q-tooltip>Notificações</q-tooltip>
              </q-btn>

              <!-- Avatar/Perfil com borda arredondada -->
              <q-btn
                flat
                round
                dense
                class="profile-btn"
                size="md"
              >
                <q-avatar size="32px" class="profile-avatar">
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg" alt="avatar">
                </q-avatar>
                <q-menu>
                  <q-list style="min-width: 200px">
                    <q-item clickable v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>Meu Perfil</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="settings" />
                      </q-item-section>
                      <q-item-section>Configurações</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="logout" />
                      </q-item-section>
                      <q-item-section>Sair</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Barra de busca expansível (opcional) -->
        <div class="row justify-center q-mt-sm" v-if="showSearch">
          <div class="col-8">
            <q-input
              outlined
              dense
              placeholder="Buscar ideias inovadoras..."
              bg-color="grey-2"
              class="search-input-expanded"
              rounded
            >
              <template v-slot:append>
                <q-icon name="search" class="cursor-pointer text-primary" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </q-header>

    <!-- Conteúdo da página -->
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="container" style="max-width: 1250px; margin: 0 auto; padding: 32px 16px;">
          <div class="text-center">
            <h1 class="text-h3 text-weight-light text-grey-8" style="font-family: 'Ubuntu', sans-serif;">
              Ideias Inovadoras
            </h1>
            <p class="text-subtitle1 text-grey-6 q-mt-md">
              Navegue com estilo usando nosso navbar moderno com bordas arredondadas
            </p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'ModernLayout',
  data() {
    return {
      showSearch: false,
      menuItems: [
        { label: 'Início', active: true },
        { label: 'Produtos', active: false },
        { label: 'Serviços', active: false },
        { label: 'Sobre', active: false },
        { label: 'Contato', active: false }
      ]
    }
  }
}
</script>

<style lang="scss">
// Import Ubuntu font
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

.modern-navbar {
  font-family: 'Ubuntu', sans-serif;
  border-radius: 0 0 30px 30px !important;
  margin: 10px 20px 0 20px;
  width: calc(100% - 40px);
  left: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1) !important;
  }

  .logo-container {
    position: relative;
    display: inline-block;

    .logo-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .logo-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      bottom: 8px;
      right: -8px;
      animation: pulse 2s infinite;
    }
  }

  .menu-center-container {
    background: #f5f7fa;
    border-radius: 40px;
    padding: 4px;

    .menu-items {
      .menu-btn {
        border-radius: 30px;
        padding: 8px 20px;
        font-weight: 500;
        font-size: 14px;
        text-transform: none;
        transition: all 0.3s ease;
        font-family: 'Ubuntu', sans-serif;

        &:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea !important;
        }

        &.active-menu {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  .action-btn {
    border-radius: 50%;
    background: #f5f7fa;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  }

  .profile-btn {
    border-radius: 30px;
    background: #f5f7fa;
    padding: 4px 8px 4px 4px;

    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .profile-avatar {
        border-color: white;
      }
    }

    .profile-avatar {
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
  }

  .search-input-expanded {
    :deep(.q-field__control) {
      border-radius: 40px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// Animações
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// Responsividade
@media (max-width: 1023px) {
  .modern-navbar {
    margin: 10px 10px 0 10px;
    width: calc(100% - 20px);
    left: 10px;

    .menu-center-container {
      display: none;
    }
  }
}

@media (max-width: 767px) {
  .modern-navbar {
    .logo-text {
      font-size: 1.2rem !important;
    }
  }
}
</style>
