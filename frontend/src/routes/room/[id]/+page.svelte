<script>
    import {onMount} from "svelte";
    import io from 'socket.io-client'
    const socket = io("http://192.168.42.126:3000/")
    export let data;
    let id = data.posts.id
    let newMessages = []
    let realMessages = []
    let messages = []
    let newRooms = []
    let rooms = []
    let roomexists = false
    let user
    let username
    let message = ''
    let file

    onMount(() => {
        let cookies = document.cookie
        cookies = cookies.split(';')
        username = cookies[0]
        username = username.split('=')
        username = username[1]

        let newUsers = []
        let users = []

        socket.on('get-users', (data) => {
            newUsers = [...users, data]
            newUsers = newUsers[0]
            for (let i = 0; i<newUsers.length; i++) {
                let usertest = newUsers[i]
                if (usertest.username === username) {
                    user = usertest
                    console.log(user)
                }
            }
            if (!user) {
                location.href ='/login'
            }
        })
        socket.on('get-rooms', (data) => {
            newRooms = [...rooms, data]
            newRooms = newRooms[0]
            newRooms.forEach(room => {
                if(room.roomId === id){
                    roomexists = true
                }
            })
        })
    })

    socket.on('chat message', (data) => {
        messages = [...messages, data]
    })

    socket.on('get-messages', (data) => {
        let messags = []
        newMessages = [...messages, data]
        newMessages = newMessages[0]
        newMessages.forEach(msg => {
            if(msg.roomid === id) {
                messags.push(msg)
            }
        })
        realMessages = [...messags]
    })

    const sendMessage = () => {
        if (file) {
            socket.emit("upload", file, (status) => {
                let url = status.message
                console.log(message)
                socket.emit('chat message', {id, message, username, url})
                message = ''
            });
        } else {
            socket.emit('chat message', {id, message, username})
            message = ''
        }
    }

    const upload = (files) => {
        file = files[0]
    }
</script>
<main>
    <a href="/">Home</a><br>
    <div>
        {#if roomexists}
            <div>
                <input bind:value={message} placeholder="Poruka" type="text"><br>
                <input type="file" on:change={(e) => upload(e.target.files)} />
                <button on:click={sendMessage} >Send</button>
            </div>
            {#each realMessages as message}
                <h3>{message.username}: {message.msg}</h3>
                {#if message.imageUrl}
                    <img style="height: auto;max-width: 15%" src={`http://192.168.42.126:4000/${message.imageUrl}`} alt="#">
                {/if}
            {/each}
            {#each messages as message}
                <h3>{message.username}: {message.msg}</h3>
                {#if message.imageUrl}
                    <img style="height: auto;max-width: 15%" src={`http://192.168.42.126:4000/${message.imageUrl}`} alt="#">
                {/if}
            {/each}
        {:else}
            <h2>Ta soba ne postoji!</h2>
        {/if}
    </div>
</main>