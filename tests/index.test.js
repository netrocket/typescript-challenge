const app = require('../src/app');
const request = require('supertest');
const { populateDatabase, destroyDatabase } = require('./mockDatabase');

beforeEach(() => {
    return populateDatabase();
});

afterEach(() => {
    return destroyDatabase();
});

describe('Test the GET users path', () => {
    test('It should return a 400 without a page query', (done) => {
        request(app).get('/users').then((response) => {
            expect(response.statusCode).toBe(400);
            done();
        })
    });

    test('It should return a 200 with a page query', (done) => {
        request(app).get('/users?page=1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('It should return 5 results for the first page', (done) => {
        request(app).get('/users?page=1').then((response) => {
            let result = JSON.parse(response.text);
            expect(result.length).toBe(5);
            done();
        });
    });

    test('It should not return 5 results for the fourth page', (done) => {
        request(app).get('/users?page=4').then((response) => {
            let result = JSON.parse(response.text);
            expect(result.length).not.toBe(5);
            done();
        });
    });

    test('It should return 1 result for the fourth page', (done) => {
        request(app).get('/users?page=4').then((response) => {
            let result = JSON.parse(response.text);
            expect(result.length).toBe(1);
            done();
        });
    });

    test('It should return 0 results for users aged 33', (done) => {
        request(app).get('/users?page=1&age=33').then((response) => {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    test('It should return 2 results for users aged 32', (done) => {
        request(app).get('/users?page=1&age=32').then((response) => {
            let result = JSON.parse(response.text);
            expect(result.length).toBe(2);
            done();
        });
    });

    test('It should return 0 results for users aged 32 on the second page', (done) => {
        request(app).get('/users?page=2&age=32').then((response) => {
            expect(response.statusCode).toBe(404);
            done();
        });
    });
});

describe('Test the POST users path', () => {
    test('It should return a 200 after creating a new user', (done) => {
        request(app).post('/users').send({name: 'test123', age: 1}).then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        })
    });
    test('It should return a 400 if name is not sent', (done) => {
        request(app).post('/users').send({age: 1}).then((response) => {
            expect(response.statusCode).toBe(400);
            done();
        })
    });
    test('It should return a 400 if age is not sent', (done) => {
        request(app).post('/users').send({name: 'test1'}).then((response) => {
            expect(response.statusCode).toBe(400);
            done();
        })
    });
    test('It should return a 400 if age is not a number', (done) => {
        request(app).post('/users').send({name: 'test123', age: 'ten'}).then((response) => {
            expect(response.statusCode).toBe(400);
            done();
        })
    });
});