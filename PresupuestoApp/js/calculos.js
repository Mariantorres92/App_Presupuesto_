
(function (global) {
  'use strict';

  // Utilidades internas 
  const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /** Redondea a 2 decimales y devuelve Number */
  function round2(n) {
    return Number.parseFloat(Number(n).toFixed(2));
  }

  /** Formatea una cantidad con signo (+/-) y 2 decimales: "+ 123.45" / "- 67.00" */
  function formatSigned(amount, isIncome = true) {
    const sign = isIncome ? '+' : '-';
    return `${sign} ${round2(Math.abs(amount)).toFixed(2)}`;
  }

  /** Suma segura de una lista de números. Ignora NaN/undefined/null. */
  function sum(numbers) {
    return round2(
      numbers.reduce((acc, n) => (Number.isFinite(+n) ? acc + (+n) : acc), 0)
    );
  }

  
  /** Devuelve "Presupuesto de <Mes> <YYYY>" para la fecha dada (o hoy). */
  function getCurrentMonthTitle(date = new Date()) {
    const month = MONTHS_ES[date.getMonth()];
    const year = date.getFullYear();
    return `Presupuesto de ${month} ${year}`;
  }

  /** Calcula el total de ingresos a partir de:
   *  - Array de números: [100, 50, 20]
   *  - o Array de objetos con { amount, type } (filtra por type === 'income'/'ingreso')
   */
  function calcTotalIncome(list) {
    if (!Array.isArray(list)) return 0;
    const values = list.map(it => {
      if (typeof it === 'number') return it;
      if (it && typeof it.amount !== 'undefined' && (it.type === 'income' || it.type === 'ingreso')) {
        return +it.amount;
      }
      return 0;
    });
    return sum(values);
  }

  /** Calcula el total de egresos: acepta números o objetos { amount, type:'expense'/'egreso' } */
  function calcTotalExpense(list) {
    if (!Array.isArray(list)) return 0;
    const values = list.map(it => {
      if (typeof it === 'number') return it;
      if (it && typeof it.amount !== 'undefined' && (it.type === 'expense' || it.type === 'egreso')) {
        return +it.amount;
      }
      return 0;
    });
    return sum(values);
  }

  /** Presupuesto total = ingresos - egresos */
  function calcBudgetTotal(totalIncome, totalExpense) {
    return round2((+totalIncome || 0) - (+totalExpense || 0));
  }

  /** Porcentaje de gastos = (egresos / ingresos) * 100. Si ingresos = 0, devuelve 0. */
  function calcExpensePercentage(totalIncome, totalExpense) {
    const inc = +totalIncome || 0;
    const exp = +totalExpense || 0;
    if (inc <= 0) return 0;
    return round2((exp / inc) * 100);
  }

  // --- Helpers de UI (opcionales): actualizan elementos por ID ya definidos en el HTML) ---
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /** Actualiza los elementos de cabecera:
   *  #budgetTitle, #totalIncome, #totalExpense, #totalBudget, #expensePercentage
   */
  function updateHeaderUI({ totalIncome = 0, totalExpense = 0 } = {}) {
    const budget = calcBudgetTotal(totalIncome, totalExpense);
    const pct = calcExpensePercentage(totalIncome, totalExpense);

    // Título de mes
    setText('budgetTitle', getCurrentMonthTitle());

    // Totales formateados
    setText('totalIncome', formatSigned(totalIncome, true));
    setText('totalExpense', formatSigned(totalExpense, false));

    // Presupuesto: signo depende de si es >= 0
    setText('totalBudget', formatSigned(budget, budget >= 0));

    // Porcentaje de gastos (ej. "35%")
    setText('expensePercentage', `${pct}%`);
  }

  // API pública
  const Calculos = {
    round2,
    formatSigned,
    getCurrentMonthTitle,
    calcTotalIncome,
    calcTotalExpense,
    calcBudgetTotal,
    calcExpensePercentage,
    updateHeaderUI
  };

  // Exponer en window para consumo desde otras capas
  global.Calculos = Calculos;

})(window);
