// Use a free API that doesn't require a key for the demo.
// If the user wants to use currencyapi.com, they can swap the URL/Key logic.
const API_URL = "https://open.er-api.com/v6/latest/";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from-currency");
const toSelect = document.getElementById("to-currency");
const resultText = document.getElementById("result-text");
const rateText = document.getElementById("rate-text");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-button");
const errorMsg = document.querySelector(".error-msg");
const historyTableBody = document.querySelector("#history-table tbody");
const exportBtn = document.getElementById("export-btn");

// Popular currencies to show first
const popularCurrencies = ["USD", "BRL", "EUR", "GBP", "JPY", "CAD"];

async function loadCurrencies() {
  try {
    const res = await fetch(`${API_URL}USD`);
    const data = await res.json();

    if (data && data.rates) {
      const currencies = Object.keys(data.rates);

      // Populate selects
      [fromSelect, toSelect].forEach((select) => {
        select.innerHTML = "";
        // Add popular first
        popularCurrencies.forEach((code) => {
          if (currencies.includes(code)) {
            select.add(new Option(`${code}`, code));
          }
        });

        // Add separator
        select.add(new Option("──────────", "disabled", true, true));

        // Add rest
        currencies.sort().forEach((code) => {
          if (!popularCurrencies.includes(code)) {
            select.add(new Option(code, code));
          }
        });
      });

      // Set defaults
      fromSelect.value = "USD";
      toSelect.value = "BRL";

      // Initial convert
      convert();
    }
  } catch (err) {
    showError("Erro ao carregar moedas. Verifique sua conexão.");
    console.error(err);
  }
}

async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    // showError("Insira um valor válido.");
    return;
  }

  // Skip disabled separator
  if (from === "disabled" || to === "disabled") return;

  hideError();
  resultText.innerHTML =
    '<ion-icon name="sync-outline" class="spin"></ion-icon>'; // Loading spinner concept

  try {
    const res = await fetch(`${API_URL}${from}`);
    const data = await res.json();

    if (data && data.rates && data.rates[to]) {
      const rate = data.rates[to];
      const final = amount * rate;

      resultText.textContent = `${to} ${final.toFixed(2)}`;
      rateText.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

      addToHistory(amount, from, to, final);
    } else {
      showError("Taxa de câmbio não encontrada.");
    }
  } catch (err) {
    showError("Erro na conversão.");
    console.error(err);
  }
}

function showError(msg) {
  // Use Toast if available
  if (document.getElementById("toast-container")) {
    showToast(msg, "error");
  }
  errorMsg.textContent = msg;
}

function hideError() {
  errorMsg.textContent = "";
}

function addToHistory(amount, from, to, result) {
  const row = document.createElement("tr");
  const date = new Date().toLocaleDateString("pt-BR");

  row.innerHTML = `
        <td>${date}</td>
        <td>${from}</td>
        <td>${to}</td>
        <td>${result.toFixed(2)}</td>
    `;

  // Add to top
  historyTableBody.insertBefore(row, historyTableBody.firstChild);

  // Limit history to 10 items
  if (historyTableBody.children.length > 10) {
    historyTableBody.removeChild(historyTableBody.lastChild);
  }
}

function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convert();
}

function exportHistory() {
  const rows = historyTableBody.querySelectorAll("tr");
  if (rows.length === 0) {
    showError("Histórico vazio.");
    return;
  }

  let content = "Data\tDe\tPara\tResultado\n";
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const line = Array.from(cells)
      .map((c) => c.textContent)
      .join("\t");
    content += line + "\n";
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "historico_conversoes.txt";
  a.click();
  URL.revokeObjectURL(url);
}

const clearHistoryBtn = document.getElementById("clear-history-button");

// Events
convertBtn.addEventListener("click", convert);
swapBtn.addEventListener("click", swapCurrencies);
exportBtn.addEventListener("click", exportHistory);
clearHistoryBtn.addEventListener("click", clearHistory);

// Initial Load
document.addEventListener("DOMContentLoaded", loadCurrencies);

function clearHistory() {
  if (historyTableBody.children.length === 0) {
    showToast("Histórico já está vazio.", "info");
    return;
  }

  showConfirm(
    "Tem certeza que deseja limpar todo o histórico de conversões?",
    () => {
      historyTableBody.innerHTML = "";
      showToast("Histórico limpo com sucesso.", "success");
    }
  );
}

// Notification Helpers (Replicated from Media Calculator)
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return; // Guard clause

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconName = "information-circle-outline";
  if (type === "success") iconName = "checkmark-circle-outline";
  if (type === "error") iconName = "alert-circle-outline";
  if (type === "warning") iconName = "warning-outline";

  toast.innerHTML = `
    <ion-icon name="${iconName}" style="font-size: 1.5rem"></ion-icon>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}

function showConfirm(message, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  if (!modal) {
    if (confirm(message)) onConfirm();
    return;
  }

  const msgEl = document.getElementById("modal-message");
  const confirmBtn = document.getElementById("modal-confirm");
  const cancelBtn = document.getElementById("modal-cancel");

  msgEl.textContent = message;
  modal.classList.add("open");

  const cleanup = () => {
    modal.classList.remove("open");
    confirmBtn.replaceWith(confirmBtn.cloneNode(true)); // remove listeners
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  };

  // Clone buttons to ensure clean listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener("click", () => {
    onConfirm();
    modal.classList.remove("open");
  });

  newCancelBtn.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  // Close on outside click
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove("open");
  };
}
