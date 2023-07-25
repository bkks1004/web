<template>
  <q-page class="flex flex-center">
    <!-- <img
        alt="Quasar logo"
        src="~assets/quasar-logo-vertical.svg"
        style="width: 200px; height: 200px"
      > -->
    <q-card style="height: 600px; width: 400px">
      <h6 class="text-center q-mb-sm" style="font-family: 'ONE-Mobile-Title'">
        Welcome
      </h6>
      <h5 class="text-center q-mt-sm" style="font-family: 'ONE-Mobile-Title'">
        Login
      </h5>
      <div class="row basic-row">
        <div class="col">
          <q-input v-model="state.id" label="User ID">
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
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            hind="Password"
            :rules="[val => !!val || '비밀번호를 입력해주세요.']"
            lazy-rules
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
    </q-card>
  </q-page>
</template>

<script>
// import { api } from 'src/boot/axios'
import { axios } from 'src/boot/axios'
import { ref, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LogIn',
  setup() {
    // const id = ref('')
    // const password = ref('')
    const router = useRouter()
    const isPwd = ref(true)
    const state = reactive({
      loggedIn: false,
      id: null,
      password: null,
    })

    // await this.$axios.get('http://localhost:3000/user/').then(res => {
    //   console.log(res)
    // })
    axios.get('web-server/user').then(res => {
      console.log(res.data)
    })

    // this.$axios.get('http://localhost:3000/user').then(res => {
    //   console.log(res)
    // })
    // this.$axios.get('web-server/user').then(res => {
    //   console.log(res)
    // })

    const login = () => {
      console.log('로그인 구현', state.id, state.password)
      const args = {
        id: state.id,
        password: state.password,
      }
      axios.post('web-server/user', state.id).then(res => {
        console.log(res)
      })
      axios.post('web-server/user', args).then(res => {
        console.log(res)
      })
    }
    function join() {
      console.log('회원가입 구현')
      router.push({ path: '/join' })
    }

    return {
      // id,
      // password,
      isPwd,
      state,
      login,
      join,
    }
  },
})
</script>

<style scoped></style>
