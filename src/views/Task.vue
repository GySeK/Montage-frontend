<script setup>
import { ref, onMounted, useSSRContext, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

//Импорт своих компонентов
import requestState from '../data_models/requestState'

import useTask from '../models/task'
const task = useTask()

import useTaskDone from '../models/taskDone'
const taskDone = useTaskDone()

const TaskDoneState = ref(false)
onMounted(async () => {
  await task.update(route.params.id)

  TaskDoneState.value = task.data.value.is_done
})

function onBack() {
  router.push({name: "main"})
}

function onTaskDone() {
  taskDone.update(route.params.id, !TaskDoneState.value)
  if(taskDone.state.value = requestState.FINISHED)
    TaskDoneState.value = !TaskDoneState.value
}

</script>

<template>
  <div class="header">
    <div class="header__content">
      <button @click="onBack" class="header__content__back button button_null">
        <svg class="header__content__back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>

      <span v-show="task.state.value == requestState.NOT_START" class="header__content__title">
        Название
      </span>
      <span v-show="task.state.value == requestState.START" class="header__content__title">
        Загрузка...
      </span>
      <span v-show="task.state.value == requestState.FINISHED" class="header__content__title">
        {{ task.data.value.title }}
      </span>
      <span v-show="task.state.value == requestState.ERROR" class="header__content__title">
        Ошибка запроса
      </span>
    </div>
  </div>

  <div class="main">
    <div class="main__content">
      <div class="main__content__info">
        <div class="main__content__info__user">
          <svg class="main__content__info__user__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span v-show="task.state.value == requestState.NOT_START" class="main__content__info__user__name">
            Создатель
          </span>
          <span v-show="task.state.value == requestState.START" class="main__content__info__user__name">
            Загрузка...
          </span>
          <span v-show="task.state.value == requestState.FINISHED" class="main__content__info__user__name">
            {{ task.data.value.creator_login }}
          </span>
          <span v-show="task.state.value == requestState.ERROR" class="main__content__info__user__name">
            Ошибка запроса
          </span>
        </div>
        
        <span v-show="task.state.value == requestState.NOT_START" class="main__content__info__descript">
          Описание
        </span>
        <span v-show="task.state.value == requestState.START" class="main__content__info__descript">
          Загрузка...
        </span>
        <span v-show="task.state.value == requestState.FINISHED" class="main__content__info__descript">
          {{ task.data.value.description }}
        </span>
        <span v-show="task.state.value == requestState.ERROR" class="main__content__info__descript">
          Ошибка запроса
        </span>
      </div>
      <button @click="onTaskDone" class="main__content__send button">
        <span v-show="taskDone.state.value == requestState.START">Загрузка...</span>
        <span v-show="taskDone.state.value != requestState.ERROR && !TaskDoneState">Завершить</span>
        <span v-show="taskDone.state.value != requestState.ERROR && TaskDoneState">Отменить</span>
        <span v-show="taskDone.state.value == requestState.ERROR">Ошибка загрузки</span>
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
  align-items: center;
  flex: 1;
  max-width: 600px;
  padding: 12px 40px;
  min-width: 0;
}

.header__content__back {
  width: 32px;
  height: 32px;
  margin-right: 20px;
}

.header__content__title {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 24px;
}

.main {
  display: flex;
  justify-content: center;
  flex: 1;
}

.main__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 600px;
  padding: 0 40px;
  margin: 40px 0;
  justify-content: space-between;
}

.main__content__info {
  border: 3px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
}

.main__content__info__user {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  min-height: 32px;
}

.main__content__info__user__logo {
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin-right: 10px;
}

.main__content__info__user__name {
  word-break: break-word;
  font-size: 24px;
}

.main__content__info__descript {
  word-break: break-word;
  white-space: break-spaces;
  font-size: 18px;
}

.main__content__send {
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 0;
  margin-top: 40px;
  color: var(--button-color-primary);
  background: var(--button-background-primary);
  font-size: 20px;
}
</style>
