const User = require('../../models/User')
const { decryptPlainText, encryptPlainText } = require('../../utils/crypto')
const asLogin = require('../jobs_helpers/asLogin')

module.exports = (agenda) => {
    agenda.define('arbiter sync', {priority: 20}, async (job, done) => {
        let { asEmail, asPassword, userID } = job.attrs.data
        let user = await User.findById(userID)
        asPassword = decryptPlainText(asPassword)
        let tryLogin = await asLogin(asEmail, asPassword, true)
        if(!tryLogin){
            user.jobs.asSyncStatus = 'invalid login'
        } else if(tryLogin){
            user.jobs.asSyncStatus = 'success'
            user.asPassword = encryptPlainText(asPassword)
            user.asEmail = asEmail
        } else {
            user.jobs.asSyncStatus = 'error'
        }
        await user.save()
        await job.remove()
        done()
    })
    
}