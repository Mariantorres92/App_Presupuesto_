
(function (global) {
  'use strict';

  // Estado interno
  const state = {
    ingresos: [],  
    egresos: []    
  };

  // Utilidades
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function normalizeType(t) {
    const v = String(t || '').toLowerCase().trim();
    if (v === 'ingreso' || v === 'income') return 'ingreso';
    if (v === 'egreso' || v === 'expense') return 'egreso';
    return '';
  }

  function toAmount(n) {
    const num = Number(n);
    return Number.isFinite(num) ? num : NaN;
  }

  // Crear objeto transacción validado
  function createTransaction({ type, description, amount }) {
    const t = normalizeType(type);
    const a = toAmount(amount);
    const d = String(description || '').trim();

    if (!t) throw new Error('Tipo inválido (ingreso/egreso).');
    if (!d) throw new Error('La descripción es obligatoria.');
    if (!Number.isFinite(a) || a <= 0) throw new Error('Monto inválido (número > 0).');

    return {
      id: uid(),
      type: t,           
      description: d,
      amount: a
    };
  }

  // Mutadores
  function addTransaction(txInput) {
    const tx = createTransaction(txInput);
    if (tx.type === 'ingreso') state.ingresos.push(tx);
    else state.egresos.push(tx);
    return tx;
  }

  function removeTransaction(id) {
    const rm = (arr) => {
      const i = arr.findIndex(x => x.id === id);
      if (i >= 0) { arr.splice(i, 1); return true; }
      return false;
    };
    return rm(state.ingresos) || rm(state.egresos);
  }

  function clearAll() {
    state.ingresos.length = 0;
    state.egresos.length = 0;
  }

  // Selectores
  const getIncome = () => [...state.ingresos];
  const getExpense = () => [...state.egresos];

  // Totales y métricas 
  function getTotals() {
  
    const totalIncome = Calculos.calcTotalIncome(state.ingresos);
    const totalExpense = Calculos.calcTotalExpense(state.egresos);
    const budget = Calculos.calcBudgetTotal(totalIncome, totalExpense);
    const expensePct = Calculos.calcExpensePercentage(totalIncome, totalExpense);
    return { totalIncome, totalExpense, budget, expensePct };
  }

  // API pública
  const Transacciones = {
    state,
    addTransaction,
    removeTransaction,
    clearAll,
    getIncome,
    getExpense,
    getTotals
  };

  global.Transacciones = Transacciones;

})(window);
