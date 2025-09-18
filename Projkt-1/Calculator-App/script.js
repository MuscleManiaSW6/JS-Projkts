//*<--- storing DOM elements into constants --->
const btnEl = document.querySelectorAll(".btn");
const spanEl = document.getElementById("result");


//*<--- global variables --->
let displayValue = "0";         //stores the value to be shown on calculator display and also works as variable to store the value of second number
let firstOperand = null;        // stores the value of first number
let operator = null;            // stores the values of operator
let waitingForSecond = false;   //flag to tell if we are typing first number or second number 


//*<--- function to update numbers on calculator --->
function updateDisplay() {
    
    spanEl.textContent = displayValue;
    

    const maxLength = 14;
    if (displayValue.length > maxLength) {
        const scale = maxLength / displayValue.length;
        spanEl.style.fontSize = `${28 * scale}px`
    } else {
        spanEl.style.fontSize = "28px";
    }

}

updateDisplay();          //starts the app with "0" as default calculator display

//*<--- mouse event trigger --->
btnEl.forEach(btn=>{
    btn.addEventListener("click", ()=>{           // arrow function to call functions based on what btn is clicked
          
        const value = btn.textContent.trim();

        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value)) {
            handleNumber(value);
        } else if (value === ".") {
            handleDecimal(value);
        } else if (["+", "-", "*", "/"].includes(value)) {
            handleOperator(value);
        } else if (value === "=") {
            handleEquals();
        } else if (value === "C") {
            handleClear();
        }
        
        updateDisplay();          //updates the display after the result of if-else statement
    });
});

//*<--- keyboard event trigger --->
document.addEventListener("keydown", handleKeypress);

function handleKeypress(event) {                 // function to call functions based on what key is pressed
    const key = event.key;

        if(!isNaN(key)) {
            handleNumber(key);
        } else if (key === ".") {
            handleDecimal(key);
        } else if (["+", "-", "*", "/"].includes(key)) {
            handleOperator(key);
        } else if (key === "=" || key === "Enter") {
            handleEquals();
        } else if (key === "c" || key === "C") {
            handleClear();
        }

        updateDisplay();
}


//* <--- function to handle numbers when "any number" is clicked or pressed --->
function handleNumber(value) {

    if(waitingForSecond) {          // checks for second number to be entered
        displayValue = value;       // updates the display with the second number
        waitingForSecond = false;   // set to default as already typing the second number and goes into else statement 
    } else {
        displayValue = displayValue === "0" ? value : displayValue + value;         //appends the number on the display
    }
}


//*<--- function to handle operators when "any operator" is clicked or pressed --->

function handleOperator(value) {
    if (waitingForSecond) {
        operator = value;
        return;
    }
    firstOperand = +displayValue;    // stores the value of first operand
    operator = value;                // stores the value of operator
    waitingForSecond = true;         // next typed numbers will be the second operand

}

//*<--- function to add decimal when "." is clicked or pressed --->
function handleDecimal(value) {

    if(waitingForSecond) {              // checks if this is the second number
        displayValue = "0.";            // add "0." in-front of the number when "." is pressed after pressing any operator
        waitingForSecond = false;       //setting to default
        return;                         // exits the function
    }

    if(!displayValue.includes(".")) {   //checking if the number already includes a decimal
        displayValue += value;          //appends the decimal onto the number
    }

}

//*<--- function to do calculation when "=/Enter" is clicked or pressed --->
function handleEquals(value) {
    if(operator === null || firstOperand === null) return;           // do nothing when when first number or operator is not entered yet and exit the function
    
    let result = calculate(+firstOperand, +displayValue, operator); 
    
    displayValue = result.toString();     // displays the result
    operator = null;                      // resets the operator
    if(result === "Error") {              // stores the value of result to chain it for the next operation
        firstOperand = null;
    } else {
        firstOperand = result;    
    }

    waitingForSecond = true;               // flag to indicate next entered number is second number
}

//*<--- function to reset the calculator when "C/c" is clicked or pressed --->
function handleClear(value) {
    displayValue = "0";          // resets display 
    operator = null;             // resets operator
    firstOperand = null;         // resets first number
    waitingForSecond = false;    // resets the second number flag
}

//*<--- function to calculate the result based on the inputs of operands and operator --->
function calculate(num1, num2, operator) {
    switch (operator) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num2 !== 0 ? num1 / num2 : "Error";
        default:
            return "Error";
    }
}


