import mongoose from 'mongoose';
import { Question, TestCase } from '../models/index.js'; // adjust the import if needed

await mongoose.connect('mongodb://localhost:27017/dbms-lab-eval');

// Insert PL/SQL questions
const questions = await Question.insertMany([
  {
    title: "Increase Employee Salary",
    description: "Write a procedure `INCREASE_SALARY` that takes employee name and increment amount, and updates the SALARY column.",
    type: "PLSQL",
    subType: "PROCEDURE",
    outputTypes: ["tables"],
    marks: 10,
    schemas: [
      {
        tableName: "EMPLOYEES",
        rows: [
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "SALARY", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `
      CREATE OR REPLACE PROCEDURE INCREASE_SALARY (
        emp_name IN VARCHAR2,
        inc_amt IN NUMBER
      ) AS
      BEGIN
        UPDATE EMPLOYEES SET SALARY = SALARY + inc_amt WHERE NAME = emp_name;
      END;
    `,
    solutionCallName: "INCREASE_SALARY",
    validationQuery: null
  },
  {
    title: "Get Employee Salary",
    description: "Write a function `GET_SALARY` that returns the salary of an employee given their name.",
    type: "PLSQL",
    subType: "FUNCTION",
    marks: 10,
    outputTypes: ["returnValue"],
    schemas: [
      {
        tableName: "EMPLOYEES",
        rows: [
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "SALARY", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `
      CREATE OR REPLACE FUNCTION GET_SALARY(emp_name IN VARCHAR2)
      RETURN NUMBER IS
        emp_salary NUMBER;
      BEGIN
        SELECT SALARY INTO emp_salary FROM EMPLOYEES WHERE NAME = emp_name;
        RETURN emp_salary;
      END;
    `,
    solutionCallName: "GET_SALARY"
  },
  {
    title: "Log Insert on Employees",
    description: "Create a trigger `EMP_INSERT_LOG` that logs any insert on EMPLOYEES table into AUDIT_LOG table.",
    type: "PLSQL",
    subType: "TRIGGER",
    outputTypes: ["tables"],
    marks: 15,
    schemas: [
      {
        tableName: "EMPLOYEES",
        rows: [
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "SALARY", columnType: "NUMBER" }
        ]
      },
      {
        tableName: "AUDIT_LOG",
        rows: [
          { columnName: "MESSAGE", columnType: "VARCHAR2" }
        ]
      }
    ],
    solutionQuery: `
      CREATE OR REPLACE TRIGGER EMP_INSERT_LOG
      AFTER INSERT ON EMPLOYEES
      FOR EACH ROW
      BEGIN
        INSERT INTO AUDIT_LOG(MESSAGE)
        VALUES('Inserted ' || :NEW.NAME);
      END;
    `,
    solutionCallName: "EMP_INSERT_LOG",
    validationQuery: `INSERT INTO EMPLOYEES VALUES('Charlie', 40000)`
  },
  {
    title: "Print Salary Message",
    description: "Write an anonymous block that prints the salary of 'David' using DBMS_OUTPUT.",
    type: "PLSQL",
    subType: "BLOCK",
    marks: 5,
    outputTypes: ["dbms_output"],
    schemas: [
      {
        tableName: "EMPLOYEES",
        rows: [
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "SALARY", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `
      DECLARE
        sal NUMBER;
      BEGIN
        SELECT SALARY INTO sal FROM EMPLOYEES WHERE NAME = 'David';
        DBMS_OUTPUT.PUT_LINE('David salary is ' || sal);
      END;
    `,
    solutionCallName: ""
  },
  {
    title: "Increase Employee Salary and Return New Salary",
    description: "Write a procedure `INCREASE_SALARY` that takes employee name and increment amount as input, updates the SALARY column, and returns the new salary via an OUT parameter.",
    type: "PLSQL",
    subType: "PROCEDURE",
    outputTypes: ["tables", "variables"],
    marks: 10,
    schemas: [
      {
        tableName: "EMPLOYEES",
        rows: [
          { columnName: "NAME", columnType: "VARCHAR2" },
          { columnName: "SALARY", columnType: "NUMBER" }
        ]
      }
    ],
    solutionQuery: `
      CREATE OR REPLACE PROCEDURE INCREASE_SALARY (
        emp_name IN VARCHAR2,
        inc_amt IN NUMBER,
        new_salary OUT NUMBER
      ) AS
      BEGIN
        UPDATE EMPLOYEES 
        SET SALARY = SALARY + inc_amt 
        WHERE NAME = emp_name;

        SELECT SALARY INTO new_salary 
        FROM EMPLOYEES 
        WHERE NAME = emp_name;
      END;
    `,
    solutionCallName: "INCREASE_SALARY"
  }
]);

// Insert Test Cases
await TestCase.insertMany([
  {
    questionId: questions[0]._id,
    input: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "Alice", SALARY: 50000 }
          ]
        }
      ],
      variables: [
        { dir: "IN", type: "STRING", name: "emp_name", value: "Alice" },
        { dir: "IN", type: "NUMBER", name: "inc_amt", value: 5000 }
      ],
      returnValue: null
    },
    output: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "Alice", SALARY: 55000 }
          ]
        }
      ],
      variables: [],
      dbms_output: [],
      returnValue: null
    },
    hidden: false
  },
  {
    questionId: questions[1]._id,
    input: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "Bob", SALARY: 62000 }
          ]
        }
      ],
      variables: [
        { dir: "IN", type: "STRING", name: "emp_name", value: "Bob" }
      ],
      returnValue: {
        type: "NUMBER"
      }
    },
    output: {
      tables: [],
      variables: [],
      dbms_output: [],
      returnValue: {
        type: "NUMBER",
        value: 62000
      }
    },
    hidden: false
  },
  {
    questionId: questions[2]._id,
    input: {
      tables: [
        { tableName: "EMPLOYEES", rows: [] },
        { tableName: "AUDIT_LOG", rows: [] }
      ],
      variables: []
    },
    output: {
      tables: [
        {
          tableName: "AUDIT_LOG",
          rows: [
            { MESSAGE: "Inserted Charlie" }
          ]
        }
      ],
      variables: [],
      dbms_output: []
    },
    hidden: false
  },
  {
    questionId: questions[3]._id,
    input: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "David", SALARY: 80000 }
          ]
        }
      ],
      variables: []
    },
    output: {
      tables: [],
      variables: [],
      dbms_output: ["David salary is 80000"]
    },
    hidden: false
  },
  {
    questionId: questions[4]._id,
    input: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "Alice", SALARY: 50000 }
          ]
        }
      ],
      variables: [
        { dir: "IN", type: "STRING", name: "emp_name", value: "Alice" },
        { dir: "IN", type: "NUMBER", name: "inc_amt", value: 5000 },
        { dir: "OUT", type: "NUMBER", name: "new_salary", value: null }
      ],
      returnValue: null
    },
    output: {
      tables: [
        {
          tableName: "EMPLOYEES",
          rows: [
            { NAME: "Alice", SALARY: 55000 }
          ]
        }
      ],
      variables: [
        { dir: "OUT", type: "NUMBER", name: "new_salary", value: 55000 }
      ],
      dbms_output: [],
      returnValue: null
    },
    hidden: false
  }
]);

console.log("✅ Seeded all PL/SQL questions and test cases.");
await mongoose.disconnect();
