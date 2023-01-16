<template>
 <div id="wrapper">
    <router-view />
 </div>   
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import socket from './services/socketio.js';

export default {
name: 'App'
}
</script>

<style>
</style>
