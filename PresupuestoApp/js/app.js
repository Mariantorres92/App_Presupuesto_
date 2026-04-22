
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transactionForm');
  const typeEl = document.getElementById('transactionType');
  const descEl = document.getElementById('transactionDescription');
  const amountEl = document.getElementById('transactionAmount');

  const incomeListEl = document.getElementById('incomeList');
  const expenseListEl = document.getElementById('expenseList');

  Transacciones.addTransaction({ type: 'ingreso', description: 'Salario 1', amount: 400 });
  Transacciones.addTransaction({ type: 'ingreso', description: 'Salario 2', amount: 400 });
  Transacciones.addTransaction({ type: 'egreso',  description: 'Renta', amount: 200 });
  Transacciones.addTransaction({ type: 'egreso',  description: 'Comida', amount: 100 });

  function render() {
    const ingresos = Transacciones.getIncome();
    const egresos  = Transacciones.getExpense();
    const { totalIncome, totalExpense } = Transacciones.getTotals();

    Calculos.updateHeaderUI({ totalIncome, totalExpense });

    incomeListEl.innerHTML = ingresos.map(tx => itemIncomeHTML(tx)).join('') || emptyState('No hay ingresos');
    expenseListEl.innerHTML = egresos.map(tx => itemExpenseHTML(tx, totalIncome)).join('') || emptyState('No hay egresos');
  }

  function emptyState(msg) {
    return `<div class="transaction-item"><span class="transaction-description">${msg}</span></div>`;
  }

  function itemIncomeHTML(tx) {
    return `
      <div class="transaction-item" data-id="${tx.id}">
        <span class="transaction-description">${escapeHtml(tx.description)}</span>
        <span class="transaction-amount income-amount">${Calculos.formatSigned(tx.amount, true)}</span>
        <button type="button" class="btn-del" aria-label="Eliminar" title="Eliminar" style="margin-left:12px;border:none;background:transparent;cursor:pointer;">✖</button>
      </div>`;
  }

  function itemExpenseHTML(tx, totalIncome) {
    const pct = totalIncome > 0 ? Calculos.round2((tx.amount / totalIncome) * 100) : 0;
    return `
      <div class="transaction-item" data-id="${tx.id}">
        <span class="transaction-description">${escapeHtml(tx.description)}</span>
        <span class="transaction-amount expense-amount">${Calculos.formatSigned(tx.amount, false)}</span>
        <span class="transaction-percentage">${pct}%</span>
        <button type="button" class="btn-del" aria-label="Eliminar" title="Eliminar" style="margin-left:12px;border:none;background:transparent;cursor:pointer;">✖</button>
      </div>`;
  }

  function onDeleteClick(e) {
    const btn = e.target.closest('.btn-del');
    if (!btn) return;
    const item = btn.closest('.transaction-item');
    const id = item?.dataset?.id;
    if (!id) return;
    Transacciones.removeTransaction(id);
    render();
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  incomeListEl.addEventListener('click', onDeleteClick);
  expenseListEl.addEventListener('click', onDeleteClick);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawType = typeEl.value;
    if (!rawType) {
      alert('Selecciona Ingreso o Egreso');
      return;
    }
    const type = (rawType === 'ingreso' || rawType === 'egreso') ? rawType : '';
    const description = descEl.value;
    const amount = Number(String(amountEl.value).replace(',', '.'));

    try {
      Transacciones.addTransaction({ type, description, amount });
      descEl.value = '';
      amountEl.value = '';
      typeEl.value = '';
      render();
    } catch (err) {
      alert(err.message);
    }
  });

  render();
});
