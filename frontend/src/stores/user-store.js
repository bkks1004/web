const { defineStore } = require('pinia')

import { ref, computed } from "vue"
// composition
export const useUserStore = defineStore('user-store', () => {
    const user = ref([])
    function getUser()
})
