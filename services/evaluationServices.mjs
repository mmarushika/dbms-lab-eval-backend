import { getTestCases } from "../models/TestCases.mjs";
import { createTable, dropTable, truncateTable } from "./oracleDBServices.mjs";
import { insertTableInput } from "./oracleDBServices.mjs";
import { executeSolution } from "./oracleDBServices.mjs";

export function _validate(result, output) {
    console.log("result", result);
    console.log("output", output);
    let outputColumns = Object.keys(output[0]);
    let resultColumns = Object.keys(result[0]);

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

export async function _evaluate(code, testCase) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    try {
        let result = await executeSolution(code);
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = _validate(result, JSON.parse(testCase.output));
        testCaseResult["output"] = JSON.stringify(result);
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
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
        await insertTableInput(input.tableName, JSON.parse(input.rows));
    }
}

async function _clearTestCaseEnvironment(schemas) {
    for await (const schema of schemas) {
        await truncateTable(schema.tableName);
    }
}

export async function getSubmissionReport(question, code) {
    const testCases = await getTestCases(question._id);

    await _initEvaluationEnvironment(question.schemas);

    let submission = {
        questionId: question._id,
        testCases: [],
        code: code
    }
    for await (const testCase of testCases) {
        await _initTestCaseEnvironment(testCase.input)
        let testCaseResult = await _evaluate(code, testCase);
        submission.testCases.push(testCaseResult)
        await _clearTestCaseEnvironment(question.schemas);
    }
    await _clearEvaluationEnvironment(question.schemas);
    return submission;
}

