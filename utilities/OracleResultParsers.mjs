export async function parseResult(result) {
    let rs = result.resultSet;
    let md = result.metaData;

    let rows = [];
    for await (const row of rs) {
        let rowObj = {}
        for(let i = 0; i < md.length; i++) {
            rowObj[md[i].name] = row[i];
        }
        rows.push(rowObj);
    }
    return rows;
}