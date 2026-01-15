let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Get elements properly
const titleEl = document.getElementById("title");
const amountEl = document.getElementById("amount");
const typeEl = document.getElementById("type");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const list = document.getElementById("list");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");
const monthFilter = document.getElementById("monthFilter");
const expenseChart = document.getElementById("expenseChart");

showTransactions();

function addTransaction(){
  const title = titleEl.value;
  const amount = amountEl.value;
  const type = typeEl.value;
  const category = categoryEl.value;
  const date = dateEl.value;

  if(!title || !amount || !date){
    alert("Fill all fields");
    return;
  }

  transactions.push({
    id: Date.now(),
    title,
    amount: +amount,
    type,
    category,
    date
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  showTransactions();

  titleEl.value = "";
  amountEl.value = "";
  dateEl.value = "";
}

function showTransactions(){
  list.innerHTML = "";
  let income = 0, expense = 0, data = {};

  const m = monthFilter.value;

  transactions.forEach(t=>{
    if(m !== "all" && new Date(t.date).getMonth() != m) return;

    list.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
        <td>₹${t.amount}</td>
        <td><button onclick="del(${t.id})">❌</button></td>
      </tr>
    `;

    if(t.type === "income"){
      income += t.amount;
    } else {
      expense += t.amount;
      data[t.category] = (data[t.category] || 0) + t.amount;
    }
  });

  totalIncome.innerText = income;
  totalExpense.innerText = expense;
  balance.innerText = income - expense;

  drawChart(data);
}

function del(id){
  transactions = transactions.filter(t => t.id != id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  showTransactions();
}

let chart;
function drawChart(data){
  if(chart) chart.destroy();

  chart = new Chart(expenseChart, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data)
      }]
    }
  });
}

function downloadCSV(){
  let csv = "Title,Category,Type,Amount,Date\n";
  transactions.forEach(t=>{
    csv += `${t.title},${t.category},${t.type},${t.amount},${t.date}\n`;
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
  a.download = "expenses.csv";
  a.click();
}
