const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'mongo';

const connectDB = (callback: any) => {
    MongoClient.connect(url + dbName, (err: any, client: any) => {
        if(err) throw err;

        const db = client.db(dbName);
        callback(db);

        client.close();
    });
}

module.exports = connectDB;