import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import mikroConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";
import { MyContext } from "./types";

(async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "sid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: "keyboard caty",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  app.listen(4000, () => {
    console.log("Server started on port 4000...");
  });
})();
