import {
    clearEvaluationEnvironment,
    clearTestCaseEnvironment
} from "../evaluationEnvironmentServices.js";
import { mmUserId } from "../../../tests/testEnvVars.js";
import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

//await clearTestCaseTableEnvironment(mmUserId);
await clearEvaluationEnvironment(mmUserId);
