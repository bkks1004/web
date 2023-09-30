<template>
  <div>profile 추가 예정</div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useUsersStore } from '../stores/user-store'

export default {
  name: 'Profile',
  setup() {
    const userStore = useUsersStore()
    const data = reactive({
      id: userStore.id,
      name: null,
      yearOfBirth: null,
      birthday: null,
      email: null,
      sex: 'M',
      phoneNumber: null,
      createDate: null,
    })
    const userInfo = async () => {
      const config = {
        method: 'get',
        url: '/web-server/user',
        headers: {
          // TODO: authorization header 추가
          'Content-Type': 'application/json',
        },
        params: { id: data.id },
      }
      await axios(config)
        .then(res => {
          const userData = res.data.result
          data.name = userData.name
          data.yearOfBirth = userData?.year_of_birth
          data.birthday = userData?.birthday
          data.email = userData.email
          data.sex = userData?.sex
          data.phoneNumber = userData?.phone_number
          data.createDate = userData.create_date.split('T')
        })
        .catch(err => {
          alert(err.response.data.error.message)
        })
    }
    onMounted(() => {
      userInfo()
    })
    return {
      data,
    }
  },
}
</script>
<style scoped></style>
