# Thingful Server

## Setting Up

- Install dependencies: `npm install`
- Create development database, test database, and database user.
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values.
- Bootstrap database: `npm run migrate`

## Sample Data

- To seed the database for development: `psql -U my_user -d my_database -a -f seeds/seed.thingful_tables.sql`
- To clear sample data: `psql -U my_user -d my_database -a -f seeds/trunc.thingful_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Start application for production: `npm start`
- Run tests in watch mode: `npm test`
