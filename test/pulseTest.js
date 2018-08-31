const { liveCrawler } = require('../index');
import cheerio from 'cheerio';
// import R from 'ramda';
const { By } = require('selenium-webdriver');


let {
	pageSource$,
	addLink,
	addData,
	data$
} = liveCrawler({
	domain: 'https://awapgdvpriapp01:8443/pulseui',
	// headless: true,
	startFrom: '/#/session-landing',
	cookiePath: './test/pulseCookies.txt',
	pipes: [{
		predicate: () => true,
		fn: driver => {
			console.log('get in fn');
			// driver.findElement(By.id('j_username')).sendKeys('389816');
			// driver.findElement(By.id('j_password')).sendKeys('Quick123');
			// driver.findElement(By.id('loginButton')).click();
			// driver.wait(until.elementIsVisible(By.id('Pl_Official_Headerv6__1'), 6000))
			return driver;
		}
	}, {
		predicate: url => url.indexOf('sites') >= 0,
		fn: chm => {
			console.log('another predicate');
			return chm
		}
	}]
});


pageSource$.subscribe(({ url, src }) => {

	let $ = cheerio.load(src);
	console.log('url is ', url)
	console.log(src);

	$('td.td-store span').toArray().map(a => $(a).text()).map(addData);

	// $('.member_li .S_txt1').toArray().map(a => $(a).text()).map(addData)
	// let next = $('button.PaginationButton-next')
	// if (next) {
	// 	var newUrl = url.includes('page') ? R.init(url) + (parseInt(R.last(url)) + 1) : url + '?page=2';
	// 	console.log('new url', newUrl);
	// 	addLink(newUrl)
	// }
	addLink('/#/sites');
});

data$.subscribe(d => console.log(d + '  from log'))
