
import express from 'express';

import * as controllers from '../controllers/evaluationControllers.mjs';

const questionRouter = express.Router();

questionRouter.post("/api/v1/questions", controllers.evaluationController);

export default questionRouter;