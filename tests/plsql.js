
import { getUserConnection } from "../services/oracleUserPoolServices.js"
import mongoose from "mongoose";
import oracledb from "oracledb";

await mongoose.connect('mongodb://127.0.0.1:27017/dbms-lab-eval');
let connection = await getUserConnection('685bb48ef150d85daa68e8b0');

import { executePLSQLProcedure } from "../services/oracleDBServices.js";

let userId = '685bb48ef150d85daa68e8b0';
let procedure = 
`CREATE OR REPLACE PROCEDURE greet_user (
    p_name   IN  VARCHAR2,
    p_greet  OUT VARCHAR2
) AS
BEGIN
    p_greet := 'Hello, ' || p_name || '!';
    DBMS_OUTPUT.PUT_LINE('Greeting generated for: ' || p_name);
END;`

let procedureName = 'greet_user';
let variables = [
    {
        name: 'p_name',
        dir: 'IN',
        type: 'STRING',
        value: 'Alice'
    },
    {
        name: 'p_greet',
        dir: 'OUT',
        type: 'STRING',
        value: ''
    }

]
let result = await executePLSQLProcedure(userId, procedure, procedureName, variables);

console.log(result);

/*await connection.execute(`
  BEGIN
    DBMS_OUTPUT.ENABLE(NULL); -- NULL means unlimited buffer size
  END;
`);

await connection.execute(`
  BEGIN
    DBMS_OUTPUT.PUT_LINE('Hello from PL/SQL!');
  END;
`);

const result = await connection.execute(`
  BEGIN
    DBMS_OUTPUT.GET_LINES(:lines, :numlines);
  END;`,
  {
    lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxArraySize: 100 },
    numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 100 }
  }
);

console.log(result.outBinds.lines);*/