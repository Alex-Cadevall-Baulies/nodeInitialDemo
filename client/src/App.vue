<template>
    <h1>
        This is the landing page
    </h1>
    <button @click="redirect">Chat Here</button>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import socket from './services/socketio.js';

export default {
name: 'App',
  components: {},
  methods: {
    redirect() {
      this.$router.push({name : 'chat'})
    }
  },
  created() {
    socket.connect()
  },
  beforeUnmount() {
    if(socket)
    socket.disconnect()
  }
}
</script>

<style>
</style>
