const removePlatformGames = (schedule, platform) => {
    let newSchedule = []
    for(let i = 0; i < schedule.length; i++){
        if(schedule[i].platform !== platform){
            newSchedule.push(schedule[i])
        }
    }
    return newSchedule
}

module.exports = removePlatformGames