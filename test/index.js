process.argv = ['node', 'test/index.js', '--name', 'beer', '-a', '999', '--options', 'a', '8', '0.98', '-e'];

var args = require('../index.js')({
  name: {
    type: String,
    required: true,
    description: 'product name'
  },
  amount: Number,
  exists: Boolean,
  options: [String]
});

console.log(args);


try {
  var args = require('../index.js')({
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

} catch (e) {
  console.log(e);
}
