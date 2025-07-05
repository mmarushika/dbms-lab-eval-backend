import { 
    initEvaluationTableEnvironment,
    initTestCaseTableEnvironment,
    clearEvaluationTableEnvironment,
    clearTestCaseTableEnvironment,
    evaluateSelectTable,
    evaluateCreateTable,
    evaluateDropTable,
    evaluateDML
 } from "./evaluationQueryServices.js";

 import { parseInput } from "../utilities/InputParsers.js";

export function _getPassedCount(testCases) {
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
    console.log("DML");
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

    await initEvaluationTableEnvironment(userId, schemas);
    for await (const testCase of testCases) {
        await initTestCaseTableEnvironment(userId, testCase.input)
        let testCaseResult = await evaluateDML(userId, queries[0], testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseTableEnvironment(userId, schemas);
    }
    await clearEvaluationTableEnvironment(userId);
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

    await initEvaluationTableEnvironment(userId, schemas);
    for await (const testCase of testCases) {
        await initTestCaseTableEnvironment(userId, testCase.input)
        let testCaseResult = await evaluateSelectTable(userId, queries[0], testCase, err);
        submission.testCases.push(testCaseResult)
        await clearTestCaseTableEnvironment(userId, schemas);
    }
    await clearEvaluationTableEnvironment(userId);
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
    await initEvaluationTableEnvironment(userId, schemas);
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

    await clearEvaluationTableEnvironment(userId);
    for await (const testCase of testCases) {
        await initEvaluationTableEnvironment(userId, schemas);
        let testCaseResult = await evaluateDropTable(userId, queries[0], testCase, err);
        submission.testCases.push(testCaseResult)
        await clearEvaluationTableEnvironment(userId);
    }
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

let userId = '685bb48ef150d85daa68e8b0';

export async function generatePLSQLBlockEvaluationReport
({
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
    await initEvaluationTableEnvironment(userId, schemas);
    for await (const testCase of testCases) {
        await initTestCaseTableEnvironment(userId, testCase.input)
        let testCaseResult = await evaluatePLSQLBlock(userId, code, testCase);
        submission.testCases.push(testCaseResult)
        await clearTestCaseTableEnvironment(userId, schemas);
    }
    await clearEvaluationTableEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}