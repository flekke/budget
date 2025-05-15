const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const filePath = path.join(__dirname, 'logs.json');

  // 기존 데이터 불러오기
  let logs = [];
  if (existsSync(filePath)) {
    const fileData = readFileSync(filePath);
    logs = JSON.parse(fileData);
  }

  // 새 로그 항목 추가
  const newLog = req.body;
  if (!newLog || !newLog.category || isNaN(newLog.amount)) {
    context.res = {
      status: 400,
      body: 'Invalid log format.'
    };
    return;
  }

  logs.push(newLog);
  writeFileSync(filePath, JSON.stringify(logs, null, 2));

  context.res = {
    status: 200,
    body: { message: 'Log added successfully.' }
  };
};
