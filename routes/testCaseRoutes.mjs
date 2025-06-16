
import express from 'express';

import * as controllers from '../controllers/testCaseControllers.mjs';

const testCaseRouter = express.Router();

testCaseRouter.get("/api/v1/testcases", controllers.fetchTestCaseController);

export default testCaseRouter;