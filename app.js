// DOM Elements
const calculatorFormEl = document.getElementById("calculatorForm");
const mortgageAmountEl = document.getElementById("mortgageAmount");
const mortgageTermEl = document.getElementById("mortgageTerm");
const mortgageRateEl = document.getElementById("mortgageRate");
const interestOnlyRadioInputEl = document.getElementById("interestOnly");
const repaymentRadioInputEl = document.getElementById("repayment");
const emptyResultsEl = document.querySelector(".results-empty");
const completedResultsEl = document.querySelector(".results-completed");
const monthlyPaymentDOMEl = document.getElementById("monthlyAmount");
const totalPaymentDOMEl = document.getElementById("totalAmount");
const resultsCompletedTitleEl = document.querySelector(".calculator-title-results");

const inputsArray = [mortgageAmountEl, mortgageTermEl, mortgageRateEl];

function showError(element, text) {
    const parentEl = element.parentElement;
    parentEl.classList.add("error");
    const errorMsgEl = parentEl.nextElementSibling;
    errorMsgEl.classList.add("show");
    errorMsgEl.textContent = text;
}

function cleanInputError(element) {
    element.parentElement.classList.remove("error");
    element.parentElement.nextElementSibling.classList.remove("show");
}

function cleanAllErrors() {
    const errorElements = document.querySelectorAll(".error");
    for(const err of errorElements) {
        err.classList.remove("error");
        err.nextElementSibling.classList.remove("show");
    }
}

function cleanRadioInputsError(el) {
    const parentEl = el.parentElement.parentElement;
    const errMsgEl = parentEl.querySelector(".err-msg");
    errMsgEl.classList.remove("show");
}

function validateInputValue(element, allowZero) {
    const elToCheck = element.value.trim();
    if(!elToCheck) {
       showError(element, "This field is required");
       return;
    }
    const convertedEl = Number(elToCheck);
    if(isNaN(convertedEl) || convertedEl < 0 || (convertedEl === 0 && !allowZero)) {
        showError(element, "Insert valid number");
        return;
    };
    return convertedEl;
}

function validateRadioSelection() {
  if (repaymentRadioInputEl.checked === false && interestOnlyRadioInputEl.checked === false) {
    showError(interestOnlyRadioInputEl, "Please select a mortgage type");
    return;
  }
  return repaymentRadioInputEl.checked;
}

function calculateRepaymentAmount(mortgageData) {
    const borrowedAmount = mortgageData.amount;
    const numOfPayments = mortgageData.term * 12;
    const monthlyRate = (mortgageData.rate / 100) / 12;
    const compoundFactor = (1 + monthlyRate) ** numOfPayments;
    
    let monthlyPayment;
    let totalPayment;

    if(mortgageData.isRepaymentType) {
        if(monthlyRate === 0) {
            monthlyPayment = borrowedAmount / numOfPayments;
            totalPayment = borrowedAmount;
            return {monthlyPayment, totalPayment};
        }
        // Repayment total sum
        monthlyPayment = borrowedAmount * (monthlyRate * compoundFactor) / (compoundFactor - 1);
        totalPayment = monthlyPayment * numOfPayments;
    } else {
        // Interest only
        monthlyPayment = borrowedAmount * monthlyRate;
        totalPayment = monthlyPayment * numOfPayments;
    }

    return {monthlyPayment, totalPayment}
}

function displayMortgageRepayments(result) {
    const monthlyPaymentEl = result.monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const totalPaymentEl = result.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    monthlyPaymentDOMEl.textContent = monthlyPaymentEl;
    totalPaymentDOMEl.textContent = totalPaymentEl;

    emptyResultsEl.hidden = true;
    completedResultsEl.hidden = false;
    resultsCompletedTitleEl.focus();  
}

function handleArrowSteps(element, stepAmount, decimals, mathOperation, minValue) {
    cleanInputError(element);
    const currValue = Number(element.value);
    let newValue;

    if(mathOperation === "add") {
        newValue = currValue + stepAmount
    } else {
        newValue = currValue - stepAmount;
    }

    newValue = Math.max(newValue, minValue);
    return newValue.toFixed(decimals);
}

calculatorFormEl.addEventListener("submit", function(e) {
    e.preventDefault();
    cleanAllErrors();
    const mortgageData = {
        amount: validateInputValue(mortgageAmountEl, false),
        term: validateInputValue(mortgageTermEl, false),
        rate: validateInputValue(mortgageRateEl, true), 
        isRepaymentType: validateRadioSelection()
    };

    const hasInvalidField = Object.values(mortgageData).some(value => value === undefined);
    if(hasInvalidField) return;

    const results = calculateRepaymentAmount(mortgageData);
    displayMortgageRepayments(results);
});

for(const input of inputsArray) {
    input.addEventListener("input", function(e) {
            cleanInputError(e.target);
    });
}

mortgageAmountEl.addEventListener("keydown", function(e) {
    if(e.key === "ArrowUp") {
        e.preventDefault();
        const newValue = handleArrowSteps(e.target, 1, 0, "add", 1);
        e.target.value = newValue;
    }

    if(e.key === "ArrowDown") {
        e.preventDefault();
        const newValue = handleArrowSteps(e.target, 1, 0, "subtract", 1);
        e.target.value = newValue;
    }
});

mortgageTermEl.addEventListener("keydown", function(e) {
    if(e.key === "ArrowUp") {
        e.preventDefault();
        const newValue = handleArrowSteps(e.target, 1, 0, "add", 1);
        e.target.value = newValue;
    }

    if(e.key === "ArrowDown") {
        e.preventDefault();
        const newValue = handleArrowSteps(e.target, 1, 0, "subtract", 1);
        e.target.value = newValue;
    }
});

mortgageRateEl.addEventListener("keydown", function(e) {
    if(e.key === "ArrowUp") {
        e.preventDefault();
         const newValue = handleArrowSteps(e.target, 0.1, 1, "add", 0);
         e.target.value = newValue;
    }

    if(e.key === "ArrowDown") {
        e.preventDefault();
        const newValue = handleArrowSteps(e.target, 0.1, 1, "subtract", 0);
        e.target.value = newValue;
    }
});

calculatorFormEl.addEventListener("reset", function() {
    cleanAllErrors();
    emptyResultsEl.hidden = false;
    completedResultsEl.hidden = true;
});

interestOnlyRadioInputEl.addEventListener("change", function(e) {
    cleanRadioInputsError(e.target);
});

repaymentRadioInputEl.addEventListener("change", function(e) {
    cleanRadioInputsError(e.target);
});