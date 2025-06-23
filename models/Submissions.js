import mongoose from "mongoose";
import { Submission } from "./index.js";


export async function createSubmissionReport(data) {
   try {
      console.log("db", data);
      await Submission.insertOne(data);
   } catch(err) {
      throw err;
   }
}

export async function getSubmission() {
   try {
      let data = await Submission.findById(id);
      return data;
   } catch(err) {
      throw err;
   }
}

export async function getAllSubmissions(userId, taskId, questionId) {
   try {
      let data = await Submission.find(
         {
            $and : [
               { userId: userId },
               { taskId: taskId },
               { questionId: questionId }
            ]
         }
      )
      return data;
   } catch(err) {
      throw err;
   }
}