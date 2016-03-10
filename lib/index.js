'use strict';

var _ = require('lodash');
var paramCase = require('param-case');

module.exports = function (schema, settings) {
  var argv = _.get(settings, 'argv', process.argv.splice(2));
  // parse schema
  var opts = _.reduce(schema, function (acc, v, k) {
    var s = {
      key: k,
      type: v.type ? v.type : v,
      required: !!v.required,
      description: v.description
    };
    acc.l['--' + paramCase(k)] = s;
    var short = '-' + k.charAt(0);
    acc.s[short] = s;
    s.short = short;
    return acc;
  }, { l: {}, s: {} });
  // parse argv
  var res = argv.reduce(function (acc, x) {
    if (x.indexOf('--') == 0 || x.indexOf('-') == 0) {
      var opt = opts.l[x] || opts.s[x]; //FIXIT: one
      if (opt) {
        if (opt.type == Boolean) {
          acc.res[opt.key] = true;
        } else {
          acc.opt = opt;
        }
      }
    } else {
      if (acc.opt) {
        if (Array.isArray(acc.opt.type)) {
          if (acc.res[acc.opt.key]) {
            acc.res[acc.opt.key].push(parse(acc.opt.type, x));
          } else {
            acc.res[acc.opt.key] = [parse(acc.opt.type, x)];
          }
        } else {
          acc.res[acc.opt.key] = parse(acc.opt.type, x);
        }
      }
    }
    return acc;
  }, { res: {}, opt: null }).res;
  //validate required
  if (_.values(opts.l).some(function (x) {
    return x.required && !res[x.key];
  })) {
    console.log(makeMan(opts, settings));
    throw new Error('not enough args');
  }
  return res;
};

var parse = function parse(type, v) {
  switch (type) {
    case Number:
      return parseFloat(v);
    default:
      return v;
  }
};

var makeMan = function makeMan(opts, settings) {
  return 'Usage: \n' + (settings ? settings + '\n' : '') + _.map(opts.l, function (v, k) {
    return k + (v.short ? ', ' + v.short : '') + (v.required ? '*' : '') + ': ' + (v.description || '') + ' (' + typeName(v.type || v) + ')';
  }).join('\n');
};

var typeName = function typeName(t) {
  return Array.isArray(t) ? '[' + t[0].name + ']' : t.name;
};