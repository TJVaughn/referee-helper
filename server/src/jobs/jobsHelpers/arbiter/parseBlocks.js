const parseBlocks = async (b) => {
    // Calendar
    // Trevor Hauck,June 2020
    // Jun 15,Jun 20
    // 109773,BLOCKED,12:00 PM,2:00 PM,,109773,BLOCKED,12:00 PM,2:00 PM,
    // 102876,BLOCKED,12:00 PM,2:00 PM,,102876,BLOCKED,12:00 PM,2:00 PM,
    // 108720,BLOCKED,12:00 PM,2:00 PM,,108720,BLOCKED,12:00 PM,2:00 PM,
    // 109822,BLOCKED,12:00 PM,2:00 PM,,109822,BLOCKED,12:00 PM,2:00 PM,
    // Jun 17
    // 109822,BLOCKED,8:00 AM,5:00 PM,
    // 108720,BLOCKED,8:00 AM,5:00 PM,
    // 102876,BLOCKED,8:00 AM,5:00 PM,
    // 109773,BLOCKED,8:00 AM,5:00 PM,
    // "Tuesday, June 02, 2020, 12:28 PM",Created by ArbiterSports.com,Page 1 of,1
    console.log(b)

    b = b.toString()
    b = b.split(/\n/).join(',')
    b = b.split(',')
    b = b.map(i =>
        i = i.trim()
    )
    b = b.splice(3)
    for(let i = 0; i < b.length;){
        //if b[i] is a date
        // save it as {
        //  block: {
        //      date: b[i],
        //      start: null,
        //      end: null
        //     }
        // }
        // else if b[i] is a group,
        // b[i + 1] is BLOCKED
        // b[i + 2] is start time
        // b[i + 3] is end time
        if(b[i] ){

        }
    }
    console.log(b)

}
module.exports = parseBlocks