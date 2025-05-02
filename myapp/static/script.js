function calculate() {
  const budget = parseFloat(document.getElementById("budget").value);
  const used = parseFloat(document.getElementById("used").value);
  const remaining = budget - used;
  document.getElementById("result").innerText = `잔여 금액: ${remaining} kr`;
}
