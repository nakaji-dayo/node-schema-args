#!/bin/sh


js=`cat ./docs/app.js | sed -e "s/..\/lib\/index.js/schema-args/"`

alias resolvAppJS='sed -e "s/.\/docs\/app.js/app.js/"'

command='node ./docs/app.js --name beer -a 999 --options a 8 c -e'
result=`eval ${command}`
command_=`echo $command | resolvAppJS`
helpCommand='node ./docs/app.js --help 2> /dev/null'
helpResult=`eval ${helpCommand}`
helpCommand_=`echo $command | resolvAppJS`

cat > README.md <<EOF
# node-schema-args

## example

app.js

\`\`\`javascript
${js}
\`\`\`

\`\`\`sh
$ ${command_}
${result}

$ ${helpCommand_}
${helpResult}
\`\`\`
EOF
