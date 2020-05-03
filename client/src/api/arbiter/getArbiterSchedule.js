import axios from 'axios'

const asSchedule = async () => {
    let res = await axios({
        url: "/api/arbiter/schedule",
        method: 'get',
        responseType: 'json'
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
    console.log("starting get arbiter schedule")
    const newSchedule = await asSchedule()
    const [ newGames, gamesTBUpdated ] = await importAndUpdateGames(newSchedule)
    return [ newGames, gamesTBUpdated ]
}

export default getArbiterSchedule