const User = require('../../../models/User')
const { decryptPlainText, encryptPlainText } = require('../../../utils/crypto')
const asLogin = require('../../jobsHelpers/arbiter/asLogin')

module.exports = (agenda) => {
    agenda.define('asSyncJob', {priority: 20}, async (job, done) => {
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
