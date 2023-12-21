<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

//Импорт своих компонентов
import authStore from '../stores/auth.js'
const auth = authStore()

import requestState from '../data_models/requestState'

import useName from '../models/name.js'
const name = useName()

import useTaskList from '../models/taskList'
const taskList = useTaskList()

onMounted(async () => {
  name.update()
  taskList.update()
})

function updateTasks() {
  taskList.update()
}

function logout() {
  auth.logout()
  router.push({name: "auth"})
}
</script>

<template>
  <div class="header">
    <div class="header__content">
      <span class="header__content__hello">
        Привет, 
        <span v-show="name.state.value == requestState.NOT_START">Пользователь</span>
        <span v-show="name.state.value == requestState.START">Пользователь</span> 
        <span v-show="name.state.value == requestState.FINISHED">{{ name.data.value.first_name }}</span>
        <span v-show="name.state.value == requestState.ERROR">Ошибка запроса</span>
      </span>

      <button @click="logout()" class="button button_null">
        <svg class="header__content__logout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    </div>
  </div>

  <div class="main">
    <div class="main__content">
      <div class="main__content__tasks">
        <div v-show="taskList.state.value != requestState.FINISHED || taskList.data.value.length == 0" class="main__content__tasks__states">
          <span v-show="taskList.data.value.length == 0" class="main__content__tasks__states__text">Нет задач</span>
          <span v-show="taskList.state.value == requestState.START" class="main__content__tasks__states__text">Загрузка...</span>
          <span v-show="taskList.state.value == requestState.ERROR" class="main__content__tasks__states__text">Ошибка запроса</span>
        </div>

        <router-link v-show="taskList.state.value == requestState.FINISHED && taskList.data.value.length > 0" :to="{ name: 'task', 
            params: { id: task.id }}" v-for="task in taskList.data.value" class="link_null task">
          <div class="task__creator">
            <svg class="task__creator__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="task__creator__name">
              {{ task.creator_login }}
            </span>
          </div>
          <span class="task__descript">
            {{ task.title }}
          </span>
        </router-link>
      </div>

      <button @click="updateTasks" class="button button_null main_content__refresh">
        Обновить задачи
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--devider-color);
}

.header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  max-width: 600px;
  padding: 12px 40px;
  min-width: 0;
}

.header__content__hello {
  font-weight: bold;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  font-size: 24px;
  margin-right: 15px;
}

.header__content__logout {
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
}

.main {
  display: flex;
  justify-content: center;
  flex: 1;
}

.main__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  max-width: 600px;
  padding: 0 40px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.main__content__tasks {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main_content__refresh {
  color: var(--button-color-primary);
  background: var(--button-background-primary);
  display: flex;
  justify-content: center;
  border: none;
  border-radius: 12px;
  padding: 12px;
  margin-top: 40px;
  font-size: 20px;
  user-select: none;
}

.main__content__tasks__states {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.main__content__tasks__states__text {
  font-size: 36px;
  font-weight: bold;
}

.task {
  border: 3px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
}

.task + .task {
  margin-top: 20px;
}

.task__creator {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  min-height: 32px;
}

.task__creator__logo {
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin-right: 8px;
}

.task__creator__name {
  word-break: break-word;
  font-size: 24px;
}

.task__descript {
  word-break: break-word;
  white-space: break-spaces;
  font-size: 18px;
}

.main__content__send {
  margin: 40px 0;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 0;
  color: var(--button-color-primary);
  background: var(--button-background-primary);
  font-size: 20px;
}
</style>
