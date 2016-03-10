# node-schema-args

## example

app.js

```javascript
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

```sh
$ node app.js --name beer -a 999 --options a 8 c -e
{ name: 'beer',
  amount: 999,
  options: [ 'a', '8', 'c' ],
  exists: true }

$ node app.js --help 2> /dev/null
Usage: 
Options:
 --name, -n: product name (String) *
 --amount, -a:  (Number)
 --exists, -e:  (Boolean)
 --options, -o:  ([String])
 --help: show help (Boolean)
```
