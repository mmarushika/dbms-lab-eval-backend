import { 
    dropQuestion,
    dropTestCase,
    createQuestion, 
    createTestCase,
    createQuestionWrong,
    renameQuestion, 
    renameTestCase,
    alterQuestion,
    alterTestCase,
    truncateQuestion, 
    truncateTestCase
} from "./ddlSampleData.js";

import { generateDDLEvaluationReport } from "../reportGenerationServices.js";


import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');


let createOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: createQuestion.schemas,
  type: createQuestion.subType,
  testCases: [createTestCase],
  code: createQuestion.solutionQuery
};

let createOptions2 = {
userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: createQuestionWrong.schemas,
  type: createQuestionWrong.subType,
  testCases: [createTestCase],
  code: createQuestionWrong.solutionQuery
}
let dropOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: dropQuestion.schemas,
  type: dropQuestion.subType,
  testCases: [dropTestCase],
  code: dropQuestion.solutionQuery
};

let renameOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: renameQuestion.schemas,
  type: renameQuestion.subType,
  testCases: [renameTestCase],
  code: renameQuestion.solutionQuery
};

let alterOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: alterQuestion.schemas,
  type: alterQuestion.subType,
  testCases: [alterTestCase],
  code: alterQuestion.solutionQuery
};

let truncateOptions = {
  userId: '685bb48ef150d85daa68e8b0',
  taskId: '685bb48ef150d85daa68e8b0',
  questionId: '685bb48ef150d85daa68e8b0',
  schemas: truncateQuestion.schemas,
  type: truncateQuestion.subType,
  testCases: [truncateTestCase],
  code: truncateQuestion.solutionQuery
};

let result;
/*console.log("CREATE");
result = await generateDDLEvaluationReport(createOptions2);
console.log(result);*/

console.log("DROP");
result = await generateDDLEvaluationReport(dropOptions);
console.log(result);

console.log("ALTER");
result = await generateDDLEvaluationReport(alterOptions);
console.log(result);

console.log("RENAME");
result = await generateDDLEvaluationReport(renameOptions);
console.log(result);

console.log("TRUNCATE");
result = await generateDDLEvaluationReport(truncateOptions);
console.log(result);
