class Calculator {
  constructor(prevOperandTextElement, currOperandTextElement) {
    this.prevOperandTextElement = prevOperandTextElement;
    this.currOperandTextElement = currOperandTextElement;
    this.clear();
  }

  clear() {
    this.currOperand = "0";
    this.prevOperand = "";
    this.operation = undefined;
  }

  delete() {
    if (this.currOperand === "0") return;
    this.currOperand = this.currOperand.toString().slice(0, -1);
    if (this.currOperand === "" || this.currOperand === "-")
      this.currOperand = "0";
  }

  appendNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    if (this.currOperand === "0" && number !== ".") {
      this.currOperand = number.toString();
    } else {
      this.currOperand = this.currOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.prevOperand);
    const current = parseFloat(this.currOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      case "%":
        // Match legacy behavior: "What percent is prev of curr?" -> prev * 100 / current ??
        // Actually legacy code was: result = number1 * 100 / number2
        // If I hit: 50 % 200, legacy sent num1=50, num2=200. Result: 25.
        // Standard calculator behavior for % depends on context.
        // "50 % 200" on standard calc usually means 50 modulo 200, or 50% * 200.
        // But the user's legacy code was explicit about "f'{number1 * 100 / number2}%'".
        // This means "First number is what percent of Second number".
        // Example: 25 is what percent of 100? -> 25 * 100 / 100 = 25%.
        // Example: 50 is what percent of 200? -> 50 * 100 / 200 = 25%.
        if (current === 0) {
          alert("Divisão por zero não permitida");
          return;
        }
        computation = (prev * 100) / current;
        break;
      default:
        return;
    }

    this.currOperand = computation;
    this.operation = undefined;
    this.prevOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("pt-BR", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay},${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currOperandTextElement.innerText = this.getDisplayNumber(
      this.currOperand.toString().replace(".", ",")
    ).replace(".", ","); // visual hack for PT-BR

    // Actually simpler:
    this.currOperandTextElement.innerText = this.currOperand
      .toString()
      .replace(".", ",");

    if (this.operation != null) {
      this.prevOperandTextElement.innerText = `${this.prevOperand
        .toString()
        .replace(".", ",")} ${this.operation}`;
    } else {
      this.prevOperandTextElement.innerText = "";
    }
  }
}

const prevOperandTextElement = document.getElementById("prev-operand");
const currOperandTextElement = document.getElementById("curr-operand");

const calculator = new Calculator(
  prevOperandTextElement,
  currOperandTextElement
);

document.querySelectorAll("[data-num]").forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

document.querySelectorAll("[data-op]").forEach((button) => {
  button.addEventListener("click", () => {
    // Map visual sympols to internal ops
    let op = button.innerText;
    if (op === "×" || op === "x") op = "*";
    if (op === "÷") op = "/";

    calculator.chooseOperation(op);
    calculator.updateDisplay();
  });
});

document
  .querySelector('[data-action="compute"]')
  .addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
  });

document.querySelector('[data-action="c"]').addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

document.querySelector('[data-action="ce"]').addEventListener("click", () => {
  calculator.delete(); // Or clear entry? Just delete last char for simple CE or reset current
  // Standard CE clears current entry (current number being typed)
  // Legacy had separate CE and C.
  calculator.currOperand = "0";
  calculator.updateDisplay();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if ((e.key >= 0 && e.key <= 9) || e.key === ".") {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
  }
  if (e.key === "Backspace") {
    calculator.delete();
    calculator.updateDisplay();
  }
  if (e.key === "Enter" || e.key === "=") {
    calculator.compute();
    calculator.updateDisplay();
  }
  if (["+", "-", "*", "/"].includes(e.key)) {
    calculator.chooseOperation(e.key);
    calculator.updateDisplay();
  }
});
