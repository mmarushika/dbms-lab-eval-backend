async function getResultColumns(result) {
    let rs = result.resultSet;
    let md = result.metaData;

    let columns = []
    for(let i = 0; i < md.length; i++) {
        columns.push({
            name : md[i].name,
            dbType : md[i].dbTypeName,
            values : []
        })
    }

    for await (const row of rs) {
        console.log(row);
        for(let i = 0; i < row.length; i++) {
            columns[i].values.push(row[i]);
        }
    }
    return columns;
}