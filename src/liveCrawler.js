const Rx = require('rxjs/Rx');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { cookieArray } = require('./utils/cookieUtil');

const liveCrawler = (opts = {}) => {
  let config = {
    startFrom: '',
    noDuplicatedLink: true,
    noDuplicatedData: true,
    ...opts
  };

  let { domain, startFrom, pipe, cookiePath, noDuplicatedLink } = config;

  let link$ = new Rx.BehaviorSubject({ url: startFrom });
  if (noDuplicatedLink) link$ = link$.distinct(x => x.url);

  var driver = new webdriver.Builder().forBrowser('chrome');
  if (config.headless) {
    driver = driver.setChromeOptions(
      new chrome.Options().headless().windowSize({
        width: 1920,
        height: 1080
      })
    );
  }
  driver = driver.build();

  const pageSource$ = link$.flatMap(({ url, data }) => {
    if (!url) {
      return Promise.resolve({
        url,
        src: null,
        data
      });
    }

    driver.navigate().to(url.includes('http') ? url : domain + url);
    if (cookiePath) {
      driver.manage().deleteAllCookies();
      cookieArray(cookiePath).forEach(cook => driver.manage().addCookie(cook));
      driver.navigate().to(domain + url);
    }

    if (pipe) {
      pipe(driver, domain + url);
    }

    return driver.getPageSource().then(src => ({
      url,
      data,
      src
    }));
  });

  const addLink = (url, data) => link$.next({ url, data });
  return {
    link$,
    addLink,
    pageSource$
  };
};

module.exports = liveCrawler;
