var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var dbName = 'mongo';
var connectDB = function (callback) {
    MongoClient.connect(url + dbName, function (err, client) {
        if (err)
            throw err;
        var db = client.db(dbName);
        callback(db);
        client.close();
    });
};
module.exports = connectDB;
