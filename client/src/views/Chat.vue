<template>
    <h1>
        This is the chat page
    </h1>

    <p> This is the username: {{ username }}</p>
    <button @click="logout">Logout</button>

    <p> Current room: {{ currentRoom }}</p>
    <button @click="leaveRoom">Leave Room</button>

    <div id="chat">
        <div v-if="noMessages">
            {{ content }}
        </div>
        <div v-else>
            <div v-for="item in content" :key="item">
                <span>{{ item.user }} : {{ item.message }}</span>
            </div>
            <div v-for="item in chat" :key="item">
                <span>{{ item.user }} : {{ item.msg }}</span>
            </div>
        </div>
    </div>

    <div id="messageBar">
        <form id="messageForm" action="" @submit.prevent="sendMessage">
            <input id="input" autocomplete="off" required v-model="newMessage" />
            <button>Send</button>
        </form>
    </div>

    <div id="roomBar">
        <form id="roomForm" action="" @submit.prevent="enterRoom">
            <input id="input" autocomplete="off" v-model="room" />
            <button>Join Room</button>
        </form>
    </div>
</template>

<script>
import socket from '../services/socketio';

export default {
    data() {
        return {
            username: "",
            content: '',
            newMessage: '',
            room: '',
            currentRoom: 'main',
            noMessages: false,
            chat: []
        }
    },

    methods: {
        async sendMessage() {
            if (this.newMessage) {
                try{
                await fetch('http://localhost:8080/chat', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        "user": this.username,
                        "chatroom": this.currentRoom,
                        "message": this.newMessage, 
                    })
                })
                
                socket.emit('sendMessage', this.newMessage, this.username, this.room)
                this.newMessage = '';

                }catch (err){
                    console.log(err)
            }
            }
        },
        enterRoom() {
            if (this.room) {
                socket.emit('joinRoom', this.room)
                this.currentRoom = this.room
            }
        },
        leaveRoom() {
            this.room = '',
                this.currentRoom = 'main'
        },
        logout() {
            this.$router.push({ name: 'login' })
            localStorage.removeItem('token');
            
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
                if(resDB.lenght > 0) {
                    this.content = resDB
                    this.noMessages = false
                } else {
                    this.content = resDB
                    this.noMessages = true
                }
                
            } catch (err) {
                console.log(err)
            }
        }
    },

    created() {
        socket.connect()
        this.username = localStorage.getItem('user')
    },

    mounted() {
        localStorage.removeItem('user')
        this.getMessages()
        socket.on('showMessage', async (msg, user) => {
            this.chat.push({
                user: user,
                msg: msg
            })
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