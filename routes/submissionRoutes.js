
import express from 'express';

import * as controllers from '../controllers/submissionControllers.js';

const submissionRouter = express.Router();

submissionRouter.post("/api/v1/dbms/submissions", controllers.createSubmissionController);
submissionRouter.get("/api/v1/dbms/submissions", controllers.getAllSubmissionsController);
submissionRouter.get("/api/v1/dbms/submissions/:id", controllers.getSubmissionController);

export default submissionRouter;