var _ = require('lodash');
var paramCase = require('param-case');

module.exports = (schema, settings) => {
  var argv = process.argv.splice(2);
  // parse schema
  var opts = _.reduce(schema, (acc, v, k) => {
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
  }, {l: {}, s: {}});
  // parse argv
  var res = argv.reduce((acc, x) => {
    if (x.indexOf('--') == 0 || x.indexOf('-') == 0) {
      var opt = opts.l[x] || opts.s[x]; //FIXIT: one
      if (opt) {
        acc.opt = opt;
      }
    } else {
      if (acc.opt) {
        acc.res[acc.opt.key] = parse(acc.opt.type, x);
      }
    }
    return acc;
  }, {res: {}, opt: null}).res;
  //validate required
  if (_.values(opts.l).some(x => x.required && !res[x.key])) {
    console.log(makeMan(opts, settings));
    throw new Error('not enough args');
  }
  return res;
};

var parse = (type, v) => {
  switch (type) {
  case Number:
    return parseFloat(v);
  default:
    return v;
  }
};

var makeMan = (opts, settings) => {
  return 'Usage: \n' + (settings ? settings + '\n' : '') +
    _.map(opts.l, (v, k) => k + (v.short ? ', ' + v.short : '') +
          (v.required ? '*' : '') + ': ' +
          (v.description || '') + ' (' + (typeName(v.type || v)) + ')')
    .join('\n');
};

var typeName = t => Array.isArray(t) ? `[${t[0].name}]` : t.name;

