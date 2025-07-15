import mongoose from 'mongoose';
import { Question } from '../models/index.js';
import { TestCase } from '../models/index.js';

await mongoose.connect('mongodb://localhost:27017/dbms-lab-eval'); 

// Insert questions
const questions = await Question.insertMany([
  // 1. CREATE TABLE
  {
    title: "Create a table to store student information",
    description: "Write a SQL statement to create a table named STUDENTS with columns for ID, NAME, and AGE.",
    type: "DDL",
    subType: "CREATE",
    target: "TABLE",
    marks: 5,
    outputTypes: ["tables"],
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "AGE", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `
      CREATE TABLE STUDENTS (
        ID NUMBER,
        NAME VARCHAR2(100),
        AGE NUMBER
      )
    `,
    validationQuery: `
      SELECT COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'STUDENTS'
    `
  },

  // 2. DROP TABLE
  {
    title: "Drop the TEMP_EMPLOYEES Table",
    description: "The table TEMP_EMPLOYEES was created temporarily and is no longer needed. Write a SQL query to drop the TEMP_EMPLOYEES table.",
    type: "DDL",
    subType: "DROP",
    target: "TABLE",
    marks: 5,
    outputTypes: ["tables"],
    schemas: [
      {
        tableName: "TEMP_EMPLOYEES",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(100)" },
          { columnName: "DEPT", columnType: "VARCHAR2(50)" }
        ]
      }
    ],
    solutionQuery: `DROP TABLE TEMP_EMPLOYEES`,
    validationQuery: `
      SELECT TABLE_NAME FROM USER_TABLES WHERE TABLE_NAME = 'TEMP_EMPLOYEES'
    `
  },

  // 3. RENAME TABLE
  {
    title: "Rename the EMP_TEMP Table",
    description: "The table EMP_TEMP needs to be renamed to EMPLOYEES. Write a SQL query to rename the table.",
    type: "DDL",
    subType: "RENAME",
    target: "TABLE",
    marks: 5,
    outputTypes: ["tables"],
    schemas: [
      {
        tableName: "EMP_TEMP",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(100)" }
        ]
      }
    ],
    solutionQuery: `RENAME EMP_TEMP TO EMPLOYEES`,
    validationQuery: `
      SELECT TABLE_NAME FROM USER_TABLES WHERE TABLE_NAME = 'EMPLOYEES'
    `
  },

  // 4. ALTER TABLE
  {
    title: "Add a Column to the STUDENTS Table",
    description: "The table STUDENTS currently has columns ID and NAME. Add a new column named AGE of type NUMBER.",
    type: "DDL",
    subType: "ALTER",
    target: "TABLE",
    marks: 5,
    outputTypes: ["tables"],
    schemas: [
      {
        tableName: "STUDENTS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "NAME", columnType: "VARCHAR2(100)" }
        ]
      }
    ],
    solutionQuery: `ALTER TABLE STUDENTS ADD AGE NUMBER`,
    validationQuery: `
      SELECT COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'STUDENTS'
    `
  },

  // 5. TRUNCATE TABLE
  {
    title: "Truncate the LOGS Table",
    description: "The table LOGS contains old records that are no longer needed. Write a SQL query to truncate the LOGS table.",
    type: "DDL",
    subType: "TRUNCATE",
    target: "TABLE",
    marks: 5,
    outputTypes: ["tables"],
    schemas: [
      {
        tableName: "LOGS",
        rows: [
          { columnName: "ID", columnType: "NUMBER" },
          { columnName: "MESSAGE", columnType: "VARCHAR2(200)" }
        ]
      }
    ],
    solutionQuery: `TRUNCATE TABLE LOGS`,
    validationQuery: `
      SELECT * FROM LOGS
    `
  }
]);

// Insert matching test cases
await TestCase.insertMany([
  // TestCase for CREATE
  {
    questionId: questions[0]._id,
    input: {
      tables: [],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: [
            { COLUMN_NAME: "ID", DATA_TYPE: "NUMBER" },
            { COLUMN_NAME: "NAME", DATA_TYPE: "VARCHAR2" },
            { COLUMN_NAME: "AGE", DATA_TYPE: "NUMBER" }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  // TestCase for DROP
  {
    questionId: questions[1]._id,
    input: {
      tables: [
        {
          tableName: "TEMP_EMPLOYEES",
          rows: []
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [], // Table should not exist
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  // TestCase for RENAME
  {
    questionId: questions[2]._id,
    input: {
      tables: [
        {
          tableName: "EMP_TEMP",
          rows: []
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { COLUMN_NAME: "ID", DATA_TYPE: "NUMBER" },
            { COLUMN_NAME: "NAME", DATA_TYPE: "VARCHAR2" }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  // TestCase for ALTER
  {
    questionId: questions[3]._id,
    input: {
      tables: [
        {
          tableName: "STUDENTS",
          rows: []
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
            { COLUMN_NAME: "ID", DATA_TYPE: "NUMBER" },
            { COLUMN_NAME: "NAME", DATA_TYPE: "VARCHAR2" },
            { COLUMN_NAME: "AGE", DATA_TYPE: "NUMBER" }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  },

  // TestCase for TRUNCATE
  {
    questionId: questions[4]._id,
    input: {
      tables: [
        {
          tableName: "LOGS",
          rows: [
            { ID: 1, MESSAGE: "Log A" },
            { ID: 2, MESSAGE: "Log B" },
            { ID: 3, MESSAGE: "Log C" }
          ]
        }
      ],
      variables: [],
      returnValue: {}
    },
    output: {
      tables: [
        {
          tableName: "LOGS",
          rows: [] // Should be empty after truncate
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: {}
    },
    hidden: false
  }
]);

console.log("✅ Seeded all 5 DDL questions with matching test cases.");
await mongoose.disconnect();
