const formatCurrency = n =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n);

const debounceTimer = (fn, msec) => {

    let lastCall = 0;
    let lastCallTimer;

    return (...arg) => {
        const previouseCall = lastCall;
        lastCall = Date.now();

        if (previouseCall && ((lastCall - previouseCall) <= msec)) {
            clearTimeout(lastCallTimer);
        };

        lastCallTimer = setTimeout(() => {
            fn(...arg);
        }, msec);
    }
};

{
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
}

{
    // calculator ausn

    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';

    formAusn.addEventListener('input', debounceTimer((e) => {

        const income = +formAusn.income.value;

        if (formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(income * 0.08);
            formAusn.expenses.value = '';
        }

        if (formAusn.type.value === 'expenses') {
            const expenses = +formAusn.expenses.value;
            const profit = income < expenses ? 0 : income - expenses;
            calcLabelExpenses.style.display = '';
            resultTaxTotal.textContent = formatCurrency((profit) * 0.2);
        }
    }, 500));
}
{
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

    formSelfEmployment.addEventListener('input', debounceTimer((e) => {

        const fiz = +formSelfEmployment.fiz.value;
        const yr = +formSelfEmployment.yr.value;

        const resultIndividual = fiz * 0.04;
        const resultEntity = yr * 0.06;

        checkCompensation();

        formSelfEmployment.compensation.value = 
            +formSelfEmployment.compensation.value > 10_000 ? 10_000 : formSelfEmployment.compensation.value;
        const tax = resultIndividual + resultEntity;
        const benefits = +formSelfEmployment.compensation.value;
        const resBenefits = fiz * 0.01 + yr * 0.02;
        const finalBenefits = benefits - resBenefits > 0 ? benefits - resBenefits : 0;
        const finalTax = tax - (benefits - finalBenefits);

        resultSelfEmployment.textContent = formatCurrency(tax);
        resultTaxCompensation.textContent =formatCurrency(benefits - finalBenefits);
        resultTaxRestCompensation.textContent =formatCurrency(finalBenefits);
        resultTaxResult.textContent =formatCurrency(finalTax);
    }, 500));
}
{
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

    formOsno.addEventListener('input', debounceTimer((e) => {
        checkFormBusiness();

        const income = +formOsno.income.value;
        const expenditure = +formOsno.expenditure.value;
        const property = +formOsno.property.value;

        const nds = income * 0.2;
        const taxProperty = property * 0.02;
        const profit = income < expenditure ? 0 : income - expenditure;
        const ndflExpenditure = profit * 0.13;
        const ndflIncome = (income - nds) * 0.13;
        const TaxProfit = profit * 0.2;

        resultTaxNds.textContent = formatCurrency(nds);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
        resultTaxNdflExpenditure.textContent = formatCurrency(ndflExpenditure);
        resultTaxNdflIncome.textContent = formatCurrency(ndflIncome);
        resultTaxProfit.textContent = formatCurrency(TaxProfit);
    }, 500));
}
{
    // calculator usn

    const LIMIT = 300_000;

    const usn = document.querySelector('.usn');
    const formUsn = usn.querySelector('.calc__form');

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
    const calcLabelProperty = usn.querySelector('.calc__label_property');
    const resultBlockProperty = usn.querySelector('.result__block_property');

    const resultUsnTotal = usn.querySelector('.result__tax_total');
    const resultUsnProperty = usn.querySelector('.result__tax_property');

    const checkShopProperty = (typeTax) => {
        switch(typeTax) {
            case 'income': {
                calcLabelExpenses.style.display =  'none';
                calcLabelProperty.style.display =  'none';
                resultBlockProperty.style.display = 'none';

                formUsn.expenses.value = '';
                formUsn.property.value = '';
                break;
            }
            case 'ip-expenses': {
                calcLabelExpenses.style.display =  '';
                calcLabelProperty.style.display =  'none';
                resultBlockProperty.style.display = 'none';

                formUsn.property.value = '';
                break;
            }
            case 'ooo-expenses': {
                calcLabelExpenses.style.display =  '';
                calcLabelProperty.style.display =  '';
                resultBlockProperty.style.display = '';
                break;
            }
        }
    }

    const percent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }

    checkShopProperty(formUsn.typeTax.value);

    formUsn.addEventListener('input', debounceTimer((e) => {
        checkShopProperty(formUsn.typeTax.value);

        const income = +formUsn.income.value;
        const expenses = +formUsn.expenses.value;
        const сontributions = +formUsn.сontributions.value;
        const property = +formUsn.property.value;

        let profit = income - сontributions;

        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses;
        };

        const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
        const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
        let tax = summ * percent[formUsn.typeTax.value];
        let taxProperty = property * 0.02;

        resultUsnTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
        resultUsnProperty.textContent = formatCurrency(taxProperty);
    }, 500));
}

{
    // 13%

    const taxReturn = document.querySelector('.tax-return');
    const formTaxReturn = taxReturn.querySelector('.calc__form');

    const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
    const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
    const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

    formTaxReturn.addEventListener('input', debounceTimer((e) => {
        
        const expenses = +formTaxReturn.expenses.value;
        const income = +formTaxReturn.income.value;

        const sumExpenses = +formTaxReturn.sumExpenses.value;

        const ndfl = income * 0.13;
        const possibleDeductuion = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
        const deduction = possibleDeductuion < ndfl ? possibleDeductuion : ndfl;

        resultTaxNdfl.textContent = formatCurrency(ndfl);
        resultTaxPossible.textContent = formatCurrency(possibleDeductuion);
        resultTaxDeduction.textContent = formatCurrency(deduction);
        
    }, 500));
}