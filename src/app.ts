console.log('App running...');

import User from './classes/User';
const connectDB = require('./connectDB');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pageQuantity = 5;


// Middleware
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const createUser = (req: any, serverResponse: any) => {
    const {name, age} = req.body;
    if (!name || !age) return serverResponse.status(400).send('Name and Age are both required fields');
    const parsedAge = parseInt(age);
    if (!parsedAge) return serverResponse.status(400).send('Age must be a number');
    // NOTE: more complex validation needs to be done here in a production environment.
    // I would use a library like Joi to set up more specific validation and error messaging

    // Connect to the db
    connectDB((db: any) => {
        // Get the documents collection
        const collection = db.collection('users');
        // Insert user
        collection.insertOne({name: name, age: parsedAge}, (err: any, res: any) => {
            if (err) throw err;
            // response is array of created documents so get the first and return it
            serverResponse.send(res.ops[0]);
        });
    }); 
}

const findUsers = (req: any, res: any) => {
    // Get page number
    const pageNumber = req.query.page;
    if (!pageNumber) return res.status(400).send('Page number is required');

    // Connect to the db
    connectDB((db: any) => {
        // Get users
        const collection = db.collection('users');
        let filter = {};
        if (req.query.age) filter = { age: parseInt(req.query.age) };
        // ideally it would be more efficient to query the database for only the results required
        // rather than filter in code, but I ran out of time to research how to do it with MondoDB
        collection.find(filter).toArray((err: any, docs: any) => {
            if (err) throw err;
            // calculate slice from pageNumber and configured pageQuantity
            const startPos = (pageNumber - 1) * pageQuantity;
            const endPos = pageNumber * pageQuantity;
            const pagedDocs = docs.slice(startPos, endPos);
            if (pagedDocs.length < 1) return res.status(404).send('No users were found');
            res.send(JSON.stringify(parseUsers(pagedDocs)));
        });
    });  
}

// in this scenario it is not really necessary to construct User objects, but this is an example
// in case there is further processing required e.g. Users are attached to another object as a property
const parseUsers = (users: any) => {
    let parsedUsers: User[] = [];
    users.forEach((user: any) => parsedUsers.push(new User(user._id, user.name, user.age)));
    return parsedUsers;
}

const deleteAllUsers = (req: any, res: any) => {
    connectDB((db: any) => {
        const collection = db.collection('users');
        collection.remove({});
        res.send("All documents deleted");
    });
}

app.post('/users', (req: any, res: any) => createUser(req, res));
app.get('/users', (req: any, res: any) => findUsers(req, res));
app.delete('/users', (req: any, res: any) => deleteAllUsers(req, res));

module.exports = app;