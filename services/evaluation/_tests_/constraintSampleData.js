
export const primaryKeyQuestion = {
    title: "Add Primary Key Constraint to Student Table",
    description: "Add a PRIMARY KEY constraint to the `id` column of the `Student` table.",
    type: "CONSTRAINT",
    subType: "PRIMARY",
    target: "TABLE", // optional here, but valid for constraint on table
    marks: 10,
    schemas: [
        {
            tableName: "STUDENT",
            rows: [
                { columnName: "ID", columnType: "NUMBER" },
                { columnName: "NAME", columnType: "VARCHAR2(100)" },
                { columnName: "AGE", columnType: "NUMBER" }
            ]
        }
    ],
    solutionQuery: `ALTER TABLE STUDENT ADD CONSTRAINT PK_STUDENT PRIMARY KEY (ID);`,
    outputTypes: ["tables"]
};

export const primaryKeyTestCase = {
    questionId: 1,
    hidden: false,
    input: {
        tables: [
            {
                tableName: "STUDENT",
                rows: []
            }
        ],
        variables: [],
        returnValue: null
    },
    output: {
        tables: [
            {
                tableName: "PRIMARY_KEY",
                rows: [
                    {
                        CONSTRAINT_NAME: "PK_STUDENT",
                        CONSTRAINT_TYPE: "P",
                        TABLE_NAME: "STUDENT",
                        COLUMN_NAME: "ID"
                    }
                ]
            }
        ],
        variables: [],
        dbms_output: [],
        returnValue: null
    }
};

export const foreignKeyQuestion = {
    title: "Add Foreign Key Constraint to Student Table",
    description: "Add a FOREIGN KEY constraint on the `DEPT_ID` column of the `STUDENT` table referencing the `ID` column of the `DEPARTMENT` table.",
    type: "CONSTRAINT",
    subType: "FOREIGN",
    target: "TABLE",
    marks: 10,
    schemas: [
        {
            tableName: "DEPARTMENT",
            rows: [
                { columnName: "ID", columnType: "NUMBER" },
                { columnName: "NAME", columnType: "VARCHAR2(100)" }
            ]
        },
        {
            tableName: "STUDENT",
            rows: [
                { columnName: "ID", columnType: "NUMBER" },
                { columnName: "NAME", columnType: "VARCHAR2(100)" },
                { columnName: "AGE", columnType: "NUMBER" },
                { columnName: "DEPT_ID", columnType: "NUMBER" }
            ]
        }
    ],
    solutionQuery: `ALTER TABLE STUDENT ADD CONSTRAINT FK_STUDENT_DEPT FOREIGN KEY (DEPT_ID) REFERENCES DEPARTMENT(ID);`,
    outputTypes: ["tables"]
};

export const foreignKeyTestCase = {
    questionId: 2, // Replace with actual ObjectId or value in DB
    hidden: false,
    input: {
        tables: [
            {
                tableName: "DEPARTMENT",
                rows: []
            },
            {
                tableName: "STUDENT",
                rows: []
            }
        ],
        variables: [],
        returnValue: null
    },
    output: {
        tables: [
            {
                tableName: "FOREIGN_KEY",
                rows: [
                    {
                        CONSTRAINT_TYPE: "R",
                        CONSTRAINT_NAME: "FK_STUDENT_DEPT",
                        TABLE_NAME: "STUDENT",
                        COLUMN_NAME: "DEPT_ID",
                        REF_TABLE_NAME: "DEPARTMENT",
                        REF_COLUMN_NAME: "ID"
                    }
                ]
            }
        ],
        variables: [],
        dbms_output: [],
        returnValue: null
    }
};

export const notNullQuestion = {
  title: "Add NOT NULL Constraint to Name Column",
  description: "Add a NOT NULL constraint to the `NAME` column of the `STUDENT` table.",
  type: "CONSTRAINT",
  subType: "NOT_NULL",
  target: "TABLE",
  marks: 10,
  schemas: [
    {
      tableName: "STUDENT",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" },
        { columnName: "AGE", columnType: "NUMBER" }
      ]
    }
  ],
  solutionQuery: `ALTER TABLE STUDENT MODIFY NAME VARCHAR2(100) NOT NULL;`,
  outputTypes: ["tables"]
};

export const notNullTestCase = {
  questionId: 3, // Replace with actual ObjectId or DB reference
  hidden: false,
  input: {
    tables: [
      {
        tableName: "STUDENT",
        rows: []
      }
    ],
    variables: [],
    returnValue: null
  },
  output: {
    tables: [
      {
        tableName: "NOT_NULL",
        rows: [
          {
            TABLE_NAME: "STUDENT",
            COLUMN_NAME: "NAME",
            NULLABLE: "N"
          }
        ]
      }
    ],
    variables: [],
    dbms_output: [],
    returnValue: null
  }
};

export const uniqueConstraintQuestion = {
  title: "Add UNIQUE Constraint to Email Column",
  description: "Add a UNIQUE constraint to the `EMAIL` column of the `STUDENT` table so that no two students can have the same email.",
  type: "CONSTRAINT",
  subType: "UNIQUE",
  target: "TABLE",
  marks: 10,
  schemas: [
    {
      tableName: "STUDENT",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" },
        { columnName: "EMAIL", columnType: "VARCHAR2(100)" }
      ]
    }
  ],
  solutionQuery: `ALTER TABLE STUDENT ADD CONSTRAINT UQ_STUDENT_EMAIL UNIQUE (EMAIL);`,
  outputTypes: ["tables"]
};

export const uniqueConstraintTestCase = {
  questionId: 4, // Replace with actual ObjectId or DB reference
  hidden: false,
  input: {
    tables: [
      {
        tableName: "STUDENT",
        rows: []
      }
    ],
    variables: [],
    returnValue: null
  },
  output: {
    tables: [
      {
        tableName: "UNIQUE",
        rows: [
          {
            CONSTRAINT_TYPE: "U",
            CONSTRAINT_NAME: "UQ_STUDENT_EMAIL",
            TABLE_NAME: "STUDENT",
            COLUMN_NAME: "EMAIL"
          }
        ]
      }
    ],
    variables: [],
    dbms_output: [],
    returnValue: null
  }
};

export const checkConstraintQuestion = {
  title: "Add CHECK Constraint on Age",
  description: "Add a CHECK constraint to ensure that the `AGE` column in the `STUDENT` table is greater than or equal to 18.",
  type: "CONSTRAINT",
  subType: "CHECK",
  target: "TABLE",
  marks: 10,
  schemas: [
    {
      tableName: "STUDENT",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2(100)" },
        { columnName: "AGE", columnType: "NUMBER" }
      ]
    }
  ],
  solutionQuery: `ALTER TABLE STUDENT ADD CONSTRAINT CHK_STUDENT_AGE CHECK (AGE >= 18)`,
  outputTypes: ["tables"],
  validationQuery: `INSERT INTO STUDENT (ID, NAME, AGE) VALUES (1, 'Alice', 15)`
};

export const checkConstraintTestCase = {
  questionId: 5, // Replace with actual ObjectId or reference
  hidden: false,
  input: {
    tables: [
      {
        tableName: "STUDENT",
        rows: []
      }
    ],
    variables: [],
    returnValue: null
  },
  output: {
    tables: [
      {
        tableName: "CHECK",
        rows: [
          {
            CONSTRAINT_TYPE: "C",
            CONSTRAINT_NAME: "CHK_STUDENT_AGE",
            TABLE_NAME: "STUDENT",
            COLUMN_NAME: "AGE"
          }
        ]
      }
    ],
    variables: [],
    dbms_output: [],
    returnValue: null
  }
};
