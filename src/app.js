"use strict";
exports.__esModule = true;
console.log('App running...');
var User_1 = require("./classes/User");
var connectDB = require('./connectDB');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pageQuantity = 5;
// Middleware
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var createUser = function (req, serverResponse) {
    var _a = req.body, name = _a.name, age = _a.age;
    if (!name || !age)
        return serverResponse.status(400).send('Name and Age are both required fields');
    var parsedAge = parseInt(age);
    if (!parsedAge)
        return serverResponse.status(400).send('Age must be a number');
    // NOTE: more complex validation needs to be done here in a production environment.
    // I would use a library like Joi to set up more specific validation and error messaging
    // Connect to the db
    connectDB(function (db) {
        // Get the documents collection
        var collection = db.collection('users');
        // Insert user
        collection.insertOne({ name: name, age: parsedAge }, function (err, res) {
            if (err)
                throw err;
            // response is array of created documents so get the first and return it
            serverResponse.send(res.ops[0]);
        });
    });
};
var findUsers = function (req, res) {
    // Get page number
    var pageNumber = req.query.page;
    if (!pageNumber)
        return res.status(400).send('Page number is required');
    // Connect to the db
    connectDB(function (db) {
        // Get users
        var collection = db.collection('users');
        var filter = {};
        if (req.query.age)
            filter = { age: parseInt(req.query.age) };
        // ideally it would be more efficient to query the database for only the results required
        // rather than filter in code, but I ran out of time to research how to do it with MondoDB
        collection.find(filter).toArray(function (err, docs) {
            if (err)
                throw err;
            // calculate slice from pageNumber and configured pageQuantity
            var startPos = (pageNumber - 1) * pageQuantity;
            var endPos = pageNumber * pageQuantity;
            var pagedDocs = docs.slice(startPos, endPos);
            if (pagedDocs.length < 1)
                return res.status(404).send('No users were found');
            res.send(JSON.stringify(parseUsers(pagedDocs)));
        });
    });
};
// in this scenario it is not really necessary to construct User objects, but this is an example
// in case there is further processing required e.g. Users are attached to another object as a property
var parseUsers = function (users) {
    var parsedUsers = [];
    users.forEach(function (user) { return parsedUsers.push(new User_1["default"](user._id, user.name, user.age)); });
    return parsedUsers;
};
var deleteAllUsers = function (req, res) {
    connectDB(function (db) {
        var collection = db.collection('users');
        collection.remove({});
        res.send("All documents deleted");
    });
};
app.post('/users', function (req, res) { return createUser(req, res); });
app.get('/users', function (req, res) { return findUsers(req, res); });
app["delete"]('/users', function (req, res) { return deleteAllUsers(req, res); });
module.exports = app;
