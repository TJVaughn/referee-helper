const Agenda = require('agenda')
const asScheduleJob = require('../routers/arbiter/jobs/asScheduleJob')

const agenda = new Agenda({ 
    db: { 
        address: process.env.MONGO_URL
    }, 
    collection: 'jobs', 
    processEvery: '30 seconds'
})

agenda.define('arbiter schedule', async (job, done) => {
    const { user } = job.attrs.data
    const addedSchedule = await asScheduleJob(user)
    if(addedSchedule.error){

    }
    // console.log(addedSchedule)
    done()
})

// let jobTypes = ['scrapeData']

// jobTypes.forEach(type => {
//     require('./jobs_list/' + type)(agenda)
// })

// if(jobTypes.length){
//     agenda.on('ready', async () => await agenda.start())
// }

let graceful = () => {
    agenda.stop(() => process.exit(0))
}

process.on("SIGTERM", graceful)
process.on("SIGINT", graceful)

module.exports = agenda