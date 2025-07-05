import oracledb from 'oracledb';
import {
    getCreateTableQuery,
    getDropTableQuery,
    getInsertTableInputQuery,
    getTruncateTableQuery,
    getProcedureOrFunctionCall,
    getBindVariables
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
        const result = await connection.execute(sql, [], { autoCommit: true });
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
    console.log("allTables", allTables);
    try {
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        for (tableName of allTables) {
            let sql = `DROP TABLE ${tableName}`;
            await connection.execute(sql, [], { autoCommit: true });
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
        let parsedResult = await parseResult(result);
        let output = parsedResult.map(i => i.TABLE_NAME);
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
    let sql = `SELECT * FROM ${tableName}`;
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
        let result = await connection.execute(sql, [], { resultSet: true, autoCommit: true })
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

export async function executePLSQLBlock(userId, block) {
    let connection;
    try {
        // Get connection from the pool and use it    
        connection = await getUserConnection(userId);

        // Set dbms_output 
        await connection.execute(`
            BEGIN
                DBMS_OUTPUT.ENABLE(NULL); -- NULL means unlimited buffer size
             END;
        `);

        // Execute anonymous pl/sql block
        await connection.execute(block, { autoCommit: true });

        // Retrieve DBMS_OUTPUT
        const result = await connection.execute(`
            BEGIN
                DBMS_OUTPUT.GET_LINES(:lines, :numlines);
            END;`,
            {
                lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxArraySize: 100 },
                numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 100 }
            }
        );
        return result.outBinds.lines;
    } catch (error) {
        console.log("Error executing", block, error.message);
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
export async function executePLSQLProcedure(userId, procedure, procedureName, variables) {
    let connection;
    try {
        // Get connection from the pool and use it    
        connection = await getUserConnection(userId);

        // Set dbms_output 
        await connection.execute(`
            BEGIN
                DBMS_OUTPUT.ENABLE(NULL); -- NULL means unlimited buffer size
             END;
        `);

        // Create procedure
        await connection.execute(procedure, [], { autoCommit: true });

        // Call procedure
        const callResult = await connection.execute(`
            BEGIN
                ${getProcedureOrFunctionCall(procedureName, variables)};
            END;`,
            getBindVariables(variables)
        );
        // Retrieve DBMS_OUTPUT
        const dbmsResult = await connection.execute(`
            BEGIN
                DBMS_OUTPUT.GET_LINES(:lines, :numlines);
            END;`,
            {
                lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxArraySize: 100 },
                numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 100 }
            }
        );
        let output = {
            variables: callResult.outBinds,
            dbms_output: dbmsResult.outBinds.lines.filter(line => line !== null)
        }
        return output;
    } catch (error) {
        console.log("Error executing", procedure, error.message);
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

export async function executePLSQL(userId, plsql, type, options) {
    const { callName, variables, returnValue, query } = options;
    let connection;
    try {
        // Get connection from the pool and use it    
        connection = await getUserConnection(userId);

        // Set dbms_output 
        await connection.execute(`
            BEGIN
                DBMS_OUTPUT.ENABLE(NULL); -- NULL means unlimited buffer size
             END;
        `);

        // Execute plsql (Create procedure/function/trigger, Execute block)
        await connection.execute(plsql, [], { autoCommit: true });

        let callResult = null;
        switch (type) {
            case 'PROCEDURE':
                callResult = await connection.execute(`
                    BEGIN
                        ${getProcedureOrFunctionCall(callName, variables)};
                        COMMIT;
                    END;`
                    ,
                    getBindVariables(variables)
                );
                break;
            case 'FUNCTION':
                callResult = await connection.execute(`
                    BEGIN
                        :returnVal := ${getProcedureOrFunctionCall(callName, variables)};
                        COMMIT;
                    END;`
                    ,
                    getBindVariables(variables, returnValue) 
                );
                break;
            case 'TRIGGER':
                console.log("QUERY", query);
                await connection.execute(plsql, [], { autoCommit: true });
                await connection.execute(query, [], { autoCommit: true });
        }

        // Retrieve DBMS_OUTPUT
        const dbmsResult = await connection.execute(`
            BEGIN
                DBMS_OUTPUT.GET_LINES(:lines, :numlines);
            END;`,
            {
                lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxArraySize: 100 },
                numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 100 },
            }
        );
        const { returnVal, ...resultVariables } = callResult?.outBinds ?? {};
        let output = {
            variables: resultVariables, // variables object
            dbms_output: dbmsResult.outBinds.lines.filter(line => line !== null),
            returnValue: returnVal
        }
        return output;
    } catch (error) {
        console.log("Error executing", plsql, error.message);
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

