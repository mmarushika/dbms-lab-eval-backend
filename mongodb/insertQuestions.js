import mongoose from 'mongoose';
import { Question } from '../models/index.js';
import { TestCase } from '../models/index.js';
import { User } from '../models/index.js';

await mongoose.connect('mongodb://localhost:27017/dbms-lab-eval'); // Change your DB

// Insert the question
const procedureQuestion = await Question.create({
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
  solutionCallName: "INCREASE_SALARY",
  validationQuery: null
});

// Insert the test case
await TestCase.create({
  questionId: procedureQuestion._id,
  hidden: false,
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
      { dir: "IN", type: "VARCHAR2", name: "emp_name", value: "Alice" },
      { dir: "IN", type: "NUMBER", name: "inc_amt", value: 5000 },
      { dir: "OUT", type: "NUMBER", name: "new_salary", value: null }
    ]
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
    dbms_output: []
  },
  outputTypes: ["tables", "variables"]
});

console.log("✅ Inserted procedure question and test case.");
await mongoose.disconnect();


/*await TestCase.insertOne({
  questionId: new mongoose.Types.ObjectId('6864195a343034ea76ab5345'),
  input: {
    tables: [
      {
        tableName: "STUDENTS",
        rows: [
          { STUDENT_ID: "S001", STUDENT_NAME: "Alice", EMAIL: "alice@example.com" },
          { STUDENT_ID: "S002", STUDENT_NAME: "Bob", EMAIL: "bob@example.com" }
        ]
      }
    ],
    variables: [
      { dir: "IN", type: "VARCHAR2", name: "P_STUDENT_ID", value: "S002" },
      { dir: "IN", type: "VARCHAR2", name: "P_NEW_EMAIL", value: "bob.new@example.com" }
    ]
  },
  output: {
    tables: [
      {
        tableName: "STUDENTS",
        rows: [
          { STUDENT_ID: "S001", STUDENT_NAME: "Alice", EMAIL: "alice@example.com" },
          { STUDENT_ID: "S002", STUDENT_NAME: "Bob", EMAIL: "bob.new@example.com" }
        ]
      }
    ],
    variables: [],
    dbms_output: []
  },
  hidden: false,
  outputTypes: ["tables"]
});


await Question.insertOne({
  title: "Update a Student's Email",
  description: "Write a PL/SQL procedure named UPDATE_STUDENT_EMAIL that updates the EMAIL of a student in the STUDENTS table, given the STUDENT_ID and the new EMAIL.",
  type: "procedure",
  subType: "basic-update",
  outputType: "tables",
  marks: 10,
  schemas: [
    {
      tableName: "STUDENTS",
      rows: [
        { columnName: "STUDENT_ID", columnType: "VARCHAR2" },
        { columnName: "STUDENT_NAME", columnType: "VARCHAR2" },
        { columnName: "EMAIL", columnType: "VARCHAR2" }
      ]
    }
  ],
  solutionQuery: `CREATE OR REPLACE PROCEDURE UPDATE_STUDENT_EMAIL(
    P_STUDENT_ID IN VARCHAR2,
    P_NEW_EMAIL IN VARCHAR2
)
IS
BEGIN
    UPDATE STUDENTS
    SET EMAIL = P_NEW_EMAIL
    WHERE STUDENT_ID = P_STUDENT_ID;
END;`,
  solutionCallName: "UPDATE_STUDENT_EMAIL"
});

const questionId = await Question.findOne({ title: "Update a Student's Email" })._id;

await Question.updateOne(
  { _id: new mongoose.Types.ObjectId('685e66d84bb6dc99ef8f60a2') },
  {
    $set: {
      solutionCallName: 'update_long_term_salaries' // 🔁 Replace with desired name if different
    }
  }
);


 await TestCase.create({
  questionId: '685e66d84bb6dc99ef8f60a2',
  hidden: false,
  input: {
    tables: [
      {
        tableName: 'EMPLOYEES',
        rows: [
          { ID: 1, NAME: 'ALICE', SALARY: 70000, DEPARTMENT: 'HR' },
          { ID: 2, NAME: 'BOB', SALARY: 80000, DEPARTMENT: 'SALES' }
        ]
      }
    ],
    variables: [
      {
        dir: 'IN',
        type: 'VARCHAR2',
        name: 'P_NAME',
        value: 'ALICE'
      }
    ]
  },
  output: {
    tables: [],
    variables: [
      {
        dir: 'OUT',
        type: 'NUMBER',
        name: 'P_SALARY',
        value: '70000'
      }
    ],
    dbms_output: ["Department: HR"]
  },
  outputTypes: ['VARIABLES', 'DBMS_OUTPUT']
});

 await TestCase.create({
    questionId: '685e66d84bb6dc99ef8f60a2',
    hidden: false,
    input: {
        tables: [
            {
                tableName: "EMPLOYEES",
                rows: [
                    { ID: 1, NAME: "ALICE", SALARY: 70000, DEPARTMENT: "HR" },
                    { ID: 2, NAME: "BOB", SALARY: 80000, DEPARTMENT: "SALES" }
                ]
            }
        ],
        variables: {
            P_NAME: "ALICE"
        }
    },
    output: {
        tables: [],
        variables: [
            {
                dir: "OUT",
                type: "NUMBER",
                name: "P_SALARY",
                value: 70000
            }
        ],
        dbms_output: [
            "Department: HR"
        ]
    },
    outputTypes: ["VARIABLES", "DBMS_OUTPUT"]
});



 const question = await Question.create({
  title: "Get Employee Salary",
  description: "Write a PL/SQL procedure named GET_EMP_SALARY that takes an employee name as input and returns the salary in an OUT parameter. Also print the employee's department using DBMS_OUTPUT.",
  type: "PLSQL",
  subType: "PROCEDURE",
  outputType: "VARIABLES_AND_OUTPUT",
  marks: 10,
  schemas: [
    {
      tableName: "EMPLOYEES",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" },
        { columnName: "SALARY", columnType: "NUMBER" },
        { columnName: "DEPARTMENT", columnType: "VARCHAR2(100)" }
      ]
    }
  ],
  solutionQuery: `
    CREATE OR REPLACE PROCEDURE GET_EMP_SALARY (
      P_NAME IN VARCHAR2,
      P_SALARY OUT NUMBER
    ) IS
      V_DEPT VARCHAR2(100);
    BEGIN
      SELECT SALARY, DEPARTMENT INTO P_SALARY, V_DEPT
      FROM EMPLOYEES
      WHERE NAME = P_NAME;

      DBMS_OUTPUT.PUT_LINE('Department: ' || V_DEPT);
    END;
  `
});


 const questionDoc = new Question({
  title: "Update Salaries of Long-Term Employees",
  description: `You are given a table called EMPLOYEES with the following structure:

- ID (NUMBER): Unique identifier for each employee  
- NAME (VARCHAR2): Name of the employee  
- JOIN_YEAR (NUMBER): Year the employee joined the company  
- SALARY (NUMBER): Current salary of the employee

Write a PL/SQL block that increases the SALARY of all employees who joined **before the year 2015** by **15%**.

Your PL/SQL block should perform the update using control structures (i.e., loops or conditional statements), not a single UPDATE SQL statement.

After execution, the EMPLOYEES table should reflect the updated salaries.`,
  type: "PLSQL",
  subType: "BLOCK",
  outputType: "TABLE",
  marks: 10,
  schemas: [
    {
      tableName: "EMPLOYEES",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(50)" },
        { columnName: "JOIN_YEAR", columnType: "NUMBER" },
        { columnName: "SALARY", columnType: "NUMBER" }
      ]
    }
  ],
  solutionQuery: `
DECLARE
  CURSOR emp_cur IS
    SELECT ID, SALARY, JOIN_YEAR FROM EMPLOYEES WHERE JOIN_YEAR < 2015;
BEGIN
  FOR emp IN emp_cur LOOP
    UPDATE EMPLOYEES
    SET SALARY = SALARY * 1.15
    WHERE ID = emp.ID;
  END LOOP;
END;`,
  validationQuery: `SELECT * FROM EMPLOYEES ORDER BY ID`
});

const savedQuestion = await questionDoc.save();

const testCaseDoc = new TestCase({
  questionId: savedQuestion._id,
  input: [
    {
      tableName: "EMPLOYEES",
      rows: [
        { ID: 1, NAME: "Alice", JOIN_YEAR: 2010, SALARY: 50000 },
        { ID: 2, NAME: "Bob", JOIN_YEAR: 2018, SALARY: 60000 },
        { ID: 3, NAME: "Charlie", JOIN_YEAR: 2012, SALARY: 70000 }
      ]
    }
  ],
  output: [
    {
      tableName: "EMPLOYEES",
      rows: [
        { ID: 1, NAME: "Alice", JOIN_YEAR: 2010, SALARY: 57500 },
        { ID: 2, NAME: "Bob", JOIN_YEAR: 2018, SALARY: 60000 },
        { ID: 3, NAME: "Charlie", JOIN_YEAR: 2012, SALARY: 80500 }
      ]
    }
  ],
  hidden: false
});

await testCaseDoc.save();

console.log("✅ Question and test case inserted successfully");
await mongoose.disconnect();


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
 await Question.create({
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
