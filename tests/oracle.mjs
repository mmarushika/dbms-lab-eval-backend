import oracledb from 'oracledb';
import mongoose from 'mongoose';

import { getCreateTableQuery } from "../utilities/OracleSQLConverters.mjs";
import { createPool } from '../config/database.mjs';
import { parseResult } from '../utilities/OracleResultParsers.mjs';
import { getSubmissionReport } from '../services/evaluationServices.mjs';
import { getQuestion } from '../models/Questions.mjs';

async function execute(question, code) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        let submission = await getSubmissionReport(question, code);
        console.log(submission);
    } catch (error) {
        console.log(error.message);
    } finally {
        await connection.close();
    }

}

async function run() {
    await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');
    let question = await getQuestion('6847ada39879729fffc08dcd');
    let code = 'SELECT NAME FROM PERSON';

    await createPool()
    await execute(question , code);
}

run();
let schemas = [
    {
        tableName: "Person",
        rows: [
            {
                columnName: "id",
                columnType: "NUMBER"
            },
            {
                columnName: "name",
                columnType: "VARCHAR2"
            }
        ]
    }
]


import { insertTableInput } from '../services/oracleDBServices.mjs';

let inputRows1 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' }
]

async function display(resultSet) {
    console.log(resultSet);
    console.log('display');
    for await (const row of resultSet) {
        console.log(row);
        //console.log(row.map(val => val === null ? '[NULL]' : val));
    }
}

/*async function execute(sql) {
    let connection;
    try {
        //connection = await oracledb.getConnection();
        //const result = await connection.execute(sql, [], {resultSet: true});
        //let output = await parseResult(result);
        console.log(output);
        //console.log(result);
        //const columns = await getColumns(result.metaData, result.resultSet);
        //console.log(columns);
        //await display(result);
    } catch(error) {
        console.log(error.message);
    } finally {
        await connection.close();
    }

}*/