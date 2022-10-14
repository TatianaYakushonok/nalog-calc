const formatCurrency = n =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n);

const nav = document.querySelectorAll('.navigation__link');
const calc = document.querySelectorAll('.calc');

nav.forEach(el => {
    el.addEventListener('click', function(e) {
        e.preventDefault();
        calc.forEach(elem => {
            if (el.dataset.tax === elem.dataset.tax) {
                elem.classList.add('calc_active');
            } else {
                elem.classList.remove('calc_active');
            }
        })
    })
})

function changeClassActive() {
    for (let i = 0; i < nav.length; i++) {
        nav[i].classList.remove('navigation__link_active');
    }
    this.classList.add('navigation__link_active');
}

for (let i = 0; i < nav.length; i++) {
    nav[i].addEventListener('click', changeClassActive, false);
};

// calculator ausn

const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', function() {
    if (formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        formAusn.expenses.value = '';
    }

    if (formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = 'block';
        resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
    }
})

// calculator self-employment

const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resultSelfEmployment = selfEmployment.querySelector('.result__tax_total');
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');

const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
const resultTaxResult =selfEmployment.querySelector('.result__tax_result');

const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
    calcCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach(elem => {
        elem.style.display = setDisplay;
    })
}

checkCompensation();

formSelfEmployment.addEventListener('input', function() {
    const resultIndividual = formSelfEmployment.fiz.value * 0.04;
    const resultEntity = formSelfEmployment.yr.value * 0.06;

    checkCompensation();
    formSelfEmployment.compensation.value = 
        formSelfEmployment.compensation.value > 10_000 ? 10_000 : formSelfEmployment.compensation.value;
    const tax = resultIndividual + resultEntity;
    const benefits = formSelfEmployment.compensation.value;
    const resBenefits = formSelfEmployment.fiz.value * 0.01 + formSelfEmployment.yr.value * 0.02;
    const finalBenefits = benefits - resBenefits > 0 ? benefits - resBenefits : 0;
    const finalTax = tax - (benefits - finalBenefits);
    
    resultSelfEmployment.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent =formatCurrency(benefits - finalBenefits);
    resultTaxRestCompensation.textContent =formatCurrency(finalBenefits);
    resultTaxResult.textContent =formatCurrency(finalTax);
})

// calculator osno

const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');

const resultBlockNdflExpenditure = osno.querySelector('.result__block_ndfl-expenditure');
const resultBlockNdflIncome = osno.querySelector('.result__block_ndfl-income');
const resultBlockTaxIncome = osno.querySelector('.result__block_tax-income');

const resultTaxNds = osno.querySelector('.result__tax_total');
const resultTaxProperty = osno.querySelector('.result__tax_property');
const resultTaxNdflExpenditure = osno.querySelector('.result__tax_ndfl-expenditure');
const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
const resultTaxIncome = osno.querySelector('.result__tax_income');

resultBlockTaxIncome.style.display = 'none';

formOsno.addEventListener('input', () => {
    if (formOsno.type.value === 'business') {
        resultBlockTaxIncome.style.display = 'none';
        resultBlockNdflExpenditure.style.display = 'block';
        resultBlockNdflIncome.style.display = 'block';
    }

    if (formOsno.type.value === 'corporation') {
        resultBlockTaxIncome.style.display = 'block';
        resultBlockNdflExpenditure.style.display = 'none';
        resultBlockNdflIncome.style.display = 'none';
    }
})