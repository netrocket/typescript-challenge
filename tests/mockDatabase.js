const connectDB = require('../src/connectDB');

exports.populateDatabase = () => {
    let promise = new Promise((resolve, reject) => {
        connectDB((db) => {
            // Get the documents collection
            const collection = db.collection('users');
            // Insert a heap of users for testing
            collection.insertMany([
                { name: 'Johnny', age: 6 },
                { name: 'Alan', age: 32 },
                { name: 'Bob', age: 32 },
                { name: 'Michael', age: 26 },
                { name: 'Irene', age: 56 },
                { name: 'Shaun', age: 16 },
                { name: 'Frank', age: 46 },
                { name: 'Riley', age: 2 },
                { name: 'Susan', age: 43 },
                { name: 'Maddy', age: 6 },
                { name: 'Flo', age: 76 },
                { name: 'Barb', age: 86 },
                { name: 'Florence', age: 56 },
                { name: 'Alan', age: 46 },
                { name: 'Allan', age: 43 },
                { name: 'John', age: 47 }
            ]);
            resolve();
        });
    });
    return promise;
}

exports.destroyDatabase = () => {
    let promise = new Promise((resolve, reject) => {
        connectDB((db) => {
            // Get the documents collection
            const collection = db.collection('users');
            // destroy database
            collection.deleteMany({});
            resolve();
        });
    });
    return promise;
}