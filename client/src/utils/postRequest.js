const postRequest = async (url, method, { data }) => {
    const response = await fetch(`/api/${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(data)
    })
    const body = await response.json()
    return body
}

export default postRequest