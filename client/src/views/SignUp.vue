<template>
    <main>
        <div class="box">
            <div class="text" id="login">
                <form id="login" action="" @submit.prevent="createData">
                    <p>Username: <input id="username" autocomplete="off" required v-model="username" /></p>
                    <p>Chat Nickname: <input id="nickname" autocomplete="off" required v-model="nickname" /></p>
                    <p>Password: <input id="password" autocomplete="off" required v-model="password" /></p>
                    <p>Confirm Password: <input id="confirmPassword" autocomplete="off" required
                            v-model="confirmPassword" />
                    </p>
                    <button>submit</button>
                </form>

                <p>Already have an account? <RouterLink :to="{ name: 'login' }">Click here</RouterLink>
                </p>
            </div>
        </div>
    </main>
</template>

<script>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
    setup() {
        const username = ref('')
        const nickname = ref('')
        const password = ref('')
        const confirmPassword = ref('')
        const router = useRouter()

        const createData = async () => {
            //we check if password and confirm password match, if not we return null
            if (password.value !== confirmPassword.value) {
                password.value = ''
                confirmPassword.value = ''
                return alert('Password and confirm password must be the same')
            }

            //if password and c. password match we send info through dataService.js
            try {
                const res = await fetch('http://localhost:8080/user/register', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        //we use .value as we are sending refs
                        "username": username.value,
                        "nickname": nickname.value,
                        "password": password.value
                    })
                })
                const resDB = await res.json()
                console.log(resDB)

                //If registration works we confirm and send to login
                if (resDB.success === true) {
                    localStorage.setItem('token', resDB.accessToken)
                    localStorage.setItem('user', nickname.value)
                    router.push({
                        name: 'chat'
                    })
                }
                else {
                    //If registration does not work we inform and clean fields
                    alert(resDB.msg)
                    username.value = ''
                    nickname.value = ''
                    password.value = ''
                    confirmPassword.value = ''
                }
            } catch (err) {
                console.log(err)
            }
        }
        return { username, nickname, password, confirmPassword, createData }
    },
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