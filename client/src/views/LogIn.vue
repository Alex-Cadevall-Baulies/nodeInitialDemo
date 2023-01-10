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
import dataService from '../services/dataService'

export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },

    methods: {
        async checkData() {
            await dataService.login({
                "username": this.username,
                "password": this.password
            }).then(res => {
                if(res.data.success == true) {
                    localStorage.setItem('token', res.data.accessToken)
                    this.$router.push({name : 'chat'})}
                })
            .catch(res => {
                alert(res.response.data.msg)
                this.username = "",
                this.password = ""
            })
        }
    },
}
</script>

<style>

</style>