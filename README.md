# Serverless function to retrieve the organizational structure

Author: Birant Altinel

## Project Structure

- **docs/api.yaml**: The API documentation based on OpenAPI 3.0.0 specification.
- **src/ directory**: contains the entire source code
  - handler.ts: the main entry point of the application, validates the request and handles errors.
  - service.ts: implements the main domain functionalities.
  - repository/: implements the operations that access and query the database.
  - models/: contains the common types and interfaces used by the handler and service functions.
- **tests/ directory**: contains the unit tests
- **serverless.yml**: the configuration file used by the serverless framework
- **env.json**: Environment variables that are needed by the domain services during runtime.
- **tables.sql**: The SQL queries that initialize the database tables.
- **data.sql**: The SQL queries that insert the initial organizational structure to the tables.
- **tsconfig.json**: Options for the TypeScript compiler.
- **tslint.json**: Options for the TypeScript linter.
- **.nvmrc**: Specifies the NodeJS version that the project should be deployed with.

## How to Deploy & Run

Prerequisites:

- Use nvm to install the preset Node version
- Create and initialize a MySQL database using the queries in
`tables.sql` and `data.sql`. Save the DB credentials in `env.json`
- Obtain your AWS credentials and save them in the corresponding fields inside `serverless.yml`

### Run locally (without AWS)

Run the following commands from your terminal:

1. npm install -g serverless
2. npm install
3. serverless offline

The HTTP endpoint will be reachable at `http://localhost:3000/docebo/organizationalChart`

### Deploy to AWS lambda

1. npm install -g serverless
2. npm install
3. serverless config credentials --provider aws --key YOUR_AWS_KEY_ID --secret YOUR_AWS_SECRET_KEY
4. serverless deploy
