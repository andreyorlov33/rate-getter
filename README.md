## Rate Getter App

Full-stack application displaying real time borrow rate for DAI on the Compound Finance and AAVE Protocols.


Server :
    Server leverages Redis to store rates for each of the protocols at 30 second intervals, pushing and popping off of the que (max length 60) to ensure that 30 minutes of data is stored at a time. 

Client:
    Polls for data every second, and only updating the UI chart if the data for the exchange rate is updated or if 30 second window has passed. 

## Set Up

A NodeJS / Express / React boilerplate is already created for you in this repo.

To get started running it:

1. Run `yarn install` to install dependencies
2. Install docker if you don't have it already, and start the containers with `docker compose up -d`
3. In terminal #1, run `npm run build:watch` to generate webpack bundle
4. In terminal #2, run `make serve` to start the express server, which is available at `localhost:3001`.

The following ports are mapped for you for development/debugging purposes:

* Node debugger: Port 9230
* Redis: Port 6377
* Postgres
  * Port: 5430
  * Username: pguser
  * Password: password
  * Database: app

<br>