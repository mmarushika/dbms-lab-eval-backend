
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
} from "./plsqlSampleData.js";

import { generatePLSQLEvaluationReport } from "../reportGenerationServices.js";

import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

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

console.log("PROCEDURE 1");
let result = await generatePLSQLEvaluationReport(procedureOptions);
console.log(result);

console.log("FUNCTION");
result = await generatePLSQLEvaluationReport(functionOptions);
console.log(result);

console.log("TRIGGER");
result = await generatePLSQLEvaluationReport(triggerOptions);
console.log(result);

console.log("BLOCK");
result = await generatePLSQLEvaluationReport(blockOptions);
console.log(result);

console.log("PROCEDURE 2");
result = await generatePLSQLEvaluationReport(procedureOptions2);
console.log(result);
