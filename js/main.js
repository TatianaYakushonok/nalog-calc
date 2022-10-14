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
        calcLabelExpenses.style.display = '';
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
const resultBlockTaxProfit = osno.querySelector('.result__block_tax-profit');

const resultTaxNds = osno.querySelector('.result__tax_nds');
const resultTaxProperty = osno.querySelector('.result__tax_property');
const resultTaxNdflExpenditure = osno.querySelector('.result__tax_ndfl-expenditure');
const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
const resultTaxProfit = osno.querySelector('.result__tax_profit');

const checkFormBusiness = () => {
    if (formOsno.type.value === 'business') {
        resultBlockTaxProfit.style.display = 'none';
        resultBlockNdflExpenditure.style.display = '';
        resultBlockNdflIncome.style.display = '';
    }

    if (formOsno.type.value === 'corporation') {
        resultBlockTaxProfit.style.display = '';
        resultBlockNdflExpenditure.style.display = 'none';
        resultBlockNdflIncome.style.display = 'none';
    }
};

checkFormBusiness();

formOsno.addEventListener('input', () => {
    checkFormBusiness();

    const income = formOsno.income.value;
    const expenditure = formOsno.expenditure.value;
    const property = formOsno.property.value;

    const nds = income * 0.2;
    const taxProperty = property * 0.02;
    const profit = income - expenditure;
    const ndflExpenditure = profit * 0.13;
    const ndflIncome = (income - nds) * 0.13;
    const TaxProfit = profit * 0.2;

    resultTaxNds.textContent = nds;
    resultTaxProperty.textContent = taxProperty;
    resultTaxNdflExpenditure.textContent = ndflExpenditure;
    resultTaxNdflIncome.textContent = ndflIncome;
    resultTaxProfit.textContent = TaxProfit;
});

// calculator usn

