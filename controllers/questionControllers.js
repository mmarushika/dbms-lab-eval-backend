import { questionSchema } from "../models/index.js";
import { getQuestion } from "../models/Questions.js";
import { getPublicTestCases } from "../models/TestCases.js";

export async function fetchQuestionController(req, res) {
    try {
        let question = await getQuestion(req.params.id);
        let testCases = await getPublicTestCases(req.params.id);
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

export async function fetchAllQuestionsController(req, res) {
    try {
        let questions = await getQuestion();
        res.send(questions);
    } catch (err) {
        console.log(err.message);
    }
}