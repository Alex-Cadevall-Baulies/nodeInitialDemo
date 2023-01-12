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
            try{
                const res = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        "username": this.username,
                        "password": this.password  
                    })
                })
                const resDB = await res.json()
                console.log(resDB)
                if(resDB.success === true) {
                    localStorage.setItem('token', resDB.accessToken)
                    this.$router.push({name : 'chat'})
                } else{
                    alert(resDB.msg)
                    this.username = "",
                    this.password = ""
                }
                }catch (err){
                    console.log(err)
            }
        }
    },
}
</script>

<style>

</style>