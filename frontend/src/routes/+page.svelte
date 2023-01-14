<script>
    import {onMount} from "svelte";
    import io from 'socket.io-client'
    const socket = io("http://192.168.42.126:3000/")
    let messages = []
    let newMessages = []
    let rooms = []
    let newRooms = []
    let user
    let exists = true
    let username
    let message = ''
    let roomjoin = ''
    let roomcreate = ''

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
                }
            }
            if (!user) {
                location.href ='/login'
            }
        })
    });

    socket.on('create room', (data) => {
        rooms = [...rooms, data]
    })

    socket.on('get-rooms', (data) => {
        newRooms = [...rooms, data]
        newRooms = newRooms[0]
    })

    const joinOrCreateRoom = () => {
        if(roomjoin){
            let found = false
            newRooms.forEach(room => {
                if(room.roomId === roomjoin){
                    found = true
                    location.href = `/room/${roomjoin}`
                }
            })
            console.log(found)
            if(!found){
                socket.emit('create room', {roomjoin})
                location.href = `/room/${roomjoin}`
                roomjoin = ''
            }
        } else {
            message = 'Morate unjeti broj sobe!'
        }
    }
</script>
<main>
    <h1>Chat aplikacija</h1>
    <h2>Pozdrav{#if username}, {username}{/if}</h2>
    <div>
        <div>
            <input bind:value={roomjoin} placeholder="Broj Sobe" type="number">
            <button on:click={joinOrCreateRoom} >Napravi ili Udji</button>
        </div>
        {#if message}
            <h2>{message}</h2>
        {/if}
    </div>
</main>