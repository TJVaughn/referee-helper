let MongoClient = require('mongodb').MongoClient

dbName = "referee-helper-jobs"

module.exports = (agenda) => {
    agenda.define('scrapeData', (job, done) => {
        let client = new MongoClient(process.env.MONGO_URL)

        client.connect((err) => {
            if(!err){
                let db = client.db(dbName)
                console.log(db)
            }
        })

    })
}