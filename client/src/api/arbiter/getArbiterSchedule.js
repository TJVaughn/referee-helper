import axios from 'axios'

const asLogin = async () => {
    let res = await axios({
        url: "/api/arbiter/schedule/login",
        method: 'get',
        responseType: 'json'
    })
    console.log(res.data)
    return res.data.browserWSEndpoint
}
const setSchedule = async (browserWSEndpoint) => {
    let res = await axios({
        url: '/api/arbiter/schedule/set-schedule',
        method: 'POST',
        responseType: 'json',
        data: {
            browserWSEndpoint
        }
    })
    console.log(res.data)
    return res.data.browserWSEndpoint
}

const asSchedule = async (browserWSEndpoint) => {
    let res = await axios({
        url: "/api/arbiter/schedule/schedule",
        method: 'post',
        responseType: 'json',
        data: {
            browserWSEndpoint
        }
    })
    return res.data
}
const importAndUpdateGames = async (schedule) => {
    let response = await axios({
        url: '/api/games/add-many',
        method: 'POST',
        responseType: 'json',
        data: {
            schedule: schedule,
            platform: "Arbiter Sports"
        }
    })
    console.log(response)
    const [ newGames, gamesTBUpdated ] = response.data
    console.log([ newGames, gamesTBUpdated ])
    return [ newGames, gamesTBUpdated ]
}

const getArbiterSchedule = async () => {
    let res = await axios({
        url: "/api/arbiter/schedule",
        method: 'get',
        responseType: 'json'
    })
    console.log(res.data)
    // return res.data.browserWSEndpoint
    // console.log("starting get arbiter schedule")
    // const browserWSEndpoint = await asLogin()
    // await setSchedule(browserWSEndpoint)
    // const newSchedule = await asSchedule(browserWSEndpoint)
    // const [ newGames, gamesTBUpdated ] = await importAndUpdateGames(newSchedule)
    // return [ newGames, gamesTBUpdated ]
}

export default getArbiterSchedule