<template>
    <div id="login">
    <form id="login" action="" @submit.prevent="checkData">
        <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
        <p>Chat Nickname: <input id="nickname" autocomplete="off" required v-model="nickname" /></p>
        <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
        <button>submit</button>
    </form>
   
    <p>Already have an account? <RouterLink :to="{ name: 'home'}">Click here</RouterLink> </p>
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },

    methods: {
    },
}
</script>

<style>

</style>