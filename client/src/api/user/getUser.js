const getUser = async () => {
    let user = await fetch('/api/user/me', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    })
    user = await user.json()
    return user

}
export default getUser