const display = document.getElementById('display');
let firstOperand = '';
let operator = '';
let waitingForSecondOperand = false;

function inputNumber(num) {
  if (display.textContent === '0' || waitingForSecondOperand) {
    display.textContent = num;
    waitingForSecondOperand = false;
  } else if (display.textContent.length < 15) {
    display.textContent += num;
  }
}

function inputDot() {
  if (waitingForSecondOperand) {
    display.textContent = '0.';
    waitingForSecondOperand = false;
    return;
  }
  if (!display.textContent.includes('.')) {
    display.textContent += '.';
  }
}

function clearDisplay() {
  display.textContent = '0';
  firstOperand = '';
  operator = '';
  waitingForSecondOperand = false;
}

function backspace() {
  if (waitingForSecondOperand) return;
  if (display.textContent.length === 1) {
    display.textContent = '0';
    return;
  }
  display.textContent = display.textContent.slice(0, -1);
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(display.textContent.replace(',', '.'));
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }
  if (firstOperand === '') {
    firstOperand = inputValue;
  } else if (operator) {
    const result = operate(firstOperand, inputValue, operator);
    display.textContent = result;
    firstOperand = result;
  }
  operator = nextOperator;
  waitingForSecondOperand = true;
}

function operate(a, b, op) {
  switch (op) {
    case 'add': return (a + b).toString();
    case 'subtract': return (a - b).toString();
    case 'multiply': return (a * b).toString();
    case 'divide': return b === 0 ? 'Error' : (a / b).toString();
    default: return b.toString();
  }
}

document.querySelectorAll('.num').forEach(btn => {
  btn.addEventListener('click', e => {
    const value = btn.getAttribute('data-num');
    if (value === '.') {
      inputDot();
    } else {
      inputNumber(value);
    }
  });
});

document.querySelectorAll('.op').forEach(btn => {
  btn.addEventListener('click', e => {
    const action = btn.getAttribute('data-action');
    if (action === 'clear') {
      clearDisplay();
    } else if (action === 'back') {
      backspace();
    } else {
      handleOperator(action);
    }
  });
});

document.querySelector('.equal').addEventListener('click', () => {
  if (!operator) return;
  const inputValue = parseFloat(display.textContent.replace(',', '.'));
  const result = operate(firstOperand, inputValue, operator);
  display.textContent = result;
  firstOperand = '';
  operator = '';
  waitingForSecondOperand = false;
});

// Permitir teclado numérico
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  if (e.key === '.') inputDot();
  if (e.key === '+' || e.key === '-') handleOperator(e.key === '+' ? 'add' : 'subtract');
  if (e.key === '*' || e.key === 'x') handleOperator('multiply');
  if (e.key === '/') handleOperator('divide');
  if (e.key === 'Enter' || e.key === '=') document.querySelector('.equal').click();
  if (e.key === 'Backspace') backspace();
  if (e.key.toLowerCase() === 'c') clearDisplay();
});