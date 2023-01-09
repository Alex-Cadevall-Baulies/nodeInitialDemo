<template>
    <div id="login">
    <form id="login" action="" @submit.prevent="createData">
        <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
        <p>Chat Nickname: <input id="nickname" autocomplete="off" required v-model="nickname" /></p>
        <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
        <p>Confirm Password: <input id="confirmPassword" autocomplete="off" required v-model="confirmPassword" /></p>
        <button>submit</button>
    </form>
   
    <p>Already have an account? <RouterLink :to="{ name: 'login'}">Click here</RouterLink> </p>
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import dataService from '../services/dataService'

export default {
    data() {
        return {
            username: "",
            nickname: "",
            password: "",
            confirmPassword: ""
        }
    },

    methods: {
        async createData() {
            //we check if password and confirm password match, if not we return null
            if (this.password !== this.confirmPassword) return
            
            //if password and c. password match we send info through dataService.js
            await dataService.create({
                "username": this.username,
                "nickname": this.nickname,
                "password": this.password
            }).then(res => {
                if(res.data.success == true) {
                    alert(res.data.msg)
                    this.$router.push({name : 'login'})}
                })
            .catch(res => {
                alert(res.response.data.msg),
                this.password = ''
                this.confirmPassword = ''
            })

        }
    },
}
</script>

<style>

</style>