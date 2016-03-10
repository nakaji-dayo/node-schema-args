var args = require('../lib/index.js')({
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
