import mongoose from 'mongoose';
import { Question } from '../models/index.js';
import { TestCase } from '../models/index.js';

await mongoose.connect('mongodb://localhost:27017/dbms-lab-eval');

const createdBy = new mongoose.Types.ObjectId('685bb48ef150d85daa68e8b0');

const questions = await Question.insertMany([
  // INSERT
  {
    title: "Insert a New Student Record",
    description: "Write an INSERT statement to add a new student with id 4, name 'David', and age 21 into the 'STUDENTS' table.",
    type: "DML",
    subType: "INSERT",
    outputTypes: ["tables"],
    marks: 5,
    createdBy,
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(50)" },
          { columnName: "AGE", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `INSERT INTO STUDENTS (ID, NAME, AGE) VALUES (4, 'David', 21);`
  },

  // UPDATE
  {
    title: "Update Student Age",
    description: "Write an UPDATE query to change the age of the student named 'Alice' to 25 in the 'STUDENTS' table.",
    type: "DML",
    subType: "UPDATE",
    outputTypes: ["tables"],
    marks: 5,
    createdBy,
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(50)" },
          { columnName: "AGE", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `UPDATE STUDENTS SET AGE = 25 WHERE NAME = 'Alice';`
  },

  // DELETE
  {
    title: "Delete Student Record",
    description: "Write a DELETE query to remove the student named 'Charlie' from the 'STUDENTS' table.",
    type: "DML",
    subType: "DELETE",
    outputTypes: ["tables"],
    marks: 5,
    createdBy,
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(50)" },
          { columnName: "AGE", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `DELETE FROM STUDENTS WHERE NAME = 'Charlie';`
  },

  // SELECT
  {
    title: "Select Students Aged 21 or Above",
    description: "Write a SELECT query to retrieve the names of all students aged 21 or older from the 'STUDENTS' table.",
    type: "DML",
    subType: "SELECT",
    outputTypes: ["tables"],
    marks: 5,
    createdBy,
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(50)" },
          { columnName: "AGE", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `SELECT NAME FROM STUDENTS WHERE AGE >= 21;`
  },

  // SELECT JOIN
  {
    title: "Select Orders with Customer Names",
    description: "Write a SELECT query to retrieve the order id and customer name for all orders placed. Use the 'ORDERS' and 'CUSTOMERS' tables.",
    type: "DML",
    subType: "SELECT",
    outputTypes: ["tables"],
    marks: 10,
    createdBy,
    schemas: [
      {
        tableName: "CUSTOMERS",
        rows: [
          { columnName: "CUSTOMER_ID", columnType: "NUMBER" },
          { columnName: "CUSTOMER_NAME", columnType: "VARCHAR2(50)" }
        ]
      },
      {
        tableName: "ORDERS",
        rows: [
          { columnName: "ORDER_ID", columnType: "NUMBER" },
          { columnName: "CUSTOMER_ID", columnType: "NUMBER" },
          { columnName: "AMOUNT", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `SELECT O.ORDER_ID, C.CUSTOMER_NAME FROM ORDERS O JOIN CUSTOMERS C ON O.CUSTOMER_ID = C.CUSTOMER_ID;`
  }
]);

await TestCase.insertMany([
  {
    questionId: questions[0]._id,
    input: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 23 }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 23 },
            { ID: 4, NAME: "David", AGE: 21 }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  {
    questionId: questions[1]._id,
    input: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 23 }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 25 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 23 }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  {
    questionId: questions[2]._id,
    input: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 23 }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  {
    questionId: questions[3]._id,
    input: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { ID: 1, NAME: "Alice", AGE: 20 },
            { ID: 2, NAME: "Bob", AGE: 22 },
            { ID: 3, NAME: "Charlie", AGE: 21 }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "",
          rows: [
            { NAME: "Bob" },
            { NAME: "Charlie" }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  {
    questionId: questions[4]._id,
    input: {
      tables: [
        {
          tableName: "CUSTOMERS",
          rows: [
            { CUSTOMER_ID: 1, CUSTOMER_NAME: "Alice" },
            { CUSTOMER_ID: 2, CUSTOMER_NAME: "Bob" }
          ]
        },
        {
          tableName: "ORDERS",
          rows: [
            { ORDER_ID: 101, CUSTOMER_ID: 1, AMOUNT: 500 },
            { ORDER_ID: 102, CUSTOMER_ID: 2, AMOUNT: 750 },
            { ORDER_ID: 103, CUSTOMER_ID: 1, AMOUNT: 200 }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "",
          rows: [
            { ORDER_ID: 101, CUSTOMER_NAME: "Alice" },
            { ORDER_ID: 102, CUSTOMER_NAME: "Bob" },
            { ORDER_ID: 103, CUSTOMER_NAME: "Alice" }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  }
]);

console.log("✅ Seeded 5 DML questions with test cases.");
await mongoose.disconnect();
