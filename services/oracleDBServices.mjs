import oracledb from 'oracledb';
import { getCreateTableQuery } from "../utilities/OracleSQLConverters.mjs";
import { getDropTableQuery } from '../utilities/OracleSQLConverters.mjs';
import { getInsertTableInputQuery } from '../utilities/OracleSQLConverters.mjs';
import { getTruncateTableQuery } from '../utilities/OracleSQLConverters.mjs';
import { parseResult } from '../utilities/OracleResultParsers.mjs';

export async function createTable(schema) {
    let sql = getCreateTableQuery(schema)
    let connection;
    try {
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql);
        // console.log(result);
    } catch (error) {
        console.log(error.message);
    }

    await connection.close();

}

export async function dropTable(tableName) {
    let sql = getDropTableQuery(tableName)
    let connection;
    try {
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql);
        // console.log(result);
    } catch (error) {
        console.log(error.message);
    }

    await connection.close();

}

export async function insertTableInput(tableName, rows) {
    let query = getInsertTableInputQuery(tableName, rows);
    // console.log(query);
    let connection;
    try {
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        let options = {
            autoCommit: true,
        }
        const result = await connection.executeMany(query.sql, query.binds, options);
        // console.log(result);
    } catch (error) {
        console.log(error.message);
    }

    await connection.close();
}

export async function truncateTable(tableName) {
    let sql = getTruncateTableQuery(tableName);
    let connection;
    try {
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        let options = {
            autoCommit: true,
        }
        const result = await connection.execute(sql, [], options);
        // console.log(result);
    } catch (error) {
        console.log(error.message);
    }

    await connection.close();
}

export async function executeSolution(sql) {
    let connection;
    console.log("solution query", sql);
    try {
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], {resultSet: true})
        let output = await parseResult(result);
        console.log("execute solution output", output);
        return output;
    } catch (error) {
        throw error;
    }
    await connection.close();
}