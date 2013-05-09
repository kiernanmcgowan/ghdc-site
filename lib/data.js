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

  opts = _.defaults(opts, {type: 'weight', filter: null, count: 5});

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
      _.each(res, function(val, term) {
        if (!invert[val]) {
          invert[val] = [];
        }
        invert[val].push(term);
      });
      var vec = Object.keys(invert);
      // get the last 5 values
      var out = [];
      var counter = 0;

      var minStar = 1000000000;
      for (var i = vec.length - 1; counter < opts.count; i--) {
        var terms = invert[vec[i]];
        if (!terms) {
          // no more terms
          break;
        }
        for (var j = 0; j < terms.length; j++) {
          if (terms[j] === '') {
            continue;
          }
          if (vec[i] < minStar) {
            minStar = vec[i];
          }
          out.push({word: terms[j], count: vec[i]});
          counter++;
          if (opts.count >= 5) {
            break;
          }
        }
      }

      var incomplete = false;
      // add on blank data if not enough terms
      while (counter < opts.count) {
        out.push({word: '', count: minStar});
        counter++;
      }

      getMeanMedian(key, function(err, data) {
        cb(null, {list: out, mm: data, incomplete: incomplete});
      });
    }
  });
}
module.exports.getTopWords = getTopWords;

// gets mean / median for any lang
// cache it as it is little :)
var mmHash = {};

function getMeanMedian(key, cb) {
  console.log('key: ' + key);
  if (mmHash[key]) {
    cb(null, mmHash[key]);
  } else {
    var count = 0;
    var hasError = false;
    var tmpHash = {};
    var bothDone = function(err, num, type) {
      count++;
      if (err) {
        // that sucks
        hasError = true;
        console.log(err);
      } else {
        tmpHash[type] = num;
      }
      if (count >= 2) {
        if (!hasError) {
          // only store if no error
          mmHash[key] = tmpHash;
        }
        cb(null, tmpHash);
      }
    };

    client.hget('mean_median', key + '_mean', function(err, data) {
      if (err) {
        cb(err);
      } else {
        bothDone(null, data * 1, 'mean');
      }
    });

    client.hget('mean_median', key + '_median', function(err, data) {
      if (err) {
        cb(err);
      } else {
        bothDone(null, data * 1, 'median');
      }
    });
  }
}

function getLang(cb) {
  client.keys('*', function(err, res) {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      var out = {};
      _.each(res, function(l) {
        l = l.replace('_count', '');
        if (!(l === 'count' || l === 'weight' || l === 'mean_median')) {
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
          out.push({word: word, val: count});
        });
        getMeanMedian(key, function(err, mm) {
          cb(null, {output: out, mm: mm});
        });
      }
    });
  } else {
    cb(null, {output: []});
  }

}
module.exports.getSuggestion = getSuggestion;

