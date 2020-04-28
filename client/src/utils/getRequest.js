const getRequest = async (url) => {
    const response = await fetch(`/api/${url}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const body = await response.json()
    return body
}

export default getRequest