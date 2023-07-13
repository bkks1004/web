<template>
  <q-page class="flex flex-center">
    <q-card style="height: 800px; width: 400px">
      <h6
        class="text-center q-mt-lg q-mb-sm"
        style="font-family: 'ONE-Mobile-Title'; font-size: 24px"
      >
        회원가입
      </h6>
      <div class="row basic-row">
        <div class="col">
          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.id"
                  label="아이디"
                  dense
                  :rules="[
                    val => !!val || '아이디를 입력해주세요.',
                    val => val.length <= 45 || '45자 이내로 입력해주세요.',
                    val => idForm.test(val) || '영어, 숫자로만 입력해주세요.',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.password"
                  label="비밀번호"
                  :type="isPwd ? 'password' : 'text'"
                  dense
                  :rules="[
                    val => !!val || '비밀번호를 입력해주세요.',
                    val =>
                      pwdForm.test(val) ||
                      '영어, 숫자, 특수문자가 1개 이상 포함된 6~20자리여야 합니다.',
                  ]"
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
                <small style="color: gray"
                  >특수문자 : !, @, #, $, %, ^, &, (, ), -, _, +, =</small
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.passwordConfirm"
                  label="비밀번호 확인"
                  dense
                  :rules="[
                    val =>
                      val === data.password || '비밀번호가 일치하지 않습니다.',
                  ]"
                  lazy-rules
                >
                  <template #prepend>
                    <q-icon name="password" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdConfirm = !isPwdConfirm"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="row basic-row">
        <div class="col">
          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.name"
                  label="이름"
                  dense
                  :rules="[
                    val =>
                      (!!val && val.length <= 10) ||
                      '올바른 이름을 입력해주세요.',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.birthday"
                  label="생년월일"
                  type="date"
                  dense
                >
                  <template #prepend>
                    <q-icon name="perm_contact_calendar" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <!-- <q-input v-model="data.sex" label="성별" dense>
                  <template #prepend>
                  </template>
                </q-input> -->
                <q-btn-toggle
                  v-model="data.sex"
                  push
                  flat
                  spread
                  toggle-color="primary"
                  :options="[
                    { label: '남자', value: 'M' },
                    { label: '여자', value: 'W' },
                  ]"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="data.phoneNumber"
                  label="휴대폰 번호"
                  mask="###-####-####"
                  unmasked-value
                  dense
                  :rules="[
                    val =>
                      phoneNumberForm.test(val) ||
                      '올바른 번호를 입력해주세요.',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="stay_current_portrait" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  ref="emailRef"
                  v-model="data.email"
                  label="이메일"
                  dense
                  :rules="[
                    val =>
                      emailForm.test(val) || '올바른 이메일을 입력해주세요.',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="mail" />
                  </template>
                  <!-- <template #append>
                    <q-btn
                      color="white"
                      text-color="black"
                      label="인증번호 전송"
                    />
                  </template> -->
                </q-input>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  color="white"
                  text-color="black"
                  label="이메일 인증"
                  size="md"
                  @click="sendMailAuthCode"
                />
              </q-item-section>
            </q-item>
            <q-item v-if="openAuthCode">
              <q-item-section>
                <q-input
                  v-model="etcData.authCode"
                  label="인증코드"
                  dense
                  clearable
                >
                  <template #append>
                    <small style="font-size: 14px; color: red">
                      {{ etcData.timeStr }}
                    </small>
                  </template>
                </q-input>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  color="white"
                  text-color="black"
                  label="확인"
                  size="md"
                  @click="checkAuthCode"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="row basic-row">
        <div class="col text-center">
          <q-btn color="primary" class="full-width" label="가입하기" />
        </div>
        <q-btn @click="test">test</q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { axios } from 'src/boot/axios'

export default defineComponent({
  name: 'Join',
  setup() {
    const data = reactive({
      id: null,
      password: null,
      passwordConfirm: null,
      name: null,
      birthday: null,
      sex: null,
      phoneNumber: null,
      email: null,
    })
    const etcData = reactive({
      authCode: null,
      authCodeConfirm: null,
      authCodeValid: false,
      timer: null,
      timeCounter: 180,
      timeStr: '03:00',
    })
    const emailRef = ref(null)
    const openAuthCode = ref(true) // FIXME: false

    const prettyTime = () => {
      const time = etcData.timeCounter / 60
      const minutes = parseInt(time, 10)
      const seconds = Math.round((time - minutes) * 60)
      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    }
    const stopTimer = timer => {
      clearInterval(timer)
      etcData.timeCounter = 0
    }
    const startTimer = () => {
      etcData.timeCounter = 1 // 180
      const interval = setInterval(() => {
        etcData.timeCounter -= 1
        etcData.timeStr = prettyTime()
        if (etcData.timeCounter <= 0) {
          etcData.authCodeValid = false
          stopTimer(interval)
          alert('인증 시간이 만료되었습니다.\n재인증 받아주세요.')
        }
      }, 1000)
      return interval
    }

    const test = () => {
      console.log('data', data)
      axios.post('web-server/user', data).then(res => {
        console.log(res)
      })
    }
    return {
      data,
      etcData,
      test,
      // sendMailAuthCode,
      isPwd: ref(true),
      isPwdConfirm: ref(true),
      emailRef,
      openAuthCode,
      sendMailAuthCode() {
        emailRef.value.validate()
        if (!emailRef.value.hasError) {
          openAuthCode.value = true
          etcData.authCodeValid = true
          if (!etcData.timer) {
            stopTimer(etcData.timer)
            etcData.timer = null
          }
          etcData.timer = startTimer()
        } else return
        console.log('email', data.email)
        axios
          .post('web-server/user/email-auth', { mail: data.email })
          .then(res => {
            console.log('메일인증', res)
            etcData.authCodeConfirm = res.data.authCode
          })
      },
      checkAuthCode() {
        console.log(etcData.authCodeConfirm)
        if (!etcData.authCodeValid) {
          alert('인증 시간이 만료되었습니다.\n재인증 받아주세요.')
          return
        }
        if (etcData.authCode === etcData.authCodeConfirm) {
          stopTimer(etcData.timer)
          etcData.timeStr = null
          alert('인증 성공')
        } else {
          alert(
            '인증 코드를 확인해주세요.\n(메일이 오지 않으면 스팸함을 확인해주세요.)'
          )
        }
      },
      idForm: ref(/^[A-Za-z0-9]*$/),
      pwdForm: ref(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&+=()\-_])(?!.*\s).{6,20}$/
      ),
      phoneNumberForm: ref(/^010\d{8}$/),
      emailForm: ref(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    }
  },
})
</script>
<style scoped></style>
