
export function getCreateTableQuery(schema) {
    let columns = schema.columns;
    let sql = `CREATE TABLE ${schema.tableName} (`
    for(let i = 0; i < columns.length; i++) {
        console.log()
        sql += `${columns[i].columnName} ${schema.columns[i].columnType}`
        if(columns[i].columnType == 'VARCHAR2') {
            sql +=`(100)`;
        }
        if(i != columns.length - 1) {
            sql += ", "
        } else {
            sql += ")";
        }
    }
    return sql;
}
/*export function getCreateTableQuery(schema) {
    let query = `CREATE TABLE :tableName (`
    for(let i = 0; i < schema.columns.length; i++) {
        query += `:columnName${i} :columnType${i}`;
        if(i != schema.columns.length - 1) {
            query += ","
        } else {
            query += ")";
        }
    }

    let bindVariables = {tableName : schema.tableName};
    for(let i = 0; i < schema.columns.length; i++) {
        bindVariables[`columnName${i}`] = schema.columns[i].columnName;
        bindVariables[`columnType${i}`] = schema.columns[i].columnType;
    }
    return {
        query: query,
        bindVariables: bindVariables
    }
}*/