#!/bin/sh

js=`cat ./docs/app.js | sed -e "s/..\/lib\/index.js/schema-args/"`
command='node ./docs/app.js --name beer -a 999 --options a 8 c -e'
result=`eval ${command}`
showCommand=`echo $command | sed -e "s/.\/docs\/app.js/app.js/"`

cat > README.md <<EOF
# node-schema-args

\`\`\`js: app.js
${js}
\`\`\`

\`\`\`
> ${showCommand}
${result}
\`\`\`
EOF
