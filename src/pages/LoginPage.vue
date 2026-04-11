<template>
  <q-page class="login-page flex flex-center">

    <div class="login-card">

      <!-- HEADER -->
      <div class="header">
        <div class="title">ACESSO</div>
        <div class="subtitle">Entre na sua conta para continuar</div>
      </div>

      <!-- BOTÕES DE LOGIN -->
      <div class="actions">

        <q-btn class="provider-btn google" unelevated no-caps>
          <q-icon name="fab fa-google" size="20px" class="icon" />
          <span>Entrar com Google</span>
        </q-btn>

        <q-btn class="provider-btn microsoft" unelevated no-caps>
          <q-icon name="fab fa-microsoft" size="20px" class="icon" />
          <span>Entrar com Microsoft</span>
        </q-btn>

        <q-btn class="provider-btn email" unelevated no-caps>
          <q-icon name="fas fa-envelope" size="20px" class="icon" />
          <span>Entrar com E-mail</span>
        </q-btn>

        <q-btn class="provider-btn celular" unelevated no-caps>
          <q-icon name="fas fa-mobile-alt" size="20px" class="icon" />
          <span>Entrar com Celular</span>
        </q-btn>

      </div>

      <!-- LINKS -->
      <div class="footer">
        <a href="#">Esqueceu a senha?</a>
        <p>Não tem uma conta? <a href="#">Cadastre-se aqui</a></p>
      </div>

    </div>

  </q-page>
</template>

<script setup>
// Auth futuramente (Firebase / OAuth)
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fc, #ffffff);
}

.login-card {
  width: 440px;
  padding: 40px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
}

.header {
  text-align: center;
  margin-bottom: 26px;
}

.title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #111;
}

.subtitle {
  font-size: 13px;
  color: #777;
  margin-top: 6px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.provider-btn {
  width: 100%;
  justify-content: flex-start;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.provider-btn .icon {
  margin-right: 12px;
}

.provider-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.10);
}

.google { color: #111; }
.microsoft { color: #111; }
.email { color: #111; }
.celular { color: #111; }

.footer {
  margin-top: 22px;
  text-align: center;
  font-size: 12px;
  color: #777;
}

.footer a {
  color: #1976d2;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
