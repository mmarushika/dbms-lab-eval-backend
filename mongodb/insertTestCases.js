import mongoose from "mongoose";

async function seedEngineeringTestCases() {
  await mongoose.connect("mongodb://127.0.0.1:27017/dbms-lab-eval");
  const coll = mongoose.connection.db.collection("testcases");

  const qIdStr = "685455410bd9f4a86d5befe7";
  const qIdObj = new mongoose.Types.ObjectId(qIdStr);

  await coll.deleteMany({
    questionId: { $in: [ qIdObj, qIdStr ] }
  });

  await coll.insertMany([
    {
      questionId: qIdObj,
      input: [
        {
          tableName: "Employee",
          rows: [
            { EMP_ID: 1, NAME: "Alice", SALARY: 70000, DEPT_ID: 10 },
            { EMP_ID: 2, NAME: "Bob",   SALARY: 65000, DEPT_ID: 20 },
            { EMP_ID: 3, NAME: "Carol", SALARY: 72000, DEPT_ID: 10 }
          ]
        },
        {
          tableName: "Department",
          rows: [
            { DEPT_ID: 10, DEPT_NAME: "Engineering" },
            { DEPT_ID: 20, DEPT_NAME: "HR" }
          ]
        }
      ],
      query:   "SELECT E.name, E.salary FROM Employee E JOIN Department D ON E.dept_id = D.dept_id WHERE D.dept_name = 'Engineering';",
      validationQuery: "SELECT COUNT(*) FROM Employee E JOIN Department D ON E.dept_id = D.dept_id WHERE D.dept_name = 'Engineering';",
      output: [
        {
          tableName: "Employee",
          rows: [
            { NAME: "Alice", SALARY: 70000 },
            { NAME: "Carol", SALARY: 72000 }
          ]
        }
      ],
      hidden: false
    },
    {
      questionId: qIdObj,
      input: [
        {
          tableName: "Employee",
          rows: [
            { EMP_ID: 4, NAME: "Dave",  SALARY: 58000, DEPT_ID: 10 },
            { EMP_ID: 5, NAME: "Eve",   SALARY: 60000, DEPT_ID: 30 }
          ]
        },
        {
          tableName: "Department",
          rows: [
            { DEPT_ID: 10, DEPT_NAME: "Engineering" },
            { DEPT_ID: 30, DEPT_NAME: "Marketing" }
          ]
        }
      ],
      query:   "SELECT E.name, E.salary FROM Employee E JOIN Department D ON E.dept_id = D.dept_id WHERE D.dept_name = 'Engineering';",
      validationQuery: "SELECT COUNT(*) FROM Employee E JOIN Department D ON E.dept_id = D.dept_id WHERE D.dept_name = 'Engineering';",
      output: [
        {
          tableName: "Employee",
          rows: [
            { NAME: "Dave", SALARY: 58000 }
          ]
        }
      ],
      hidden: false
    }
  ]);

  console.log("✅ Seeded only non-empty testcases with capitalized keys");
  await mongoose.disconnect();
}

seedEngineeringTestCases().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
