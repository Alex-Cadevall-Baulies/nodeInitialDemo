<template>
 <div id="wrapper">
  <nav>
    <button @click="redirect">To Chat</button>
  </nav>
  <router-view />
 </div>   
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
