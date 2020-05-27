const removePastEvents = (schedule) => {
    let now = new Date()
    let futureEvents = []
    for(let i = 0; i < schedule.length; i++){
        if(schedule[i].dateTime > now){
            futureEvents.push(schedule[i])
        }
    }   
    return futureEvents
}

module.exports = removePastEvents