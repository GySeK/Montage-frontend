import axios from 'axios'
import authStore from '../stores/auth.js'

export default async (id, done) => {
    const auth = authStore()

    const req = await axios.put(`${import.meta.env.VITE_API_URL}/montage/put/task/done`, {
        id,
        done
      }, {
        headers: {
          "Authorization": await auth.getAccessToken()
        }
      })

    return req.data
}