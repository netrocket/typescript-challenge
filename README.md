# TypeScript Code Challenge

Welcome!

For this code challenge we would like you to write a simple NodeJS REST API project in TypeScript using the [express.js](https://expressjs.com/) framework, and then extend it with some functionalities below.

## Adding MongoDB

Write an API endpoint for saving a JSON object in MongoDB. Mongo DB should be running in a Docker Container.

- Input:
  - JSON Object
- Output:
  - 200 OK or error code

Write also an API endpoint for getting a list of all previously saved JSON objects filtered by some field’s value, in pages, N objects per page:

- Input:
  - field’s value
  - page number
- Output:
  - list of JSON objects (no more than N)

## Adding Tests

Write end-to-end test(s) for these 2 endpoints.

Tests should be rerunnable and independent of their execution order. Make sure you test the most tricky cases.


## How to deliver the results

Fork this repo and once you're done send us a link to a repo with your solution. The result should be your own repository on Github with instructions stored in the SOLUTION.md on how to run tests.
