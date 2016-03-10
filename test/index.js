process.argv = ['node', 'test/index.js', '--name', 'beer', '-a', '999', '--options', 'a', '8', '0.98'];

var args = require('../index.js')({
  name: {
    type: String,
    required: true,
    description: 'product name'
  },
  amount: Number,
  options: [String]
});

console.log(args);

process.argv = ['node', 'test/index.js', '-a', '0'];

try {
var args = require('../index.js')({
  name: {
    type: String,
    required: true,
    description: 'product name'
  },
  amount: Number,
  options: [String]
});

} catch (e) {
  console.log(e);
}
