export const createGroupObject = (g) => {
    let groupObj = []
    for(let i = 0; i < g.length; i++) {
        let group = {
            id: g[i]._id,
            name: g[i].group.name,
            number: g[i].group.number,
            earned: 0,
            received: 0,
            remaining: 0,
            miles: 0,
            duration: 0
        }
        groupObj.push(group)
    }
    return groupObj
}

export const calculateGroupData = (groups, games) => {
    let total = 0
    console.log(groups)

    for(let i = 0; i < games.length; i++){
        for(let x = 0; x < groups.length; x ++){
            if(games[i].refereeGroup === groups[x].name){
                groups[x].earned += games[i].fees
                groups[x].miles += games[i].distance
                if(games[i].paid){
                    groups[x].received += games[i].fees
                }
            }
        }
        total += games[i].fees
    }
    console.log(groups)

    groups = groups.filter((group) => {
        if(group.earned === 0 && group.miles === 0){
            return false
        }
        return true
    })
    console.log(groups)
    return [total, groups]
}