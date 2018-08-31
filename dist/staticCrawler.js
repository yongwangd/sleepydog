'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var request = require('request-promise-native');
var Rx = require('rxjs/Rx');

var _require = require('./utils/cookieUtil'),
    cookieString = _require.cookieString;

var staticCrawler = function staticCrawler() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = _extends({
    startFrom: '',
    noDuplicatedLink: true,
    noDuplicatedData: false
  }, opts);

  var domain = config.domain,
      startFrom = config.startFrom,
      cookie = config.cookie,
      cookiePath = config.cookiePath,
      noDuplicatedLink = config.noDuplicatedLink;


  var requestOptions = opts.requestOptions || {
    headers: {}
  };
  requestOptions.headers.Cookie = cookie ? cookie : cookiePath ? cookieString(cookiePath) : null;

  var link$ = new Rx.BehaviorSubject({
    url: startFrom
  });
  if (noDuplicatedLink) link$ = link$.distinct(function (x) {
    return x.url;
  });

  var pageSource$ = link$.flatMap(function (_ref) {
    var url = _ref.url,
        data = _ref.data;
    return request(_extends({
      url: url.includes('http') ? url : domain + url
    }, requestOptions)).then(function (src) {
      return {
        url: url,
        data: data,
        src: src
      };
    });
  });

  var queueLink = function queueLink(url, data) {
    return link$.next({ url: url, data: data });
  };

  return {
    pageSource$: pageSource$,
    link$: link$,
    queueLink: queueLink
  };
};

module.exports = staticCrawler;