<template>
    <h1>
        This is the landing page
    </h1>
    <RouterLink :to="{ name: 'chat'}"> Chat View </RouterLink>
    <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import SocketioService from './services/socketio.js';

export default {
  name: 'App',
  components: {},
  created() {
    SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style>
</style>
