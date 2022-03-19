process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let CacheItem = require('../cache/models/cacheItem.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
describe('Cache', () => {

	describe('/GET /', () => {
		it('health check', (done) => {
			chai.request(server)
				.get('/')
				.end((err, res) => {
					res.should.have.status(200);
					res.text.should.be.eql('CacheAPI');
					done();
				});
		});
	});

	describe('/GET cacheItems', () => {
		it('retrieve all the cache items', (done) => {
			chai.request(server)
				.get('/cacheItems')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.gte(0);
					done();
				});
		});
	});

	describe('/GET cacheItem/key', () => {
		it('retrieve existing cache item or create one', (done) => {
			$key = "trykey";
			chai.request(server)
				.get('/cacheItem/' + $key)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('Object');
					res.body.should.have.property('key').eq($key);
					res.body.should.have.property('value');
					res.body.should.have.property('expiration');
					done();
				});
		});
	});

	describe('/DELETE /', () => {
		it('delete cache item by key', (done) => {
			$key = "trykey";
			chai.request(server)
				.delete('/cacheItem/' + $key)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});

});
