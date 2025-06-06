import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { appConfig } from './config/app.mjs';
import { createPool } from "./config/database.mjs";

import questionRouter from './routes/questionRoutes.mjs';

const port = 8000;
const app = express();

app.set('config', appConfig); // the system configrations

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

app.use(questionRouter);

app.listen(port, () => {
    createPool();
    console.log(`listening on port ${port}`);
})