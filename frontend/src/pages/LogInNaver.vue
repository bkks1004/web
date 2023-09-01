<template>
  <div>router</div>
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

      naverUseridCheck(data)
    }

    const naverUseridCheck = async data => {
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
        naverUserJoin()
      } else if (result === 'not exist') {
        naverUserLogin()
      }
    }

    const naverUserJoin = async () => {
      const url = `/web-server/user/sns/join`
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
          alert(`아이디가 생성되었습니다.`)
          naverUserLogin()
        })
        .catch(err => {
          alert(err.response.data.error.message)
        })
    }

    const naverUserLogin = async () => {
      console.log('@@@@@@@@@@@@@@네이버로그인!!!!!!!!!!!!!!!!!!')
      // const url = `/ROOT/api/member/login.json`;
      //   const headers = { "Content-Type": "application/json" };
      //   const body = {
      //           userid: state.userid,
      //           userpw: state.userpw,
      //           role: 'CUSTOMER'
      //       }
      //   const { data } = await axios.post(url, body, { headers });
      //   console.log(data);
      //       if (data.status === 200) {
      //           sessionStorage.setItem("token", data.result);
      //           store.commit('setLogged', true);
      //           store.commit('setCounter');
      //           router.push({ path: '/' });
      //       }
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
