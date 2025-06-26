import { getQuestion } from "../models/Questions.js";
import { 
  generateSelectTableEvaluationReport,
  generateCreateTableEvaluationReport, 
  generateDropTableEvaluationReport
 } from "../services/reportGenerationServices.js";
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
      testCases: testCases,
      code: req.body.input
    }
    let result;
    switch(question?.type) {
      case 'DDL':
        result = await generateCreateTableEvaluationReport(options);
      break;
      case 'DROP':
        result = await generateDropTableEvaluationReport(options);
      break;
    }
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
}