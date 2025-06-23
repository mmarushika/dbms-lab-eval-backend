
import express from 'express';

import * as controllers from '../controllers/evaluationControllers.mjs';

const evaluationRouter = express.Router();

evaluationRouter.post("/api/v1/dbms/evaluation", controllers.evaluationController);

export default evaluationRouter;