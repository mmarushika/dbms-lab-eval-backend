import mongoose from "mongoose";
import { Question } from "./index.js";


export async function getQuestion(id) {
   try {
      let question = await Question.findOne(
         {
            _id: mongoose.Types.ObjectId.createFromHexString(id)
         }, 
         {
            'schemas.rows._id': 0 
         }
      )
      return question;
   } catch(err) {
      throw err;
   }
}