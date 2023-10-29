<template>
  <q-page class="flex flex-center">
    <q-card style="height: 600px; width: 400px">
      <q-form>
        <h6 class="text-center q-mb-sm" style="font-family: 'ONE-Mobile-Title'">
          Welcome
        </h6>
        <h5 class="text-center q-mt-sm" style="font-family: 'ONE-Mobile-Title'">
          Login
        </h5>
        <div class="row basic-row">
          <div class="col">
            <q-input
              v-model="state.id"
              label="User ID"
              @keydown.enter.prevent="focusPassword"
            >
              <template #prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="basic-row">
          <div class="col">
            <q-input
              v-model="state.password"
              name="password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              hind="Password"
              :rules="[val => !!val || '비밀번호를 입력해주세요.']"
              lazy-rules
              @keydown.enter.prevent="login"
            >
              <template #prepend>
                <q-icon name="password" />
              </template>
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="basic-row justify-center">
          <q-btn
            class="glossy full-width q-mt-md"
            rounded
            color="primary"
            size="md"
            label="Login"
            @click="login"
          />
        </div>
        <div class="basic-row justify-center">
          <q-btn
            class="full-width q-my-sm"
            rounded
            color="white"
            text-color="black"
            size="md"
            label="Join"
            @click="join"
          />
        </div>
        <div class="row basic-row justify-between q-mx-sm">
          <p style="cursor: pointer" @click="join">회원가입</p>
          <p>아이디 / 비밀번호 찾기</p>
        </div>
        <div class="basic-row justify-center text-center">
          <img
            src="../assets/naver-logo-button.png"
            alt="네이버 로고"
            width="140"
            height="37"
            style="cursor: pointer; margin-right: 25px"
            @click="naverLogin"
          />
          <img
            src="../assets/kakao_login_medium_narrow.png"
            alt="카카오 로고"
            width="140"
            height="37"
            style="cursor: pointer"
            @click="kakaoLogin"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../stores/user-store'

export default defineComponent({
  name: 'LogIn',
  setup() {
    const router = useRouter()
    const isPwd = ref(true)
    const state = reactive({
      loggedIn: false,
      id: null,
      password: null,
    })
    const userStore = useUsersStore()
    const login = async () => {
      const loginData = {
        id: state.id,
        password: state.password,
      }
      await userStore.login(loginData)

      if (userStore.accessToken) router.push({ path: '/' })
    }
    function join() {
      router.push({ path: '/join' })
    }
    function focusPassword() {
      if (document.getElementsByName('password')) {
        document.getElementsByName('password')[0].focus()
      }
    }
    const naverLogin = () => {
      const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&state=${process.env.NAVER_STATE}&redirect_uri=${process.env.NAVER_CALLBACK_URL}`
      window.location.href = url
    }
    const kakaoLogin = () => {
      const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}` // &scope=account_email,gender,age_range,birthday`
      window.location.href = url
    }

    return {
      isPwd,
      state,
      login,
      join,
      focusPassword,
      naverLogin,
      kakaoLogin,
    }
  },
})
</script>

<style scoped></style>
