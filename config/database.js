import oracledb from 'oracledb';

import { appConfig } from './app.mjs';
export async function createPool() {
    //console.log(appConfig);
    try {
        await oracledb.createPool({
            user : appConfig.oracledb.user,
            password : appConfig.oracledb.password,
            //connectString : appConfig.oracledb.connectString
        });
    } catch (err) {
       throw err;
    }
}

export async function closePool() {
    try {
        await oracledb.getPool().close(0);
    } catch (err) {
       throw err;
    }
}


