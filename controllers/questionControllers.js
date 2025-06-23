import { getQuestion } from "../models/Questions.js";
import { getPublicTestCases } from "../models/TestCases.js";

export async function fetchQuestionController(req, res) {
    try {
        let question = await getQuestion(req.query.id);
        let testCases = await getPublicTestCases(req.query.id);
        let data = {
            _id: question._id,
            title: question.title,
            description: question.description,
            schemas : question.schemas,
            testCases: testCases
        }
        res.send(data);
    } catch (err) {
        console.log(err.message);
    }
}