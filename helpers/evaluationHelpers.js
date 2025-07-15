import {
    insertTableInput,
    getAllTableNames,
    createTable,
    dropAllTables,
    truncateTable,
} from "../services/oracleDBServices.js";

export function compareTables(result, output) {
    console.log("result", result);
    console.log("output", output);
    if(!result || !output || result.length == 0 || output.length == 0) {
        return false;
    }
    let outputColumns = Object.keys(output[0]);
    let resultColumns = Object.keys(result[0]);
    // Check for wrong no. of rows 
    if (result.length != output.length) {
        console.log("wr");
        return false;
    }

    // Check for wrong no. of columns
    if (outputColumns.length != resultColumns.length) {
        console.log("wc");
        return false;
    }

    console.log("names", outputColumns);
    for (let i = 0; i < output.length; i++) {
        console.log("row", result[i], output[i])
        for (let j = 0; j < outputColumns.length; j++) {
            // Check for mismatched columns
            if (result[i][outputColumns[j]] === undefined) {
                console.log("mc");
                return false;
            }

            // Check for inaccurate value
            if (result[i][outputColumns[j]] != output[i][outputColumns[j]]) {
                console.log("wv");
                return false;
            }
        };
    }
    return true;
}

export async function _checkIfTableExists(userId, tableName) {
    let allTables = await getAllTableNames(userId);
    return allTables.find(i => i === tableName);
}
