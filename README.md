# news_site_api

### Link to hosted version

You can find the latest version of the api [here](https://nodejs-api-example-5959.herokuapp.com/api)

## Description

This api's aim is to mimic some of the backend services of a real world news site providing a CRUD REST api to a postgresql database. 

Currently, it responds to the client requests for articles, comments, users & topics. It responds solely in a JSON format.

It can also receive requests from the client providing that the client send the correct request body. Details on each endpoint can be found [here](https://nodejs-api-example-5959.herokuapp.com/api)

The entire api is written in JavaScript using node.js & express. 

## Dependencies 

### Prerequisites

* node 17.x
* npm 8.x

### Dependencies

* bcrypt 5.x
* cors 2.8
* dotenv 14.x
* express 4.x
* jsonwebtoken 4.x
* pg 8.x
* pg-format 1.x

### Dev Dependencies

* nodemon 2.x
* jest 27.x
* jest-sorted 1.x
* supertest 6.x

## Cloning

    git clone https://github.com/Pikaca/news_site_api.git
    cd new_site_api
    npm i 
  
## Setup 

To create the default databases run the following script: 

    npm run setup-dbs
    
This will create the databases in the ./db/setup.sql file
   
## Run the app   

You need to create a `.env.development` file in the root directory of project. 

You then need to have the following line within the file: **PGDATABASE=<database_name_here>**. Afterwards, run the following command: 

    npm run dev
    
This will populate the database and run the app. By default, this app runs on port 9090 but can be changed in `listen.js` 

If, however, you only want to populate the databases without running the app then use the following command:

    npm run seed
    
## Run the tests 

To run the tests you will need to create a `.env.test` file in the root directory of project. 

You then need to have the following line within the file: **PGDATABASE=<database_name_here>**. Afterwards, you need to run the following command: 

    npm run test
    
This will also populate the test database before each test

---
