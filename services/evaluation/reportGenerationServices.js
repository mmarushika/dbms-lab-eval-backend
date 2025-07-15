import { evaluatePLSQL } from "./plsqlEvaluationServices.js";
import { evaluateDDL } from "./ddlEvaluationServices.js";
import { evaluateDML } from "./dmlEvaluationServices.js";
import { evaluateConstraint } from "./constraintEvaluationServices.js";

import { parseInput } from "../../utilities/InputParsers.js";

import {
    initEvaluationEnvironment,
    initTestCaseEnvironment,
    clearEvaluationEnvironment,
    clearTestCaseEnvironment
} from "../oracle/evaluationEnvironmentServices.js";

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

    try {
        await clearEvaluationEnvironment(userId);
    await initEvaluationEnvironment(userId, type, schemas, code);
    for await (const testCase of testCases) {
        await initTestCaseEnvironment(userId, testCase.input.tables)
        let testCaseResult = await evaluatePLSQL(userId, type, code, testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseEnvironment(userId, schemas);
    }
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
    } catch(error) {
        submission.testCases = testCases.map(i => ({
            errorMsg: error.message,
            passed: false,
            output: {
                tables: [],
                variables: [],
                dbms_output: []
            }
        }))
    }
}

export async function generateDDLEvaluationReport
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
    const queries = parseInput(code);
    let err = "";
    if(queries.length != 1) {
        err = "Too many queries";
        console.log("Error", queries.length, queries);
    }
    await clearEvaluationEnvironment(userId);
    if(type != 'CREATE') {
        await initEvaluationEnvironment(userId, type, schemas);
    }
    let testCaseResult = await evaluateDDL(userId, type, queries[0], testCases[0], err);
    submission.testCases.push(testCaseResult)
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function generateConstraintEvaluationReport
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
    const queries = parseInput(code);
    let err = "";
    if(queries.length != 1) {
        err = "Too many queries";
        console.log("Error", queries.length, queries);
    }
    await clearEvaluationEnvironment(userId);
    await initEvaluationEnvironment(userId, type, schemas);
    let testCaseResult = await evaluateConstraint(userId, type, queries[0], testCases[0], err);
    submission.testCases.push(testCaseResult)
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function generateDMLEvaluationReport
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
    const queries = parseInput(code);
    let err = "";
    if(queries.length != 1) {
        err = "Too many queries";
        console.log("Error", queries.length, queries);
    }
    await clearEvaluationEnvironment(userId);
    await initEvaluationEnvironment(userId, type, schemas, code);
    for await (const testCase of testCases) {
        await initTestCaseEnvironment(userId, testCase.input.tables)
        let testCaseResult = await evaluateDML(userId, type, queries[0], testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseEnvironment(userId, schemas);
    }
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

function _getPassedCount(testCases) {
    let count = 0;
    for(let testCase of testCases) {
        if(testCase.passed) {
            count++;
        }
    }
    return count;
}


