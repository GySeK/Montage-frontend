<script setup>
import { ref, onMounted } from 'vue'

import requestState from '../data_models/requestState'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

import authStore from '../stores/auth.js'
const auth = authStore()

let login = ref("")
let password = ref("")

let authState = ref(requestState.NOT_START)
async function onSend() {
  try {
    authState.value = requestState.START

    if(await auth.login(login.value, password.value)) {
      router.push({name: "main"})
    } else {
      title.value = "Неправильный логин или пароль"
    }

    authState.value = requestState.FINISHED
  } catch(err) {
    authState.value = requestState.ERROR
    console.error(err)
  }
}

onMounted(async () => {
})
</script>

<template>
  <div class="wrapper-auth">
    <form @submit.prevent="onSend" class="auth-cont">
      <span v-show="authState == requestState.NOT_START" class="auth-cont__title">Авторизация</span>
      <span v-show="authState == requestState.START" class="auth-cont__title">Загрузка...</span>
      <span v-show="authState == requestState.FINISHED" class="auth-cont__title">Авторизация</span>
      <span v-show="authState == requestState.ERROR" class="auth-cont__title">Неправильный логин или пароль</span>
      <div class="auth-cont__fields">
        <div class="auth-cont__fields__group">
          <label class="auth-cont__fields__group__item auth-cont__fields__group__item_text" for="login">Логин</label>
          <input required v-model="login" class="input auth-cont__fields__group__item auth-cont__fields__group__item_input-text" id="login" placeholder="Введите логин"/>
        </div>

        <div class="auth-cont__fields__group">
          <label class="auth-cont__fields__group__item auth-cont__fields__group__item_text" for="password">Пароль</label>
          <input required type="password" v-model="password" class="input auth-cont__fields__group__item auth-cont__fields__group__item_input-text" id="password"  placeholder="Введите пароль"/>
        </div>
      </div>

      <button @click="onSend" class="input auth-cont__send button">Войти</button>
    </form>
  </div>
</template>

<style scoped>
  .wrapper-auth {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0 30px;
  }

  .auth-cont {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: solid 4px var(--border-color);
    border-radius: 20px;
    padding: 40px;
    max-width: 450px; 
  }

  .auth-cont__title {
    font-size: 30px;
    font-weight: bold;
    user-select: none;
    margin-bottom: 40px;
  }

  .auth-cont__fields__group {
    display: flex;
    flex-direction: column;
  }

  .auth-cont__fields__group + .auth-cont__fields__group {
    margin-top: 20px;
  }

  .auth-cont__fields__group__item + .auth-cont__fields__group__item{
    margin-top: 10px;
  }

  .auth-cont__fields__group__item_text {
    font-size: 20px;
    font-weight: bold;
  }

  .auth-cont__fields__group__item_input-text {
    border: 2px solid var(--border-color);
    padding: 0 12px;
    border-radius: 12px;
    font-size: 16px;
    line-height: 40px;
  }

  .auth-cont__fields__group__item_input-text::placeholder {
    opacity: 1;
    color: var(--input-placeholder-color);
  }

  .auth-cont__send {
    border: none;
    border-radius: 12px;
    padding: 12px 0;
    color: var(--button-color-primary);
    background: var(--button-background-primary);
    font-size: 20px;
    margin-top: 40px;
  }

  @media screen and (max-width: 600px) {
    .auth-cont {
      border: none !important;
      padding: 0 !important;
    }
  }
</style>
