<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'

defineProps<{ version: number }>()
</script>

<template>
  <Head title="Homepage" />

  <div class="container">
    <div class="title">AdonisJS {{ version }} x Inertia x Vue.js</div>

    <Link route="posts.create" :params="[]"> Create a new post </Link>
    <Link route="posts_comments.create" :params="{ postId: 1 }"> Create comment for post 1 </Link>
    <span>
      Learn more about AdonisJS and Inertia.js by visiting the
      <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
    </span>
  </div>
</template>
