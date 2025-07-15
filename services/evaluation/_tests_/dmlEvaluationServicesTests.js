import { 
    selectQuestion,
    selectTestCase,
    selectJoinQuestion,
    selectJoinTestCase,
    updateQuestion,
    updateTestCase,
    insertQuestion,
    insertTestCase,
    deleteQuestion,
    deleteTestCase
} from "./dmlSampleData.js";

import { generateDMLEvaluationReport } from "../reportGenerationServices.js";


import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

let insertOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: insertQuestion.schemas,
  type: insertQuestion.subType,
  testCases: [insertTestCase],
  code: insertQuestion.solutionQuery
};

let updateOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: updateQuestion.schemas,
  type: updateQuestion.subType,
  testCases: [updateTestCase],
  code: updateQuestion.solutionQuery
};

let deleteOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: deleteQuestion.schemas,
  type: deleteQuestion.subType,
  testCases: [deleteTestCase],
  code: deleteQuestion.solutionQuery
};

let selectOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: selectQuestion.schemas,
  type: selectQuestion.subType,
  testCases: [selectTestCase],
  code: selectQuestion.solutionQuery
};

let selectJoinOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: selectJoinQuestion.schemas,
  type: selectJoinQuestion.subType,
  testCases: [selectJoinTestCase],
  code: selectJoinQuestion.solutionQuery
};

console.log("INSERT");
let result = await generateDMLEvaluationReport(insertOptions);
console.log(result);

console.log("UPDATE");
result = await generateDMLEvaluationReport(updateOptions);
console.log(result);

console.log("DELETE");
result = await generateDMLEvaluationReport(deleteOptions);
console.log(result);

console.log("SELECT");
result = await generateDMLEvaluationReport(selectOptions);
console.log(result);

console.log("SELECT JOIN");
result = await generateDMLEvaluationReport(selectJoinOptions);
console.log(result);