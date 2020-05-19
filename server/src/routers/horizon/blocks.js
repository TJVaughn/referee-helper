
const puppeteer = require('puppeteer')
const Game = require('../../models/Game')
const auth = require('../../middleware/auth')
const { decryptPlainText } = require('../../utils/crypto')



const changePmTo24Hour = (time) => {
    time = time.toLowerCase().split('pm').join('')
    time = time.split(':')
    let hours = parseInt(time[0])
    let mins = time[1]
    let secs = time[2]
    if(hours < 12){
        hours += 12
    } else if(hours === 12){
        hours = 23
    }
    hours = hours.toString()

    time = `${hours}:${mins}:${secs}`
    // console.log(time)
    return time
}
const formatAMTime = (time) => {
    time = time.toLowerCase().split('am').join('').trim()
    time = time.split(':')
    let hours = parseInt(time[0])
    let mins = time[1]
    if(hours < 10){
        hours = hours.toString()
        hours = "0" + hours
    }
    time = `${hours}:${mins}:00`
    return time
}



