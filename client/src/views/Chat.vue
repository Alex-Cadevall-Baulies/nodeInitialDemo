<template>
    <h1>
        This is the chat page
    </h1>

    <p> This is the username: {{ username }}</p>
    <button @click="logout">Logout</button>

    <div>
        <div v-for="username in connectedUsers" :key="username">
            <ul> {{ username }}</ul>
        </div>
    </div>

    <p> Current room: {{ room }}</p>
    <div>
        <div v-for="room in subscribedRooms" :key="room">
            <button @click="enterRoom(room)"> {{ room }}</button>
            <button @click="deleteRoom(room)"> X </button>
        </div>
    </div>

    <div id="roomBar">
        <form id="roomForm" action="" @submit.prevent="addRoom">
            <input id="input" autocomplete="off" v-model="room" />
            <button>Join Room</button>
        </form>
    </div>

    <div id="chat">
        <div v-if="noMessages">
            No messages yet, be the first one to post!
        </div>
        <div v-for="item in chat" :key="item">
            <span>{{ item.username }} : {{ item.message }}</span>
        </div>
    </div>

    <div id="messageBar">
        <form id="messageForm" action="" @submit.prevent="sendMessage">
            <input id="input" autocomplete="off" required v-model="newMessage" />
            <button>Send</button>
        </form>
    </div>

</template>

<script>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export default {
    setup() {
        const username = ref("")
        const connectedUsers = ref([])
        const newMessage = ref('')
        const room = ref('main')
        const noMessages = ref(false)
        const chat = ref([])
        const subscribedRooms = ref([])
        const router = useRouter()

        //Vue3 composition API makes us call socket inside setup
        const socket = io(`http://localhost:8080`,
            { query: { token: localStorage.getItem('token') } })

        onMounted(() => {
            startChat()
        })

        onUnmounted(() => {
            leaveChat()
        })

        socket.on('login', (data) => {
            connectedUsers.value.push(data.username)
            chat.value.push(data)
            connectUsers()
        }),

            socket.on('showMessage', (data) => {
                console.log('showMessage activated')
                console.log(data)
                chat.value.push(data)
            }),

            socket.on('left', (data) => {
                chat.value.push(data)
                const index = connectedUsers.value.indexOf(data.username);
                console.log(index)
                connectedUsers.value.splice(index, 1);
            }),

            socket.on('joined', (joinedData) => {
                connectedUsers.value.push(joinedData.username)
                chat.value.push(joinedData)
                connectUsers()
            })

        const sendMessage = async () => {
            if (newMessage.value) {
                try {
                    const data = {
                        "username": username.value,
                        "chatroom": room.value,
                        "message": newMessage.value,
                    }

                    await fetch('http://localhost:8080/chat', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })

                    socket.emit('sendMessage', data)
                    noMessages.value = false
                    newMessage.value = '';

                } catch (err) {
                    console.log(err)
                }
            }
        }

        const leaveRoom = () => {
            const data = {
                "username": username.value,
                "chatroom": room.value,
            }
            socket.emit('leaveRoom', data)
        }

        const enterRoom = async (newRoom) => {
            console.log(`this is the ${newRoom}`)
            //We logout user from previous room
            leaveRoom()
            room.value = newRoom

            const data = {
                "username": username.value,
                "chatroom": room.value,
            }
            socket.emit('joinRoom', data)
            chat.value = []
            connectedUsers.value = []
            getMessages()
            getConnectedUsers()
        }

        const connectUsers = async () => {
            await fetch('http://localhost:8080/chat/connect', {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "username": username.value,
                    "chatroom": room.value
                })
            })
        }

        const disconnectUsers = async () => {
            await fetch('http://localhost:8080/chat/connect', {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "username": username.value,
                    "chatroom": room.value
                })
            })
        }

        const getConnectedUsers = async () => {
            const usersOnline = await fetch('http://localhost:8080/chat/connect', {
                method: 'GET',
                headers: {
                    "Content-type": "application/json"
                },
            })

            const resDB = await usersOnline.json()
            if (resDB.success) {
                resDB.getConnections.filter(data => {
                    if (data.chatroom === room.value) {
                        connectedUsers.value.push(data.username)
                    }
                })
            }
        }

        const logout = () => {
            leaveRoom()
            deleteRoom()
            if (socket)
                socket.disconnect()
            router.push({ name: 'login' })
            localStorage.removeItem('token');
            localStorage.removeItem('user');

        }

        const getMessages = async () => {
            try {
                const res = await fetch('http://localhost:8080/chat', {
                    method: 'GET',
                    headers: {
                        "Content-type": "application/json"
                    }
                })

                const resDB = await res.json()
                if (resDB.success) {
                    resDB.data.filter(data => {
                        if (data.chatroom === room.value) {
                            chat.value.push(data)
                        }
                    })
                    noMessages.value = false
                } else {
                    noMessages.value = true
                }

            } catch (err) {
                console.log(err)
            }
        }

        const addRoom = async () => {
            if (room.value) {
                try {
                    const res = await fetch('http://localhost:8080/user/rooms', {
                        method: 'PUT',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            "username": username.value,
                            "chatroom": room.value
                        })
                    })
                    const resDB = await res.json()
                    if (resDB.success) {
                        subscribedRooms.value.push(resDB.chatroom)
                        alert(resDB.msg)
                        enterRoom(room.value)
                    } else {
                        enterRoom(room.value)
                        alert(resDB.msg)
                    }
                }
                catch (err) { console.log(err) }
            }
        }

        const getRooms = async () => {
            try {
                const res = await fetch('http://localhost:8080/user/rooms', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        "username": username.value
                    })
                })
                const resDB = await res.json()

                //all people should have at least main room added into array
                if (resDB.success) {
                    await resDB.chatroom.map(element => subscribedRooms.value.push(element))
                }
            }
            catch (err) { console.log(err) }
        }

        const deleteRoom = async (room) => {
            if (room == 'main') return alert(`main room cannot be deleted!`)
            const res = await fetch('http://localhost:8080/user/rooms', {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "username": username.value,
                    "chatroom": room
                })
            })
            const resDB = await res.json()

            //there will always be a room to delete
            if (resDB.success) {
                const index = subscribedRooms.value.indexOf(resDB.chatroom);
                subscribedRooms.value.splice(index, 1);
            }
        }

        const startChat = async () => {
            username.value = localStorage.getItem('user')
            getRooms()
            getMessages()
            getConnectedUsers()

            const data = {
                username: username.value,
                chatroom: room.value
            }

            socket.emit('new-user', data)
        }

        const leaveChat = async () => {
            disconnectUsers()
            if (socket)
                socket.disconnect()
        }

        return { username, connectedUsers, room, subscribedRooms, room, noMessages, chat, newMessage, logout, enterRoom, deleteRoom, addRoom, sendMessage }
    }
}
</script>

<style>
#messageForm {
    background: rgba(0, 0, 0, 0.15);
    padding: 0.25rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 3rem;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
}

#input {
    border: none;
    padding: 0 1rem;
    flex-grow: 1;
    border-radius: 2rem;
    margin: 0.25rem;
}

#input:focus {
    outline: none;
}

#messageForm>button {
    background: #333;
    border: none;
    padding: 0 1rem;
    margin: 0.25rem;
    border-radius: 3px;
    outline: none;
    color: #fff;
}

#messages {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#messages>li {
    padding: 0.5rem 1rem;
}

#messages>li:nth-child(odd) {
    background: #efefef;
}
</style>