import { defineStore } from 'pinia'
import { axios } from '../boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    userName: null,
  }),

  getters: {},

  actions: {
    async login(loginData) {
      try {
        await axios
          .post('web-server/user/login', loginData)
          .then(res => {
            console.log(res)
            this.accessToken = res.data.accessToken
            this.refreshToken = res.data.refreshToken
            this.userName = res.data.userName
          })
          .catch(err => {
            alert(err.response.data.error.message)
          })
      } catch (error) {
        console.log('error', error)
      }
    },
  },
})
