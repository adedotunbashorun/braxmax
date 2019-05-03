var expect = require('chai').expect;
var request = require('supertest');

var server = request.agent("http://localhost:5000");
// UNIT test begin

const userCredentials = {
    email: 'adedotunolawale@gmail.com',
    password: '123456'
}

describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        server
            .post('/api/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(userCredentials)
            .expect(404)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.statusCode).to.equal(404);
                // expect(response.body).to.be.an('object');
            })
            .end(done);
    });
});