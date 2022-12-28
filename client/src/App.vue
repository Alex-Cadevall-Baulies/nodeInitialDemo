<template>
 <div id="wrapper">
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
