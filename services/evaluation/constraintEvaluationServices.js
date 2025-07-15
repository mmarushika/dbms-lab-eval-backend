import { getAddPrimaryKeyConstraintQuery } from "../../utilities/OracleSQLConverters.js";
import { 
    executeQuery,
    describeTableConstraints
} from "../oracleDBServices.js";
import { compareTables } from "../../helpers/evaluationHelpers.js";

export async function evaluateConstraint(userId, type, query, testCase, err) {
    let testCaseResult = {
        testCaseId: testCase._id
    }
    if (err) {
        testCaseResult["errorMsg"] = err;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
        return testCaseResult;
    }

    try {
        if(type.toUpperCase() == "FOREIGN") {
            // Create primary key for all foreign key references
            const fkConstraints = testCase.output.tables.find(item => item.tableName === "FOREIGN_KEY");
            if(!fkConstraints || fkConstraints == undefined) {
                throw new Error("Solution output formatted incorrectly");
            }
            for(const row of fkConstraints.rows) {
                let sql = getAddPrimaryKeyConstraintQuery(row.REF_TABLE_NAME, row.REF_COLUMN_NAME);
                await executeQuery(userId, sql);
            }
        }
        // Create constraint 
        await executeQuery(userId, query);
        let results = [];
        let status = true;
        let errorMsg = "";

        if (!testCase.output || !Array.isArray(testCase.output.tables)) {
            throw new Error("Output tables not defined in test case.");
        }

        // Map all result constraint tables
        results = await describeTableConstraints(userId);
        if(results.length != testCase.output.tables.length) {
            console.dir(results, {depth: null});
            console.dir(testCase.output.tables, {depth: null});
            throw new Error("Incorrect no. of constraints");
        }
        let resultConstraintTables = {}
        for (const constraintTable of results) {
            resultConstraintTables[constraintTable.tableName] = constraintTable.rows;
        }
 
        // Compare result constraints and testcase output constraints
        for (const table of testCase.output.tables) {
            if (!compareTables(resultConstraintTables[table.tableName], table.rows)) {
                console.log("")
                status = false;
                errorMsg = "Mismatched constraints"
            }
        }

        // Execute validation query for check constraints 
        if (type.toUpperCase() == "CHECK") {
            if (!testCase.validationQuery) {
                throw new Error("Validation query for check constraint is null");
            }
            try {
                await executeQuery(userId, testCase.validationQuery);
                status = false;
                errorMsg = "Incorrect check constraint";
            } catch (error) {
                // Throw errors other than check constraint violation
                if (error.errorNum != 2290) {
                    throw error;
                }
            }
        }
        testCaseResult["errorMsg"] = errorMsg;
        testCaseResult["passed"] = status;
        testCaseResult["output"] = {
            tables: results,
            variables: [],
            dbms_output: []
        };
    } catch (error) {
        console.log("ERROR IN CONSTRAINT EVALUTATION");
        testCaseResult["errorMsg"] = error.message;
        testCaseResult["passed"] = false;
        testCaseResult["output"] = null;
    } finally {
        return testCaseResult;
    }
}

