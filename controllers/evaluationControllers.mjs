import { getSubmissionReport } from "../services/evaluationServices.mjs";
import { getQuestion } from "../models/Questions.mjs";
import { exec } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function evaluationController(req, res) {
  console.log(req.body, "controller");
  try {
    exec('echo exit | sqlplus -S c##mm/mgm2005@localhost:1521/XEPDB1 @test.sql', ["bash"],
      function (error, stdout, stderr) {
        console.log(stdout);
      }
    );

    const content = 'req.body';
    fs.writeFile(__dirname + '/test.sql', content, err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
    //let question = await getQuestion(req.body.questionId);
    //let result = await getSubmissionReport(question, req.body.code);
    console.log("Submission Report", result);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
}