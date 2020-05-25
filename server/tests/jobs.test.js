const request = require('supertest')
const app = require('../src/app')
const Event = require('../src/models/Event')
const  {user1, user2, event1, event2, event3, event4, newEvent1, newEvent2, setupDB} = require('./fixtures/db')
const removeDuplicates = require('../src/jobs/jobsHelpers/removeDuplicates')
const findUniqueEvents = require('../src/jobs/jobsHelpers/findUniqueEvents')
beforeEach(setupDB)

// test('Should find duplicates and return them', async () => {
//     const uniques = await removeDuplicates(event3.dateTime, event3.location, event3.gameCode)
//     console.log(uniques)
//     expect(uniques).not.toBe(null)
// })
test('find Unique Events', async () => {
    let events = [ newEvent1, newEvent2 ]
    //pass in a list of new events, 
    //if there is a match don't add the event to the database
    let uniques = await findUniqueEvents(events)
    expect(uniques.length).toBe(1)
})  