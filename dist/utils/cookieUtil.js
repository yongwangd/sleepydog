'use strict';

var sh = require('shelljs');

var cookieString = function cookieString(path) {
	return sh.cat(path).split('\n').filter(function (a) {
		return a[0] != '#';
	}).map(function (c) {
		return c.split('\t');
	}).map(function (a) {
		return a[5] + '=' + a[6];
	}).join('; ');
};

var cookieArray = function cookieArray(path) {
	console.log(sh.pwd());
	var cs = sh.cat(path).split('\n').filter(function (a) {
		return a[0] != '#';
	}).map(function (c) {
		return c.split('\t');
	}).map(function (a) {
		return {
			name: a[5],
			value: a[6]
		};
	}).filter(function (a) {
		return a.name && !a.value.includes('&quot');
	});

	console.log(cs);
	return cs;
};

module.exports.cookieString = cookieString;
module.exports.cookieArray = cookieArray;