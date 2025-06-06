
  import { createSchema } from "../models/Evaluation.mjs";

  export async function evaluationController(req, res) {
    console.log(req.body, "controller");
    try {
        await createSchema(req.body.schema);
    } catch(err) {
        console.log(err.message);
    }
 }