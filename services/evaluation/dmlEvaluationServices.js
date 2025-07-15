import {
    executeSelect,
    executeQuery,
    getAllTableNames,
    selectTable
} from "../oracleDBServices.js";

import { compareTables } from "../../helpers/evaluationHelpers.js";

export async function evaluateDML(userId, type, code, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if (err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = [{
            tables: [],
            variables: [],
            dbms_output: []
        }]
        return testCaseResult;
    }
    try {
        let status = true;
        let results = [];

        if (type == 'SELECT') {
            let result = await executeSelect(userId, code);
            status = compareTables(result, testCase.output.tables[0].rows);
            results.push({
                tableName: "RESULT",
                rows: result
            })
        } else {
            // Execute DML query to manipulate existing tables
            let result = await executeQuery(userId, code); 
            
            // Get all relevant tables
            let allTableNames = await getAllTableNames(userId) ?? [];
            let allTables = {};
            for (const tableName of allTableNames) {
                allTables[tableName] = await selectTable(userId, tableName);
            }

            // For each table compare the manipulate input tables to stored output tables
            for (const table of testCase.output.tables) {
                if (!compareTables(allTables[table.tableName], table.rows)) {
                    status = false;
                }
                results.push(
                    {
                        tableName: table.tableName,
                        rows: allTables[table.tableName]
                    }
                );
            }
            console.log("INSERT TABLES", result)
        }
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = status;
        testCaseResult["output"] = {
            tables: results,
            variables: [],
            dbms_output: []
        };
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = {
            tables: [],
            variables: [],
            dbms_output: []
        };
    } finally {
        return testCaseResult;
    }
}


