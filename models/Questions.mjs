import mongoose from "mongoose";
import { Question } from "./index.mjs";

export async function getQuestion(id) {
   let question = await Question.findById(id);
   return question;
}