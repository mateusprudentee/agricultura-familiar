<template>
    <div class="login-container">
      <!-- Left Side - Brand Area -->


      <!-- Right Side - Login Form -->
      <div class="login-section">
        <div class="login-wrapper">
          <div class="login-header">
            <h2 class="login-title">Bem-vindo de volta</h2>
            <p class="login-subtitle">Escolha uma das opções abaixo para acessar sua conta</p>
          </div>

          <div class="login-options">
            <!-- Google Login -->
            <button class="login-btn google-btn" @click="handleGoogleLogin">
              <div class="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span>Continuar com Google</span>
            </button>

            <!-- Microsoft Login -->
            <button class="login-btn microsoft-btn" @click="handleMicrosoftLogin">
              <div class="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M2 2h9.5v9.5H2z"/>
                  <path fill="#7FBA00" d="M12.5 2H22v9.5H12.5z"/>
                  <path fill="#00A4EF" d="M2 12.5h9.5V22H2z"/>
                  <path fill="#FFB900" d="M12.5 12.5H22V22H12.5z"/>
                </svg>
              </div>
              <span>Continuar com Microsoft</span>
            </button>

            <!-- Email Login -->
            <button class="login-btn email-btn" @click="handleEmailLogin">
              <div class="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#666666"/>
                </svg>
              </div>
              <span>Continuar com E-mail</span>
            </button>

            <!-- Phone Login -->
            <button class="login-btn phone-btn" @click="handlePhoneLogin">
              <div class="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.1 14.8 15.8 14.9 15.6 15.1L13.2 17.5C10.4 16 8 13.6 6.5 10.8L8.9 8.4C9.1 8.2 9.2 7.9 9.1 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.5 8 3 7.5 3H4C3.5 3 3 3.5 3 4C3 13.4 10.6 21 20 21C20.5 21 21 20.5 21 20V16.5C21 16 20.5 15.5 20 15.5Z" fill="#666666"/>
                </svg>
              </div>
              <span>Continuar com Celular</span>
            </button>
          </div>

          <div class="login-divider">
            <span class="divider-line"></span>
            <span class="divider-text">ou</span>
            <span class="divider-line"></span>
          </div>

          <div class="register-prompt">
            <p class="register-text">
              Novo por aqui?
              <a href="#" class="register-link" @click.prevent="handleRegister">Crie sua conta</a>
            </p>
          </div>

          <div class="help-links">
            <a href="#" class="help-link" @click.prevent="handleForgotPassword">Esqueceu a senha?</a>
            <span class="help-separator">•</span>
            <a href="#" class="help-link" @click.prevent="handleHelp">Precisa de ajuda?</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const handleGoogleLogin = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para login com Google...',
    position: 'top',
    timeout: 2000
  })
  // Implement Google OAuth here
}

const handleMicrosoftLogin = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para login com Microsoft...',
    position: 'top',
    timeout: 2000
  })
  // Implement Microsoft OAuth here
}

const handleEmailLogin = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para login com E-mail...',
    position: 'top',
    timeout: 2000
  })
  // Implement email login here
}

const handlePhoneLogin = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para login com Celular...',
    position: 'top',
    timeout: 2000
  })
  // Implement phone login here
}

const handleRegister = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para página de cadastro...',
    position: 'top',
    timeout: 2000
  })
  // Implement registration redirect
}

const handleForgotPassword = () => {
  $q.notify({
    type: 'info',
    message: 'Redirecionando para recuperação de senha...',
    position: 'top',
    timeout: 2000
  })
  // Implement forgot password
}

const handleHelp = () => {
  $q.notify({
    type: 'info',
    message: 'Abrindo central de ajuda...',
    position: 'top',
    timeout: 2000
  })
  // Implement help center
}
</script>

<style scoped>


.login-container {
  display: flex;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.062);
  min-height: 600px;
}

/* Brand Section - Left Side */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #e6e6e6 0%, #ffffff 100%);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="rgba(255,255,255,0.05)" d="M100 0L130 30L100 60L70 30L100 0Z"/><path fill="rgba(255,255,255,0.05)" d="M100 140L130 170L100 200L70 170L100 140Z"/><path fill="rgba(255,255,255,0.05)" d="M0 100L30 70L60 100L30 130L0 100Z"/><path fill="rgba(255,255,255,0.05)" d="M140 100L170 70L200 100L170 130L140 100Z"/></svg>') repeat;
  opacity: 0.1;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.logo-wrapper {
  margin-bottom: 24px;
}

.brand-icon {
  color: #48bb78;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

.brand-divider {
  width: 60px;
  height: 3px;
  background: #48bb78;
  margin: 0 auto 24px auto;
  border-radius: 2px;
}

.brand-description {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.8;
  margin: 0;
  max-width: 280px;
}
.sidebar-logo {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
/* Logo no modo mini - reduz tamanho */
.sidebar-logo-mini {
  padding: 16px 10px;
}
.logo-area {
  background-image: url("https://i.imgur.com/MzEVU64.png");
  background-size: cover;
  background-position: center;
  height: 60px;
  width: 200px;
  border-right: 1px solid rgb(235, 235, 235);
}


.logo-text {
  font-size: 35px;
  font-weight: normal;
  background: linear-gradient(135deg, #363636 0%, #0130ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
  line-height: 1.3;
  max-width: 10px;
}
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
/* Login Section - Right Side */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: white;
}

.login-wrapper {
  max-width: 380px;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 13px;
  color: #718096;
  margin-top: -10px;
  line-height: 1.5;
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-btn:hover {
  border-color: #4285F4;
  background: #f8f9ff;
}

.microsoft-btn:hover {
  border-color: #00A4EF;
  background: #f0f9ff;
}

.email-btn:hover {
  border-color: #48bb78;
  background: #f0fff4;
}

.phone-btn:hover {
  border-color: #ed8936;
  background: #fffaf0;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  font-size: 12px;
  color: #a0aec0;
  text-transform: uppercase;
}

.register-prompt {
  text-align: center;
  margin-bottom: 16px;
}

.register-text {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.register-link {
  color: #48bb78;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #38a169;
  text-decoration: underline;
}

.help-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
}

.help-link {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.help-link:hover {
  color: #48bb78;
}

.help-separator {
  color: #e2e8f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 480px;
  }

  .brand-section {
    padding: 32px;
    min-height: 280px;
  }

  .login-section {
    padding: 32px;
  }

  .brand-title {
    font-size: 24px;
  }

  .brand-description {
    font-size: 13px;
  }

  .login-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }

  .brand-section,
  .login-section {
    padding: 24px;
  }

  .login-wrapper {
    max-width: 100%;
  }
}
</style>
