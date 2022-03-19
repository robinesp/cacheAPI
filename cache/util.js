const config = require('../common/config/env.config');

const TTL_DAYS = config.ttl_days;

exports.getRandomString = () => (Math.random() + 1).toString(36).substring(7);

exports.getExpirationDate = () => {
	var date = new Date();
	date.setDate(date.getDate() + TTL_DAYS);
	return date.toISOString();
}
