import { defineStore } from 'pinia'
import { axios } from '../boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    accessToken: null,
    userName: null,
    id: null,
  }),

  getters: {},

  actions: {
    async login(loginData) {
      try {
        await axios
          .post('web-server/user/login', loginData)
          .then(res => {
            this.accessToken = res.data.accessToken
            this.userName = res.data.userName
            this.id = res.data.id
          })
          .catch(err => {
            alert(err.response.data.error.message)
          })
      } catch (error) {
        console.log('error', error)
        this.accessToken = null
        this.userName = null
        this.id = null
      }
    },
    async checkRefreshToken() {
      try {
        const config = {
          method: 'get',
          url: '/web-server/user/check-refesh-token',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          params: { id: this.id },
        }
        await axios(config)
          .then(res => {
            console.log(
              'access token 검증 실패 후 refresh token 검증 성공',
              res
            )
          })
          .catch(err => {
            console.log('err', err)
            this.accessToken = null
            this.userName = null
            this.id = null
          })
      } catch (error) {
        console.log('error', error)
        this.accessToken = null
        this.userName = null
        this.id = null
      }
    },
  },
  persist: true,
})
