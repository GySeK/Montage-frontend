import axios from 'axios'
import authStore from '../stores/auth.js'

export default async () => {
    const auth = authStore()

    const req = await axios.get(`${import.meta.env.VITE_API_URL}/montage/get/task-list`, {
        headers: {
          "Authorization": await auth.getAccessToken()
        }
    })

    return req.data
}