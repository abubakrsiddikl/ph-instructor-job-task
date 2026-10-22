import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";

import appContract  from "./src/prisma/contract.json";
import app from "./service.ts";

export default module("ph-instructor", ({ provision }) => {
  const database = provision(
    postgres({
      name: "database",
      contract: appContract as any,
      config: "./prisma.config.ts",
    }),
    { id: "database" },
  );

  provision(app, { deps: { database } });
});
