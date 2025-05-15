const { readFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const logsPath = path.join(__dirname, 'logs.json');

  if (!existsSync(logsPath)) {
    context.res = {
      status: 200,
      body: []
    };
    return;
  }

  const fileData = readFileSync(logsPath);
  const logs = JSON.parse(fileData);

  context.res = {
    status: 200,
    body: logs
  };
};

// File: api/getBudgets.js
const { readFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const budgetsPath = path.join(__dirname, 'budgets.json');

  if (!existsSync(budgetsPath)) {
    context.res = {
      status: 200,
      body: {}
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

// File: api/updateBudgets.js
const { writeFileSync } = require('fs');
const path = require('path');

module.exports = async function (context, req) {
  const budgetsPath = path.join(__dirname, 'budgets.json');
  const newBudgets = req.body;

  if (!newBudgets || typeof newBudgets !== 'object') {
    context.res = {
      status: 400,
      body: 'Invalid budget data.'
    };
    return;
  }

  writeFileSync(budgetsPath, JSON.stringify(newBudgets, null, 2));

  context.res = {
    status: 200,
    body: { message: 'Budgets updated successfully.' }
  };
};
