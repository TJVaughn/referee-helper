const puppeteer = require('puppeteer')

const setBlocks = async (username, password, futureGames) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--window-size=1500,825', '--no-sandbox'
            ]
            })
            const page = await browser.newPage()
            await page.setViewport({
                height: 825,
                width: 1500
            })
            await page.goto('https://www.horizonwebref.com/?pageID=login')
            await page.waitFor(1500)
    
            await page.click('#loginTable2 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > input')
            await page.keyboard.type(username)
            await page.click("#password")
            await page.waitFor(750)
        
            await page.keyboard.type(password)
            await page.click('#loginsub')
        
            await page.content()
            await page.waitFor(500)
            await page.goto('https://www.horizonwebref.com/?pageID=1132')
            await page.waitFor(1000)
    
            let blocksCreatedArr = []
            for(let x = 0; x < futureGames.length; x ++){
                console.log(futureGames[x].dateTime.getDate())
                let gameTime = futureGames[x].dateTime
                let gameMonth = gameTime
                gameMonth = new Date(gameMonth.getFullYear(), gameMonth.getMonth(), 1, 12, 0, 0)
                let currentMonth = new Date()
                currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1, 12, 0, 0)
                let date = futureGames[x].dateTime.getDate()
    
                let blockStart = gameTime.setHours(gameTime.getHours() - 1)
                blockStart = new Date(blockStart)
    
                if(blockStart.getMinutes() !== (15 || 30 || 45)){
                    let blockMins = blockStart.getMinutes();
                    if(blockMins >= 45 && blockMins < 59){
                        blockStart.setMinutes(45)
                    } else if(blockMins >= 30){
                        blockStart.setMinutes(30)
                    } else if(blockMins >= 15){
                        blockStart.setMinutes(15)
                    } else {
                        blockStart.setMinutes(0)
                    }
                    blockStart = new Date(blockStart)
                }
    
                let blockStartTime = blockStart
                let blockEndTime = blockStart
                //HORIZON USES 24 TIME
                blockStartTime = blockStartTime.toLocaleTimeString() 
                if(blockStartTime.toLowerCase().includes('pm')){
                    blockStartTime = changePmTo24Hour(blockStartTime)
                }
                blockStartTime = formatAMTime(blockStartTime)
                // console.log("Block Start: " + blockStartTime)
                // blockStartTime = blockStartTime.toLocaleTimeString().split('').reverse()
                // blockStartTime.splice(3, 3)
                // blockStartTime = blockStartTime.join('').split('').reverse().join('').toLowerCase()
    
                blockEndTime = blockEndTime.setHours(blockEndTime.getHours() + 3)
                blockEndTime = new Date(blockEndTime)
                blockEndTime = blockEndTime.toLocaleTimeString()
                if(blockEndTime.toLowerCase().includes('pm')){
                    blockEndTime = changePmTo24Hour(blockEndTime)
                }
                blockEndTime = formatAMTime(blockEndTime)
                // blockEndTime = blockEndTime.split('').reverse()
                // blockEndTime.splice(3, 3)
                // blockEndTime = blockEndTime.join('').split('').reverse().join('').toLowerCase()
    
                console.log("Block Start: " + blockStartTime)
                console.log("Block End: " + blockEndTime)
                console.log("Game Time: " + gameTime)
                
                let forMonth = gameMonth.getMonth() - currentMonth.getMonth()
                forMonth = forMonth.toString()
                console.log(forMonth)
                await page.select('#mnum', forMonth)
                await page.waitFor(1000)
                await page.select(`#Avail${date}`, "Not Between")
                await page.waitFor(1000)
                await page.select(`#Time${date}`, blockStartTime)
                await page.waitFor(1000)
                let blockEndHours = blockEndTime
                blockEndHours = blockEndHours.split(':')
                blockEndHours = blockEndHours[0]
                let blockEndMins = blockEndHours[1]
                let blockEndDate = new Date(gameMonth.getFullYear(), gameMonth.getMonth(), date, blockEndHours, blockEndMins)
                let blockStartHours = blockStartTime
                blockStartHours = blockStartHours.split(':')
                blockStartHours = blockStartHours[0]
                blockStartMins = blockStartHours[1]
                let blockStartDate = new Date(gameMonth.getFullYear(), gameMonth.getMonth(), date, blockStartHours, blockStartMins)
                console.log(blockEndDate)
                console.log(blockStartDate)
                if(blockEndDate < blockStartDate){
                    await page.select(`#Time2-${date}`, "23:45:00")
                } else {
                    await page.select(`#Time2-${date}`, blockEndTime)
                }
                await page.waitFor(1500)
                gameTime = gameTime.setHours(gameTime.getHours() + 1);
                gameTime = new Date(gameTime)
                blocksCreatedArr.push({
                    gameStartTime: gameTime,
                    blockStartTime,
                    blockEndTime,
                    gameData: futureGames[x]
                })
            }
            await page.waitFor(5000)
            await browser.close()

            return blocksCreatedArr
    } catch (error) {
        return {error: "Error in blocks: " + error}
    }

}

module.exports = setBlocks