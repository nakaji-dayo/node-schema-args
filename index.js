var _ = require('lodash');
var paramCase = require('param-case');

// parse
module.exports = (schema, settings) => {
  var argv = _.get(settings, 'argv', process.argv.splice(2));
  //default schema
  _.defaults(schema, {'__help': helpOption});
  // parse schema
  var opts = _.reduce(schema, (acc, v, k) => {
    var s = {
      key: k,
      type: v.type ? v.type : v,
      required: !!v.required,
      description: v.description
    };
    acc.l['--' + paramCase(k)] = s;
    if (!v.noShort) {
      var short = '-' + k.charAt(0);
      acc.s[short] = s;    
      s.short = short;
    }
    return acc;
  }, {l: {}, s: {}});
  // parse argv
  var res = argv.reduce((acc, x) => {
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
  }, {res: {}, opt: null}).res;
  // show help
  if (res.__help) {
    console.log(makeMan(opts, settings));
    throw new Error('help is shown');
  }
  //validate required
  if (_.values(opts.l).some(x => x.required && !res[x.key])) {
    console.log(makeMan(opts, settings));
    throw new Error('not enough args');
  }
  return res;
};

//parse value with type
var parse = (type, v) => {
  switch (type) {
  case Number:
    return parseFloat(v);
  default:
    return v;
  }
};

//`usage` string
var makeMan = (opts, settings) => {
  return 'Usage: ' + (settings.binName ? settings.binName : '') + '\n' +
    'Options:' + '\n' + 
    _.map(opts.l, (v, k) => ' ' + k + (v.short ? ', ' + v.short : '') +
          ': ' +
          (v.description || '') + ' (' + (typeName(v.type || v)) + ')' +
          (v.required ? ' *' : '')
         ).join('\n');
};

// name of type
var typeName = t => Array.isArray(t) ? `[${t[0].name}]` : t.name;


// help option
var helpOption = {
  type: Boolean,
  description: 'show help',
  noShort: true
};
