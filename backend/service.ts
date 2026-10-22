// import node from "@prisma/composer/node";
// import { compute } from "@prisma/composer-prisma-cloud";
// import { postgres } from "@prisma/composer-prisma-cloud/orm";

// import appContract from "./src/prisma/contract.json" with { type: "json" };
// export default compute({
//   name: "app",
//   deps: {
//     database: postgres(appContract as any),
//   },
//   build: node({ module: import.meta.url, entry: "./dist/server.mjs" }),
// });


import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import appContract from "./src/prisma/contract.json" with { type: "json" };

export default module("my-app", ({ provision }) => {
  provision(
    postgres({
      name: "database",
      contract: appContract as any,
      config: "./prisma.config.ts",
    }),
  );
});