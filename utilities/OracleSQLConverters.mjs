
export function getCreateTableQuery(schema) {
    const rows = schema.rows;
    let sql = `CREATE TABLE ${schema.tableName} (`
    for(let i = 0; i < rows.length; i++) {
        console.log()
        sql += `${rows[i].columnName} ${schema.rows[i].columnType}`
        if(rows[i].columnType == 'VARCHAR2') {
            sql +=`(100)`;
        }
        if(i != rows.length - 1) {
            sql += ", "
        } else {
            sql += ")";
        }
    }
    return sql;
}

export function getDropTableQuery(tableName) {
    return `DROP TABLE ${tableName}`;
}

export function getInsertTableInputQuery(tableName, rows) {
    let sql = `INSERT INTO ${tableName} VALUES (`

    let columnNames = Object.keys(rows[0]);
    for(let i = 0; i < columnNames.length; i++) {
        sql += `:${columnNames[i]}`
        if(i != columnNames.length - 1) {
            sql += ", "
        } else {
            sql += ")";
        }
    }

    return {
        sql: sql,
        binds: rows
    }
}

export function getTruncateTableQuery(tableName) {
    return `TRUNCATE TABLE ${tableName}`;
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