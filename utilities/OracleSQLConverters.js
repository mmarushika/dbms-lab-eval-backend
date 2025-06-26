import { selectAllConstraintNames } from "../services/oracleDBServices.js";

let varcharMaxSize = 100;
export function getCreateTableQuery(schema) {
    const rows = schema.rows;
    let sql = `CREATE TABLE ${schema.tableName} (`
    for(let i = 0; i < rows.length; i++) {
        sql += `${rows[i].columnName} ${rows[i].columnType}`
        if(rows[i].columnType == 'VARCHAR2') {
            sql +=`(${varcharMaxSize})`;
        }
        if(i != rows.length - 1) {
            sql += ", "
        } else {
            sql += ")";
        }
    }
    return sql;
}

export function getDropTableQuery(tableName) {
    return `DROP TABLE ${tableName}`;
}

export function getInsertTableInputQuery(tableName, rows) {
    let sql = `INSERT INTO ${tableName} VALUES (`

    let columnNames = Object.keys(rows[0]);
    for(let i = 0; i < columnNames.length; i++) {
        sql += `:${columnNames[i]}`
        if(i != columnNames.length - 1) {
            sql += ", "
        } else {
            sql += ")";
        }
    }

    return {
        sql: sql,
        binds: rows
    }
}

export function getTruncateTableQuery(tableName) {
    return `TRUNCATE TABLE ${tableName}`;
}

export function getSelectTableQuery(tableName) {
    return `SELECT * FROM ${tableName}`;
}

export async function getAddCheckConstraintQuery(tableName, condition) {
    const constraintName = await _getUniqueConstraintName();
    return `
        ALTER TABLE ${tableName} 
        ADD CONSTRAINT ${constraintName} CHECK (${condition})
    `;
}

export async function getAddUniqueConstraintQuery(tableName, columnName) {
    const constraintName = await _getUniqueConstraintName();
    return `
        ALTER TABLE ${tableName} 
        ADD CONSTRAINT ${constraintName} UNIQUE (${columnName})
    `;
}

export function getAddNotNullConstraintQuery(tableName, columnName, columnType) {
    if(columnType === 'VARCHAR2') {
        columnType += `(${varcharMaxSize})`
    }
    return `ALTER TABLE ${tableName} MODIFY ${columnName} ${columnType} NOT NULL`
}

export async function getAddPrimaryKeyConstraintQuery(tableName, columnName, columnType) {
    if(columnType === 'VARCHAR2') {
        columnType += `(${varcharMaxSize})`
    }
    const constraintName = await _getUniqueConstraintName();
    return `
        ALTER TABLE ${tableName} 
        ADD CONSTRAINT ${constraintName} PRIMARY KEY (${columnName})
    `;
}

export async function getAddForeignKeyConstraintQuery(tableName, columnName, referenceTable, referenceColumn) {
    const constraintName = await _getUniqueConstraintName();
    return `
        ALTER TABLE ${tableName} 
        ADD CONSTRAINT ${constraintName} 
        FOREIGN KEY (${columnName})
        REFERENCES ${referenceTable}(${referenceColumn})
    `;
}

async function _getUniqueConstraintName() {
    let constraints = await selectAllConstraintNames();
    let count = constraints.length;
    return `Constraint${count + 1}`;
}

/*export function getCreateTableQuery(schema) {
    let query = `CREATE TABLE :tableName (`
    for(let i = 0; i < schema.columns.length; i++) {
        query += `:columnName${i} :columnType${i}`;
        if(i != schema.columns.length - 1) {
            query += ","
        } else {
            query += ")";
        }
    }

    let bindVariables = {tableName : schema.tableName};
    for(let i = 0; i < schema.columns.length; i++) {
        bindVariables[`columnName${i}`] = schema.columns[i].columnName;
        bindVariables[`columnType${i}`] = schema.columns[i].columnType;
    }
    return {
        query: query,
        bindVariables: bindVariables
    }
}*/