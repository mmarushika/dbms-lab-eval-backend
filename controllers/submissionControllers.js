import { 
  generateDMLEvaluationReport,
  generateSelectTableEvaluationReport
} from "../services/reportGenerationServices.js";
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
    let result = await generateDMLEvaluationReport(
      req.body.userId, 
      req.body.taskId,
      question._id, 
      question.schemas,
      testCases,
      req.body.input
    );
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
  } catch(err) {
    console.log(err.message);
  }
}

export async function getSubmissionController(req, res) {
  try {
    let data = await getSubmission(req.params.id);
    res.send(data)
  } catch(err) {
    console.log(err.message);
  }
}