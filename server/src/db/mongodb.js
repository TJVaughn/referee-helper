const MongoClient = require('mongodb')

const connectionURL = process.env.MONGO_URL
const dbName = 'referee-helper-api'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error){
        return console.log("ERROR!\n", error)
    }
    const db = client.db(dbName)
    // console.log(db)
    
})
// module.exports = MongoClient
