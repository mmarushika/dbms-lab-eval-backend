import { getAllTestCases } from "../models/TestCases.js";
import { createTable, dropTable, truncateTable } from "./oracleDBServices.js";
import { insertTableInput } from "./oracleDBServices.js";
import { executeSolution } from "./oracleDBServices.js";

export function compareOutput(result, output) {
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

export async function evaluateQuery(code, testCase) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    try {
        let result = await executeSolution(code);
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = compareOutput(result, testCase.output);
        testCaseResult["output"] = result;
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
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
async function _initEvaluationEnvironment(schemas) {
    for await (const schema of schemas) {
        await createTable(schema);
    }
}


async function _clearEvaluationEnvironment(schemas) {
    for await (const schema of schemas) {
        await dropTable(schema.tableName);
    }
}

async function _initTestCaseEnvironment(inputs) {
    for await (const input of inputs) {
        await insertTableInput(input.tableName, input.rows);
    }
}

async function _clearTestCaseEnvironment(schemas) {
    for await (const schema of schemas) {
        await truncateTable(schema.tableName);
    }
}

export async function generateDMLSubmissionReport(
    userId, 
    taskId, 
    questionId, 
    schemas, 
    testCases, 
    code
) {
    await _initEvaluationEnvironment(schemas);
    let submission = {
        userId: userId,
        taskId: taskId,
        questionId: questionId,
        testCases: [],
        code: code
    }
    for await (const testCase of testCases) {
        await _initTestCaseEnvironment(testCase.input)
        let testCaseResult = await evaluateQuery(code, testCase);
        submission.testCases.push(testCaseResult)
        await _clearTestCaseEnvironment(schemas);
    }
    await _clearEvaluationEnvironment(schemas);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

