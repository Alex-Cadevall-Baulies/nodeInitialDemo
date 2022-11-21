const form = document.getElementById('form');
const input = document.getElementById('message-input');

form.addEventListener('submit', event =>{
    //if the event does not get explicitly handled, its default action should not be taken.
    event.preventDefault();
    const message = input.value

    if(message === "") return //if inpu.value = blank, return nothing
    displayMessage(message)

    input.value = "" //clear input value
})

function displayMessage(message) {
    const div = document.createElement("div")
    div.textContent = message

    //add element to div
    document.getElementById("message-container").append(div)
    window.scrollTo(0, document.body.scrollHeight)
}

/*let count = 0
    setInterval(() => {
        socket.volatile.emit('ping', ++count)
    }, 5000)

    document.addEventListener('keydown', e => {
        if(e.target.matches('input')) return

        if(e.key === 'c') socket.connect()
        if (e.key === 'd') socket.disconnect()
    })*/