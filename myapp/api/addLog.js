const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const logsPath = path.join(__dirname, 'logs.json');
  let logs = [];
  if (existsSync(logsPath)) {
    const fileData = readFileSync(logsPath);
    logs = JSON.parse(fileData);
  }

  const newLog = req.body;
  if (!newLog || !newLog.category || isNaN(newLog.amount)) {
    context.res = {
      status: 400,
      body: 'Invalid log format.'
    };
    return;
  }

  logs.push(newLog);
  writeFileSync(logsPath, JSON.stringify(logs, null, 2));

  context.res = {
    status: 200,
    body: { message: 'Log added successfully.' }
  };
};
