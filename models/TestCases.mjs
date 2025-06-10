import mongoose from "mongoose";
import { TestCase } from "./index.mjs";

export async function getTestCases(questionId) {
   let testCases = await TestCase.find({questionId: new mongoose.Types.ObjectId(questionId)});
   return testCases;
}