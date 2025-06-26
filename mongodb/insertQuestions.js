import mongoose from 'mongoose';
import { Question } from '../models/index.js';
import { TestCase } from '../models/index.js';
import { User } from '../models/index.js';

await mongoose.connect('mongodb://localhost:27017/dbms-lab-eval'); // Change your DB

 // 2. Insert test case
    await TestCase.create({
      questionId: '685c262d57b30019dc4e0273',
      input: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { ID: 1, NAME: "Alice", SALARY: 50000 },
            { ID: 2, NAME: "Bob", SALARY: 60000 },
            { ID: 3, NAME: "Alice", SALARY: 55000 }
          ]
        }
      ],
      query: "UPDATE EMPLOYEES SET SALARY = 70000 WHERE NAME = 'Alice';",
      validationQuery: "SELECT * FROM EMPLOYEES ORDER BY ID",
      output: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { ID: 1, NAME: "Alice", SALARY: 70000 },
            { ID: 2, NAME: "Bob", SALARY: 60000 },
            { ID: 3, NAME: "Alice", SALARY: 70000 }
          ]
        }
      ],
      hidden: false
    });
/*await Question.create({
      title: "Update Employee Salary",
      description: "Update the salary of employees named 'Alice' to 70000.",
      type: "DML",
      subType: "update",
      outputType: "table",
      marks: 10,
      schemas: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { columnName: "ID", columnType: "NUMBER" },
            { columnName: "NAME", columnType: "VARCHAR2" },
            { columnName: "SALARY", columnType: "NUMBER" }
          ]
        }
      ],
      solution: "UPDATE EMPLOYEES SET SALARY = 70000 WHERE NAME = 'Alice';"
    });

let user = await User.insertMany([
  {
    oracleUsername: 'c##mm',
    oraclePassword: 'mgm2005'
  },
  {
    oracleUsername: 'testuser',
    oraclePassword: 'mypassword'
  }
]);


// Insert DDL Question
const question = await Question.create({
  title: "Create the EMPLOYEE Table",
  description: `You are required to create a table named EMPLOYEE with the following columns and constraints:

- EMP_ID: an integer that uniquely identifies each employee. It must not be null and should be the primary key.
- NAME: a string that must not be null.
- DEPARTMENT: a string field that can be null.
- SALARY: a number representing the employee's monthly salary.
- JOIN_DATE: the date the employee joined the company.`,
  type: "DDL",
  marks: 5,
  schemas: [
    {
      tableName: "EMPLOYEE",
      rows: [
        { columnName: "EMP_ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2" },
        { columnName: "DEPARTMENT", columnType: "VARCHAR2" },
        { columnName: "SALARY", columnType: "NUMBER" },
        { columnName: "JOIN_DATE", columnType: "DATE" }
      ]
    }
  ],
  solution: 0
});

const { ObjectId } = mongoose.Types; 

// Insert Test Case for the question
await TestCase.updateOne(
    { _id: new ObjectId("685a6f99060d16f0337dee0c") },
    {
      $set: {
        "output.0.tableName": "EMPLOYEE",
        "output.0.rows": [
          { COLUMN_NAME: "EMP_ID", DATA_TYPE: "NUMBER" },
          { COLUMN_NAME: "NAME", DATA_TYPE: "VARCHAR2" },
          { COLUMN_NAME: "DEPARTMENT", DATA_TYPE: "VARCHAR2" },
          { COLUMN_NAME: "SALARY", DATA_TYPE: "NUMBER" },
          { COLUMN_NAME: "JOIN_DATE", DATA_TYPE: "DATE" }
        ]
      }
    }
  )

async function insertDropTableQuestion() {
  try {
    // 1. Create the question document
    const question = new Question({
      title: "Drop the TEMP_EMPLOYEES Table",
      description: "Write a SQL query to drop the table named TEMP_EMPLOYEES.",
      type: "DDL",
      marks: 5,
      schemas: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: [
            { columnName: "EMP_ID", columnType: "NUMBER" },
            { columnName: "EMP_NAME", columnType: "VARCHAR2" },
            { columnName: "JOIN_DATE", columnType: "DATE" }
          ]
        }
      ],
      solution: 1
    });

    const savedQuestion = await question.save();

    // 2. Create the test case for the question
    const testCase = new TestCase({
      questionId: savedQuestion._id,
      input: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: [
            { EMP_ID: 1, EMP_NAME: "Alice", JOIN_DATE: "2023-01-01" },
            { EMP_ID: 2, EMP_NAME: "Bob", JOIN_DATE: "2023-02-15" }
          ]
        }
      ],
      query: "DROP TABLE TEMP_EMPLOYEES",
      validationQuery: "SELECT table_name FROM user_tables WHERE table_name = 'TEMP_EMPLOYEES'",
      output: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: []  // Empty rows to indicate the table should no longer exist
        }
      ],
      hidden: false
    });

    const savedTestCase = await testCase.save();

    console.log("✅ Question and test case saved:");
    console.log("Question ID:", savedQuestion._id.toString());
    console.log("Test Case ID:", savedTestCase._id.toString());

  } catch (err) {
    console.error("❌ Error inserting question and test case:", err);
  }
}
const testCase = new TestCase({
      questionId: new mongoose.Types.ObjectId('685b16a2e5a0a6d9c6a941f9'),
      input: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: [
            { EMP_ID: 1, EMP_NAME: "Alice", JOIN_DATE: "2023-01-01" },
            { EMP_ID: 2, EMP_NAME: "Bob", JOIN_DATE: "2023-02-15" }
          ]
        }
      ],
      query: "DROP TABLE TEMP_EMPLOYEES",
      validationQuery: "SELECT table_name FROM user_tables WHERE table_name = 'TEMP_EMPLOYEES'",
      output: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: []
        }
      ],
      hidden: false
    });

await testCase.save();*/
console.log("✅ Seeded DDL question and test case.");
await mongoose.disconnect();
