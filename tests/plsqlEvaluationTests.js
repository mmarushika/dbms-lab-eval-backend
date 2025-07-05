import { 
    getAllTableNames,
    executePLSQL,
    selectTable
} from "../services/oracleDBServices.js";
import {
    functionQuestion,
    functionTestCases,
    procedureQuestion,
    procedureTestCases,
    triggerQuestion,
    triggerTestCases,
    blockQuestion,
    blockTestCases,
    procedureQuestion2,
    procedureTestCases2
} from "./sampleData.js";
import { 
     _compareTables,
    initEvaluationTableEnvironment,
    initTestCaseTableEnvironment,
    clearEvaluationTableEnvironment,
    clearTestCaseTableEnvironment 
} from "../services/evaluationQueryServices.js";

import { _getPassedCount } from "../services/reportGenerationServices.js";

import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');


export async function _evaluateTestCaseTables(userId, expectedTables) {
    // Get all relevant tabels
    let allTableNames = getAllTableNames(userId);
    let allTables = {};
    for(const tableName of allTableNames) {
        allTables[tableName] = await selectTable(userId, tableName);
    }

    // Compare tables to expected tables
    for(table of testCase.output.tables) {
        if(!_compareTables(allTables[table.tableName], table.rows)) {
            return false // Comparison fails
        } 
    }

    // Comparison doesn't fail
    return true;
}

export async function _evaluateTestCaseVariables(resultVariables, expectedVariables) {
    // resultVariables is an object
    // expectedVariables is an array
}

export async function getUserTables(userId) {
    
}

export async function evaluatePLSQL(userId, plsql, type, testCase, err) {
    console.log(plsql, type, testCase);
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
            variables: variables,
            dbms_output: dbms_output
        }

        // For each table compare the result tables after execution to stored output tables
        if(testCase.outputTypes.includes("tables")) {
            for(const table of testCase.output.tables) {
                if(!_compareTables(resultTables[table.tableName], table.rows)) {
                    status = false;
                } 
            }
        }

        // Compare each variable 
        if(testCase.outputTypes.includes("variables")) {
            console.log("OUTPUT", testCase.output.variables)
            console.log("RESULT", variables);
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
            output: null
        }
    } finally {
        return testCaseResult;
    }
}

export async function generatePLSQLEvaluationReport
({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
    type: type,
    testCases: testCases, 
    code: code
}) {
    let submission = {
        userId: userId,
        taskId: taskId,
        questionId: questionId,
        testCases: [],
        code: code
    }
    await clearEvaluationTableEnvironment(userId);
    await initEvaluationTableEnvironment(userId, schemas);
    for await (const testCase of testCases) {
        await initTestCaseTableEnvironment(userId, testCase.input.tables)
        let testCaseResult = await evaluatePLSQL(userId, code, type, testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseTableEnvironment(userId, schemas);
    }
    await clearEvaluationTableEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}


let procedureOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: procedureQuestion.schemas,
    type: procedureQuestion.subType,
    testCases: procedureTestCases.map(testCase => ({
        ...testCase,
        ["outputTypes"]: procedureQuestion.outputTypes,
        ["callName"]: procedureQuestion.solutionCallName,
    })),
    code: procedureQuestion.solutionQuery
}

let functionOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: functionQuestion.schemas,
    type: functionQuestion.subType,
    testCases: functionTestCases.map(testCase => ({
        ...testCase,
        ["outputTypes"]: functionQuestion.outputTypes,
        ["callName"]: functionQuestion.solutionCallName,
    })),
    code: functionQuestion.solutionQuery
}

let triggerOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: triggerQuestion.schemas,
    type: triggerQuestion.subType,
    testCases: triggerTestCases.map(testCase => ({
        ...testCase,
        ["outputTypes"]: triggerQuestion.outputTypes,
        ["validationQuery"]: triggerQuestion.validationQuery,
    })),
    code: triggerQuestion.solutionQuery
}

let blockOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: blockQuestion.schemas,
    type: blockQuestion.subType,
    testCases: blockTestCases.map(testCase => ({
        ...testCase,
        ["outputTypes"]: blockQuestion.outputTypes,
    })),
    code: blockQuestion.solutionQuery
}

let procedureOptions2 = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: procedureQuestion2.schemas,
    type: procedureQuestion2.subType,
    testCases: procedureTestCases2.map(testCase => ({
        ...testCase,
        ["outputTypes"]: procedureQuestion2.outputTypes,
        ["callName"]: procedureQuestion2.solutionCallName,
    })),
    code: procedureQuestion2.solutionQuery
}

const result = await generatePLSQLEvaluationReport(procedureOptions2);
console.log(result);