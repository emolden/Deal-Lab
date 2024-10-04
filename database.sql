
--Database Name: deal_lab_proto

--------- DROP tables -----------------------------------------

DROP TABLE IF EXISTS "repair_items";
DROP TABLE IF EXISTS "holding_items";
DROP TABLE IF EXISTS "default_repairs";
DROP TABLE IF EXISTS "default_holdings";
DROP TABLE IF EXISTS "properties";
DROP TABLE IF EXISTS "property_api_data";
DROP TABLE IF EXISTS "user";

---------CREATE tables --------------------------------------

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR (80) UNIQUE NOT NULL,
  "password" VARCHAR (1000) NOT NULL,
  "holding_period_default" INT DEFAULT 6
);

CREATE TABLE "property_api_data" (
  "id" SERIAL PRIMARY KEY,
  "address" VARCHAR (1000) NOT NULL,
  "inserted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "purchase_price" DECIMAL (15,2),
  "taxes_yearly" DECIMAL (15,2),
  "after_repair_value" DECIMAL (15,2),
  "property_type" VARCHAR (1000),
  "bedrooms" INT,
  "bathrooms" DECIMAL (15,2),
  "square_footage" DECIMAL (15,2)
);

CREATE TABLE "properties" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "user" NOT NULL,
  "property_api_id" INT REFERENCES "property_api_data" NOT NULL,
  "address" VARCHAR (1000) NOT NULL,
  "inserted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "purchase_price" DECIMAL (15,2),
  "holding_period" INT DEFAULT 6,
  "taxes_yearly" DECIMAL (15,2),
  "after_repair_value" DECIMAL (15,2),
  "is_selected" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "default_holdings" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" NOT NULL,
	"holding_name" VARCHAR (1000),
	"holding_cost" DECIMAL
);

CREATE TABLE "default_repairs" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" NOT NULL,
	"repair_name" VARCHAR (1000),
	"repair_cost" DECIMAL
);

CREATE TABLE "holding_items" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties" ON DELETE CASCADE,
	"name" VARCHAR (1000),
	"cost" DECIMAL
);

CREATE TABLE "repair_items" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties" ON DELETE CASCADE,
	"name" VARCHAR (1000),
	"cost" DECIMAL
);