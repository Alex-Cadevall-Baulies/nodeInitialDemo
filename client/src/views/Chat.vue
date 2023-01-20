<template>
    <h1>
        This is the chat page
    </h1>

    <p> This is the username: {{ username }}</p>
    <button @click="logout">Logout</button>

    <div>
        <div v-for="user in connectedUsers" :key="user">
            <ul> {{ user }}</ul>
        </div>
    </div>

    <p> Current room: {{ room }}</p>
    <div>
        <div v-for="room in subscribedRooms" :key="room">
            <button @click="enterRoom(room)"> {{ room }}</button>
            <button @click="deleteRooms(room)"> X </button>
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
            <span>{{ item.user }} : {{ item.message }}</span>
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
import socket from '../services/socketio';

export default {
    data() {
        return {
            username: "",
            connectedUsers: [],
            newMessage: '',
            room: 'main',
            noMessages: false,
            chat: [],
            subscribedRooms: []
        }
    },

    methods: {
        async sendMessage() {
            if (this.newMessage) {
                try {
                    const data = {
                        "user": this.username,
                        "chatroom": this.room,
                        "message": this.newMessage,
                    }

                    await fetch('http://localhost:8080/chat', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })

                    socket.emit('sendMessage', data)
                    this.noMessages = false
                    this.newMessage = '';

                } catch (err) {
                    console.log(err)
                }
            }
        },
        enterRoom(newRoom) {
            //this.leaveRoom()
            this.room = newRoom
            const data = {
                "user": this.username,
                "chatroom": this.room,
            }
            socket.emit('joinRoom', data)
            this.chat = []
            this.getMessages()
            socket.on('joined', (data) => {
            //console.log(`this is data: ${data}`)
            //this.connectedUsers.push(data.user)
        })
        },
        leaveRoom() {
            console.log(`this is the array: ${this.connectedUsers}`)
            const index = this.connectedUsers.indexOf(this.username);
            console.log(`this is the index ${index}`)
            this.connectedUsers.splice(index, 1);
            console.log(`this is the array after: ${this.connectedUsers}`)
        },
        logout() {
            this.leaveRoom()
            this.$router.push({ name: 'login' })
            localStorage.removeItem('token');
            localStorage.removeItem('user');

        },
        async getMessages() {
            try {
                const res = await fetch('http://localhost:8080/chat', {
                    method: 'GET',
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                const resDB = await res.json()
                if (resDB.success) {
                    resDB.msg.filter(message => {
                        if (message.chatroom === this.room) {
                            this.chat.push(message)
                        }
                    })
                    this.noMessages = false
                } else {
                    this.noMessages = true
                }

            } catch (err) {
                console.log(err)
            }
        },
        async addRoom() {
            if (this.room) {
                try {
                    const res = await fetch('http://localhost:8080/user/rooms', {
                        method: 'PUT',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            "username": this.username,
                            "chatroom": this.room
                        })
                    })
                    const resDB = await res.json()
                    if (resDB.success) {
                        this.subscribedRooms.push(resDB.chatroom)
                        this.enterRoom(this.room)
                    } else {
                        this.enterRoom()
                        alert(resDB.msg)
                    }
                }
                catch (err) { console.log(err) }
            }
        },
        async getRooms() {
            try {
                const res = await fetch('http://localhost:8080/user/rooms', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                            "username": this.username
                        })
                })
                const resDB = await res.json()

                //all people should have at least main room added into array
                if (resDB.success) {
                    await resDB.chatroom.map(element => this.subscribedRooms.push(element))
                }
                }
                catch (err) { console.log(err) }
        },
        async deleteRooms(room) {
            const res = await fetch('http://localhost:8080/user/rooms', {
                        method: 'DELETE',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            "username": this.username,
                            "chatroom": room
                        })
                    })
            const resDB = await res.json()
            
            //there will always be a room to delete
            if (resDB.success) {
            const index = this.subscribedRooms.indexOf(resDB.chatroom);
            this.subscribedRooms.splice(index, 1);
            }    
        }
    },

    created() {
        this.username = localStorage.getItem('user')
        socket.connect()
        this.getRooms()
        this.getMessages()
    },

    mounted() {
        socket.on('showMessage', (data) => {
            this.chat.push(data)
        })
    },

    beforeUnmount() {
        if (socket)
            socket.disconnect()
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