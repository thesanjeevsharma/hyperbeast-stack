import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { hash, verify } from "argon2";

import { User } from "../entities/User";
import { MyContext } from "src/types";

@InputType()
class UserInputType {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    const user = await ctx.em.findOne(User, { id: ctx.req.session.userId });
    if (!user) {
      return null;
    }

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials") credentials: UserInputType,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    if (credentials.username.length <= 4) {
      return {
        errors: [
          {
            field: "username",
            message: "too short, should have at least 5 chars",
          },
        ],
      };
    }

    if (credentials.password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "too short, should have at least 8 chars",
          },
        ],
      };
    }

    const hashedPassword = await hash(credentials.password);
    const user = ctx.em.create(User, {
      username: credentials.username.toLowerCase(),
      password: hashedPassword,
    });

    try {
      await ctx.em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        // duplicate key
        return {
          errors: [
            {
              field: "username",
              message: "username already exists!",
            },
          ],
        };
      }

      return {
        errors: [
          {
            field: "unknown",
            message: err.message,
          },
        ],
      };
    }

    ctx.req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("credentials") credentials: UserInputType,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, {
      username: credentials.username.toLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "user does not exist",
          },
        ],
      };
    }

    const isPasswordValid = await verify(user.password, credentials.password);
    if (!isPasswordValid) {
      return {
        errors: [
          {
            field: "password",
            message: "password is not correct",
          },
        ],
      };
    }

    ctx.req.session.userId = user.id;

    return { user };
  }
}
