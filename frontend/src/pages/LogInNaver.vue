<template>
  <div></div>
</template>
<script>
import { defineComponent, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../stores/user-store'

export default defineComponent({
  name: 'LogInNaver',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUsersStore()

    const state = reactive({
      code: route.query.code,
      accessToken: '', // 발급받은 accessToken 저장을 위한 변수
      refreshToken: '', // 발급받은 refreshToken 저장을 위한 변수
      id: '',
      email: '',
      name: '',
      sex: '',
      phoneNumber: '',
      yearOfBirth: '',
      birthday: '',
    })

    const naverCallback = async () => {
      const config = {
        method: 'get',
        url: '/web-server/user/oauth/naver',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { code: state.code },
      }
      await axios(config)
        .then(res => {
          console.log('naverCallback res', res)
          userStore.accessToken = res.data.accessToken
          userStore.userName = res.data.name
          userStore.id = res.data.id
          router.push({ path: '/' })
        })
        .catch(err => {
          console.log('naverCallback err', err)
          userStore.accessToken = null
          userStore.userName = null
          userStore.id = null
          alert(err.response.data.error.message)
          router.push({ path: '/login' })
        })
    }
    onMounted(() => {
      naverCallback()
    })

    return {
      naverCallback,
    }
  },
})
</script>
<style scoped></style>
