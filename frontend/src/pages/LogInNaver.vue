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
      naverClientId: 'ydDzQxlGNx737EQ1cQIe',
      clientSecret: 'MBSuuk90jn',
      callbackUrl: 'http://localhost:9000/login/naver',
      code: route.query.code,
      states: route.query.state, // csrf 공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값으로 URL 인코딩을 적용한 값을 사용
      accessToken: '', // 발급받은 accessToken 저장을 위한 변수
      refreshToken: '', // 발급받은 refreshToken 저장을 위한 변수
      state: 'test',
      id: '',
      email: '',
      name: '',
      sex: '',
      phoneNumber: '',
      yearOfBirth: '',
      birthday: '',
    })

    const naverCallback = async () => {
      const url = `/oauth2.0/token?grant_type=authorization_code&client_id=${state.naverClientId}&client_secret=${state.clientSecret}&code=${state.code}&state=${state.states}`
      const headers = {
        'X-Naver-Client-Id': state.naverClientId,
        'X-Naver-Client-Secret': state.clientSecret,
      }
      const { data } = await axios.get(url, { headers })
      state.accessToken = data.access_token
      state.refreshToken = data.refresh_token

      naverUserInfo()
    }

    const naverUserInfo = async () => {
      const url = `/v1/nid/me`
      const header = `Bearer ${state.accessToken}`
      const headers = { Authorization: header }
      const { data } = await axios.get(url, { headers })

      // 변수에 값 넣기
      state.id = data.response.id
      state.email = data.response.email
      state.name = data.response.name
      state.sex = data.response.gender
      state.phoneNumber = data.response.mobile.replaceAll('-', '')
      state.yearOfBirth = data.response.birthyear
      state.birthday = data.response.birthday

      naverUseridCheck()
    }

    const naverUseridCheck = async () => {
      const config = {
        method: 'get',
        url: '/web-server/user/sns/check-id',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { id: state.id, snsType: 'naver' },
      }
      let result

      await axios(config)
        .then(res => {
          result = res.data.result
        })
        .catch(err => {
          alert(err.response.data.error.message)
        })
      if (result === 'exist') {
        naverUserLogin()
      } else if (result === 'not exist') {
        naverUserJoin()
      }
    }

    const naverUserJoin = async () => {
      const url = '/web-server/user/sns/join'
      const headers = { 'Content-Type': 'application/json' }
      const body = {
        id: state.id,
        password: null,
        name: state.name,
        birthday: `${state.yearOfBirth}-${state.birthday}`,
        sex: state.sex,
        phoneNumber: state.phoneNumber,
        email: state.email,
        snsType: 'naver',
      }
      await axios
        .post(url, body, { headers })
        .then(res => {
          console.log(`${res.data.msg}`)
          naverUserLogin(res.data.createdUserInfo)
        })
        .catch(err => {
          alert(err.response.data.error.message)
        })
    }

    const naverUserLogin = async userInfo => {
      const updateObject = {
        refresh_token: state.refreshToken,
      }
      const config = {
        method: 'put',
        url: '/web-server/user',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { id: userInfo.id, updateObject },
      }

      await axios(config)
        .then(res => {
          if (res.data.result === 'OK') {
            userStore.accessToken = state.accessToken
            userStore.refreshToken = state.refreshToken
            userStore.userName = state.name
            router.push({ path: '/' })
          }
        })
        .catch(err => {
          userStore.accessToken = null
          userStore.refreshToken = null
          userStore.userName = null
          alert(err.response.data.error.message)
        })
    }

    onMounted(() => {
      naverCallback()
    })

    return {
      state,
      naverCallback,
    }
  },
})
</script>
<style scoped></style>
