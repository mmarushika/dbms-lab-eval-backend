import { 
    executePLSQL,
    getAllTableNames,
    selectTable
} from "../oracleDBServices.js";

import { compareTables } from "../../helpers/evaluationHelpers.js";

export async function evaluatePLSQL(userId, type, plsql, testCase, err) {
    console.log("EVALUATE PLSQL TESTCASE", testCase);
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
        let options = {
            callName : testCase.callName,
            variables : testCase.input.variables,
            returnValue : testCase.input.returnValue,
            query: testCase.validationQuery
        }

        // Execute PL/SQL Procedure
        const {variables, dbms_output, returnValue } = await executePLSQL(
            userId, 
            plsql,
            type,
            options
        );

        // Get result tables
        let resultTableNames = await getAllTableNames(userId);
        let resultTables = {};
        for (const tableName of resultTableNames) {
            resultTables[tableName] = await selectTable(userId, tableName);
        }

        let status = true;
        let results = {
            tables : resultTableNames.map(name => (
                {
                    tableName: name,
                    rows: resultTables[name]
                }
            )),
            variables: Object.keys(variables).map(key => ({name: key, value: variables[key]})),
            dbms_output: dbms_output
        }

        // For each table compare the result tables after execution to stored output tables
        if(testCase.outputTypes.includes("tables")) {
            for(const table of testCase.output.tables) {
                if(!compareTables(resultTables[table.tableName], table.rows)) {
                    status = false;
                } 
            }
        }

        // Compare each variable 
        if(testCase.outputTypes.includes("variables")) {
            for(const variable of testCase.output.variables) {
                if(variable.value !== variables[variable.name]) {
                    status = false;
                }
            }
        }

        // Compare dbms_output
        if(testCase.outputTypes.includes("dbms_output")) {
            if (testCase.output.dbms_output.length == dbms_output.length) {
                for (let i = 0; i < testCase.output.dbms_output.length; i++) {
                    if (dbms_output[i].trim() !== testCase.output.dbms_output[i].trim()) {
                        status = false;
                        break;
                    }
                }
            } else {
                status = false;
            }
        }

        // Compare return value
        if(testCase.outputTypes.includes("returnValue")) {
            if(returnValue !== testCase.output.returnValue.value) {
                status = false;
            }
        }

        testCaseResult = {
            errorMsg: null,
            passed: status,
            output: results
        }
    } catch (error) {
        console.log(error.stack);
        testCaseResult = {
            errorMsg: error.message,
            passed: false,
            output: {
                tables: [],
                variables: [],
                dbms_output: []
            }
        }
    } finally {
        return testCaseResult;
    }
}
