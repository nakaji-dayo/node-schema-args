# node-schema-args

```js: app.js
var args = require('schema-args')({
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
```

```
> node app.js --name beer -a 999 --options a 8 c -e
{ name: 'beer',
  amount: 999,
  options: [ 'a', '8', 'c' ],
  exists: true }
```
