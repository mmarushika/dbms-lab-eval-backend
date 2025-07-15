export async function parseResult(result) {
    let rs = result.resultSet;
    let md = result.metaData;

    let rows = [];
    for await (const row of rs) {
        let rowObj = {}
        for (let i = 0; i < md.length; i++) {
            rowObj[md[i].name] = row[i];
        }
        rows.push(rowObj);
    }
    return rows;
}

export function parseConstraintOutput(result) {
    const indexMap = { 'P': 0, 'R': 1, 'C': 2, 'U': 3, 'N': 4 }
    let tables = [
        {
            tableName: "PRIMARY_KEY",
            rows: []
        },
        {
            tableName: "FOREIGN_KEY",
            rows: []
        },
        {
            tableName: "CHECK",
            rows: []
        },
        {
            tableName: "UNIQUE",
            rows: []
        },
        {
            tableName: "NOT_NULL",
            rows: []
        }
    ];

    // Filter constraint output
    for (const row of result) {
        const tableFields = {
            TABLE_NAME: row.TABLE_NAME,
            COLUMN_NAME: row.COLUMN_NAME,
        };
        const constraintFields = {
            CONSTRAINT_TYPE: row.CONSTRAINT_TYPE,
            CONSTRAINT_NAME: row.CONSTRAINT_NAME
        }
        const commonFields = {
            ...constraintFields,
            ...tableFields
        }

        const notNullFields = {
            ...tableFields,
            NULLABLE: row.NULLABLE
        }

        const fkFields = {
            ...constraintFields,
            ...tableFields,
            REF_TABLE_NAME: row.REF_TABLE_NAME,
            REF_COLUMN_NAME: row.REF_COLUMN_NAME

        }
        switch (row.CONSTRAINT_TYPE) {
            case 'P':
                tables[indexMap['P']].rows.push(commonFields);
                break;
            case 'U':
                tables[indexMap['U']].rows.push(commonFields);
                break;
            case 'R':
                tables[indexMap['R']].rows.push(fkFields);
                break;
            case 'C':
                if (row.NULLABLE == 'N') {
                    tables[indexMap['N']].rows.push(notNullFields);
                } else {
                    tables[indexMap['C']].rows.push(commonFields);
                }
                break;
        }
    }
    return tables.filter(table => table.rows.length != 0);
}

