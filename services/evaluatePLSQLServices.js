export async function evaluatePLSQL(connection, ques, studentSubmission, testcase, isFirstTestCase = false, isLastTestCase = false) {
  try {
    // Create tables only for first test case
    if (isFirstTestCase && ques.schemas?.length > 0) {
      await createTables(connection, ques.schemas);
    }

    // Reset database state for this test case
    await resetDatabaseState(connection, ques, testcase);

    // Execute student submission
    try {
      await connection.execute(studentSubmission);
    } catch (err) {
      return {
        testCaseId: testcase._id,
        success: false,
        error: `Compilation Error: ${err.message}`,
        status: 'Failed'
      };
    }

    // Get and compare outputs
    const evaluationResult = await evaluateTestCase(connection, ques, testcase);

    // Clean up after last test case
    if (isLastTestCase && ques.schemas?.length > 0) {
      await dropTables(connection, ques.schemas);
    }

    return {
      testCaseId: testcase._id,
      ...evaluationResult
    };

  } catch (err) {
    return { 
      testCaseId: testcase._id,
      success: false, 
      error: err.message,
      status: 'Error' 
    };
  }
}

// Helper functions
async function createTables(connection, schemas) {
  for (const schema of schemas) {
    try {
      await createTable(connection, schema);
    } catch (err) {
      console.error(`Error creating table ${schema.tableName}:`, err);
      throw new Error(`Failed to create table ${schema.tableName}`);
    }
  }
}

async function resetDatabaseState(connection, ques, testcase) {
  try {
    // Truncate tables if they exist
    if (ques.schemas?.length > 0) {
      for (const schema of ques.schemas) {
        try {
          await connection.execute(
            `BEGIN
               EXECUTE IMMEDIATE 'TRUNCATE TABLE ${schema.tableName}';
             EXCEPTION
               WHEN OTHERS THEN NULL;
             END;`
          );
        } catch (err) {
          console.error(`Error truncating ${schema.tableName}:`, err);
        }
      }
    }

    // Insert test data
    if (testcase.inputTables?.length > 0) {
      await inserTable(connection, testcase, ques.schemas);
    }

    // Execute setup SQL
    if (ques.setupSQL?.trim()) {
      await connection.execute(ques.setupSQL, [], { autoCommit: true });
    }
  } catch (err) {
    console.error('Error resetting database state:', err);
    throw new Error('Failed to reset database state');
  }
}

async function evaluateTestCase(connection, ques, testcase) {
  // Get actual output
  const actualOutput = await getTestOutput(connection, ques, testcase);
  
  // Get expected output
  const expectedOutput = await getExpectedOutput(connection, ques, testcase);
  
  // Compare results
  const passed = compareOutputs(actualOutput, expectedOutput, ques.expectedOutputType);

  return {
    success: passed,
    actualOutput,
    expectedOutput,
    status: passed ? 'Passed' : 'Failed'
  };
}

async function getTestOutput(connection, ques, testcase) {
  await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
  
  try {
    await connection.execute(
      ques.testBlock, 
      testcase.inputVariables || {}, 
      { autoCommit: true }
    );
  } catch (err) {
    throw new Error(`Runtime Error in test block: ${err.message}`);
  }

  switch (ques.expectedOutputType) {
    case 'dbms_output':
      return await getDbmsOutput(connection);
    case 'return_value':
      const res = await connection.execute(
        `SELECT * FROM return_values`, 
        [], 
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return res.rows;
    case 'table_data':
      if (!testcase.expectedTableName) {
        throw new Error('Expected table name not provided for table_data output type');
      }
      const res2 = await connection.execute(
        `SELECT * FROM ${testcase.expectedTableName}`, 
        [], 
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return res2.rows;
    default:
      throw new Error(`Unknown output type: ${ques.expectedOutputType}`);
  }
}

async function getExpectedOutput(connection, ques, testcase) {
  if (ques.expectedOutputType === 'table_data') {
    return testcase.expectedOutput;
  }

  if (ques.referenceCode) {
    await resetDatabaseState(connection, ques, testcase);
    await connection.execute(ques.referenceCode, [], { autoCommit: true });
    return await getTestOutput(connection, ques, testcase);
  }

  return testcase.expectedOutput;
}

async function dropTables(connection, schemas) {
  for (const schema of schemas) {
    try {
      await connection.execute(
        `BEGIN
           EXECUTE IMMEDIATE 'DROP TABLE ${schema.tableName} PURGE';
         EXCEPTION
           WHEN OTHERS THEN NULL;
         END;`
      );
    } catch (err) {
      console.error(`Error dropping table ${schema.tableName}:`, err);
    }
  }
}

function compareOutputs(actual, expected, outputType) {
  if (outputType === 'dbms_output') {
    return arraysEqual(actual, expected);
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}