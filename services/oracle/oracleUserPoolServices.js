import oracledb from 'oracledb';
import { appConfig as config } from "../../config/app.js";
import { getUserOracleCredentials } from "../../models/Users.js";

const userPools = new Map(); // username => { pool, lastUsed }

export async function initUserPool(userId) {
  const existing = userPools.get(userId);
  if (existing) {
    existing.lastUsed = Date.now();
    return existing.pool;
  }
  const user = await getUserOracleCredentials(userId);
  console.log(user);
  const pool = await oracledb.createPool({
    user: user.oracleUsername,
    password: user.oraclePassword,
    connectString: config.oracledb.connectString,
    poolMin: 0,
    poolMax: 3,
    poolTimeout: 60,
  });

  userPools.set(userId, { pool, lastUsed: Date.now() });
  console.log(`Created pool for user: ${userId}`);
  return pool;
}

export async function getUserConnection(userId) {
  const pool = await initUserPool(userId);
  return await pool.getConnection();
}

export async function cleanupIdlePools(idleTimeoutMs = 10 * 60 * 1000) {
  const now = Date.now();
  for (const [userId, { pool, lastUsed }] of userPools.entries()) {
    if (now - lastUsed > idleTimeoutMs) {
      await pool.close();
      userPools.delete(userId);
      console.log(`Closed idle pool for user: ${userId}`);
    }
  }
}

export async function closeAllUserPools() {
  for (const { pool } of userPools.values()) {
    await pool.close(10); // wait 10s for active connections
  }
  userPools.clear();
  console.log('All user pools closed');
}
