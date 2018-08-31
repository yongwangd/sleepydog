const { liveCrawler } = require('../index');
import cheerio from 'cheerio';
// import R from 'ramda';


let {
	pageSource$,
	addLink,
	addData,
	data$
} = liveCrawler({
	domain: 'http://weibo.com/1921541980/follow',
	// headless: true,
	cookiePath: './test/cookies.txt',
	pipes: [{
		predicate: () => true,
		fn: chm => {
			console.log('get in fn');
			// chm.wait(until.elementIsVisible(By.id('Pl_Official_Headerv6__1'), 6000))
			return chm;
		}
	}, {
		predicate: url => url.indexOf('zhihu') >= 0,
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

	$('.member_li .S_txt1').toArray().map(a => $(a).text()).map(addData)
	// let next = $('button.PaginationButton-next')
	// if (next) {
	// 	var newUrl = url.includes('page') ? R.init(url) + (parseInt(R.last(url)) + 1) : url + '?page=2';
	// 	console.log('new url', newUrl);
	// 	addLink(newUrl)
	// }
});

data$.subscribe(d => console.log(d + '  from log'))