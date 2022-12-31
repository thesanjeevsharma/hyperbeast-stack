import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field(() => String)
  @Property({ type: "DateType" })
  createdAt?: Date = new Date();

  @Field(() => String)
  @Property({ type: "DateType", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
