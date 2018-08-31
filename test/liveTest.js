const { liveCrawler } = require('../index');
const cheerio = require('cheerio');
const R = require('ramda');

let { pageSource$, addLink, addData, data$ } = liveCrawler({
  domain: 'https://www.zhihu.com',
  // headless: true,
  startFrom: '/people/wang-sneaky/following',
  cookiePath: 'cookies.txt',
  pipes: [
    {
      predicate: () => true,
      fn: chm => {
        console.log('get in fn');
        // chm.wait(until.elementIsVisible(By.id('Pl_Official_Headerv6__1'), 6000))
        return chm;
      }
    },
    {
      predicate: url => url.indexOf('zhihu') >= 0,
      fn: chm => {
        console.log('another predicate');
        return chm;
      }
    }
  ]
});

pageSource$.subscribe(({ url, src }) => {
  console.log(src, 'src--------------');
  let $ = cheerio.load(src);
  console.log('url is ', url);
  // console.log(src);

  $('.UserLink-link')
    .toArray()
    .map(a => $(a).text())
    .map(addData);
  let next = $('button.PaginationButton-next');
  if (next) {
    var newUrl = url.includes('page')
      ? R.init(url) + (parseInt(R.last(url)) + 1)
      : url + '?page=2';
    console.log('new url', newUrl);
    addLink(newUrl);
  }
});

// console.log(data$);
// console.log(liveCrawler);

// data$.subscribe(d => console.log(d + '  from log'));
