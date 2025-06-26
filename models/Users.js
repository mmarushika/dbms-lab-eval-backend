import mongoose from "mongoose";
import { User } from "./index.js";

export async function getUserOracleCredentials(userId) {
   let user = await User.findById(userId);
   return user;
}
