const CacheItemModel = require('../models/cacheItem.model');
const config = require('../../common/config/env.config');
const {getExpirationDate} = require("../util");

const TTL_DAYS = config.ttl_days;

exports.get = (req, res) => {
	CacheItemModel.getItem(req.params.key)
		.then((result) => {
			res.status(201).send(result);
		})
};

exports.list = (req, res) => {
	CacheItemModel.listAll()
		.then((result) => {
			res.status(200).send(result);
		})
};

exports.insert = (req, res) => {
	req.body.expiration = getExpirationDate();

	CacheItemModel.createItem(req.body)
		.then((result) => {
			res.status(201).send(result);
		});
};

exports.deleteByKey = (req, res) => {
	CacheItemModel.removeByKey(req.params.key)
		.then((result) => {
			res.status(204).send(result);
		});
};

exports.deleteAll = (req, res) => {
	CacheItemModel.removeAll()
		.then((result) => {
			res.status(204).send(result);
		});
};
