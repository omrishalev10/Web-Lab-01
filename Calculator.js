var calculation = '';

let isSecondMode = false;

function handleButtonClick(button) {
    const buttonText = button.textContent;

    // Toggle background color for the "2nd" button
    if (buttonText === '2nd') {
        button.classList.toggle('active');
        toggleSecondMode();
        return;
    }

    // Function to toggle the "2nd" mode
    function toggleSecondMode() {
        //isSecondMode = !isSecondMode;
        alert('This button is not implemented yet.');
        updateButtonLabels();
    }

    // Function to update button labels based on the "2nd" mode state
    function updateButtonLabels() {
        const buttonsToToggle = document.querySelectorAll('.button-row:not(.button-group) .button:first-child');
        buttonsToToggle.forEach((button) => {
            if (isSecondMode) {
                switch (button.textContent) {
                    case 'x²':
                        button.textContent = 'x³';
                        break;
                    case '√':
                        button.textContent = '∛';
                        break;
                    case 'x^y':
                        button.textContent = 'y√x';
                        break;
                }
            } else {
                switch (button.textContent) {
                    case 'x³':
                        button.textContent = 'x²';
                        break;
                    case '∛':
                        button.textContent = '√';
                        break;
                    case 'y√x':
                        button.textContent = 'x^y';
                        break;
                }
            }
        });
    }

    /* Handle regular button clicks */
    switch (buttonText) {
        case 'CE':
            clearResult();
            break;
        case '=':
            calculateResult();
            break;
        case 'X':
            appendToResult('*');
            break;
        case '⌫':
            var resultElement = document.getElementById("result");
            var currentText = resultElement.innerHTML;
            resultElement.innerHTML = currentText.slice(0, -1);
            calculation = calculation.slice(0, -1);
            break;
        case 'e':
            appendToResult(Math.E.toString());
            break;
        case 'π':
            appendToResult(Math.PI.toString());
            break;
        case 'mod':
            appendToResult('%');
            break;
        case 'x²':
            calculatePow(2);
            break;
        case 'xy':
            appendToResult('**');
            break;
        case '2√x':
            appendToResult('√(');
            break;
        case 'log':
            appendToResult('log(');
            break;
        case 'ln':
            appendToResult('ln(');
            break;
        case 'n!':
            handleFactorial();
            break;
        case '10x':
            appendToResult('(10**');
            break;
        case '1/x':
            appendToResult('1/(');
            break;
        case '|x|':
            appendToResult('abs(');
            break;
        case 'exp':
            appendToResult('Math.exp(');
            break;
        case 'MC':
            // Clear memory
            clearMemory();
            break;
        case 'MR':
            // Recall memory
            recallMemory();
            break;
        case 'M+':
            // Add to memory
            addToMemory();
            break;
        case 'M-':
            // Subtract from memory
            subtractFromMemory();
            break;
        case 'MS':
            // Store result in memory
            storeInMemory();
            break;
        case 'Mv':
            // Paste memory value to display
            pasteMemoryValue();
            break;
        default:
            appendToResult(buttonText);
            break;
    }
}

// Function to append values to the result
function appendToResult(value) {
    calculation += value;
    updateResultDisplay();
}

// Function to clear the result and reset the calculation variable
function clearResult() {
    calculation = '';
    updateResultDisplay();
}

function calculateResult() {
    try {
      // Replace 'log' with 'Math.log10', 'ln(' with 'Math.log(', '√(' with 'Math.sqrt(', '(10**' with 'Math.pow(10,', '1/(' with '(1/(', '|x|' with 'Math.abs(', and 'exp' with 'Math.exp('
      const replacedCalculation = calculation.replace(/log/g, 'Math.log10').replace(/ln\(/g, 'Math.log(').replace(/√\(/g, 'Math.sqrt(').replace(/\(10\*\*/g, 'Math.pow(10,').replace(/\(1\//g, '(1/(').replace(/abs\(/g, 'Math.abs(').replace(/\|/g, 'Math.abs(').replace(/exp/g, 'Math.exp(');
      const result = eval(replacedCalculation);
      document.getElementById("result").textContent = result;
      calculation = result.toString();
    } catch (error) {
      document.getElementById("result").textContent = 'Error';
      calculation = '';
    }
  }
  
// Function to update the result display
function updateResultDisplay() {
    document.getElementById("result").textContent = calculation;
}

// Function for Power (x^y) operation
function calculatePow(exponent) {
    var resultElement = document.getElementById("result");
    try {
        // Check if there is a base and an exponent
        const match = calculation.match(/(?:\b(?:Math\.)?[0-9.]+)\*\*(\d+)/);
        if (match) {
            const result = Math.pow(eval(match[0]), exponent);
            resultElement.innerHTML = result;
            calculation = result.toString();
        } else {
            // If no explicit base, check for parentheses at the start and end
            const hasParentheses = calculation.startsWith('(') && calculation.endsWith(')');
            
            // If parentheses present, square the entire expression
            if (hasParentheses) {
                const result = Math.pow(eval(calculation), exponent);
                resultElement.innerHTML = result;
                calculation = result.toString();
            } else {
                // Otherwise, append the exponent to the last number
                const lastNumber = calculation.match(/(?:\d*\.)?\d+$/);
                if (lastNumber) {
                    calculation += `**${exponent}`;
                    resultElement.innerHTML += `^${exponent}`;
                }
            }
        }
    } catch (error) {
        resultElement.innerHTML = 'Error';
        calculation = '';
    }
}

function calculateSquareRoot() {
    var resultElement = document.getElementById("result");
    try {
        // Use the Math.sqrt function to calculate the square root
        var result = Math.sqrt(eval(calculation));
        resultElement.innerHTML = `√(${calculation})`;
        calculation = result.toString() + ')';
    } catch (error) {
        resultElement.innerHTML = 'Error';
        calculation = '';
    }
}



// Function to calculate factorial
function handleFactorial() {
    var resultElement = document.getElementById("result");
    try {
        const value = eval(calculation);
        const result = factorial(value);
        resultElement.innerHTML = `${value}!`;
        calculation = result.toString();
    } catch (error) {
        resultElement.innerHTML = 'Error';
        calculation = '';
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/* Memory Buttons */
let memoryValue = 0;

function clearMemory() {
    memoryValue = 0;
}
  
function recallMemory() {
    calculation += memoryValue;
    updateResultDisplay();
}
  
function addToMemory() {
    try {
        const result = eval(calculation);
        memoryValue += result;
    } catch (error) {
        document.getElementById("result").textContent = 'Error';
        calculation = '';    }
}

function subtractFromMemory() {
    try {
        const result = eval(calculation);
        memoryValue -= result;
    } catch (error) {
        document.getElementById("result").textContent = 'Error';
        calculation = '';    }
}

function storeInMemory() {
    try {
        const result = eval(calculation);
        memoryValue = result;
    } catch (error) {
        document.getElementById("result").textContent = 'Error';
        calculation = '';    }
}

function pasteMemoryValue() {
    calculation += memoryValue;
    updateResultDisplay();
}