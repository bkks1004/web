<template>
  <div>router</div>
</template>
<script>
import { defineComponent, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'LogInNaver',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      naverClientId: 'ydDzQxlGNx737EQ1cQIe',
      clientSecret: 'MBSuuk90jn',
      callbackUrl: 'http://localhost:9000/login/naver',
      code: route.query.code,
      states: route.query.state, // csrf 공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값으로 URL 인코딩을 적용한 값을 사용
      access_token: '', // 발급받은 access_token 저장을 위한 변수
      refresh_token: '', // 발급받은 refresh_token 저장을 위한 변수
      state: 'test',
      id: '',
      email: '',
      name: '',
      sex: '',
      phoneNumber: '',
      yearOfBirth: '',
      birthday: '',
    })

    const naverUserInfo = async () => {
      const url = `/v1/nid/me`
      const header = `Bearer ${state.access_token}`
      const headers = { Authorization: header }
      console.log('headers => ', headers)
      const { data } = await axios.get(url, { headers })
      console.log('*****naverUserInfo data***** => ', data)

      // 변수에 값 넣기
      state.id = data.response.id
      state.email = data.response.email
      state.name = data.response.name
      state.sex = data.response.gender
      state.phoneNumber = data.response.mobile.replaceAll('-', '')
      state.yearOfBirth = data.response.birthyear
      state.birthday = data.response.birthday

      // naverUseridCheck(data);
    }
    const naverCallback = async () => {
      console.log('route.query.code => ', route.query.code) // 파라미터로 전달받은 code값
      console.log('route.query.states => ', route.query.state) // 파라미터로 전달받은 state값

      const url = `/oauth2.0/token?grant_type=authorization_code&client_id=${state.naverClientId}&client_secret=${state.clientSecret}&code=${state.code}&state=${state.states}`
      const headers = {
        'X-Naver-Client-Id': state.naverClientId,
        'X-Naver-Client-Secret': state.clientSecret,
      }
      const { data } = await axios.get(url, { headers })
      console.log('data => ', data)

      console.log('data.access_token => ', data.access_token)
      state.access_token = data.access_token

      console.log('data.refresh_token => ', data.refresh_token)
      state.refresh_token = data.refresh_token

      naverUserInfo()
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
