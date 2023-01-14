<script>
    import {onMount} from "svelte";
    import io from 'socket.io-client'
    const socket = io("http://192.168.42.126:3000/")
    let username
    let password
    let user
    let message
    let newUsers = []
    let users = []

    onMount(() => {
        let cookies = document.cookie
        cookies = cookies.split(';')
        let username = cookies[0]
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
                    location.href ='/'
                }
            }
        })
    });

    socket.on('get-users', (data) => {
        newUsers = [...users, data]
        newUsers = newUsers[0]
    })

    const Login = async () => {
        if (username){
            if (password){
                for (let i=0; i < newUsers.length; i++){
                    let usernameprob = newUsers[i].username
                    let passwordprob = newUsers[i].password

                    if (usernameprob === username && passwordprob === password){
                        user = newUsers[i]

                        message = 'Uspjesno ste se logirali!'


                        const date = new Date()
                        let today = date.getTime()
                        let expires = 2*24*60*60*1000

                        date.setTime(today + expires)
                        let new_date = date.toUTCString()

                        document.cookie = `username=${username}; expires=${new_date}`

                        username = ''
                        password = ''

                        location.href = '/'
                    }
                }
                if (!user) {
                    message = "Kriv username ili lozinka"
                }

            } else {
                message = "Morate napisati lozinku"
            }
        } else{
            message = "Morate unjeti username"
        }
    }
</script>

<main>
    <a href="/register">Register</a>
    <div class="login">
        <h1>Login</h1>
        <form on:submit|preventDefault={Login}>
            <div class="input-group">
                <input type="text" bind:value = {username} placeholder="Unesite Username">
                <input type="password" bind:value = {password} placeholder="Unesite lozinku">
                <button type="submit">Logiraj se</button>
                {#if message}
                    <h2>{message}</h2>
                {/if}
            </div>
        </form>
    </div>
</main>