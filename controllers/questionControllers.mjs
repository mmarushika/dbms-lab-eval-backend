import { getQuestion } from "../models/Questions.mjs";

export async function fetchQuestionController(req, res) {
    try {
        let question = await getQuestion(req.query.id);
        res.send(question);
    } catch (err) {
        console.log(err.message);
    }
}