import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { createPool } from "./config/database.mjs";

import questionRouter from './routes/questionRoutes.mjs';

const port = 8000;
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

app.use(questionRouter);

app.listen(port, () => {
    createPool();
    console.log(`listening on port ${port}`);
})