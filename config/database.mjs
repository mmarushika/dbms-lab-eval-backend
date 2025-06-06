import oracledb from 'oracledb';

export async function createPool() {
    try {
        await oracledb.createPool({
            user : "c##mm",
            password : "mgm2005",
            connectString : "localhost:1521/XEPDB1"
        });
    } catch (err) {
        console.error(err.message);
    }
}

export async function closePool() {
    try {
        await oracledb.getPool().close(0);
    } catch (err) {
        console.error(err.message);
    }
}

createPool();
