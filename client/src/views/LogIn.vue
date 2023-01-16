<template>
    <div id="login">
        <form id="login" action="" @submit.prevent="checkData">
            <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
            <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
            <button>submit</button>
        </form>

        <p>No Account? <RouterLink :to="{ name: 'singup' }">Click here</RouterLink>
        </p>
    </div>
</template>

<script>
import { RouterLink, useRouter} from 'vue-router'
import { ref } from 'vue'

export default {
    setup() {
        const username = ref('')
        const password = ref('')
        const router = useRouter()

        const checkData = async () => {
            if(!username.value || !password.value) {
                return alert('Please fill out the fields')
            }

            try {
                const res = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        //we use .value as we are sending refs
                        "username": username.value,
                        "password": password.value
                    })
                })
                const resDB = await res.json()
                console.log(resDB)
                if (resDB.success === true) {
                    localStorage.setItem('token', resDB.accessToken)
                    localStorage.setItem('user', username.value)
                    router.push({
                        name: 'chat',
                    })
                } else {
                    alert(resDB.msg)
                    username = "",
                    password = ""
                }
            } catch (err) {
                console.log(err)
            }
        }
    return {username, password, checkData}
    }
}
</script>

<style>

</style>