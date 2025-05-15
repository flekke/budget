// 📅 현재 월 키
const monthKey = new Date().toISOString().slice(0, 7);
const monthTitle = document.getElementById('currentMonth');
if (monthTitle) {
  monthTitle.textContent = `📅 ${monthKey}`;
}

// 🎯 기본 카테고리
const defaultCategories = {
  "Groceries": 7500, "Transportation": 1500, "Shopping": 500, "Gifts": 500,
  "Mistake": 1000, "Emergency": 1000, "Travel": 1500, "Savings": 4000,
  "Insurance": 154, "Mortgage": 13997, "Home related": 4000, "electrocity": 400,
  "Student Loan": 3000, "Music": 169, "TV": 559, "Fitness": 741, "potet": 1000
};

let budgets = {};  // 서버에서 불러옴
let logs = [];     // 서버에서 불러옴

// 📡 budgets 불러오기
function fetchBudgets() {
  fetch('/api/getBudgets')
    .then(res => res.json())
    .then(serverBudgets => {
      budgets = Object.keys(serverBudgets).length > 0 ? serverBudgets : { ...defaultCategories };
      renderBudgets(); renderCategoryList(); updateCategoryDropdown();
    });
}

// 📡 logs 불러오기
function fetchLogs() {
  fetch('/api/getLogs')
    .then(res => res.json())
    .then(serverLogs => {
      logs = serverLogs;
      renderBudgets(); renderCategoryList();
    });
}

// 💾 budgets 서버에 저장
function saveBudgets() {
  fetch('/api/updateBudgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgets)
  });
}

// 💾 logs 서버에 저장
function saveLogEntry(entry) {
  fetch('/api/addLog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  }).then(() => fetchLogs());
}

// 📋 카테고리 드롭다운 업데이트
function updateCategoryDropdown() {
  const select = document.getElementById('categorySelect');
  if (!select) return;
  select.innerHTML = '';
  for (const cat in budgets) {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  }
}

// 📊 예산 리스트 렌더링
function renderBudgets() {
  const ul = document.getElementById('budgetList');
  if (!ul) return;
  ul.innerHTML = '';
  for (const cat in budgets) {
    const used = logs.filter(l => l.category === cat).reduce((sum, l) => sum + l.amount, 0);
    const li = document.createElement('li');
    li.textContent = `${cat} (${budgets[cat]} kr): ${used} kr used`;
    if (used >= budgets[cat]) {
      li.style.color = "#999";
      li.style.textDecoration = "line-through";
    }
    ul.appendChild(li);
  }
}

function renderCategoryList() {
  const ul = document.getElementById('categoryList');
  if (!ul) return;
  ul.innerHTML = '';
  for (const cat in budgets) {
    const used = logs.filter(l => l.category === cat).reduce((sum, l) => sum + l.amount, 0);
    const available = budgets[cat] - used;
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-left">
        <span style="color:#dc2626; font-weight:bold;">${cat}</span> - ${budgets[cat]} kr
        (<span class="used-amount">U ${used} kr</span>,
        <span style="color:#dc2626; font-weight:bold;">A ${available} kr</span>)
      </div>
      <div class="item-right">
        <button onclick="editCategory('${cat}')">✏</button>
        <button onclick="deleteCategory('${cat}')">🗑</button>
      </div>`;
    if (used >= budgets[cat]) {
      li.style.color = '#999';
      li.style.textDecoration = 'line-through';
    }
    ul.appendChild(li);
  }
}

function addOrUpdateCategory() {
  const name = document.getElementById('newCategoryInput').value.trim();
  const budget = parseFloat(document.getElementById('newBudgetInput').value);
  if (!name || isNaN(budget)) return alert("Enter valid category and budget.");
  budgets[name] = budget;
  saveBudgets(); renderBudgets(); renderCategoryList(); updateCategoryDropdown();
  document.getElementById('newCategoryInput').value = '';
  document.getElementById('newBudgetInput').value = '';
}

function editCategory(cat) {
  document.getElementById('newCategoryInput').value = cat;
  document.getElementById('newBudgetInput').value = budgets[cat];
}

function deleteCategory(cat) {
  if (!confirm(`Delete category "${cat}"?`)) return;
  delete budgets[cat];
  logs = logs.filter(l => l.category !== cat);
  saveBudgets(); fetchLogs(); updateCategoryDropdown();
}

function addExpense() {
  const cat = document.getElementById('categorySelect').value;
  const amt = parseFloat(document.getElementById('amountInput').value);
  const desc = document.getElementById('descInput').value.trim();
  if (!cat || isNaN(amt)) return alert("Enter valid data.");

  const entry = {
    date: new Date().toISOString().split('T')[0],
    category: cat,
    amount: amt,
    desc: desc
  };

  saveLogEntry(entry);

  document.getElementById('amountInput').value = '';
  document.getElementById('descInput').value = '';
  renderCategoryList();
}

function renderLogTable() {
  const tbody = document.querySelector('#logTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  logs.forEach((log, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input value="${log.date}" onchange="logs[${i}].date = this.value; saveLogEntry(logs[${i}]);"></td>
      <td><input value="${log.category}" onchange="logs[${i}].category = this.value; saveLogEntry(logs[${i}]);"></td>
      <td><input type="number" value="${log.amount}" onchange="logs[${i}].amount = parseFloat(this.value); saveLogEntry(logs[${i}]);"></td>
      <td><input value="${log.desc}" onchange="logs[${i}].desc = this.value; saveLogEntry(logs[${i}]);"></td>
      <td><button onclick="deleteLog(${i})">🗑</button></td>`;
    tbody.appendChild(tr);
  });
}

function deleteLog(index) {
  logs.splice(index, 1);
  // TODO: 서버에서도 삭제 처리 필요함 (현재 API 없음)
  renderLogTable();
}

function downloadCSV() {
  if (!logs.length) return alert("No logs found.");
  const header = "Date,Category,Amount,Description\n";
  const rows = logs.map(l => `${l.date},${l.category},${l.amount},${l.desc}`);
  const content = header + rows.join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `budget_log_${monthKey}.csv`;
  a.click();
}

function uploadCSV() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (!file) return alert("Please choose a CSV file.");
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.trim().split("\n").slice(1);
    const newLogs = lines.map(line => {
      const [date, category, amount, desc] = line.split(",");
      return {
        date: date.trim(), category: category.trim(),
        amount: parseFloat(amount.trim()), desc: desc.trim()
      };
    });
    logs = newLogs;
    // TODO: 서버에 logs 전체 덮어쓰기 API가 필요함
    renderLogTable();
    alert("Log restored from CSV!");
  };
  reader.readAsText(file);
}

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  fetchBudgets(); fetchLogs();
});

// 함수 전역 등록
window.addExpense = addExpense;
window.addOrUpdateCategory = addOrUpdateCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.downloadCSV = downloadCSV;
window.uploadCSV = uploadCSV;
window.deleteLog = deleteLog;
