const asSchedule = async () => {
    let schedule = await fetch('/api/arbiter/schedule', {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        }
    })
    schedule = await schedule.json()
    // console.log(schedule)
    return schedule
}

const parsedSchedule = async (schedule) => {
    let data = {
        "schedule": schedule
    }
    let parsed = await fetch('/api/arbiter/schedule/parse', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    parsed = await parsed.json()
    // console.log(parsed)
    return parsed
}
const getArbiterSchedule = async () => {
    console.log("starting get arbiter schedule")
    const schedule = await asSchedule()
    const parsed = await parsedSchedule(schedule)
    return parsed
}

export default getArbiterSchedule