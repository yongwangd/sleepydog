const request = require('request-promise-native');

const letters = 'abcdefghijklmnopqrstuvwxyz';

const arr = letters.split('');

var name = 'abc';

var list = [];

arr.forEach(a => {
  arr.forEach(b => {
    arr.forEach(c => {
      var name = a + b + c;
      list = [...list, name];
    });
  });
});
console.log('list', list);

request('https://api.github.com/users/abc', {
  headers: {
    'User-Agent': 'request'
  }
}).then(res => {
  var json = JSON.parse(res);
  if (json.login) {
    console.log(json.login);
  } else {
    console.log(name, 'used');
  }
});
