
import express from 'express';

import * as controllers from '../controllers/questionControllers.mjs';

const questionRouter = express.Router();

questionRouter.get("/api/v1/questions", controllers.fetchQuestionController);

export default questionRouter;