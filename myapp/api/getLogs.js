const { readFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const filePath = path.join(__dirname, 'logs.json');

  if (!existsSync(filePath)) {
    context.res = {
      status: 200,
      body: []
    };
    return;
  }

  const fileData = readFileSync(filePath);
  const logs = JSON.parse(fileData);

  context.res = {
    status: 200,
    body: logs
  };
};
