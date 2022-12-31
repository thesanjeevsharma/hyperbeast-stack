import { MikroORM } from "@mikro-orm/core";

import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
    snapshot: false,
  },
  dbName: "lired",
  password: "postgres",
  user: "postgres",
  type: "postgresql",
  entities: [Post, User],
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
