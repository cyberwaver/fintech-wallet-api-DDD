import { Migration } from '@mikro-orm/migrations';

export class Migration20240330194317 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bank_account" ("id" varchar(255) not null, "account_no" varchar(255) not null, "account_name" varchar(255) not null, "bank_name" varchar(255) not null, "bank_code" varchar(255) not null, "is_default" boolean not null, "is_validated" boolean not null, "created_at" timestamptz not null, constraint "bank_account_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" varchar(255) not null, "auth_id" varchar(255) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone" varchar(255) null, "status" varchar(255) not null, "bvn" varchar(255) null, "address" varchar(255) null, "bank_accounts" text[] null, "avatar_upload_id" varchar(255) null, "avatar_upload_url" varchar(255) null, "validation_rules" text[] not null, "onboarded_at" timestamptz null, "created_at" timestamptz not null, constraint "user_pkey" primary key ("id"));');
  }

}
