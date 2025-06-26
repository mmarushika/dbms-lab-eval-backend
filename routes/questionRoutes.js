
import express from 'express';

import * as controllers from '../controllers/questionControllers.js';

const questionRouter = express.Router();

questionRouter.get("/api/v1/dbms/questions", controllers.fetchQuestionController);

export default questionRouter;