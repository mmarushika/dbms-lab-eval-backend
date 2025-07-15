import {
    getCreateTableQuery,
    getDropTableQuery,
    getInsertTableInputQuery,
    getTruncateTableQuery,
    getProcedureOrFunctionCall,
    getBindVariables
} from '../utilities/OracleSQLConverters.js';
import { getUserConnection } from './oracle/oracleUserPoolServices.js';
import { 
    parseResult,
    parseConstraintOutput 
} from '../utilities/OracleResultParsers.js';

import oracledb from 'oracledb';

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
        WHERE table_name = '${tableName.toUpperCase()}'
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
    try {
        // Get user connection from the pool   
        connection = await getUserConnection(userId);

        let result = await connection.execute(sql, [], { autoCommit: true })
        return result;
    } catch (error) {
        console.log("Error executing query", sql, error.message);
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
        // Get user connection from the pool  
        connection = await getUserConnection(userId);

        // Set dbms_output 
        await connection.execute(`
            BEGIN
                DBMS_OUTPUT.ENABLE(NULL); -- NULL means unlimited buffer size
             END;
        `);

        let callResult = null;
        console.log(variables, getBindVariables(variables));
        switch (type) {
            case 'PROCEDURE':
                console.log("Executing Procedure");
                // Exectue stored procedure
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
                // Execute stored function
                callResult = await connection.execute(`
                    BEGIN
                        :returnVal := ${getProcedureOrFunctionCall(callName, variables)};
                        COMMIT;
                    END;`
                    ,
                    getBindVariables(variables, returnValue)
                );
                break;
            case 'BLOCK':
                // Execute anonymous block
                await connection.execute(plsql, [], { autoCommit: true });
                break;
            case 'TRIGGER':
                // Excute triggering query
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
        console.log("Error executing plsql", plsql, error.message);
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

export async function dropAllProcedures(userId) {
    let connection;
    try {
        // Get connection from the pool and use it    
        connection = await getUserConnection(userId);

        await connection.execute(`
            BEGIN
                FOR ITEM IN (
                    SELECT OBJECT_NAME, OBJECT_TYPE
                    FROM USER_PROCEDURES
                ) LOOP
                    IF ITEM.OBJECT_TYPE = 'FUNCTION' THEN
                        EXECUTE IMMEDIATE 'DROP FUNCTION ' || ITEM.OBJECT_NAME;
                    ELSIF ITEM.OBJECT_TYPE = 'PROCEDURE' THEN
                        EXECUTE IMMEDIATE 'DROP PROCEDURE ' || ITEM.OBJECT_NAME;
                    END IF;
                END LOOP;
                EXECUTE IMMEDIATE 'PURGE RECYCLEBIN';
                COMMIT;
             END;
        `, [], { autoCommit: true });
    } catch (error) {
        console.log("Error executing", error.message);
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

export async function describeTableConstraints(userId) {
    const sql = `
    SELECT 
        UC.CONSTRAINT_TYPE, 
        UCC.COLUMN_NAME, 
        UCC.TABLE_NAME,
        UC.CONSTRAINT_NAME,
        UC.R_CONSTRAINT_NAME,
        PK.TABLE_NAME AS REF_TABLE_NAME,
        PKC.COLUMN_NAME AS REF_COLUMN_NAME,
        UTC.NULLABLE
    FROM USER_CONSTRAINTS UC 
    JOIN USER_CONS_COLUMNS UCC
        ON UC.CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
    LEFT JOIN USER_CONSTRAINTS PK
        ON UC.R_CONSTRAINT_NAME = PK.CONSTRAINT_NAME
    LEFT JOIN USER_CONS_COLUMNS PKC 
        ON PK.CONSTRAINT_NAME = PKC.CONSTRAINT_NAME
    JOIN USER_TAB_COLUMNS UTC
        ON UTC.TABLE_NAME = UCC.TABLE_NAME 
       AND UTC.COLUMN_NAME = UCC.COLUMN_NAME
    ORDER BY 
        UCC.TABLE_NAME,
        UC.CONSTRAINT_TYPE,
        UCC.COLUMN_NAME,
        UC.CONSTRAINT_NAME
`;

    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        result = await parseResult(result);
        let output = parseConstraintOutput(result);
        return output;
    } catch (error) {
        console.log("Error describing constraints", sql);
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
