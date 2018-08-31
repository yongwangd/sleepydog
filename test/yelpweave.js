const { liveCrawler } = require('../index');
const cheerio = require('cheerio');
const R = require('ramda');

let {
	pageSource$,
	addLink,
	addData,
	data$
} = liveCrawler({
	domain: 'https://www.yelp.com',
	// headless: true,
	startFrom: '/search?find_desc=braiding&find_loc=NC',
	pipes: [{
		predicate: () => true,
		fn: chm => {
			chm.sleep(1000);
			return chm;
		}
	}]
});


pageSource$.subscribe(({ url, src }) => {

	let $ = cheerio.load(src);

	const divs = $('.regular-search-result .search-result')
		.toArray()
		.map(d => {
			const div = $(d);
			const id = div.attr('data-biz-id');
			const name = div.find('.biz-name span').text();
			let address = div.find('address').text()
			address = address.trim().replace(/(\r\n|\n|\r)/gm, "");

			const phone = div.find('.biz-phone').text();
			addData(id + ',' + name + ',' + address + ',' + (phone || '').trim());

		});

	const nextLink = $('.pagination-links a.next').attr('href');
	addLink(nextLink);





	// console.log(src);

	// $('.UserLink-link').toArray().map(a => $(a).text()).map(addData)
	// let next = $('button.PaginationButton-next')
	// if (next) {
	// 	var newUrl = url.includes('page') ? R.init(url) + (parseInt(R.last(url)) + 1) : url + '?page=2';
	// 	console.log('new url', newUrl);
	// 	addLink(newUrl)
	// }
});

data$.subscribe(d => console.log(d))