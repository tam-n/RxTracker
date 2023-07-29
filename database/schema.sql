set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "listContent" (
	"listContentId" serial NOT NULL,
	"medicationId" TEXT NOT NULL,
	"genericName" TEXT NOT NULL,
	"dosage" TEXT NOT NULL,
	"route" TEXT NOT NULL,
	"frequency" TEXT NOT NULL,
	"listId" serial NOT NULL,
	CONSTRAINT "listContent_pk" PRIMARY KEY ("listContentId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "lists" (
	"listId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"userId" serial NOT NULL,
	CONSTRAINT "lists_pk" PRIMARY KEY ("listId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "listContent" ADD CONSTRAINT "listContent_fk0" FOREIGN KEY ("listId") REFERENCES "lists"("listId");

ALTER TABLE "lists" ADD CONSTRAINT "lists_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
