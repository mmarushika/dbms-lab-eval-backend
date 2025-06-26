import { 
    initEvaluationEnvironment,
    initTestCaseEnvironment,
    clearEvaluationEnvironment,
    clearTestCaseEnvironment,
    evaluateSelectTable,
    evaluateCreateTable,
    evaluateDropTable
 } from "./evaluationQueryServices.js";

 import { parseInput } from "../utilities/InputParsers.js";

function _getPassedCount(testCases) {
    let count = 0;
    for(let testCase of testCases) {
        if(testCase.passed) {
            count++;
        }
    }
    return count;
}

export async function generateDMLEvaluationReport({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
    testCases: testCases, 
    code: code
}) {
    await initEvaluationEnvironment(userId, schemas);
    let submission = {
        userId: userId,
        taskId: taskId,
        questionId: questionId,
        testCases: [],
        code: code
    }
    for await (const testCase of testCases) {
        await initTestCaseEnvironment(userId, testCase.input)
        let testCaseResult = await evaluateSelectTable(userId, code, testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseEnvironment(userId, schemas);
    }
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function generateSelectTableEvaluationReport({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
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

    await initEvaluationEnvironment(userId, schemas);
    for await (const testCase of testCases) {
        await initTestCaseEnvironment(userId, testCase.input)
        let testCaseResult = await evaluateSelectTable(userId, queries[0], testCase, err);
        submission.testCases.push(testCaseResult)
        await clearTestCaseEnvironment(userId, schemas);
    }
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function generateCreateTableEvaluationReport({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
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
    for await (const testCase of testCases) { // Ideally only one test case
        let testCaseResult = await evaluateCreateTable(userId, queries[0], testCase, err);
        submission.testCases.push(testCaseResult);
    }
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function generateDropTableEvaluationReport({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
    testCases: testCases, 
    code: code
}) {
    await initEvaluationEnvironment(userId, schemas);
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
    for await (const testCase of testCases) {
        await initEvaluationEnvironment(userId, schemas);
        let testCaseResult = await evaluateDropTable(userId, queries[0], testCase, err);
        submission.testCases.push(testCaseResult)
        await clearEvaluationEnvironment(userId);
    }
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}