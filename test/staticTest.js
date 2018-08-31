const {
	staticCrawler
} = require('../index');
const cheerio = require('cheerio');


let {
	pageSource$,
	addLink,
	addData,
	data$
} = staticCrawler({
	domain: 'https://movie.douban.com/top250'
});

pageSource$.subscribe(({
	url,
	src
}) => {
	console.log('url is ', url);
	let $ = cheerio.load(src);
	$('.item .title').toArray().map(a => $(a).text()).forEach(addData);
	$('.paginator a').toArray().map(a => $(a).attr('href')).map(addLink)
});

var count = 0;
data$.subscribe(d => {
	count++;
	console.log(d, count);
})

