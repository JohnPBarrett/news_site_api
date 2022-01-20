# news_site_api

### Link to hosted version

You can find the latest version of the api [here](https://nodejs-api-example-5959.herokuapp.com/)

## Description

This api's aim is to mimic some of the backend services of a real world news site providing a CRUD REST api to a postgresql database.

The entire api is written in JavaScript using node.js. 

## Install

    git clone https://github.com/Pikaca/news_site_api.git
    npm i 
  
## Setup 

To create the default databases run the following script: 

    npm run setup-dbs
   
## Run the app   

You need to create a `.env.development` file in the root directory of project. 

You then need to have the following line within the file: **PGDATABASE=nc_news**. Then you just need to run the following command: 

    npm run dev
    
This will populate the nc_news database and run the app. By default, this app runs on port 9090 but can be changed in `listen.js` 
    
## Run the tests 

To run the tests you will need to create a `.env.test` file in the root directory of project. 

You then need to have the following line within the file: **PGDATABASE=nc_news_test**. Afterwards, you need to run the following command: 

    npm run test
    
This will populate the test database before each test
