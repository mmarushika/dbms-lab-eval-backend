
export function parseInput(code) {
    let queries = code.split(';');
    queries = queries.map(query => {
        let isLiteral = false;
        let result = "";
        for(const ch of query) {
            if(ch === "'" && !isLiteral) {
                isLiteral = true;
            } else if(ch === "'" && isLiteral) {
                isLiteral = false;
            }
            if(isLiteral) {
                result += ch;
            } else {
                if(ch === '\n' || ch === '\t') {
                    result += " ";
                } else {
                    result += ch;
                }
            }
        }
        return result;    
    })
    
    queries = queries
        .map(query => query.trim())
        .filter(i => 
        i !== '' && i !== ' ' && i !== '\n' && i !== '\t'
    )
    return queries;
}

/*

*/