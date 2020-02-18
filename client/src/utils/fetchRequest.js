const fetchRequest = async (url, method) => {
    const response = await fetch(`/api/${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    })
    const body = await response.json()
    return body
}

export default fetchRequest