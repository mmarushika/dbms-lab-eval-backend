import mongoose from "mongoose";
import { Question } from "./index.js";


export async function getQuestion(id) {
   try {
      let question;
      if(id) {
         question = await Question.findOne(
         {
            _id: new mongoose.Types.ObjectId(id) 
         }, 
         {
            'schemas.rows._id': 0 
         }
      )
      } else {
         question = await Question.find({})
      }
      return question;
   } catch(err) {
      throw err;
   }
}