# README.md

1. Clone this git
2. Make sure you've installed node
3. Make .env file with config like this :

- APP_NAME=SelfTry
- APP_PORT=3003
- NODE_ENV=development

- LOG_PATH=./src/log/error.log
- LOG_LEVEL=info
- DB_TYPE=mysql
- DB_HOST=root
- DB_PORT=3306
- DB_USERNAME=
- DB_PASSWORD=
- DB_NAME=

4. open cmd in the folder, then type:

- npm install to install the dependencies from package.json file
- npm run migrate to migrate the db
- npm run dev to run the application
- npm run test to run the test
- npm run coverage to run the jest --coverage
- npm run sonar to run with sonar
