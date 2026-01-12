const currencySelect1 = document.getElementById("currency1");
const currencySelect2 = document.getElementById("currency2");
const resultElement = document.getElementById("result");
const errorElement = document.querySelector(".error");
const amountInput = document.getElementById("inicialAmount");
const converterButton = document.getElementById("converter-button");
const exportButton = document.getElementById("export-button");
const historyTableBody = document.querySelector("#history-table tbody");

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.add("visible");
}

function hideError() {
  errorElement.classList.remove("visible");
}

function clearError() {
  errorElement.textContent = "";
  hideError();
}

function showResult(amount) {
  resultElement.textContent = amount.toFixed(2);
}

function createCell(content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
}

function addToHistorical(amount, from, to, convertedAmount) {
  const row = document.createElement("tr");
  row.appendChild(createCell(from));
  row.appendChild(createCell(amount));
  row.appendChild(createCell(to));
  row.appendChild(createCell(convertedAmount.toFixed(2)));
  row.appendChild(createCell(getTodayDate()));
  historyTableBody.appendChild(row);
}

async function fetchCurrencies() {
  try {
    const res = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}`
    );
    const data = await res.json();

    console.log("Resposta da API:", data);

    if (!data || !data.data) {
      showError("Dados de moedas não disponíveis.");
      return;
    }

    const currencies = Object.keys(data.data);

    currencySelect1.innerHTML = "";
    currencySelect2.innerHTML = "";

    currencies.forEach((currency) => {
      const option1 = new Option(currency, currency);
      const option2 = new Option(currency, currency);
      currencySelect1.appendChild(option1);
      currencySelect2.appendChild(option2);
    });

    currencySelect1.value = "USD";
    currencySelect2.value = "BRL";
  } catch (error) {
    showError(`Erro ao carregar moedas: ${error.message}`);
  }
}

async function Converter() {
  clearError();

  const amount = parseFloat(amountInput.value);
  const from = currencySelect1.value;
  const to = currencySelect2.value;

  if (!from || !to || isNaN(amount)) {
    showError("Preencha todos os campos corretamente!");
    return;
  }

  try {
    const res = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`
    );
    const data = await res.json();

    if (!data || !data.data || !data.data[to]) {
      showError("Erro ao buscar taxa de câmbio.");
      return;
    }

    const rate = data.data[to].value;
    const finalAmount = amount * rate;

    showResult(finalAmount);
    addToHistorical(amount, from, to, finalAmount);
  } catch (error) {
    showError(`Erro na conversão: ${error.message}`);
  }
}

function exportHistory() {
  const rows = historyTableBody.querySelectorAll("tr");

  if (rows.length === 0) {
    showError("Nenhum histórico para exportar.");
    return;
  }

  const separator = "\t";
  const lineBreak = "\n";
  let content = `from${separator}amount${separator}to${separator}convertedAmount${separator}date${lineBreak}`;

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td")).map(
      (cell) => cell.textContent
    );
    content += cells.join(separator) + lineBreak;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "historico_de_conversoes.txt";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

window.onload = fetchCurrencies;
converterButton.addEventListener("click", Converter);
exportButton.addEventListener("click", exportHistory);

// botão de inverter
