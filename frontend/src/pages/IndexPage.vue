<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->
    <!-- <q-card style="height: 600px; width: 400px">
      <h6 class="text-center q-mb-sm" style="font-family: 'ONE-Mobile-Title'">
        Welcome
      </h6>
      <h5 class="text-center q-mt-sm" style="font-family: 'ONE-Mobile-Title'">
        Login
      </h5>
      <div class="row basic-row">
        <div class="col">
          <q-input v-model="id" label="User ID">
            <template #prepend>
              <q-icon name="account_circle" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="basic-row">
        <div class="col">
          <q-input label="Password" type="password" hind="Password">
            <template #prepend>
              <q-icon name="password" />
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
      <div class="row basic-row justify-center">
        <p>아이디 / 비밀번호 찾기</p>
      </div>
    </q-card> -->
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const id = ref('')
    const password = ref('')
    function login() {
      console.log('로그인 구현', id.value, password.value)
    }

    function join() {
      console.log('회원가입 구현')
    }

    return {
      id,
      password,
      login,
      join,
    }
  },
})
</script>

<style scoped>
.basic-row {
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 0px 16px;
}
</style>
