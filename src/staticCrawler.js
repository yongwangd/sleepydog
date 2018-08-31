const request = require('request-promise-native');
const Rx = require('rxjs/Rx');
const { cookieString } = require('./utils/cookieUtil');

const staticCrawler = (opts = {}) => {
  let config = {
    startFrom: '',
    noDuplicatedLink: true,
    noDuplicatedData: false,
    ...opts
  };

  let { domain, startFrom, cookie, cookiePath, noDuplicatedLink } = config;

  let requestOptions = opts.requestOptions || {
    headers: {}
  };
  requestOptions.headers.Cookie = cookie
    ? cookie
    : cookiePath ? cookieString(cookiePath) : null;

  let link$ = new Rx.BehaviorSubject({
    url: startFrom
  });
  if (noDuplicatedLink) link$ = link$.distinct(x => x.url);

  let pageSource$ = link$.flatMap(({ url, data }) =>
    request({
      url: url.includes('http') ? url : domain + url,
      ...requestOptions
    }).then(src => ({
      url,
      data,
      src
    }))
  );

  const queueLink = (url, data) => link$.next({ url, data });

  return {
    pageSource$,
    link$,
    queueLink
  };
};

module.exports = staticCrawler;
