'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Rx = require('rxjs/Rx');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');

var _require = require('./utils/cookieUtil'),
    cookieArray = _require.cookieArray;

var liveCrawler = function liveCrawler() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = _extends({
    startFrom: '',
    noDuplicatedLink: true,
    noDuplicatedData: true
  }, opts);

  var domain = config.domain,
      startFrom = config.startFrom,
      pipe = config.pipe,
      cookiePath = config.cookiePath,
      noDuplicatedLink = config.noDuplicatedLink;


  var link$ = new Rx.BehaviorSubject({ url: startFrom });
  if (noDuplicatedLink) link$ = link$.distinct(function (x) {
    return x.url;
  });

  var driver = new webdriver.Builder().forBrowser('chrome');
  if (config.headless) {
    driver = driver.setChromeOptions(new chrome.Options().headless().windowSize({
      width: 1920,
      height: 1080
    }));
  }
  driver = driver.build();

  var pageSource$ = link$.flatMap(function (_ref) {
    var url = _ref.url,
        data = _ref.data;

    if (!url) {
      return Promise.resolve({
        url: url,
        src: null,
        data: data
      });
    }

    driver.navigate().to(url.includes('http') ? url : domain + url);
    if (cookiePath) {
      driver.manage().deleteAllCookies();
      cookieArray(cookiePath).forEach(function (cook) {
        return driver.manage().addCookie(cook);
      });
      driver.navigate().to(domain + url);
    }

    if (pipe) {
      pipe(driver, domain + url);
    }

    return driver.getPageSource().then(function (src) {
      return {
        url: url,
        data: data,
        src: src
      };
    });
  });

  var addLink = function addLink(url, data) {
    return link$.next({ url: url, data: data });
  };
  return {
    link$: link$,
    addLink: addLink,
    pageSource$: pageSource$
  };
};

module.exports = liveCrawler;