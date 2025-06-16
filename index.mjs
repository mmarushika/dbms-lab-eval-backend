import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { appConfig } from './config/app.mjs';
import { createPool } from "./config/database.mjs";
import mongoose from 'mongoose';

import questionRouter from './routes/questionRoutes.mjs';
import testCaseRouter from './routes/testCaseRoutes.mjs';
import evaluationRouter from './routes/evaluationRoutes.mjs';

const port = 8000;
const app = express();

app.set('config', appConfig); // the system configrations

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

app.use(questionRouter);
app.use(testCaseRouter);
app.use(evaluationRouter);

async function run() {
    await createPool();
    await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');
    app.listen(port, async () => {
        console.log(`listening on port ${port}`);
    })
}

run();