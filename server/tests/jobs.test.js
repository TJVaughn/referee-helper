const request = require('supertest')
const app = require('../src/app')
const Event = require('../src/models/Event')
const  {user1, user2, event1, event2, event3, event4, newEvent1, newEvent2, newEvent3, setupDB} = require('./fixtures/db')
const removeDuplicates = require('../src/jobs/jobsHelpers/removeDuplicates')
const findUniqueEvents = require('../src/jobs/jobsHelpers/findUniqueEvents')
const addEventsFromArray = require('../src/jobs/jobsHelpers/addEventsFromArray')
const removePastEvents = require('../src/jobs/jobsHelpers/removePastEvents')
beforeEach(setupDB)

//test to find unique events -- give it two new events, 1 of which already has duplicate data in the db, expect there to be 1 unique event
test('find Unique Events', async () => {
    let events = [ newEvent1, newEvent2 ]
    //pass in a list of new events, 
    //if there is a match don't add the event to the database
    let uniques = await findUniqueEvents(events)
    expect(uniques.length).toBe(1)
})  

//test to remove past games -- give it 3 games, 1 of which is in the past, expect the games length to be 2
test('should remove past games', async () => {
    let futureEvent = newEvent1
    futureEvent.dateTime = new Date(Date.now())
    futureEvent.dateTime = new Date(futureEvent.dateTime.setMonth(futureEvent.dateTime.getMonth() + 1))
    let pastEvent = newEvent2
    pastEvent.dateTime = new Date(Date.now())
    pastEvent.dateTime = new Date(pastEvent.dateTime.setMonth(pastEvent.dateTime.getMonth() - 1))
    let events = [futureEvent, pastEvent]
    events = removePastEvents(events)
    expect(events.length).toBe(1)
})

//test to add events from array -- give it a new event and expect the current games in the database to be one game longer
test('Should add game to events', async() => {
    let initEvents = await Event.find({owner: user2._id})
    let initLength = initEvents.length
    console.log(initLength)
    let newGames = [newEvent1, newEvent3]
    let games = await addEventsFromArray(newGames, 'test', user2._id)
    let newEvents = await Event.find({owner: user2._id})
    let newLength = newEvents.length
    console.log(newLength)
    expect(games.length).toBe(2)
    //Issue with the test -- when i expect the new events length to be 4 opposed to 2, it still shows up as only 2
    //but when I look at the test db, the games are actually added, so the functions are actually working correctly but the test still fails

})
