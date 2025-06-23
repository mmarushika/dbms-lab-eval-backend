import { Question } from "../models/index.mjs";
import { TestCase } from "../models/index.mjs";

import mongoose from "mongoose";
import { getQuestion } from "../models/Questions.mjs";
import { getTestCases } from "../models/TestCases.mjs";

mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

async function insertTestQuestion() {
    let question = {
        title: "Display Names",
        description: "Select and display the names",
        schemas: [
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
    }
    
    await Question.insertOne(question);
}

async function insertTestCases() {

    let inputRows1 = [
        {ID: 1, NAME: 'A'},
        {ID: 2, NAME: 'B'},
        {ID: 3, NAME: 'C'}
    ]

    let inputRows2 = [
        {ID: 1, NAME: 'D'},
        {ID: 2, NAME: 'E'},
        {ID: 3, NAME: 'F'}
    ]

    let outputRows1 = [
        {NAME: 'A'},
        {NAME: 'B'},
        {NAME: 'C'}
    ]

    let outputRows2 = [
        {NAME: 'D'},
        {NAME: 'E'},
        {NAME: 'F'}
    ]
    let testCases =  [
        {
            questionId: await Question.findById('6847ada39879729fffc08dcd'),
            input: [
                {
                    tableName: 'PERSON',
                    rows: JSON.stringify(inputRows1) // JSON converted to string
                }
            ],
            output: JSON.stringify(outputRows1),
            hidden: false
        },
        {
            questionId: await Question.findById('6847ada39879729fffc08dcd'),
            input: [
                {
                    tableName: 'PERSON',
                    rows: JSON.stringify(inputRows2) // JSON converted to string
                }
            ],
            output: JSON.stringify(outputRows2),
            hidden: false
        }
        
    ]
    await TestCase.insertMany(testCases);
}

//insertTestQuestion();
insertTestCases();

//getTestCases('6847ada39879729fffc08dcd');
