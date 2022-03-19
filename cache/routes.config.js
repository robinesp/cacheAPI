const CacheController = require('./controllers/cache.controller');

exports.routesConfig = function (app) {
	app.get('/', (req, res) => {
		res.send('CacheAPI')
	});

	app.get('/cacheItem/:key', [
		CacheController.get
	]);

	app.post('/cacheItem', [
		CacheController.insert
	]);

    app.get('/cacheItems', [
	    CacheController.list
    ]);

	app.delete('/cacheItem/:key', [
		CacheController.deleteByKey
	]);

	app.delete('/cacheItems', [
		CacheController.deleteAll
	]);
};
