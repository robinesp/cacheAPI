const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;const config = require('../../common/config/env.config');
const {
	getRandomString,
	getExpirationDate,
} = require("../util");

const MAX_ITEMS = parseInt(config.max_items);

const cacheItemSchema = new Schema({
	key: { type: String, unique: true },
	value: String,
	expiration: Date,
});

const CacheItem = mongoose.model('CacheItems', cacheItemSchema);

const findByKey = (key) => {
	return CacheItem.findOne({key: key});
};

// if the max amount of entries has been reached the one with the oldest expiration date gets deleted
function makeSpaceIfNeeded() {
	CacheItem.countDocuments({}, function (err, count) {
		if (count >= MAX_ITEMS) {
			CacheItem.findOneAndDelete({}, {sort: {expiration: 1}}).exec();
		}
	});
}

exports.createItem = (cacheItemData) => {
	return new Promise((resolve, reject) => {
		CacheItem.findOne({key: req.params.key})
			.exec(function (err, cacheItem) {
				if (err) {
					reject(err);
				} else if (cacheItem) {
					// if existing update the current record
					cacheItem.value = cacheItemData.value;
					cacheItem.expiration = cacheItemData.expiration;
					resolve(cacheItem.save());
				} else {
					// otherwise create a new one
					makeSpaceIfNeeded();
					const newItem = new CacheItem(cacheItemData);
					resolve(newItem.save());
				}
			});
	});
};

exports.getItem = (key) => {
	return new Promise((resolve, reject) => {
		CacheItem.
			findOne({
				key: key,
			})
			.exec(function (err, cacheItem){
				if (err) {
					reject(err);
				} else if (cacheItem) {
					console.log("Cache hit");

					// check if TTL for cache item is passed
					if (new Date(cacheItem.expiration) < new Date()) {
						console.log("Cache value expired -> regenerating value");
						cacheItem.value = getRandomString();
					}

					// reset expiration date
					cacheItem.expiration = getExpirationDate();
					resolve(cacheItem.save());
				} else {
					console.log("Cache miss");

					// create new entry if missing
					makeSpaceIfNeeded();
					const newItem = new CacheItem({
						key: key,
						value: getRandomString(),
						expiration: getExpirationDate(),
					});
					resolve(newItem.save());
				}
			});
	});
};

exports.listAll = () => {
	return new Promise((resolve, reject) => {
		CacheItem.find()
			.exec(function (err, items) {
				if (err) {
					reject(err);
				} else {
					resolve(items);
				}
			})
	});
};

exports.removeByKey = (key) => {
	return new Promise((resolve, reject) => {
		CacheItem.deleteOne({key: key}, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(err);
			}
		});
	});
};

exports.removeAll = () => {
	return new Promise((resolve, reject) => {
		CacheItem.deleteMany({}, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(err);
			}
		});
	});
};
