<script>
    import {onMount} from "svelte";
    import io from 'socket.io-client'
    const socket = io("http://192.168.42.126:3000/")
    let message
    let email
    let username
    let password
    let user
    let users = []
    let newUsers = []

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

    const Register = async () => {
        if (email) {
            if (username) {
                if (password) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                        let count = 0
                        for (let i=0; i < newUsers.length; i++){
                            let emailprob = newUsers[i].email
                            let usernameprob = newUsers[i].username

                            if (usernameprob === username || emailprob === email){
                                count++
                            }
                        }
                        if (count === 0 ){
                            if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)){

                                socket.emit('create user', {email,username,password})

                                const date = new Date()
                                let today = date.getTime()
                                let expires = 2*24*60*60*1000

                                date.setTime(today + expires)
                                let new_date = date.toUTCString()

                                document.cookie = `username=${username}; expires=${new_date}`

                                message = 'Uspjesno ste se registrirali!'
                                email = ''
                                username = ''
                                password = ''

                                location.href = '/'

                            } else {
                                message = "Molimo unesite jacu lozinku."
                            }
                        } else {
                            message = "Taj email ili username se vec koristi"
                        }
                    } else {
                        message = "Email adresa nije ispravna"
                    }

                } else {
                    message = "Morate napisati lozinku"
                }
            } else {
                message = "Morate unjeti username"
            }
        } else {
            message = "Morate unjeti email"
        }
    }
</script>

<main>
    <a href="/login">Login</a>
    <div class="register">
        <h1>Register</h1>
        <form on:submit|preventDefault={Register}>
            <div class="input-group">
                <input type="text" bind:value = {email} placeholder="Unesite Email">
                <input type="text" bind:value = {username} placeholder="Unesite Username">
                <input type="password" bind:value = {password} placeholder="Napisite lozinku">
                <button type="submit">Registriraj se</button>
                {#if message}
                    <h2>{message}</h2>
                {/if}
            </div>
        </form>
    </div>
</main>