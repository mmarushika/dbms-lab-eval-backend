/*import { getTestCases } from "../models/TestCases.mjs";

export async function fetchTestCaseController(req, res) {
    try {
        console.log(req.query.id)
        let testCases = await getTestCases(req.query.questionId);
        console.log(testCases);
        res.send(testCases);
    } catch (err) {
        console.log(err.message);
    }
}*/