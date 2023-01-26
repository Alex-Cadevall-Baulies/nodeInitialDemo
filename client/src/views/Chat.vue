<template>
<div class = "container">

    <div id="information">
        <div class = "left-information">
            <p> Current Room:  <span class = "bold"> {{ room }} </span></p>
        </div>
        <div class="right-information">
            <p> Current User: <span class = "bold"> {{ username }} </span> <button id = "logout" @click="logout">Logout</button> </p>
        </div>
    </div>

    <div id="contentInfo">
<div id="sideInfo">
    <div id="rooms">
        <div id="contentBox">
            <form id="roomForm" action="" @submit.prevent="addRoom">
                <input id="roomInput" autocomplete="off" v-model="room" />
                <button id="addRoom">Add Room</button>
            </form>
        </div>

    <div id="contentBox">
        <p id="insideTitle">Registered Rooms</p>
        <div id="elementList" v-for="room in subscribedRooms" :key="room">
            <button id = "roomName" @click="enterRoom(room)"> {{ room }}</button>
            <button id = "deleteRoom" @click="deleteRoom(room)"> X </button>
        </div>
    </div>
    
    <div id="users">
        <div id="contentBox">
        <p id="insideTitle">Connected Users</p>
        <div id="elementList" v-for="username in connectedUsers" :key="username">
            <button id = "user"> {{ username }}</button>
        </div>
    </div>
    </div>


    </div>
    </div>

    <div id="chat">
        <div id = "chatbox">
        <div v-if="noMessages">
            No messages yet, be the first one to post!
        </div>
        <div  id="elementList" v-for="item in chat" :key="item" :class="{'my-message': item.username === username, 'recived-message': item.username !== username}">
            <span>  <span class = "bold"> {{ item.username }} </span> : {{ item.message }}</span>
        </div>
    </div>
        
        <div id="messageBar">
            <form id="messageForm" action="" @submit.prevent="sendMessage">
                <input id="messageInput" autocomplete="off" required v-model="newMessage" />
                <button>Send</button>
            </form>
        </div>
    </div>
</div>
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
            username.value = localStorage.getItem('user')
            getRooms()
            getMessages()
            getConnectedUsers()

            const data = {
                username: username.value,
                chatroom: room.value
            }

            socket.emit('new-user', data)
        })

        onUnmounted(() => {
            leaveRoom()
            disconnectUsers()
            if (socket)
                socket.disconnect()
        })

        socket.on('login', (data) => {
            if(!connectedUsers.value.includes(data.username)) {
                connectedUsers.value.push(data.username)
            }
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

        const enterRoom = (newRoom) => {
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
            disconnectUsers()
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

        return { username, connectedUsers, room, subscribedRooms, room, noMessages, chat, newMessage, logout, enterRoom, deleteRoom, addRoom, sendMessage }
    }
}
</script>

<style>
.container {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: "Quicksand";
    font-size: 16px

}

#information {
    height: 50px;
    width: 100%;
}

.left-information {
    float: left;
    width: 50%;
}

.right-information{
    float: right;
    width: 50%;
    text-align: right;
}
#chat {
    max-width: 100%;
}

#contentInfo {
    display: grid;
    grid-template-columns: 1fr 3fr;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    width: 100%;
}

#chatbox {
    margin: 5 auto;
    margin-bottom: 5px;
    padding: 10px;
    background: #fff;
    border: 1px solid #a7a7a7;
    height: 100%;
    border-radius: 4px;
    border-bottom: 4px solid #a7a7a7;
    border-top: 4px solid;
}

.my-message {
    text-align: right;
}

.recived-message {
    text-align: left;
}

.bold {
    font-weight: bold
}

.logout {
    margin-left: 5px
}

#messageBar {
    margin: 0 auto;
    margin-bottom: 25px;
    padding: 10px;
    background: #fff;
    border: 1px solid #a7a7a7;
    overflow: auto;
    border-radius: 4px;
    border-bottom: 4px solid #a7a7a7;
    border-top: 4px solid;
}
#messageInput {
    width: 85%;
    margin-right: 5px;
 }

#sideInfo{
    max-width: 100%;
}

#contentBox {
    margin: 0 auto;
    margin-bottom: 5px;
    padding: 10px;
    background: #fff;
    border: 1px solid #a7a7a7;
    overflow: auto;
    width: 90%;
    border-radius: 4px;
    border-bottom: 4px solid #a7a7a7;
    border-top: 4px solid;
}

#roomInput{
    margin-bottom: 2px;
}

#addRoom{
    float: right
}

#elementList{
    margin-bottom: 2px
}

#roomName{
    width: 80%;
}

#deleteRoom{
    width: 20%
}
 #insideTitle {
    text-align: center;
    border-bottom: 1px solid #a7a7a7
 }
#user {
    width: 100%
}

button {
    width: fit-content;
    height: fit-content;
    background: #333;
    border-radius: 5%;
    outline: none;
    color: #fff;
}
</style>