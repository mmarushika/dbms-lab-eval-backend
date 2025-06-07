import oracledb from 'oracledb';

import { getCreateTableQuery } from "./utilities/OracleSQLConverters.mjs";
import { createPool } from './config/database.mjs';

let schema = {
    tableName: 'employee', 
    columns: [
        {columnName: 'id', columnType: 'VARCHAR2'},
        {columnName: 'name', columnType: 'VARCHAR2'}
    ]
}

/*let sql = getCreateTableQuery(schema);
console.log(sql);*/

/*let columns = [
    {
        name : 
        dbType:
        values: 
    }
]
}*/
async function execute(sql) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql, [], {resultSet: true});
        const columns = await getColumns(result.metaData, result.resultSet);
        console.log(columns);
        //display(result.resultSet);
    } catch(error) {
        console.log(error.message);
    } finally {
        await connection.close();
    }

}

async function run() {
    await createPool();
    let sql = 'SELECT branch_name, branch_id from branch'
    await execute(sql);
    sql = 'SELECT * from branch'
    await execute(sql);
    //await oracledb.getPool().close(0);
}

async function display(resultSet) {
    for await (const row of resultSet) {
        console.log(row);
    }
}
run();
async function getColumns(metaData, resultSet) {
    let columns = []
    for(let i = 0; i < metaData.length; i++) {
        columns.push({
            name : metaData[i].name,
            dbType : metaData[i].dbTypeName,
            values : []
        })
    }

    for await (const row of resultSet) {
        console.log(row);
        for(let i = 0; i < row.length; i++) {
            columns[i].values.push(row[i]);
        }
    }
    return columns;
}