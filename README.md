# Thingful Server

## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb thingful`, `createdb thingful-test`
- Create database user: `createuser thingful`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE thingful TO thingful`
  - `GRANT ALL PRIVILEGES ON DATABASE thingful-test TO thingful`
- Prepare environment file: `cp example.env .env`
  - Replace values in `.env` with your custom values if necessary.
- Bootstrap development database: `MIGRATION_DB_NAME=my_dev_db npm run migrate`
- Bootstrap test database: `MIGRATION_DB_NAME=my_test_db npm run migrate`

## Sample Data

- To seed the database for development: `psql -U my_user -d my_database -a -f seeds/seed.thingful_tables.sql`
- To clear seed data: `psql -U my_user -d my_database -a -f seeds/trunc.thingful_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`
