import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, watch } from 'vue'

const baseUrl = import.meta.env.VITE_API_URL

export default defineStore('auth', () => {
    const refreshToken = ref(localStorage.getItem('refresh_token'))
    const accessToken = ref(null)
    const accessTokenTimer = ref(null)

    async function login(login, password) {
        return await axios.post(`${baseUrl}/auth/post/refresh-token`, {
            login,
            password
        })
        .then((response) => {
            refreshToken.value = response.data
            return axios.post(`${baseUrl}/auth/post/access-token`, {token: response.data})
        })
        .then((result) => {
            accessToken.value = result.data
            accessTokenAutoRefresh()
            
            return true
        })
        .catch((err) => {
            refreshToken.value = null
            accessToken.value = null

            return false
        })
    }

    function logout() {
        refreshToken.value = null
        accessToken.value = null
    }

    function getAuth() {
        if(refreshToken.value)
            return true
        return false
    }

    async function getAccessToken() {
        if(accessToken.value !== null)
            return accessToken.value

        if(refreshToken.value === null)
            throw new Error("No refresh token to update access token")

        const accessTokenReq = await axios.post(`${baseUrl}/auth/post/access-token`, {
            token: refreshToken.value
        })
        accessToken.value = accessTokenReq.data

        return accessToken.value
    }

    function accessTokenAutoRefresh() {
        if(accessToken.value !== null) {
            if(accessTokenTimer.value !== null)
                clearTimeout(accessTokenTimer.value)

            const jwtBase64 = accessToken.value.split('.')[1]
            const jwtToken = JSON.parse(atob(jwtBase64))

            const expires = new Date(jwtToken.exp * 1000)
            const timeout = expires.getTime() - Date.now() - (60 * 1000)
            accessTokenTimer.value = setTimeout(async () => {
                const access_token = (await axios.post(`${baseUrl}/auth/post/access-token`, {
                    token: refreshToken.value
                })).data
                
                accessToken.value = access_token
            }, timeout)
        }
    }

    watch(accessToken, accessTokenAutoRefresh)
    watch(refreshToken, () => {
        localStorage.setItem('refresh_token', refreshToken.value)
    })

    return {
        getAuth,
        login,
        logout,
        getAccessToken
    }

    // return {
    //     refreshToken,
    //     accessToken,
    //     accessTokenTimer,

    //     login,
    //     logout,
    //     getAccessToken,
    //     accessTokenAutoRefresh
    // }
})

/*export default defineStore({
    id: 'auth',
    state: () => ({
        refreshToken: null,
        accessToken: null,
        accessTokenTimeout: null
    }),

    actions: {
        async login(login, password) {
            console.log(`${baseUrl}/auth/post/refresh-token`)
            const refreshToken = (await axios.post(`${baseUrl}/auth/post/refresh-token`, {
                login,
                password
            })).data

            const accessToken = (await axios.post(`${baseUrl}/auth/post/access-token`, {
                token: refreshToken
            })).data

            this.refreshToken = refreshToken
            this.accessToken = accessToken
            
            //this.accessTokenTimer()
        },

        logout() {
            this.refreshToken = null
            this.accessToken = null
        },

        async refreshAccessToken() {
            const {accessToken} = await axios.post(`${baseUrl}/auth/post/access-token`, {
                token: this.refreshToken
            })
            this.accessToken = accessToken

            //this.accessTokenTimer()
        },

        accessTokenTimer() {
            const jwtBase64 = this.accessToken.split('.')[1]
            const jwtToken = JSON.parse(atob(jwtBase64))

            console.log(jwtToken)

            const expires = new Date(jwtToken.exp * 1000)
            const timeout = expires.getTime() - Date.now() - (60 * 1000)
            this.accessTokenTimeout = setTimeout(this.refreshAccessToken, timeout)
        },

        stopAccessTokenTimer() {
            clearTimeout(this.accessTokenTimeout)
        }
    },

    watchers: {
        accessToken: this.accessTokenTimer()
    }
})*/