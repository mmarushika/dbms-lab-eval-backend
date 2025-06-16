
import express from 'express';

import * as controllers from '../controllers/evaluationControllers.mjs';

const evaluationRouter = express.Router();

evaluationRouter.post("/api/v1/submissions", controllers.evaluationController);

export default evaluationRouter;