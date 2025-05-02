function updateCategoryDropdown() {
  const select = document.getElementById('categorySelect');
  select.innerHTML = '';
  for (const cat in budgets) {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  }
}

function renderBudgets() {
  const ul = document.getElementById('budgetList');
  ul.innerHTML = '';
  for (const cat in budgets) {
    const used = logs
      .filter(log => log.category === cat)
      .reduce((sum, log) => sum + log.amount, 0);
    const remaining = budgets[cat] - used;
    const li = document.createElement('li');

    li.textContent = `${cat} (${budgets[cat]} kr): ${used} kr used`;

    // 예산 다 썼으면 회색 + 줄긋기
    if (remaining <= 0) {
      li.style.color = '#999';
      li.style.textDecoration = 'line-through';
    }

    ul.appendChild(li);
  }
}

function addExpense() {
  const category = document.getElementById('categorySelect').value;
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
  updateCategoryDropdown(); // 드롭다운 갱신
  document.getElementById('newCategoryInput').value = '';
  document.getElementById('newBudgetInput').value = '';
}

// 초기 렌더링
renderBudgets();
renderLogs();
updateCategoryDropdown();
