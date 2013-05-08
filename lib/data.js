var redis = require('redis');
var _ = require('underscore');
var client = redis.createClient();

function getTopWords(opts, cb) {
  if (!cb && typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (!opts) {
    opts = {};
  }

  opts = _.defaults(opts, {type: 'weight', filter: null});

  // find the key
  var key = null;
  if (!opts.filter || opts.filter === 'All Languages') {
    key = opts.type;
  } else {
    key = opts.filter;
    if (opts.type === 'count') {
      key += '_count';
    }
  }

  console.log(key);
  client.hgetall(key, function(err, res) {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      var invert = {};
      _.each(res, function(val, key) {
        if (!invert[val]) {
          invert[val] = [];
        }
        invert[val].push(key);
      });
      var vec = Object.keys(invert);
      // get the last 5 values
      var out = [];
      var counter = 0;
      for (var i = vec.length - 1; counter < 5; i--) {
        var terms = invert[vec[i]];
        for (var j = 0; j < terms.length; j++) {
          if (terms[j] === '') {
            continue;
          }
          out.push({word: terms[j], count: vec[i]});
          counter++;
          if (counter >= 5) {
            break;
          }
        }
      }
      cb(null, {list: out});
    }
  });
}
module.exports.getTopWords = getTopWords;

function getLang(cb) {
  client.keys('*', function(err, res) {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      var out = {};
      _.each(res, function(l) {
        l = l.replace('_count', '');
        if (!(l === 'count' || l === 'weight')) {
          out[l] = true;
        }
      });
      var lang = Object.keys(out).sort();
      lang.unshift('All Languages');
      cb(null, {lang: lang});
    }
  });
}
module.exports.getLang = getLang;

function getSuggestion(opts, cb) {
  opts = _.defaults(opts, {type: 'weight', filter: null, input: []});

  // find the key
  var key = null;
  if (!opts.filter) {
    key = opts.type;
  } else {
    key = opts.filter;
    if (opts.type === 'count') {
      key += '_count';
    }
  }

  if (opts.input.length > 0) {
    client.hgetall(key, function(err, res) {
      if (err) {
        console.log(err);
        cb(err);
      } else {
        var out = [];
        _.each(opts.input, function(word) {
          var count = res[word];
          if (!count) {
            count = 0;
          }
          out.push({word: word, val: count, res: 'success'});
        });
        cb(null, {output: out});
      }
    });
  } else {
    cb(null, {output: []});
  }

}
module.exports.getSuggestion = getSuggestion;

