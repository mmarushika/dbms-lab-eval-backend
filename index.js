import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { appConfig } from './config/app.js';
import { cleanupIdlePools } from './services/oracle/oracleUserPoolServices.js';
import mongoose from 'mongoose';

import questionRouter from './routes/questionRoutes.js';
import evaluationRouter from './routes/evaluationRoutes.js';
import submissionRouter from './routes/submissionRoutes.js';

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
        const INTERVAL_MS = 5 * 60 * 1000;

        setInterval(async () => {
            try {
                await cleanupIdlePools(); // default timeout is 10 mins as per your function
            } catch (err) {
                console.error("Error during idle pool cleanup:", err);
            }
        }, INTERVAL_MS);
        //await createPool();
        //console.log("oracledb connected")
    } catch (err) {
        console.log(err.message);
    }
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');
        console.log("mongodb connected")
    } catch (err) {
        console.log(err.message);
    }
    app.listen(port, async () => {
        console.log(`listening on port ${port}`);
    })
}

run();