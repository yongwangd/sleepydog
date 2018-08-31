const sh = require('shelljs');

const cookieString = path => sh.cat(path).split('\n').filter(a => a[0] != '#').map(c => c.split('\t')).map(a => a[5] + '=' + a[6]).join('; ');

const cookieArray = path => {
	console.log(sh.pwd())
	let cs = sh.cat(path).split('\n').filter(a => a[0] != '#').map(c => c.split('\t')).map(a => ({
		name: a[5],
		value: a[6]
	})).filter(a => a.name && !a.value.includes('&quot'));

	
	
	console.log(cs);
	return cs;
};

module.exports.cookieString = cookieString;
module.exports.cookieArray = cookieArray;