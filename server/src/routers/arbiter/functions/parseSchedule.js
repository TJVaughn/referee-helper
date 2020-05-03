
const parseGame = (html) => {
    if(!html[0].includes("</a>")){
        html = html.splice(1)
    }
    let game = {
        gameId: html[0],
        group: {
            title: html[2],
            value: html[2],
        },
        position: html[3],
        dateTime: html[4],
        level: html[5],
        location: html[6],
        home: html[7],
        away: html[8],
        fees: html[9],
        status: html[10]
    }
    game.gameId = game.gameId.split('</a').shift()
    game.gameId = game.gameId.split('').reverse().splice(0, 8)
    game.gameId = game.gameId.reverse().join('').split('>').pop()

    game.group.value = game.group.value.split('</span>').shift()
    game.group.value = game.group.value.split('').reverse().join('').split('>').shift()
    game.group.value = game.group.value.split('').reverse().join('')

    game.group.title = game.group.title.split('title').splice(1, 1)
    game.group.title = game.group.title.join('').split(/\"/).splice(1, 1)
    game.group.title = game.group.title[0].trim()
    // game.group.title = game.group.title.split(/\"/).splice(7, 1)
    // game.group.title = game.group.title[0].trim()

    game.position = game.position.split('</span>').shift()
    game.position = game.position.split('').reverse().join('').split('>').shift()
    game.position = game.position.split('').reverse().join('')

    game.dateTime = game.dateTime.split('</span').shift()
    game.dateTime = game.dateTime.replace('<br>', '')
    game.dateTime = game.dateTime.split('').reverse().join('').split('>').shift()
    game.dateTime = game.dateTime.split('').reverse().join('').toLowerCase().replace(/sat|sun|mon|tue|wed|thu|fri/, '')
    console.log("original " + game.dateTime)
    console.log("new date to utc string" + new Date(game.dateTime).toUTCString())
    // console.log("new date " + new Date(game.dateTime))

    game.dateTime = new Date(game.dateTime).toUTCString()

    game.level = game.level.split('evel').pop()
    game.level = game.level.split('</span').shift()
    game.level = game.level.split('>').pop()
    
    game.location = game.location.split('</a>').shift()
    game.location = game.location.split('').reverse().join('').split('>').shift()
    game.location = game.location.split('').reverse().join('')
    
    game.home = game.home.split('</a>').shift()
    game.home = game.home.split('').reverse().join('').split('>').shift()
    game.home = game.home.split('').reverse().join('')

    game.away = game.away.split('</span>').shift()
    game.away = game.away.split('').reverse().join('').split('>').shift()
    game.away = game.away.split('').reverse().join('')
    
    game.fees = game.fees.split('</span>').shift()
    game.fees = game.fees.split('').reverse().join('').split('>').shift()
    game.fees = game.fees.split('').reverse().join('').replace('$', '').replace('.', '')

    if(game.status){
        game.status = game.status.split('</span>').shift()
        game.status = game.status.split('').reverse().join('').split('>').shift()
        game.status = game.status.split('').reverse().join('')
    }
    if(!game.status){
        game.status = "normal"
    }
    return game
}


const htmlToJson = (item) => {
    item = item.split('<td')
    item = parseGame(item)
    return item
}
const parseSchedule = async (htmlSchedule) => {
    htmlSchedule = htmlSchedule.toString()
    htmlSchedule = htmlSchedule.split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_dgGames')
    htmlSchedule = htmlSchedule.splice(2)
    htmlSchedule = htmlSchedule.join('').split('ctl00_ContentHolder_pgeGameScheduleEdit_conGameScheduleEdit_lnkTrigger')
    htmlSchedule = htmlSchedule.splice(0, 1)
    let allGamesHtmlArray = htmlSchedule.join('').split('<tr')
    let arbiterSchedule = []
    allGamesHtmlArray.map((item) => {
        item = htmlToJson(item)
        arbiterSchedule.push(item)
    })
    return arbiterSchedule
}
module.exports = parseSchedule