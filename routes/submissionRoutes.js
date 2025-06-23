
import express from 'express';

import * as controllers from '../controllers/submissionControllers.mjs';

const submissionRouter = express.Router();

submissionRouter.post("/api/v1/submissions", controllers.createSubmissionController);
submissionRouter.get("/api/v1/submissions", controllers.getAllSubmissionsController);
submissionRouter.get("/api/v1/submissions/:id", controllers.getSubmissionController);

export default submissionRouter;