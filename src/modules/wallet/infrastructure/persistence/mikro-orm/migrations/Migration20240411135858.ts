import { Migration } from '@mikro-orm/migrations';

export class Migration20240411135858 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "authentication" ("id" varchar(255) not null, "type" varchar(255) not null, "account_id" varchar(255) null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "email_verified_at" timestamptz null, "password_last_reset_at" timestamptz null, "created_at" timestamptz not null, constraint "authentication_pkey" primary key ("id"));');

    this.addSql('create table "users" ("id" varchar(255) not null, "auth_id" varchar(255) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone" varchar(255) null, "status" varchar(255) not null, "bvn" varchar(255) null, "address" varchar(255) null, "avatar_upload_id" varchar(255) null, "avatar_upload_url" varchar(255) null, "validation_rules" text[] not null, "onboarded_at" timestamptz null, "created_at" timestamptz not null, constraint "users_pkey" primary key ("id"));');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "bank_account" add column "user_id" varchar(255) not null;');
    this.addSql('alter table "bank_account" add constraint "bank_account_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bank_account" drop constraint "bank_account_user_id_foreign";');

    this.addSql('create table "user" ("id" varchar(255) not null, "auth_id" varchar(255) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone" varchar(255) null, "status" varchar(255) not null, "bvn" varchar(255) null, "address" varchar(255) null, "bank_accounts" text[] null, "avatar_upload_id" varchar(255) null, "avatar_upload_url" varchar(255) null, "validation_rules" text[] not null, "onboarded_at" timestamptz null, "created_at" timestamptz not null, constraint "user_pkey" primary key ("id"));');

    this.addSql('drop table if exists "authentication" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('alter table "bank_account" drop column "user_id";');
  }

}
