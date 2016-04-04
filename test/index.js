var parser = require('../lib/index.js');
var should = require('chai').should();

describe('schema-args', () => {
  it ('parse process.argv', () => {
    process.argv = ['node', 'test/index.js', '--name', 'beer', '-a', '999', '--options', 'a', '8', 'c', '-e'];
    var args = parser({
      name: {
        type: String,
        required: true,
        description: 'product name'
      },
      amount: Number,
      exists: Boolean,
      options: [String]
    });
    args.name.should.equal('beer');
    args.amount.should.equal(999);
    args.options.should.deep.equal(['a', '8', 'c']);
    args.exists.should.be.true;
  });

  it ('required', () => {    
    (() => {
      parser({
        name: {
          type: String,
          required: true,
          description: 'product name'
        },
        amount: Number,
        options: [String]
      }, {
        argv: ['-a', '0']
      });
    }).should.throw(/not enough args/);
  });

  it ('help opt', () => {
    (() => {
      parser({
        amount: Number
      }, {
        binName: 'node hoge.js',
        argv: ['--help']
      });
    }).should.throw(/help is shown/);
  });

  it ('position args', () => {
    var args = parser({
      first: {
        type: String,
        index: 0
      },
      last: {
        type: String,
        index: 1
      }
    }, {
      binName: 'node hoge.js',
      argv: ['daishi', 'nakajima']
    });
    args.first.should.equal('daishi');
    args.last.should.equal('nakajima');
  });
});
