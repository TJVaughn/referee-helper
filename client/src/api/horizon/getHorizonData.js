import axios from 'axios'

const getHorizonData = async () => {
    const res = await axios.get('/api/horizon/schedule')
    const [ newGamesToBeAdded, gamesTBUpdated ] = res.data
    return [ newGamesToBeAdded, gamesTBUpdated ]
}
export default getHorizonData