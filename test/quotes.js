const {
	staticCrawler
} = require('../index');
const cheerio = require('cheerio');


let {
	pageSource$,
	queueLink,
	link$
} = staticCrawler({
	domain: 'https://www.goodreads.com',
	startFrom: '/quotes'
});

pageSource$.subscribe(({
	src
}) => {
	let $ = cheerio.load(src);
	$('.quotes .quote .authorOrTitle').toArray().map(a => $(a).text()).forEach(console.log);
	// $('.paginator a').toArray().map(a => $(a).attr('href')).map(queueLink)

	// $('.previous_page').nextAll('a').toArray().map(a => $(a).attr('href')).forEach(addLink);
});


link$.subscribe(l => console.log(l, 'link'))
