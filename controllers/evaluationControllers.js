import { getQuestion } from "../models/Questions.js";
import {
  generateDDLEvaluationReport,
  generateDMLEvaluationReport,
  generatePLSQLEvaluationReport,
  generateConstraintEvaluationReport
} from "../services/evaluation/reportGenerationServices.js";
import { getPublicTestCases } from "../models/TestCases.js";


export async function evaluationController(req, res) {
  try {
    const question = await getQuestion(req.body.questionId);
    const testCases = await getPublicTestCases(req.body.questionId);
    let options = {
      userId: req.body.userId,
      taskId: req.body.taskId,
      questionId: question._id,
      schemas: question.schemas,
      type: question.subType,
      testCases: testCases.map(testCase => ({
        ...testCase,
        ["outputTypes"]: question?.outputTypes,
        ["validationQuery"]: question?.validationQuery,
        ["callName"]: question?.solutionCallName,
      })),
      code: req.body.input
    }
    let result;
    switch (question?.type.toUpperCase()) {
      case 'DDL':
        result = await generateDDLEvaluationReport(options);
        break;
      case 'DML':
        result = await generateDMLEvaluationReport(options);
        break;
      case 'PLSQL':
        console.log("PLSQL controller")
        result = await generatePLSQLEvaluationReport(options);
        break;
      case 'CONSTRAINT':
        result = await generateConstraintEvaluationReport(options);
        break;
    }
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
}



