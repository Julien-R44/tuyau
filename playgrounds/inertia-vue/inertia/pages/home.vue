<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

defineProps<{ version: number }>()
</script>

<template>
  <Head title="Homepage" />

  <div class="container">
    <div class="title">AdonisJS {{ version }} x Inertia x Vue.js</div>

    <span>
      Learn more about AdonisJS and Inertia.js by visiting the
      <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
    </span>
  </div>
</template>