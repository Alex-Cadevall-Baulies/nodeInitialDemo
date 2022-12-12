<template>
    <h1>
        This is the landing page
    </h1>
    <RouterLink :to="{ name: 'chat'}"> Chat View </RouterLink>
    <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
</style>
