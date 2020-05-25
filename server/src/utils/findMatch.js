const findMatch = (first, second, criteria) => {
    let matches = []
    let unMatched = []



    for(let f = 0; f < first.length; f++){
        for(let s = 0; s < second.length; s++){
            for(c = 0; c < criteria.length; c++){
                if(first[f].criteria[c] === second[s].criteria[c]){
                    matches.push({
                        first: first[f],
                        second: second[s],
                        criteria: criteria[c]
                    })
                }
            }
        }
        //didnt match with any of the second list items
        unMatched.push(first[f])
    }
}