(function (global) {
    'use strict';

//Variables y Elementos// 
const incomeInput = document.getElementById('incomeList');
const expenseInput = document.getElementById('expenseList');

let income = [
    { description: 'Salario 1', amount: 400 },
    { description: 'Salario 2', amount: 400 }
];

let expenses = [
    { description: 'Renta', amount: 200 },
    { description: 'Comida', amount: 100 }
];

//Funciones principales//

function mostrarlistas() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    
    income.forEach(item => {
        const li = document.createElement('li');
        div.classList.add('Transaction-item');
        div.innerHTML = `
                <span class="transaction-description">${item.description}</span>
                <span class="transaction-amount income-amount">${item.valor.toFixed(2)}</span>
            `;
        incomeList.appendChild(li);
    });

// Calcular porcentajes anstes de mostrar egresos// 
calcularPorcentajes();

    expenses.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('Transaction-item');
        div.innerHTML = `
            <span class="transaction-description">${item.description}</span>
            <><span class="transaction-amount expense-amount">${item.amount.toFixed(2)}</span>
            <span class="expense-percentage">${item.percentage}%</span></>
        `;
        expenseList.appendChild(div);
    });
}

// Calcular porcentajes de egresos //
function calcularPorcentajes() {
    const totalIncome = income.reduce((sum, ing) => sum + ing.amount, 0);
    expenses.forEach(egr => {
        const percentage = totalIngresos ? ((egr.amount / totalIngresos) * 100).toFixed(1) : 0;
        egr.percentage = percentage;
    });
}

//Cambio de pestañas//
const tabIncome = document.getElementById('tab-income');
const tabExpenses = document.getElementById('tab-expenses');

if (tabIncome && tabExpenses) {
    tabIncome.addEventListener('click', () => {
        incomeList.classList.add('active');
        expenseList.classList.remove('active');
    });
    
    tabExpenses.addEventListener('click', () => {
        expenseList.classList.add('active');
        incomeList.classList.remove('active');
    });
}

//Actualizar Interfaz//
function agregarIngreso(description, amount) {
    income.push({ description, amount: parseFloat(amount) });
    mostrarlistas();
}

function agregarEgreso(description, amount) {
    expenses.push({ description, amount: parseFloat(amount) });
    mostrarlistas();
}

//Inicializar//
mostrarlistas();

global.agregarIngreso = agregarIngreso;
global.agregarEgreso = agregarEgreso;