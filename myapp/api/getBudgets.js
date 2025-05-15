const { readFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const budgetsPath = path.join(__dirname, 'budgets.json');

  if (!existsSync(budgetsPath)) {
    context.res = {
      status: 200,
      body: {}  // 기본값이라도 반환해야 JS에서 에러 안 남
    };
    return;
  }

  const fileData = readFileSync(budgetsPath);
  const budgets = JSON.parse(fileData);

  context.res = {
    status: 200,
    body: budgets
  };
};
