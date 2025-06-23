import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { appConfig } from './config/app.mjs';
import { createPool } from "./config/database.mjs";
import mongoose from 'mongoose';

import questionRouter from './routes/questionRoutes.mjs';
import evaluationRouter from './routes/evaluationRoutes.mjs';
import submissionRouter from './routes/submissionRoutes.mjs';

const port = 8000;
const app = express();

app.set('config', appConfig); // the system configrations

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

app.use(questionRouter);
app.use(submissionRouter);
app.use(evaluationRouter);

async function run() {
    try {
        await createPool();
        console.log("oracledb connected")
    } catch(err) {
        console.log(err.message);
    }
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');
        console.log("mongodb connected")
    } catch(err) {
        console.log(err.message);
    }
    app.listen(port, async () => {
        console.log(`listening on port ${port}`);
    })
}

run();