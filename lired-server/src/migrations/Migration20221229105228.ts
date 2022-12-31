import { Migration } from '@mikro-orm/migrations';

export class Migration20221229105228 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "title" text not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null);');
  }

}
