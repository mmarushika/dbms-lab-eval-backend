import oracledb from 'oracledb';
import {
    getCreateTableQuery,
    getDropTableQuery,
    getInsertTableInputQuery,
    getTruncateTableQuery,
} from '../utilities/OracleSQLConverters.js';
import { getUserConnection } from './oracleUserPoolServices.js';
import { parseResult } from '../utilities/OracleResultParsers.js';

export async function createTable(userId, schema) {
    let sql = getCreateTableQuery(schema)
    let connection;
    try {
        // get connection from the pool and use it    
        //connection = await oracledb.getConnection();
        connection = await getUserConnection(userId);
        const result = await connection.execute(sql);
        // console.log(result);
    } catch (error) {
        console.log("Error: createTable", error.message);
        throw error
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }

}

export async function dropTable(userId, tableName) {
    let sql = getDropTableQuery(tableName)
    let connection;
    try {
        // get connection from the pool and use it    
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        const result = await connection.execute(sql, [], { autoCommit: true});
        // console.log(result);
    } catch (error) {
        console.log(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }

}

export async function dropAllTables(userId, tableName) {
    let connection;
    let allTables = await getAllTableNames(userId);
    allTables = allTables.map(i => i.TABLE_NAME);
    console.log("allTables", allTables);
    try {
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        for (tableName of allTables) {
            let sql = `DROP TABLE ${tableName}`;
            await connection.execute(sql, [], { autoCommit: true});
        }
    } catch (error) {
        console.log("dropAllTables", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }

}

export async function getAllTableNames(userId) {
    const sql = `
        SELECT TABLE_NAME
        FROM USER_TABLES
    `
    let connection;
    try {
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        const result = await connection.execute(sql, [], { resultSet: true });
        let output = await parseResult(result);
        return output;
    } catch (error) {
        console.log("getAllTableNames", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

export async function insertTableInput(userId, tableName, rows) {
    let query = getInsertTableInputQuery(tableName, rows);
    // console.log(query);
    let connection;
    try {
        // get connection from the pool and use it   
        connection = await getUserConnection(userId); 
        //connection = await oracledb.getConnection();
        let options = {
            autoCommit: true,
        }
        const result = await connection.executeMany(query.sql, query.binds, options);
        // console.log(result);
    } catch (error) {
        throw error;
        console.log(error.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

export async function truncateTable(userId, tableName) {
    let sql = getTruncateTableQuery(tableName);
    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);  
        //connection = await oracledb.getConnection();
        let options = {
            autoCommit: true,
        }
        const result = await connection.execute(sql, [], options);
        // console.log(result);
    } catch (error) {
        console.log("Error: truncateTable", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }

}

export async function selectTable(userId, tableName) {
    let sql =  `SELECT * FROM ${tableName}`;
    let connection;
    console.log("solution query", sql);
    try {
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        return output;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}


export async function executeSelect(userId, sql) {
    let connection;
    console.log("solution query", sql);
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);  
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        return output;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

export async function executeQuery(userId, sql) {
    let connection;
    console.log("solution query", sql);
    try {
        // get connection from the pool and use it    
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        return result;
    } catch (error) {
        console.log("Error executing", sql, error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

export async function selectAllConstraintNames(userId) {
    let sql = 'SELECT CONSTRAINT_NAME FROM USER_CONSTRAINTS';
    let connection;
    try {
        // get connection from the pool and use it
        connection = await getUserConnection(userId);    
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        console.log("execute solution output", output);
        return output;
    } catch (error) {
        console.log("Select constraints error")
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

export async function describeTable(userId, tableName) {
    console.log("describe table");
    let sql = `
        SELECT COLUMN_NAME, DATA_TYPE
        FROM user_tab_columns 
        WHERE table_name = '${tableName}'
        ORDER BY column_id
    `;
    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);  
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        console.log("execute solution output", output);
        return output;
    } catch (error) {
        console.log("Describe tables error")
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}