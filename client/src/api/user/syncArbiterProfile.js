const syncArbiterProfile = async () =>{
    let res = await fetch('/api/arbiter/profile', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    res = await res.json()
    console.log(res)
    return res
}
export default syncArbiterProfile