export const createQuestion = {
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
  solutionCallName: null,
  validationQuery: `
    SELECT COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'STUDENTS'
  `
};

export const createQuestionWrong = {
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
      NAME VARCHAR2(100),
      AGE NUMBER
    )
  `,
  solutionCallName: null,
  validationQuery: `
    SELECT COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = 'STUDENTS'
  `
};

export const createTestCase = {
  questionId: 1,
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
};

export const dropQuestion = {
  "title": "Drop the TEMP_EMPLOYEES Table",
  "description": "The table `TEMP_EMPLOYEES` was created temporarily and is no longer needed. Write a SQL query to drop the `TEMP_EMPLOYEES` table.",
  "type": "DDL",
  "subType": "DROP",
  "target": "TABLE",
  "outputTypes": ["tables"],
  "marks": 5,
  "schemas": [
    {
      "tableName": "TEMP_EMPLOYEES",
      "rows": [
        { "columnName": "ID", "columnType": "NUMBER" },
        { "columnName": "NAME", "columnType": "VARCHAR2(100)" },
        { "columnName": "DEPT", "columnType": "VARCHAR2(50)" }
      ]
    }
  ],
  "solutionQuery": "DROP TABLE TEMP_EMPLOYEES"
}

export const dropTestCase = {
  "questionId": 2,
  "input": {
    "tables": [
      {
        "tableName": "TEMP_EMPLOYEES",
        "rows": []
      }
    ],
    "variables": [],
    "returnValue": {}
  },
  "output": {
    "tables": [],
    "variables": [],
    "dbms_output": [],
    "returnValue": {}
  },
  "hidden": false
}

export const renameQuestion = {
  title: "Rename the EMP_TEMP Table",
  description: "The table `EMP_TEMP` needs to be renamed to `EMPLOYEES`. Write a SQL query to rename the table.",
  type: "DDL",
  subType: "RENAME",
  target: "TABLE",
  outputTypes: ["tables"],
  marks: 5,
  schemas: [
    {
      tableName: "EMP_TEMP",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" }
      ]
    }
  ],
  solutionQuery: "RENAME EMP_TEMP TO EMPLOYEES"
};

export const renameTestCase = {
  questionId: 3,
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
};

export const alterQuestion = {
  title: "Add a Column to the STUDENTS Table",
  description: "The table `STUDENTS` currently has columns `ID` and `NAME`. Add a new column named `AGE` of type `NUMBER`.",
  type: "DDL",
  subType: "ALTER",
  target: "TABLE",
  outputTypes: ["tables"],
  marks: 5,
  schemas: [
    {
      tableName: "STUDENTS",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" }
      ]
    }
  ],
  solutionQuery: "ALTER TABLE STUDENTS ADD AGE NUMBER"
};

export const alterTestCase = {
  questionId: 4,  // Replace with actual ObjectId
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
};

export const truncateQuestion = {
  title: "Truncate the LOGS Table",
  description: "The table `LOGS` contains old records that are no longer needed. Write a SQL query to truncate the `LOGS` table.",
  type: "DDL",
  subType: "TRUNCATE",
  target: "TABLE",
  outputTypes: ["tables"],
  marks: 5,
  schemas: [
    {
      tableName: "LOGS",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "MESSAGE", columnType: "VARCHAR2(200)" }
      ]
    }
  ],
  solutionQuery: "TRUNCATE TABLE LOGS"
};

export const truncateTestCase = {
  questionId: 5, // Replace with actual ObjectId
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
        rows: []  // ✅ Expect: table exists but is empty
      }
    ],
    variables: [],
    dbms_output: [],
    returnValue: {}
  },
  hidden: false
};
