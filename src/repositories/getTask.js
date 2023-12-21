import axios from 'axios'
import authStore from '../stores/auth.js'

export default async (ut_id) => {
    const auth = authStore()

    const req = await axios.get(`${import.meta.env.VITE_API_URL}/montage/get/task`, {
      headers: {
        "Authorization": await auth.getAccessToken()
      },
      params: {
        ut_id
      }
    })

    return req.data
}