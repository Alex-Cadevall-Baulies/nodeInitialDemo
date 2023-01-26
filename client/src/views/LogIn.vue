<template>
    <main>
    <div class = "box">
    <div class = text id="login">
        <form id="login" action="" @submit.prevent="checkData">
            <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
            <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
            <button>submit</button>
        </form>

        <p>No Account? <RouterLink :to="{ name: 'singup' }">Click here</RouterLink>
        </p>
    </div>
</div>
</main>
</template>

<script>
import { RouterLink, useRouter} from 'vue-router'
import { ref } from 'vue'

export default {
    setup() {
        let username = ref('')
        let password = ref('')
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
                    localStorage.setItem('user', resDB.nickname)
                    router.push({
                        name: 'chat',
                    })
                } else {
                    alert(resDB.msg)
                    username.value = "",
                    password.value = ""
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
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: orange;
    height: 100vh;
    font-family: "Quicksand";
    font-size: 16px
}

.box {
    height: 500px;
    width: 500px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: white;
    border-radius: 50%;
    text-align: center;
}

.text {
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
}

button {
    width: 70px;
    height: 30px;
    background: #333;
    border-radius: 5%;
    outline: none;
    color: #fff;
}

</style>