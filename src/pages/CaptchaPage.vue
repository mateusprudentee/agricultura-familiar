<template>
  <q-page class="flex flex-center">

    <q-card class="captcha-card q-pa-xl">

      <div class="text-center q-mb-md">
        <q-icon name="school" size="56px" color="primary" />
      </div>

      <div class="text-h6 text-weight-bold text-center">
        Acesso Restrito
      </div>

      <div class="text-subtitle2 text-grey-7 text-center q-mt-sm q-mb-md">
        Sistema em desenvolvimento para pesquisa de mestrado.
        Dados e funcionalidades ainda em validação.
      </div>

       <!-- Aviso de segurança -->
      <q-banner class="bg-grey-3 text-grey-9 q-mb-lg" rounded>
        Este conteúdo é restrito e requer verificação de acesso.
        Qualquer uso indevido pode comprometer a integridade da pesquisa. <b>Insira a senha abaixo.</b>
      </q-banner>

      <!-- 🔥 INPUT REAL PARA AUTOFILL DO NAVEGADOR -->
      <input
        v-model="hiddenPassword"
        type="password"
        autocomplete="current-password"
        style="position:absolute; opacity:0; height:0; width:0;"
      />

      <!-- DIGITS VISUAIS -->
      <div class="row justify-center q-gutter-sm q-mb-lg">
        <q-input
          v-for="(digit, index) in digits"
          :key="index"
          v-model="digits[index]"
          maxlength="1"
          outlined
          dense
          input-class="text-center text-h6"
          class="digit-input"
          @update:model-value="onInput"
          @keyup="focusNext(index, $event)"
        />
      </div>

      <div class="text-caption text-grey-6 text-center">
        Chave de acesso institucional temporária
      </div>

    </q-card>

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const digits = ref(['', '', '', '', '', ''])
const hiddenPassword = ref('')
const SECRET = '012698'

// =====================
// AUTOFILL WATCH
// =====================
watch(hiddenPassword, (val) => {
  if (!val) return

  const chars = val.slice(0, 6).split('')

  digits.value = ['', '', '', '', '', '']

  chars.forEach((c, i) => {
    digits.value[i] = c
  })

  verify()
})

// =====================
// VERIFY
// =====================
const verify = () => {
  const value = digits.value.join('')

  if (value.length !== SECRET.length) return

  if (value === SECRET) {
    $q.notify({
      type: 'positive',
      message: 'Acesso liberado com sucesso!'
    })

    localStorage.setItem(
      'captcha_expire',
      String(Date.now() + 3 * 60 * 60 * 1000)
    )

    setTimeout(() => {
      router.push('/')
    }, 600)

  } else {
    $q.notify({
      type: 'negative',
      message: 'Código incorreto'
    })

    digits.value = ['', '', '', '', '', '']
    hiddenPassword.value = ''
  }
}

// =====================
// INPUT CONTROL
// =====================
const onInput = () => {
  verify()
}

const focusNext = (index, event) => {
  const inputs = document.querySelectorAll('.digit-input input')

  if (event.key !== 'Backspace' && inputs[index + 1]) {
    inputs[index + 1].focus()
  }

  if (event.key === 'Backspace' && inputs[index - 1]) {
    inputs[index - 1].focus()
  }
}
</script>

<style scoped>
.captcha-card {
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.digit-input {
  width: 42px;
}
</style>
