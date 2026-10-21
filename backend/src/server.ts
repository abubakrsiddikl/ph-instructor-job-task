import { Server } from "http";
import app from "./app";
import config from "./app/config";
import { connectDatabase } from "./prisma/db";

async function main() {
    await connectDatabase();
    // console.log(process.env.DATABASE_URL,"db rul")
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
}

main();
