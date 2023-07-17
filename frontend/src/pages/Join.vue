<template>
  <q-page class="flex flex-center">
    <q-card style="height: 800px; width: 400px">
      <q-form ref="registRef">
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
                    ref="idRef"
                    v-model="data.id"
                    label="아이디"
                    dense
                    :rules="[
                      val => !!val || '아이디를 입력해주세요.',
                      val =>
                        (4 <= val.length && val.length <= 45) ||
                        '4~45자로 입력해주세요.',
                      val => idForm.test(val) || '영어, 숫자로만 입력해주세요.',
                    ]"
                    lazy-rules
                  >
                    <template #prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    color="white"
                    text-color="black"
                    label="중복 확인"
                    size="md"
                    @click="checkDuplicateId"
                  />
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
                    :type="isPwdConfirm ? 'password' : 'text'"
                    dense
                    :rules="[
                      val =>
                        val === data.password ||
                        '비밀번호가 일치하지 않습니다.',
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
                    :rules="[
                      val => checkCalendar(val) || '생년월일을 확인해주세요.',
                    ]"
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
                    lazy-rules
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
                    lazy-rules
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
            <q-btn
              color="primary"
              class="full-width"
              label="가입하기"
              @click="registUser"
            />
          </div>
          <!-- <q-btn @click="registUser">test</q-btn> -->
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { axios } from 'src/boot/axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Join',
  setup() {
    const data = reactive({
      id: null,
      password: null,
      passwordConfirm: null,
      name: null,
      birthday: null,
      sex: 'M',
      phoneNumber: null,
      email: null,
    })
    const etcData = reactive({
      checkId: false,
      authCode: null, // 입력받은 인증코드 값
      authCodeComparison: null, // 생성된 인증코드 값
      authCodeValid: false, // 만료 여부
      confirmAuthCode: false, // 인증코드 확인여부
      timer: null,
      timeCounter: 180,
      timeStr: '03:00',
    })
    const registRef = ref(null)
    const idRef = ref(null)
    const emailRef = ref(null)
    const openAuthCode = ref(false)
    const router = useRouter()

    const checkDuplicateId = async () => {
      const valid = idRef.value.validate()
      if (valid) {
        await axios
          .post('web-server/user/check-id-duplicate', { id: data.id })
          .then(res => {
            console.log(res)
            alert(`해당 ID(${data.id})는 사용가능합니다.`)
            etcData.checkId = true
          })
          .catch(err => {
            alert(err.response.data.error.message)
            etcData.checkId = false
          })
      }
    }
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
      etcData.timeCounter = 180
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
    const checkCalendar = date => {
      const today = new Date()
        .toLocaleDateString()
        .replace(/\./g, '')
        .replace(/\s/g, '-')
      console.log(today)
      const todayDate = new Date(today)
      const birthdayDate = new Date(date)
      if (birthdayDate > todayDate) return false
      return true
    }
    const registUser = async () => {
      try {
        const valid = await registRef.value.validate()
        if (valid) {
          if (!etcData.checkId) {
            throw new Error('아이디 중복확인을 해주세요.')
          }
          if (!etcData.authCodeValid) {
            throw new Error('이메일 인증을 수행해주세요.')
          }
          if (!etcData.confirmAuthCode) {
            throw new Error('인증코드을 확인해주세요.')
          }
          axios
            .post('web-server/user', data)
            .then(res => {
              alert(`아이디가 생성되었습니다.\nID: ${res.data.id}`)
              router.push({ path: '/login' })
            })
            .catch(err => {
              alert(err.response.data.error.message)
            })
        }
      } catch (err) {
        alert(err)
      }
    }
    const sendMailAuthCode = () => {
      emailRef.value.validate()
      if (!emailRef.value.hasError) {
        if (!etcData.timer) {
          stopTimer(etcData.timer)
          etcData.timer = null
        }
        axios
          .post('web-server/user/email-auth', { email: data.email })
          .then(res => {
            console.log('메일인증', res)
            etcData.authCodeComparison = res.data.authCode
            openAuthCode.value = true
            etcData.authCodeValid = true
            etcData.timer = startTimer()
          })
          .catch(err => {
            stopTimer(etcData.timer)
            openAuthCode.value = false
            etcData.timer = null
            alert(err.response.data.error.message)
          })
      }
    }
    const checkAuthCode = () => {
      if (openAuthCode.value && !etcData.authCodeValid) {
        alert('인증이 만료되었습니다.\n재인증 받아주세요.')
        return
      }
      if (etcData.authCode === etcData.authCodeComparison) {
        stopTimer(etcData.timer)
        etcData.timeStr = null
        etcData.confirmAuthCode = true
        alert('인증 성공')
      } else {
        alert(
          '인증 코드를 확인해주세요.\n(메일이 오지 않으면 스팸함을 확인해주세요.)'
        )
      }
    }

    // const test = () => {
    //   console.log('data', data)
    //   axios.post('web-server/user', data).then(res => {
    //     console.log(res)
    //   })
    // }
    return {
      data,
      etcData,
      // test,
      // sendMailAuthCode,
      isPwd: ref(true),
      isPwdConfirm: ref(true),
      idRef,
      registRef,
      registUser,
      checkCalendar,
      checkDuplicateId,
      emailRef,
      openAuthCode,
      sendMailAuthCode,
      checkAuthCode,
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
