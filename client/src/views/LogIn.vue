<template>
    <div id="login">
    <form id="login" action="" @submit.prevent="checkData">
        <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
        <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
        <button>submit</button>
    </form>
   
    <p>No Account? <RouterLink :to="{ name: 'singup'}">Click here</RouterLink> </p>
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
    data() {
        return {
            username: "",
            nickname: "",
            password: ""
        }
    },

    methods: {
    },
}
</script>

<style>

</style>