export function load({ params }) {
    let id = params.id
    id = parseInt(id)

    return {
        posts:
            {id}
    }
}