<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useRouter } from '@tuyau/inertia/vue'

defineProps<{ version: number }>()


const router = useRouter()

const backToHome = () => {
  router.visit({
    route: 'home'
  })
}

</script>

<template>

  <Head title="Homepage" />

  <div class="container">
    <div class="title">AdonisJS {{ version }} x Inertia x Vue.js</div>

    <button @click="backToHome">Go to home</button>
    <span>
      Learn more about AdonisJS and Inertia.js by visiting the
      <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
    </span>
  </div>
</template>
