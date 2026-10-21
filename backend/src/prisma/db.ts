import "dotenv/config";
import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";

import "temporal-polyfill/global";

import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

export const db: PostgresClient<Contract> = process.env.DATABASE_URL
  ? postgres<Contract>({ contractJson, url: process.env.DATABASE_URL })
  : postgres<Contract>({ contractJson });

let connection: Promise<void> | undefined;

export function connectDatabase(): Promise<void> {
  connection ??= db.connect().then(() => undefined).catch((error: unknown) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

// import "dotenv/config";
// import postgres from "@prisma/orm-postgres/runtime";

// import "temporal-polyfill/global";

// import service from "../../service.ts";
// import type { Contract } from "./contract.d.ts";
// import contractJson from "./contract.json" with { type: "json" };

// function loadComposerDatabase() {
//   try {
//     return service.load().database.client;
//   } catch {
//     return undefined;
//   }
// }

// console.log({db_url: process.env.DATABASE_URL})
// export const db =
//   loadComposerDatabase() ??
//   (process.env.DATABASE_URL
//     ? postgres<Contract>({ contractJson, url: process.env.DATABASE_URL })
//     : postgres<Contract>({ contractJson }));

// let connection: Promise<void> | undefined;

// export function connectDatabase(): Promise<void> {
//   connection ??= db.connect().then(() => undefined).catch((error: unknown) => {
//     connection = undefined;
//     throw error;
//   });
//   console.log("this is hello")
//   return connection;
// }