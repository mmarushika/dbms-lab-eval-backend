import oracledb from 'oracledb';
import { getCreateTableQuery } from "../utilities/OracleSQLConverters.mjs";

export async function createSchema(schema) {
    let sql = getCreateTableQuery(schema)
    let connection;
    try { 
        // get connection from the pool and use it    
        connection = await oracledb.getConnection();
        const result = await connection.execute(sql);
        console.log(result);
    } catch(error) {
        console.log(error.message);
    }
        
    await connection.close();
    
 }