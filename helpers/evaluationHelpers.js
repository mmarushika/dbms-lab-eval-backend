import { 
    insertTableInput,
    getAllTableNames,
    createTable,
    dropAllTables,
    truncateTable
} from "../services/oracleDBServices.js";

export function _compareTables(result, output) {
    console.log("result", result);
    console.log("output", output);
    let outputColumns = Object.keys(output[0]);
    let resultColumns = Object.keys(result[0]);
    // Check for wrong no. of rows 
    if(result.length != output.length) {
        console.log("wr");
        return false;
    }
    
    // Check for wrong no. of columns
    if (outputColumns.length != resultColumns.length) {
        console.log("wc");
        return false;
    }

    console.log("names", outputColumns);
    for (let i = 0; i < output.length; i++) {
        console.log("row", result[i], output[i])
        for(let j = 0; j < outputColumns.length; j++) {
            // Check for mismatched columns
            if (result[i][outputColumns[j]] === undefined) {
                console.log("mc");
                return false;
            }

            // Check for inaccurate value
            if (result[i][outputColumns[j]] != output[i][outputColumns[j]]) {
                console.log("wv");
                return false;
            }
        };
    }
    return true;
}

export async function _checkIfTableExists(userId, tableName) {
    let allTables = await getAllTableNames(userId);
    return allTables.find(i => i === tableName);
}

export async function initEvaluationTableEnvironment(userId, schemas) {
    for await (const schema of schemas) {
        await createTable(userId, schema);
    }
}

export async function clearEvaluationTableEnvironment(userId, schemas) {
    /*for await (const schema of schemas) {
        await dropTable(schema.tableName);
    }*/
   await dropAllTables(userId);
}

export async function initTestCaseTableEnvironment(userId, tables) {
    for await (const input of tables) {
        if(input.rows.length != 0) {
            await insertTableInput(userId, input.tableName, input.rows);
        }
    }
}

export async function clearTestCaseTableEnvironment(userId, schemas) {
    console.log(userId, schemas);
    for await (const schema of schemas) {
        await truncateTable(userId, schema.tableName);
    }
}