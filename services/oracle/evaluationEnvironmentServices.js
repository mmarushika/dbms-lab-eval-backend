import { getUserConnection } from "./oracleUserPoolServices.js";
import { createTable, insertTableInput, executeQuery } from "../oracleDBServices.js";

export async function initEvaluationEnvironment(userId, type, schemas, plsql, callName) {
    try {
        for (const schema of schemas) {
            await createTable(userId, schema);
        }

        if (type == 'FUNCTION' || type == 'PROCEDURE' || type == 'TRIGGER') {
            // Create stored funciton or procedure or trigger
            await executeQuery(userId, plsql);
        }
        /*const connection = await getUserConnection(userId);
        const objectName = callName?.toUpperCase();

        const result = await connection.execute(
            `SELECT LINE, POSITION, TEXT 
                 FROM USER_ERRORS 
                 WHERE NAME = :name`,
            { name: objectName }
        );

        if (result.rows.length > 0) {
            const errorText = result.rows.map(
                ([line, pos, text]) => `Line ${line}, Pos ${pos}: ${text}`
            ).join("\n");
            throw new Error(`PL/SQL compilation error in ${objectName}:\n${errorText}`);
        }*/
    } catch (error) {
        console.log("Error executing initEvaluationEnvironment", error.message);
        throw error;
    }
}

export async function initTestCaseEnvironment(userId, tables) {
    try {
        for (const input of tables) {
            if (input.rows.length != 0) {
                await insertTableInput(userId, input.tableName, input.rows);
            }
        }
    } catch (error) {
        console.log("Error executing initTestCaseEnvironment");
        throw error;
    }
}

export async function clearTestCaseEnvironment(userId) {
    let connection;
    try {
        // Get connection from the pool and use it    
        connection = await getUserConnection(userId);

        await connection.execute(`
                BEGIN
                    FOR ITEM IN (
                        SELECT TABLE_NAME 
                        FROM USER_TABLES
                    ) LOOP
                        EXECUTE IMMEDIATE 'TRUNCATE TABLE ' || ITEM.TABLE_NAME;
                    END LOOP;

                    COMMIT;
                 END;
            `, [], { autoCommit: true });
    } catch (error) {
        console.log("Error executing clearTestCaseEnvironment", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
                throw closeErr;
            }
        }
    }
}

export async function clearEvaluationEnvironment(userId) {
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

                    FOR ITEM IN (
                        SELECT TABLE_NAME 
                        FROM USER_TABLES
                    ) LOOP
                        EXECUTE IMMEDIATE 'DROP TABLE ' || ITEM.TABLE_NAME || ' CASCADE CONSTRAINTS';
                    END LOOP;
                    
                    EXECUTE IMMEDIATE 'PURGE RECYCLEBIN';
                    COMMIT;
                 END;
            `, [], { autoCommit: true });
    } catch (error) {
        console.log("Error executing clearEvaluationEnvironment", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
                throw closeErr;
            }
        }
    }
}