import { getQuestion } from "../models/Questions.js";
import { generateDMLSubmissionReport } from "../services/dmlEvaluationServices.js";
import { getPublicTestCases } from "../models/TestCases.js";

export async function evaluationController(req, res) {
  try {
    console.log(req.body);
    const question = await getQuestion(req.body.questionId);
    const testCases = await getPublicTestCases(req.body.questionId);
    let result = await generateDMLSubmissionReport (
      req.body.userId, 
      req.body.taskId,
      question._id, 
      question.schemas,
      testCases,
      req.body.input
    );
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
}