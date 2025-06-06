import oracledb from 'oracledb';

import { getCreateTableQuery } from "./utilities/OracleSQLConverters.js";

let schema = {
    tableName: 'employee', 
    columns: [
        {columnName: 'id', columnType: 'VARCHAR2'},
        {columnName: 'name', columnType: 'VARCHAR2'}
    ]
}

let sql = getCreateTableQuery(schema);
console.log(sql);

async function run() {
    try {
        const result = await connection.execute(sql);
    } catch(error) {
        console.log(error.message);
    }

}

run();