let lastEntry = null;

function calculateMedia() {

    const name = getInputValue("name");
    const grades = getGrades(["grade1", "grade2", "grade3", "grade4"]);
    const validGrades = grades.filter(isValidGrade);

    const errorMessage = validateInputs(name, validGrades);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    const average = calculateAverage(validGrades);

    if (isDuplicateEntry(name, grades, average)) {
        showError("Esses dados já foram inseridos. Altere algo para calcular novamente.");
        return;
    }

    clearError();

    showResult(average);
    addToHistorical(name, grades, average);

    lastEntry = { name, grades: [...grades], average };

}

function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

function getGrades(ids) {
    return ids.map(id => {
        const value = document.getElementById(id).value;
        return value === "" ? NaN : parseFloat(value);
    });
}

function isValidGrade(grade) {
    return !isNaN(grade);
}

function validateInputs(name, grades) {
    if (!name && grades.length < 2) return "Preencha o nome e pelo menos duas notas válidas.";
    if (!name) return "Preencha o nome.";
    if (grades.length < 2) return "Preencha pelo menos duas notas válidas.";
    return null;
}

function showError(message) {
    document.querySelector(".error").textContent = message;
}

function clearError() {
    document.querySelector(".error").textContent = "";
}

function calculateAverage(grades) {
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return sum / grades.length;
}

function isDuplicateEntry(name, grades, average) {
    if (!lastEntry) return false;

    const sameName = name === lastEntry.name;
    const sameAverage = average === lastEntry.average;
    const sameGrades = grades.every((grade, index) => grade === lastEntry.grades[index]);

    return sameName && sameAverage && sameGrades;
}

function showResult(average) {
    document.getElementById("result").textContent = average.toFixed(2);
}

function addToHistorical(name, grades, average) {
    const tableBody = document.querySelector("#history-table tbody");
    const row = document.createElement("tr");

    const nameCell = createCell(name);
    row.appendChild(nameCell);

    grades.forEach(grade => {
        const gradeCell = createCell(isValidGrade(grade) ? grade.toFixed(2) : "-");
        row.appendChild(gradeCell);
    });

    const avgCell = createCell(average.toFixed(2));
    row.appendChild(avgCell);

    tableBody.appendChild(row);
}

function createCell(content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
}

function clearValue() {
    ["name", "grade1", "grade2", "grade3", "grade4"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("result").textContent = "Média aritmética";
    clearError();
}

document.getElementById("ok-button").addEventListener("click", calculateMedia);

document.getElementById("clear-button").addEventListener("click", clearValue);

function exportHistory() {
    const table = document.getElementById("history-table").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    const fileType = document.getElementById("file-type").value;
  
    if (rows.length === 0) {
      showError("Nenhum histórico para exportar.");
      return;
    }
  
    const isCSV = fileType === "csv";
    const separator = isCSV ? "," : "\t";
    const lineBreak = "\n";
  
    let content = `Nome${separator}Nota 1${separator}Nota 2${separator}Nota 3${separator}Nota 4${separator}Média${lineBreak}`;
  
    for (let row of rows) {
      const cells = row.getElementsByTagName("td");
      const rowData = Array.from(cells)
        .map(cell => {
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
 

document.getElementById("export-button").addEventListener("click", exportHistory);