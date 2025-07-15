
import { _getConstraintsQuery,_getNotNullConstraintsQuery } from "../utilities/OracleSQLConverters";
import { parseResult } from "../utilities/OracleResultParsers";

async function _getUniqueConstraintName() {
    let constraints = await selectAllConstraintNames();
    let count = constraints.length;
    return `Constraint${count + 1}`;
}

export function _getConstraintsQuery(tableName){
    let sql = `SELECT 
                uc.constraint_type, ucc.column_name, ucc.table_name,
                uc.constraint_name,uc.r_constraint_name,
                pk.table_name AS ref_table,
                pkc.column_name AS ref_column
                FROM user_constraints uc 
                JOIN user_cons_columns ucc
                ON uc.constraint_name = ucc.constraint_name
                LEFT JOIN user_constraints_name pk
                ON uc.r_constraint_name = pk.constraint_name
                LEFT JOIN user_cons_columns pkc ON
                pk.constraint_name = pkc.constraint_name
                WHERE uc.table_name = '${tableName}'
                ORDER BY ucc.column_name`
    return sql;
}

export function _getNotNullConstraintsQuery(tableName){
    return `SELECT column_name FROM user_tab_columns
            WHERE table_name = '${tableName}'
            AND nullable = 'N'`
}

export const testCaseSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    input: [
        {
            tableName: { type: String, required: true },
            rows:[{type: Schema.Types.Mixed, required: true}],
        }, 
        { _id: false }
    ],
    query: {type: Schema.Types.Mixed, required: true},
    validationQuery: {type: Schema.Types.Mixed},
    output: [
        {
            tableName: { type: String, required: true },
            rows:[{type: Schema.Types.Mixed, required: true}],
        },
        { _id: false }
    ],
    expectedConstraints: [
        {
            table: {type: String, required: true},
            types: [{type: Schema.Types.Mixed, required: true}],
            references: {
                table: {type: String},
                column: {type: String}
            }
        }
    ],
    hidden: {type: Boolean, required: true}
});

export async function executeConstraints(userId, schemas, sql){
    let connection;
    console.log("solution query", sql);
    try{
        // get connection from the pool and use it  
        connection = await getUserConnection(userId);  
        //connection = await oracledb.getConnection();
        let options = {
            autoCommit: true,
        }
        let result = await connection.executeMany(sql, [], options);
        let constraintsList = [];
        for(const schema of schemas){
          const consRes = await connection.execute(_getConstraintsQuery(schema.tableName) , [], {resultSet: true});
          const parsedRes = await parseResult(consRes);
          constraintsList = [...constraintsList,...parsedRes];
        }
        const finalResult = groupConstraints(constraintsList);
        return finalResult;
    }catch(err){
      console.log(err);
    }
}

async function groupConstraints(constraintsList){
  const map = {};
  for(const c of constraintsList){
    const key = `${c.TABLE_NAME}.${c.COLUMN_NAME}`;
    if(!map[key]){
      map[key] = {
        table: c.TABLE_NAME,
        column: c.COLUMN_NAME,
        types: []
      }
    }
    if(!map[key].types.includes(c.CONSTRAINT_TYPE)){
      map[key].types.push(c.CONSTRAINT_TYPE);
    }
    if(c.CONSTRAINT_TYPE==='R'){
      map[key].references = {
        table: c.REF_TABLE,
        column: c.REF_COLUMN
      }
    }
  }
  return Object.values(map);
}

export async function generateConstraintEvaluationReport({
    userId: userId, 
    taskId: taskId, 
    questionId: questionId, 
    schemas: schemas, 
    testCases: testCases, 
    code: code
}) {
    await initEvaluationEnvironment(userId, schemas);
    let submission = {
        userId: userId,
        taskId: taskId,
        questionId: questionId,
        testCases: [],
        code: code
    }
    for await(const testCase of testCases) {
        let testCaseResult = await evaluateConstraint(userId, testCase, schemas, code);
        submission.testCases.push(testCaseResult)
    }
    await clearEvaluationEnvironment(userId);
    submission["passedCount"] = _getPassedCount(submission.testCases);
    return submission;
}

export async function evaluateConstraint(userId, testCase, schemas, code, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if(err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }
    try {
        let result = await executeConstraints(userId, schemas, code);
        testCaseResult["errorMsg"] = null;
        testCaseResult["passed"] = _compareConstraintOutput(result, testCase.expectedConstraints);
        testCaseResult["output"] = [
            {
                tableName: "",
                rows: result
            }
        ]
    } catch (error) {
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}