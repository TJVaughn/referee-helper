const removePastGames = (schedule) => {
    let now = new Date()
    let futureGames = []
    for(let i = 0; i < schedule.length; i++){
        if(schedule[i].dateTime > now){
            futureGames.push(schedule[i])
        }
    }   
    return futureGames
}

module.exports = removePastGames