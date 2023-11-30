<script setup>
import { ref, onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'


let userRole = ref('')

const getUserRole = async () => {
  const token = localStorage.getItem('token') // replace this with how you store your token
  if (!token) {
    console.log('No token found')
    return
  }
  const response = await fetch('/api/roles', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log(response) // log the entire response object

  if (response.ok) {
    const json = await response.json()
    userRole.value = json.role
    console.log(userRole.value)
  } else {
    console.log('Error:', response.status, response.statusText)
  }
}

onMounted(() => {
  getUserRole()
  // getEvents()
})
provide('userRole', userRole)
</script>

<template>


  <div class = "container">
  <RouterView />
  </div>
</template>

<style scoped>
</style>


