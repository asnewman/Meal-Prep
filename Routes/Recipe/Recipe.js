var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Rcp';

router.get('/', function(req, res) {
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

router.post('/', function(req, res) {
	var vld = validator;

	async.waterfall([
	function(cb) {
		if(vld.check(req.session), Tags.noPermission, null, cb &&
		 vld.hasFields(req.body, ["recipeId, date"], cb)) {
			req.cnn.Rcp.insertOne({recipeId: req.body.recipeId, 
			 date: req.body.date, ownerId: req.session.id});
		}
	}],
	function(cb) {
		res.status(200).end();
	});
});

router.delete('/:id', function(req, res) {
	var vld = validator;

	async.waterfall([
	function(cb) {
		if (vld.check(req.session), Tags.noPermission, null, cb) {
			req.cnn.Rcp.find({id: req.params.id});
		}
	},
	function(response, cb) {
		if (vld.check(response.id === req.session.id), 
		 Tags.noPermission, null, cb) {
			req.cnn.Rcp.deleteMany({id: req.params.id});
		}
	}],
	function(cb) {
		res.status(200).end();
	});
});




















