
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
  "google_address_id" VARCHAR (200),
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
  "total_repair_cost" DECIMAL (15,2),
  "total_upfront_cost" DECIMAL (15,2),
  "monthly_holding_cost" DECIMAL (15,2),
  "total_holding_cost" DECIMAL (15,2),
  "total_cost" DECIMAL (15,2),
  "profit" DECIMAL (15,2),
  "monthly_profit" DECIMAL (15,2),
  "is_archived" BOOLEAN DEFAULT FALSE
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

CREATE TABLE "default_mortgage_calculations" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties" ON DELETE CASCADE,
	"interest_rate" DECIMAL (15,3),
	"interest_rate_inserted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"interest_rate_updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"loan_term" INT DEFAULT 30,
	"down_payment_percentage" DECIMAL (15,3) DEFAULT 0.2,
	"closing_costs_percentage" DECIMAL (15,3) DEFAULT 0.03,
	"base_loan_amount" DECIMAL (15,2),
	"interest_rate_annual" DECIMAL (15,3)
);

CREATE TABLE "mortgage_calculations" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties" ON DELETE CASCADE,
	"interest_rate" DECIMAL (15,3),
	"interest_rate_inserted_at" DATE DEFAULT CURRENT_DATE,
	"interest_rate_updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"loan_term" INT DEFAULT 30,
	"down_payment" DECIMAL (15,2),
	"down_payment_percentage" DECIMAL (15,3) DEFAULT 0.2,
	"base_loan_amount" DECIMAL (15,2),
	"closing_costs" DECIMAL (15,2),
	"closing_costs_percentage" DECIMAL (15,3) DEFAULT 0.03,
	"interest_rate_annual" DECIMAL (15,3),
	"interest_rate_monthly" DECIMAL (15,3),
	"interest_decimal_monthly" DECIMAL (15,4),
	"interest_payment_monthly" DECIMAL (15,2)
);