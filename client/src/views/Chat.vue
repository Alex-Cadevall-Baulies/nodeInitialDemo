<template>
    <h1>
        This is the chat page
    </h1>

    <ul id="chat" ></ul>

    <form id="form" action="" @submit.prevent="sendMessage">
        <input id="input" autocomplete="off" required v-model="message"/>
        <button>Send</button>
    </form>
</template>

<script>
import SocketioService from '../services/socketio'

export default {
    data () {
        return {
            chat: '',
            message: ''
        } 
    },

    methods: {
        sendMessage () {
            if (this.message) {
                SocketioService.socketMessage(this.message)
                this.message = '';
        }
        },

        addMessage() {
            socket.on('message', function(msg) {
            var item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
            });
        }
    }
}
</script>

<style>
#form {
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

#form>button {
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