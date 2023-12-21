import getTaskList from '../repositories/getTaskList'
import requestState from '../data_models/requestState'

import { ref, onMounted, onUnmounted } from 'vue'

export default () => {
  const state = ref(requestState.NOT_START)
  const data = ref({})

  async function update() {
    try {
        state.value = requestState.START
        data.value = await getTaskList()
        state.value = requestState.FINISHED
    } catch(err) {
      state.value = requestState.ERROR
      console.error(err)
    }
  }

  return { state, data, update }
}