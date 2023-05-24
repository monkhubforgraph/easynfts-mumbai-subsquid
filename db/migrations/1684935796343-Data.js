module.exports = class Data1684935796343 {
    name = 'Data1684935796343'

    async up(db) {
        await db.query(`CREATE TABLE "token_balance" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "owner" text NOT NULL, "onsale" integer NOT NULL, "onauction" integer NOT NULL, "token_id" character varying, CONSTRAINT "PK_dc23ea262a0188977523d90ae7f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5813c3040e74c285719679c693" ON "token_balance" ("token_id") `)
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "creator" text, "uri" text, "contract_address" text, "amountminted" numeric, "minted_time" numeric, "txncount" integer, "type" text, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "order" ("id" character varying NOT NULL, "created_by" text NOT NULL, "stage" text NOT NULL, "type" text NOT NULL, "minprice" numeric, "price" numeric NOT NULL, "remtokens" integer NOT NULL, "exptime" numeric, "order_success" boolean NOT NULL, "token_id" character varying, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5d193b927e6f4a45dc6148b52f" ON "order" ("token_id") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "type" text, "from" text, "to" text, "ethamount" numeric, "tokenamount" numeric, "time" numeric, "order_id" character varying, "token_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9011283056620f5eaa7ad74cef" ON "transaction" ("order_id") `)
        await db.query(`CREATE INDEX "IDX_3faa75753c6a7975c82ce5ebf1" ON "transaction" ("token_id") `)
        await db.query(`CREATE TABLE "member_balance" ("id" character varying NOT NULL, "balance_change" numeric, "is_credit" boolean, "source" text, "timestamp" numeric, "order_id" character varying, CONSTRAINT "PK_6b6a870d13e970440e06deafe53" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0828bd0d4ccd1088c9fd11123d" ON "member_balance" ("order_id") `)
        await db.query(`CREATE TABLE "member" ("id" character varying NOT NULL, "is_marketplace" boolean NOT NULL, "shop_creators" text array NOT NULL, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "token_balance" ADD CONSTRAINT "FK_5813c3040e74c285719679c6935" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_5d193b927e6f4a45dc6148b52fc" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_9011283056620f5eaa7ad74cef6" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_3faa75753c6a7975c82ce5ebf16" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "member_balance" ADD CONSTRAINT "FK_0828bd0d4ccd1088c9fd11123d2" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token_balance"`)
        await db.query(`DROP INDEX "public"."IDX_5813c3040e74c285719679c693"`)
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "order"`)
        await db.query(`DROP INDEX "public"."IDX_5d193b927e6f4a45dc6148b52f"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_9011283056620f5eaa7ad74cef"`)
        await db.query(`DROP INDEX "public"."IDX_3faa75753c6a7975c82ce5ebf1"`)
        await db.query(`DROP TABLE "member_balance"`)
        await db.query(`DROP INDEX "public"."IDX_0828bd0d4ccd1088c9fd11123d"`)
        await db.query(`DROP TABLE "member"`)
        await db.query(`ALTER TABLE "token_balance" DROP CONSTRAINT "FK_5813c3040e74c285719679c6935"`)
        await db.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_5d193b927e6f4a45dc6148b52fc"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_9011283056620f5eaa7ad74cef6"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3faa75753c6a7975c82ce5ebf16"`)
        await db.query(`ALTER TABLE "member_balance" DROP CONSTRAINT "FK_0828bd0d4ccd1088c9fd11123d2"`)
    }
}
