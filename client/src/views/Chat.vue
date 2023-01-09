<template>
    <h1>
        This is the chat page
    </h1>

    <p>Username Here</p>
    <button @click="Logout">Logout</button>
    
    <p> Current room: {{ currentRoom }}</p>
    <button @click="leaveRoom">Leave Room</button>

    <div id="chat">
    <div v-for="interaction in chat" :key="interaction">
    <span>{{interaction}}</span>
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
import socket from '../services/socketio'

export default {
    data() {
        return {
            chat: [],
            newMessage: '',
            room: '', 
            currentRoom: 'main'
        }
    },

    methods: {
        sendMessage() {
            if (this.newMessage) {
                socket.emit('sendMessage', this.newMessage, this.room)
                this.newMessage = '';
            }
        },
        enterRoom() {
            if(this.room) {
                socket.emit('joinRoom', this.room)
                this.currentRoom = this.room
            }
        },
        leaveRoom(){
            this.room = '',
            this.currentRoom = 'main'
        },
        logout() {
            console.log('this has to logout user')
        }
    },

    created() {
        socket.connect()
    },

    mounted() {
        socket.on('showMessage', async (msg) => {
            this.chat.push(await msg)
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