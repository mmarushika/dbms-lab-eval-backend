import mongoose from "mongoose";

await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

import { executePLSQL } from "../services/oracleDBServices.js";

import {
    functionQuestion,
    functionTestCase,
    procedureQuestion,
    procedureTestCase,
    triggerQuestion,
    triggerTestCase,
    blockQuestion,
} from "./sampleData.js";

import { 
    initTestCaseTableEnvironment,
    initEvaluationTableEnvironment,
    clearTestCaseTableEnvironment,
    clearEvaluationTableEnvironment
} from "../services/evaluationQueryServices.js";

import { _compareTables } from "../services/evaluationQueryServices.js";

let userId = '685bb48ef150d85daa68e8b0';

// export async function executePLSQL(userId, plsql, type, options) {
// { callName, variables, query } = options;

// Test function

async function testPlsqlFunction() {
    let options = {
        callName : functionQuestion.solutionCallName,
        variables : functionTestCase.input.variables,
        returnValue: functionTestCase.input.returnValue
    }
    await initEvaluationTableEnvironment(userId, functionQuestion.schemas);
    await initTestCaseTableEnvironment(userId, functionTestCase.input.tables);
    let result = await executePLSQL(
        userId, 
        functionQuestion.solutionQuery,
        'FUNCTION',
        options
    );
    await clearEvaluationTableEnvironment(userId);
    console.log("output", result);
    console.log("expected output", functionTestCase.output);
}

// Test Procedure 

async function testPlsqlProcedure() {
    let options = {
        callName : procedureQuestion.solutionCallName,
        variables : procedureTestCase.input.variables,
    }
    await initEvaluationTableEnvironment(userId, procedureQuestion.schemas);
    await initTestCaseTableEnvironment(userId, procedureTestCase.input.tables);
    let result = await executePLSQL(
        userId, 
        procedureQuestion.solutionQuery,
        'PROCEDURE',
        options
    );
    await clearEvaluationTableEnvironment(userId);
    console.log("output", result);
    console.log("expected output", procedureTestCase.output);
}

/*console.log("FUNCTION TEST");
await testPlsqlFunction();*/
console.log("PROCEDURE TEST");
await testPlsqlProcedure();
