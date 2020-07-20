const months = [
        "Jan",
        "Feb",            
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
]
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

    const pre = [
        `Calendar
Trevor Hauck,June 2020
Jun 8,Jun 15
109773,BLOCKED,12:00 AM,3:00 PM,,109822,BLOCKED,12:00 PM,2:00 PM,
102876,BLOCKED,12:00 AM,3:00 PM,,108720,BLOCKED,12:00 PM,2:00 PM,
108720,BLOCKED,12:00 AM,3:00 PM,,102876,BLOCKED,12:00 PM,2:00 PM,
109822,BLOCKED,12:00 AM,3:00 PM,,109773,BLOCKED,12:00 PM,2:00 PM,
Jun 9,Jun 17
109822,BLOCKED,12:00 AM,3:00 PM,,109773,BLOCKED,8:00 AM,5:00 PM,
108720,BLOCKED,12:00 AM,3:00 PM,,102876,BLOCKED,8:00 AM,5:00 PM,
102876,BLOCKED,12:00 AM,3:00 PM,,108720,BLOCKED,8:00 AM,5:00 PM,
109773,BLOCKED,12:00 AM,3:00 PM,,109822,BLOCKED,8:00 AM,5:00 PM,
Jun 10,Jun 20
109773,BLOCKED,12:00 AM,3:00 PM,,109822,BLOCKED,12:00 PM,2:00 PM,
102876,BLOCKED,12:00 AM,3:00 PM,,108720,BLOCKED,12:00 PM,2:00 PM,
108720,BLOCKED,12:00 AM,3:00 PM,,102876,BLOCKED,12:00 PM,2:00 PM,
109822,BLOCKED,12:00 AM,3:00 PM,,109773,BLOCKED,12:00 PM,2:00 PM,
Jun 11,Jun 23
109822,BLOCKED,12:00 AM,3:00 PM,,109773,BLOCKED,12:00 AM,11:59 PM,
108720,BLOCKED,12:00 AM,3:00 PM,,102876,BLOCKED,12:00 AM,11:59 PM,
102876,BLOCKED,12:00 AM,3:00 PM,,108720,BLOCKED,12:00 AM,11:59 PM,
109773,BLOCKED,12:00 AM,3:00 PM,,109822,BLOCKED,12:00 AM,11:59 PM,
Jun 12
109773,BLOCKED,12:00 AM,3:00 PM,
102876,BLOCKED,12:00 AM,3:00 PM,
108720,BLOCKED,12:00 AM,3:00 PM,
109822,BLOCKED,12:00 AM,3:00 PM,
"Thursday, June 04, 2020, 12:11 PM",Created by ArbiterSports.com,Page 1 of,1`
    ]
data = [
    'Jun 15',
    'Jun 20',
    '109773',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '109773',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '102876',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '102876',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '108720',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '108720',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '109822',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    '109822',
    'BLOCKED',
    '12:00 PM',
    '2:00 PM',
    '',
    'Jun 17',
    '109822',
    'BLOCKED',
    '8:00 AM',
    '5:00 PM',
    '',
    '108720',
    'BLOCKED',
    '8:00 AM',
    '5:00 PM',
    '',
    '102876',
    'BLOCKED',
    '8:00 AM',
    '5:00 PM',
    '',
    '109773',
    'BLOCKED',
    '8:00 AM',
    '5:00 PM',
    '',
]

const parseBlocks = async (b) => {
    // console.log(b)

    b = b.toString()
    b = b.split(/\n/).join(',')
    b = b.split(',')
    b = b.map(i =>
        i = i.trim()
    )
    b = b.splice(3)
    b = b.splice(0, b.length - 7)
    b = b.filter((i) => { if(i !== 'BLOCKED' && i) return i })
    console.log(b.length) //was 63, now 39
    

    let blockData = []

    for(let i = 0; i < b.length;){
        let block = {
            date: null,
            group: null,
            start: null,
            end: null
        }
        for(let m = 0; m < months.length; m++){
            //12 * b.length //12 * 63 === 756 iterations // now 12 * 39 = 468 // still O(n^2)
            if(b[i].includes(months[m])){
                block.date = b[i]
                blockData.push(block)
            }
        }


        i++;
    }
    console.log(blockData)

    console.log(b)

}
module.exports = parseBlocks