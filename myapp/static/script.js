const monthKey = new Date().toISOString().slice(0, 7); // "2025-05"
document.getElementById('currentMonth')?.textContent = `📅 ${monthKey}`;

// 기본 카테고리
const defaultCategories = {
  "Groceries": 7500,
  "Transportation": 900,
  "Shopping": 500,
  "Gifts": 500,
  "Mistake": 500,
  "Emergency": 1000,
  "Travel": 3000,
  "Savings": 4000,
  "Insurance": 154,
  "Mortgage": 13997,
  "Home Electricity": 4000,
  "Student Loan": 3000,
  "Music": 169,
  "TV": 559,
  "Fitness": 741
};

// 데이터 불러오기
let budgets = JSON.parse(localStorage.getItem(`budgets_${monthKey}`)) || { ...defaultCategories };
let logs = JSON.parse(localStorage.getItem(`logs_${monthKey}`)) || [];

function saveData() {
  localStorage.setItem(`budgets_${monthKey}`, JSON.stringify(budgets));
  localStorage.setItem(`logs_${monthKey}`, JSON.stringify(logs));
}

// 공통 드롭다운 갱신
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

// 예산 요약 렌더링
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

// 카테고리 리스트 렌더링 (수정/삭제 포함)
function renderCategoryList() {
  const ul = document.getElementById('categoryList');
  if (!ul) return;
  ul.innerHTML = '';
  for (const cat in budgets) {
    const li = document.createElement('li');
    li.innerHTML = `
      ${cat} - ${budgets[cat]} kr
      <button onclick="editCategory('${cat}')">✏</button>
      <button onclick="deleteCategory('${cat}')">🗑</button>
    `;
    ul.appendChild(li);
  }
}

// 카테고리 추가 또는 수정
function addOrUpdateCategory() {
  const name = document.getElementById('newCategoryInput').value.trim();
  const budget = parseFloat(document.getElementById('newBudgetInput').value);
  if (!name || isNaN(budget)) return alert("Enter valid category and budget.");
  budgets[name] = budget;
  saveData();
  renderBudgets(); renderCategoryList(); updateCategoryDropdown();
  document.getElementById('newCategoryInput').value = '';
  document.getElementById('newBudgetInput').value = '';
}

// 수정할 카테고리 정보 입력창에 불러오기
function editCategory(cat) {
  document.getElementById('newCategoryInput').value = cat;
  document.getElementById('newBudgetInput').value = budgets[cat];
}

// 카테고리 삭제
function deleteCategory(cat) {
  if (!confirm(`Delete category "${cat}"?`)) return;
  delete budgets[cat];
  logs = logs.filter(l => l.category !== cat);
  saveData(); renderBudgets(); renderCategoryList(); updateCategoryDropdown();
}

// 지출 내역 추가
function addExpense() {
  const cat = document.getElementById('categorySelect').value;
  const amt = parseFloat(document.getElementById('amountInput').value);
  const desc = document.getElementById('descInput').value.trim();
  if (!cat || isNaN(amt)) return alert("Enter valid data.");
  logs.push({ date: new Date().toISOString().split('T')[0], category: cat, amount: amt, desc });
  saveData(); renderBudgets();
  document.getElementById('amountInput').value = '';
  document.getElementById('descInput').value = '';
}

// 📄 로그 테이블 렌더링 (log.html 전용)
function renderLogTable() {
  const tbody = document.querySelector('#logTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  logs.forEach((log, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input value="${log.date}" onchange="logs[${i}].date = this.value; saveData();"></td>
      <td><input value="${log.category}" onchange="logs[${i}].category = this.value; saveData();"></td>
      <td><input type="number" value="${log.amount}" onchange="logs[${i}].amount = parseFloat(this.value); saveData();"></td>
      <td><input value="${log.desc}" onchange="logs[${i}].desc = this.value; saveData();"></td>
      <td><button onclick="deleteLog(${i})">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// 로그 삭제
function deleteLog(index) {
  logs.splice(index, 1);
  saveData(); renderLogTable();
}

// CSV 다운로드
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

// 페이지 구분 실행
if (window.location.pathname.endsWith("index.html")) {
  renderBudgets();
  renderCategoryList();
  updateCategoryDropdown();
}
if (window.location.pathname.endsWith("log.html")) {
  renderLogTable();
}
