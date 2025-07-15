import { testCaseSchema } from "../models/index.js";
import { 
    createTable, 
    dropTable, 
    truncateTable,
    insertTableInput,
    executeSelect,
    executeQuery,
    describeTable, 
    dropAllTables,
    getAllTableNames, 
    selectTable
} from "./oracleDBServices.js";

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

export async function evaluateSelectTable(userId, query, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if(err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }
    try {
        let result = await executeSelect(userId, query);
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = _compareTables(result, testCase.output[0].rows);
        testCaseResult["output"] = [
            {
                tableName: "",
                rows: result
            }
        ]
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}

export async function evaluateCreateTable(userId, query, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if(err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }
    try {
        let errorMsg = null;
        let status = true;
        let results = [];
        for (const table of testCase.output) { 
            await clearEvaluationTableEnvironment(userId);
            await executeQuery(userId, query);
            let result = await describeTable(userId, table.tableName);
            if(result.length == 0) {
                errorMsg = "Table name is incorrect"
                status = false
            } else if(!_compareTables(result, table.rows)) {
                status = false;
            }
            results.push({
                tableName: table.tableName,
                rows: result
            })
        }
        testCaseResult["errorMsg"] = errorMsg;
        testCaseResult["passed"] = status;
        testCaseResult["output"] = errorMsg ?? results;
    } catch (error) {
        console.log("ERROR IN EVALUTATION");
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}

export async function evaluateDropTable(userId, query, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if(err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }
    let results = [];
    let status = true;
    try {
        for await (const table of testCase.input) { 
            await executeQuery(userId, query);
            let result = await _checkIfTableExists(userId, table.tableName);
            if(result) {
                status = false
                results.push(`${table.tableName} Not Dropped`)
            } else {
                results.push(`${table.tableName} Dropped`);
            }
        }
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = status;
        testCaseResult["output"] = results;
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}

export async function evaluateDML(userId, code, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if(err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }
    try {
        let result = await executeQuery(userId, code); // Execute DML query to manipulate existing tables
        // Get all relevant tabels
        let allTableNames = await getAllTableNames(userId);
        let allTables = {};
        for(const tableName of allTableNames) {
           allTables[tableName] = await selectTable(userId, tableName);
        }
        let status = true;
        let results = [];
        testCaseResult["errorMsg"] = null;

        // For each table compare the manipulate input tables to stored output tables
        for(const table of testCase.output) {
            if( !_compareTables(allTables[table.tableName], table.rows)) {
                status = false;
            }
            results.push(
                {
                    tableName: "",
                    rows: allTables[table.tableName]
                }
            );
        }
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = status;
        testCaseResult["output"] = results;
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}


