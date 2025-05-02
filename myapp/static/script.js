// myapp/static/script.js

const monthKey = new Date().toISOString().slice(0, 7); // 예: '2025-05'

document.getElementById('currentMonth').textContent = `📆 ${monthKey} 예산 관리`;

let budgets = JSON.parse(localStorage.getItem(`budgets_${monthKey}`)) || {};
let logs = JSON.parse(localStorage.getItem(`logs_${monthKey}`)) || [];

function saveData() {
  localStorage.setItem(`budgets_${monthKey}`, JSON.stringify(budgets));
  localStorage.setItem(`logs_${monthKey}`, JSON.stringify(logs));
}

function renderBudgets() {
  const ul = document.getElementById('budgetList');
  ul.innerHTML = '';
  for (const cat in budgets) {
    const used = logs
      .filter(log => log.category === cat)
      .reduce((sum, log) => sum + log.amount, 0);
    const li = document.createElement('li');
    li.textContent = `${cat} (${budgets[cat]} kr): ${used} kr used`;
    ul.appendChild(li);
  }
}

function renderLogs() {
  const tbody = document.querySelector('#logTable tbody');
  tbody.innerHTML = '';
  logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${log.date}</td><td>${log.category}</td><td>${log.amount} kr</td><td>${log.desc}</td>`;
    tbody.appendChild(tr);
  });
}

function addExpense() {
  const category = document.getElementById('categoryInput').value.trim();
  const amount = parseFloat(document.getElementById('amountInput').value);
  const desc = document.getElementById('descInput').value.trim();

  if (!category || isNaN(amount)) {
    alert("카테고리와 금액을 올바르게 입력하세요.");
    return;
  }

  logs.push({
    date: new Date().toISOString().split('T')[0],
    category,
    amount,
    desc
  });

  saveData();
  renderBudgets();
  renderLogs();

  // 입력칸 초기화
  document.getElementById('categoryInput').value = '';
  document.getElementById('amountInput').value = '';
  document.getElementById('descInput').value = '';
}

function addCategory() {
  const newCat = document.getElementById('newCategoryInput').value.trim();
  const newBudget = parseFloat(document.getElementById('newBudgetInput').value);

  if (!newCat || isNaN(newBudget)) {
    alert("카테고리 이름과 예산을 올바르게 입력하세요.");
    return;
  }

  budgets[newCat] = newBudget;
  saveData();
  renderBudgets();

  document.getElementById('newCategoryInput').value = '';
  document.getElementById('newBudgetInput').value = '';
}

renderBudgets();
renderLogs();
