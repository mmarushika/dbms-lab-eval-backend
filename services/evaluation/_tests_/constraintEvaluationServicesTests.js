import { 

    primaryKeyTestCase,
    primaryKeyQuestion,
    foreignKeyTestCase,
    foreignKeyQuestion,
    notNullQuestion,
    notNullTestCase, 
    uniqueConstraintQuestion,
    uniqueConstraintTestCase,
    checkConstraintQuestion,
    checkConstraintTestCase
} from "./constraintSampleData.js";

import { describeTableConstraints } from "../../oracleDBServices.js";

import { generateConstraintEvaluationReport } from "../reportGenerationServices.js";


import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

let primaryKeyOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: primaryKeyQuestion.schemas,
  type: primaryKeyQuestion.subType,
  testCases: [primaryKeyTestCase],
  code: primaryKeyQuestion.solutionQuery
};

let foreignKeyOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: foreignKeyQuestion.schemas,
    type: foreignKeyQuestion.subType,
    testCases: [ foreignKeyTestCase ],
    code: foreignKeyQuestion.solutionQuery
};

let notNullOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: notNullQuestion.schemas,
    type: notNullQuestion.subType,
    testCases: [ notNullTestCase ],
    code: notNullQuestion.solutionQuery
};

let uniqueConstraintOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: uniqueConstraintQuestion.schemas,
    type: uniqueConstraintQuestion.subType,
    testCases: [ uniqueConstraintTestCase ],
    code: uniqueConstraintQuestion.solutionQuery
};

let checkConstraintOptions = {
    userId: '685bb48ef150d85daa68e8b0',
    taskId: '685bb48ef150d85daa68e8b0',
    questionId: '685bb48ef150d85daa68e8b0',
    schemas: checkConstraintQuestion.schemas,
    type: checkConstraintQuestion.subType,
    testCases: [
        {
            ...checkConstraintTestCase,
            validationQuery: checkConstraintQuestion.validationQuery
        }
    ],
    code: checkConstraintQuestion.solutionQuery
};

let result;
// console.log("PRIMARY");
// result = await generateConstraintEvaluationReport(primaryKeyOptions);
// console.log(result);

// console.log("FOREIGN");
// result = await generateConstraintEvaluationReport(foreignKeyOptions);
// console.log(result);

// console.log("NOT_NULL");
// result = await generateConstraintEvaluationReport(notNullOptions);
// console.log(result);

// console.log("UNIQUE");
// result = await generateConstraintEvaluationReport(uniqueConstraintOptions);
// console.log(result);

console.log("CHECK");
result = await generateConstraintEvaluationReport(checkConstraintOptions);
console.log(result);
