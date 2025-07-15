import {
    compareTables,
    _checkIfTableExists
} from "../../helpers/evaluationHelpers.js";

import {
    selectTable,
    executeQuery,
    describeTable
} from "../oracleDBServices.js";

export async function evaluateOutputSchema(userId, testCase) {
    let results = [];
    let status = true;
    let errorMsg = "";
    let result = await describeTable(userId, testCase.output.tables[0].tableName);
    if (result.length == 0) {
        errorMsg = "Table name is incorrect";
        status = false;
    } else if (!compareTables(result, testCase.output.tables[0].rows)) {
        status = false;
    }
    results.push({
        tableName: testCase.output.tables[0].tableName,
        rows: result
    })
    return {
        errorMsg: errorMsg,
        passed: status,
        output: {
            tables: results,
            variables: [],
            dbms_output: []
        }
    };
}

export async function evaluateDrop(userId, testCase) {
    let status = true;
    let errorMsg = "";
    let result = await _checkIfTableExists(userId, testCase.input.tables[0].tableName);
    if (result) {
        status = false;
    }
    return {
        errorMsg: errorMsg,
        passed: status,
        output: {
            tables: [],
            variables: [],
            dbms_output: []
        }
    }
}

export async function evaluateRename(userId, testCase) {
    let status = true;
    let errorMsg = "";

    let originalTableExists = await _checkIfTableExists(userId, testCase.input.tables[0].tableName);
    let renamedTableExists = await _checkIfTableExists(userId, testCase.output.tables[0].tableName);
    if (
        renamedTableExists &&
        !originalTableExists
    ) {
        let result = await evaluateOutputSchema(userId, testCase);
        if (!result.passed) {
            status = false
        }
    } else {
        status = false;
    }
    return {
        errorMsg: errorMsg,
        passed: status,
        output: {
            tables: [],
            variables: [],
            dbms_output: []
        }
    }
}

export async function evaluateTruncateTable(userId, testCase) {
    let status = true;
    let errorMsg = "";
    let result = await selectTable(userId, testCase.input.tables[0].tableName);
    if (result.length != 0) {
        status = false;
    }
    return {
        errorMsg: errorMsg,
        passed: status,
        output: {
            tables: [],
            variables: [],
            dbms_output: []
        }
    }
}

export async function evaluateDDL(userId, type, query, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if (err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }

    let evaluation = null;
    try {
        // Execute DDL 
        await executeQuery(userId, query);
        switch (type) {
            case 'CREATE':
            case 'ALTER':
                evaluation = await evaluateOutputSchema(userId, testCase);
                break;
            case 'DROP':
                evaluation = await evaluateDrop(userId, testCase);
                break;
            case 'TRUNCATE':
                evaluation = await evaluateTruncateTable(userId, testCase);
                break;
            case 'RENAME':
                evaluation = await evaluateRename(userId, testCase);
                break;
        }

        testCaseResult = {
            ...testCaseResult,
            ...evaluation
        }
    } catch (error) {
        console.log("ERROR IN EVALUTATION");
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}

