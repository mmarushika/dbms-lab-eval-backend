import * as dotenv from "dotenv-flow";
dotenv.config();

export const appConfig = {
    app: {
        port: process.env.PORT || 8000,
        env: process.env.NODE_ENV || 'development',
    },
    oracledb : {
        user : process.env.ORACLE_DB_USER,
        password : process.env.ORACLE_DB_PASSWORD,
        connectString : process.env.ORACLE_DB_CONNECT_STRING
    }
}