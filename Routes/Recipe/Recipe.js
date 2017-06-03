var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Rcp';

router.get('/', function(res, req) {
	var vld = req.validator;

	async.waterfall([
	function(cb) {
		if(vld.check(req.session), Tags.noPermission, null, cb) {
			req.cnn.Rcp.find();
		}
	},
	function(rcps, cb) {
		res.status(200).json(rcps);
		cb();
	}],
	function(cb) {
		// maybe need to release?
	});
});