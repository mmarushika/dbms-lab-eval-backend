import mongoose from "mongoose";
import { TestCase } from "./index.js";

export async function getAllTestCases(questionId) {
   console.log(questionId);
   let testCases = await TestCase.find(
      {questionId: questionId}
   ).lean();
   console.log("test", testCases);
   return testCases;
}

export async function getPublicTestCases(questionId) {
   let testCases = await TestCase.find(
      {
         $and: [
            {
               questionId: mongoose.Types.ObjectId.createFromHexString(questionId)
            }, 
            {
               hidden: {
                  $ne : true
               }
            }
         ]
      }
   ).lean();
   return testCases;
}