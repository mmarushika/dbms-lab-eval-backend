
import express from 'express';

import * as controllers from '../controllers/evaluationControllers.mjs';

const evaluationRouter = express.Router();

evaluationRouter.post("/api/v1/submit", controllers.evaluationController);

export default questionRouter;