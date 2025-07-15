import {
  generateDDLEvaluationReport,
  generateDMLEvaluationReport,
  generatePLSQLEvaluationReport,
  generateConstraintEvaluationReport
} from "../services/evaluation/reportGenerationServices.js";
import { getQuestion } from "../models/Questions.js";

import {
  createSubmissionReport,
  getSubmission,
  getAllSubmissions
} from "../models/Submissions.js";
import { getAllTestCases } from '../models/TestCases.js';


export async function createSubmissionController(req, res) {
  console.log(req.body, "controller");
  try {
    const question = await getQuestion(req.body.questionId);
    const testCases = await getAllTestCases(question._id);
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
        console.log("DDL Submission controller")
        result = await generateDDLEvaluationReport(options);
        break;
      case 'DML':
        result = await generateDMLEvaluationReport(options);
        break;
      case 'PLSQL':
        console.log("PLSQL Submission controller")
        result = await generatePLSQLEvaluationReport(options);
        break;
      case 'CONSTRAINT':
        result = await generateConstraintEvaluationReport(options);
        break;
    }
    await createSubmissionReport(result);
    console.log("Submission Report", result);
  } catch (err) {
    console.log(err.message);
  }
}

export async function getAllSubmissionsController(req, res) {
  try {
    let data = await getAllSubmissions(
      req.query.userId,
      req.query.taskId,
      req.query.questionId
    );
    res.send(data)
  } catch (err) {
    console.log(err.message);
  }
}

export async function getSubmissionController(req, res) {
  try {
    let data = await getSubmission(req.params.id);
    res.send(data)
  } catch (err) {
    console.log(err.message);
  }
}