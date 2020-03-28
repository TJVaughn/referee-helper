const getRequest = async (url) => {
    const response = await fetch(`/api/${url}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    })
    const body = await response.json()
    return body
}

export default getRequest