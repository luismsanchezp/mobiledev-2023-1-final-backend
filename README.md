# PasantiasUAM Server

## Install libraries

`yarn install`

## Create .env file

`cp .env.example .env`

## Generate SECRET_KEY

`node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`

## Setting up database

### Create database

Open `mongosh`\
Create database `use pasantias_db`

### Create user

Create user `db.createUser( { user: "manager_pas", pwd: passwordPrompt(), roles: [ { role: "dbOwner", db: "pasantias_db" }] })`

### Finish .env configuration

Add `user` and `password` to the `.env` file

## Run project

`yarn dev`