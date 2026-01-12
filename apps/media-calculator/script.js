let lastEntry = null;
let historyData = [];

function calculateMedia() {
  const name = getInputValue("name");
  const grades = getGrades(["grade1", "grade2", "grade3", "grade4"]);
  const validGrades = grades.filter(isValidGrade);

  const errorMessage = validateInputs(name, validGrades);
  if (errorMessage) {
    showToast(errorMessage, "error");
    return;
  }

  const average = calculateAverage(validGrades);

  if (isDuplicateEntry(name, grades, average)) {
    showToast(
      "Esses dados já foram inseridos. Altere algo para calcular novamente.",
      "warning"
    );
    return;
  }

  clearError();

  showResult(average);
  showResult(average);

  const entry = { name, grades, average };
  historyData.push(entry);
  saveHistory();
  addToHistorical(entry);
  showToast("Média calculada com sucesso", "success");

  lastEntry = entry;
}

function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

function getGrades(ids) {
  return ids.map((id) => {
    const value = document.getElementById(id).value;
    return value === "" ? NaN : parseFloat(value);
  });
}

function isValidGrade(grade) {
  return !isNaN(grade);
}

function validateInputs(name, grades) {
  if (!name && grades.length < 2)
    return "Preencha o nome e pelo menos duas notas válidas.";
  if (!name) return "Preencha o nome.";
  if (grades.length < 2) return "Preencha pelo menos duas notas válidas.";
  return null;
}

function showError(message) {
  // Keeping this for inline errors if needed, but using Toasts mostly now
  document.querySelector(".error-msg").textContent = message;
}

function clearError() {
  document.querySelector(".error-msg").textContent = "";
}

function calculateAverage(grades) {
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return sum / grades.length;
}

function isDuplicateEntry(name, grades, average) {
  if (!lastEntry) return false;

  const sameName = name === lastEntry.name;
  const sameAverage = average === lastEntry.average;
  const sameGrades = grades.every(
    (grade, index) => grade === lastEntry.grades[index]
  );

  return sameName && sameAverage && sameGrades;
}

function showResult(average) {
  const resultElement = document.getElementById("result");
  resultElement.textContent = `Média: ${average.toFixed(2)}`;

  // Visual feedback
  if (average >= 7) {
    resultElement.style.color = "var(--success)";
  } else {
    resultElement.style.color = "var(--error)";
  }
}

function addToHistorical(entry) {
  const tableBody = document.querySelector("#history-table tbody");
  const row = document.createElement("tr");

  const nameCell = createCell(entry.name);
  row.appendChild(nameCell);

  // We stored the 4 exact grades in the entry.grades array
  // We need to ensure we display 4 cells.
  // entry.grades was created from getGrades(["grade1", "grade2", "grade3", "grade4"])
  // so it should have exactly 4 items, creating cells for them.
  entry.grades.forEach((grade) => {
    const gradeCell = createCell(isValidGrade(grade) ? grade.toFixed(2) : "-");
    row.appendChild(gradeCell);
  });

  const avgCell = createCell(entry.average.toFixed(2));
  row.appendChild(avgCell);

  tableBody.appendChild(row);
  updateHistoryView();
}

function createCell(content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
}

function clearValue() {
  ["name", "grade1", "grade2", "grade3", "grade4"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("result").textContent = "Média: -";
  document.getElementById("result").style.color = "inherit";
  clearError();
  lastEntry = null;
}

document.getElementById("ok-button").addEventListener("click", calculateMedia);

document.getElementById("clear-button").addEventListener("click", clearValue);

function exportHistory() {
  const table = document
    .getElementById("history-table")
    .getElementsByTagName("tbody")[0];
  const rows = table.getElementsByTagName("tr");
  const fileType = document.getElementById("file-type").value;

  if (rows.length === 0) {
    showToast("Nenhum histórico para exportar.", "error");
    return;
  }

  const isCSV = fileType === "csv";
  const separator = isCSV ? "," : "\t";
  const lineBreak = "\n";

  let content = `Nome${separator}Nota 1${separator}Nota 2${separator}Nota 3${separator}Nota 4${separator}Média${lineBreak}`;

  for (let row of rows) {
    const cells = row.getElementsByTagName("td");
    const rowData = Array.from(cells)
      .map((cell) => {
        const text = cell.textContent;
        return isCSV && text.includes(",") ? `"${text}"` : text;
      })
      .join(separator);
    content += rowData + lineBreak;
  }

  const mimeType = isCSV ? "text/csv" : "text/plain";
  const extension = isCSV ? "csv" : "txt";
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `historico_de_notas.${extension}`;
  downloadLink.click();

  URL.revokeObjectURL(url);
}

document
  .getElementById("export-button")
  .addEventListener("click", exportHistory);

function updateHistoryView() {
  const tableBody = document.querySelector("#history-table tbody");
  const historyContent = document.getElementById("history-content");
  const historyEmpty = document.getElementById("history-empty");

  if (tableBody.children.length === 0) {
    historyContent.style.display = "none";
    historyEmpty.style.display = "flex";
  } else {
    historyContent.style.display = "block";
    historyEmpty.style.display = "none";
  }
}

// Init view
loadHistory();

function saveHistory() {
  localStorage.setItem("mediaCalculatorHistory", JSON.stringify(historyData));
}

function loadHistory() {
  const stored = localStorage.getItem("mediaCalculatorHistory");
  if (stored) {
    historyData = JSON.parse(stored);
    // Clear table before re-rendering (though usually it's empty on load)
    document.querySelector("#history-table tbody").innerHTML = "";
    historyData.forEach((entry) => addToHistorical(entry));
  }
  updateHistoryView();
}

function clearHistory() {
  showConfirm(
    "Tem certeza que deseja limpar todo o histórico? Essa ação não pode ser desfeita.",
    () => {
      historyData = [];
      localStorage.removeItem("mediaCalculatorHistory");
      document.querySelector("#history-table tbody").innerHTML = "";
      updateHistoryView();
      showToast("Histórico limpo com sucesso.", "success");
    }
  );
}

document
  .getElementById("clear-history-button")
  .addEventListener("click", clearHistory);

/* --- Notification System --- */

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
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
