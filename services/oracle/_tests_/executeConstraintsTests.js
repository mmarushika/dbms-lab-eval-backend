import { 
    executeQuery 
} from "../../oracleDBServices.js";
import { 
    initEvaluationEnvironment,
    clearEvaluationEnvironment 
} from "../evaluationEnvironmentServices.js";
import { getUserConnection } from "../oracleUserPoolServices.js";
import { userId } from "../../../tests/testEnvionmentVariables.js";
import { parseResult, parseConstraintOutput } from "../../../utilities/OracleResultParsers.js";
import { createQuestion } from "../../evaluation/_tests_/ddlSampleData.js";

import mongoose from "mongoose";
await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');

let schemas = [
    {
      tableName: "STUDENTS",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "NAME", columnType: "VARCHAR2" },
        { columnName: "AGE", columnType: "NUMBER" }
      ]
    },
    {
      tableName: "ENROLLMENT",
      rows: [
        { columnName: "ID", columnType: "NUMBER" },
        { columnName: "STUDENT_ID", columnType: "NUMBER" },
        { columnName: "COURSE", columnType: "VARCHAR2" },
      ]
    }
]

export async function dropAllConstraints(userId) {
    let connection;;
    try {
        connection = await getUserConnection(userId);
        plsql = `
            BEGIN
                FOR ITEM IN (
                    SELECT CONSTRAINT_NAME
                    FROM USER_CONSTRAINTS
                ) LOOP 
                    EXECUTE 'DROP CONSTRAINT' || ITEM.CONSTRAINT_NAME;
                END LOOP;
            END;
        `
        await connection.execute(plsql, [], { autoCommit: true });
    } catch (error) {
        console.log("dropAllTables", error.message);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }

}

/*export async function describeTableConstraints(userId, tableName) {
    let sql = `
        SELECT 
            UC.CONSTRAINT_NAME CONSTRAINT_NAME, 
            UC.CONSTRAINT_TYPE CONSTRAINT_TYPE, 
            UCC.COLUMN_NAME COLUMN_NAME, 
            UTC.NULLABLE
        FROM USER_CONSTRAINTS UC
        JOIN USER_CONS_COLUMNS UCC 
            ON UC.CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
        JOIN USER_TAB_COLUMNS UTC 
            ON UC.TABLE_NAME = UTC.TABLE_NAME 
            AND UCC.COLUMN_NAME = UTC.COLUMN_NAME
        WHERE UC.TABLE_NAME = '${tableName.toUpperCase()}'
        ORDER BY UC.CONSTRAINT_TYPE, UC.CONSTRAINT_NAME, UCC.COLUMN_NAME
    `;
    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        return output;
    } catch (error) {
        console.log("Error describing constraints", sql);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}*/

export async function describeTableConstraints(userId, tableName) {
    /*let sql = `
    SELECT 
        uc.constraint_type, 
        ucc.column_name, 
        ucc.table_name,
        uc.constraint_name,
        uc.r_constraint_name,
        pk.table_name AS ref_table,
        pkc.column_name AS ref_column,
        
    FROM user_constraints uc 
    JOIN user_cons_columns ucc
        ON uc.constraint_name = ucc.constraint_name
    LEFT JOIN user_constraints pk
        ON uc.r_constraint_name = pk.constraint_name
    LEFT JOIN user_cons_columns pkc 
        ON pk.constraint_name = pkc.constraint_name
    WHERE uc.table_name = '${tableName.toUpperCase()}'
    ORDER BY ucc.column_name
`;*/
const sql = `
    SELECT 
        UC.CONSTRAINT_TYPE, 
        UCC.COLUMN_NAME, 
        UCC.TABLE_NAME,
        UC.CONSTRAINT_NAME,
        UC.R_CONSTRAINT_NAME,
        PK.TABLE_NAME AS REF_TABLE,
        PKC.COLUMN_NAME AS REF_COLUMN,
        UTC.NULLABLE
    FROM USER_CONSTRAINTS UC 
    JOIN USER_CONS_COLUMNS UCC
        ON UC.CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
    LEFT JOIN USER_CONSTRAINTS PK
        ON UC.R_CONSTRAINT_NAME = PK.CONSTRAINT_NAME
    LEFT JOIN USER_CONS_COLUMNS PKC 
        ON PK.CONSTRAINT_NAME = PKC.CONSTRAINT_NAME
    JOIN USER_TAB_COLUMNS UTC
        ON UTC.TABLE_NAME = UCC.TABLE_NAME 
       AND UTC.COLUMN_NAME = UCC.COLUMN_NAME
    WHERE UC.TABLE_NAME = '${tableName.toUpperCase()}'
    ORDER BY 
        UCC.TABLE_NAME,
        UC.CONSTRAINT_TYPE,
        UCC.COLUMN_NAME,
        UC.CONSTRAINT_NAME
`;

    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        result = await parseResult(result);
        let output = parseConstraintOutput(result)
        return output;
    } catch (error) {
        console.log("Error describing constraints", sql);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

export async function describeRefTableConstraints(userId) {
    let sql = `
        SELECT 
            UC.R_CONSTRAINT_NAME CONSTRAINT_NAME,
            UC.TABLE_NAME TABLE_NAME,
            UCC.TABLE_NAME REF_TABLE_NAME,
            UCC.COLUMN_NAME REF_COLUMN_NAME
        FROM USER_CONSTRAINTS  UC
        JOIN USER_CONS_COLUMNS UCC
            ON UC.R_CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
            AND UC.CONSTRAINT_type = 'R'
        ORDER BY UC.TABLE_NAME,
            UC.R_CONSTRAINT_NAME,
            UCC.TABLE_NAME,
            UCC.COLUMN_NAME
    `
    let connection;
    try {
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);
        //connection = await oracledb.getConnection();
        let result = await connection.execute(sql, [], { resultSet: true })
        let output = await parseResult(result);
        return output;
    } catch (error) {
        console.log("Error describing constraints", sql);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error while closing connection:", closeErr.message);
            }
        }
    }
}

// Clear previous table environment
await clearEvaluationEnvironment(userId);

// Create table environment
await initEvaluationEnvironment(userId, 'PRIMARY KEY', schemas);


let sql = `
    ALTER TABLE STUDENTS 
    ADD CONSTRAINT PK_STUDENT PRIMARY KEY (ID)
`;
await executeQuery(userId, sql);

sql = `
    ALTER TABLE ENROLLMENT 
    ADD CONSTRAINT FK_STUDENT_ENROLLMENT 
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENTS(ID)
`;
await executeQuery(userId, sql);

sql = `
    ALTER TABLE STUDENTS 
    MODIFY AGE INT NOT NULL
`;
await executeQuery(userId, sql);

/*let result = await describeTableConstraints(userId, 'STUDENTS');
console.log(result);
result = await describeTableConstraints(userId, 'ENROLLMENT');
console.log(result);*/

let result = await describeTableConstraints(userId, 'STUDENTS');
console.dir(result, {depth: null});
/*console.log(result);
result = await describeTableConstraints(userId, 'ENROLLMENT');
console.log(result);
result = await describeRefTableConstraints(userId);
console.log(result);*/