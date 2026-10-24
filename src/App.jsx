import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";
import useExpense from "./lib/expense.lib";

const ExpenseForm = ({ formData, handleInput, errorInput, isEdit = false, onSubmit, onCancel }) => (

  <form
    onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    className="space-y-5"
  >
    <div className="space-y-1.5">
      <label
        htmlFor={`${isEdit ? "edit" : "add"}-title`}
        className="text-sm font-semibold text-[#4A1F99]"
      >
        Expense Title
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-[#FCFAFF] px-4 transition-all duration-200 focus-within:border-[#7132DD] focus-within:ring-4 focus-within:ring-[#7132DD]/10 
        ${errorInput === "title" ? "border-red-400" : "border-[#E7DCF8]"}`}
      >
        <i className="ri-price-tag-3-line text-xl text-[#7132DD]" />
        <input id={`${isEdit ? "edit" : "add"}-title`} type="text" name="title" value={formData.title} onChange={handleInput} placeholder="e.g. Grocery shopping" className="w-full bg-transparent py-3.5 text-sm text-[#4A1F99] outline-none placeholder:text-[#A49AB8]" />
      </div>
    </div>

    <div className="space-y-1.5">
      <label htmlFor={`${isEdit ? "edit" : "add"}-description`} className="text-sm font-semibold text-[#4A1F99]">Description</label>
      <div className={`flex items-start gap-3 rounded-xl border bg-[#FCFAFF] px-4 transition-all duration-200 focus-within:border-[#7132DD] focus-within:ring-4 focus-within:ring-[#7132DD]/10 ${errorInput === "description" ? "border-red-400" : "border-[#E7DCF8]"}`}>
        <i className="ri-file-text-line mt-3.5 text-xl text-[#7132DD]" />
        <textarea id={`${isEdit ? "edit" : "add"}-description`} name="description" value={formData.description} onChange={handleInput} rows={2} placeholder="What was this expense for?" className="w-full resize-none bg-transparent py-3.5 text-sm text-[#4A1F99] outline-none placeholder:text-[#A49AB8]" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <label htmlFor={`${isEdit ? "edit" : "add"}-amount`} className="text-sm font-semibold text-[#4A1F99]">Amount (₹)</label>
        <div className={`flex items-center gap-3 rounded-xl border bg-[#FCFAFF] px-4 transition-all duration-200 focus-within:border-[#7132DD] focus-within:ring-4 focus-within:ring-[#7132DD]/10 ${errorInput === "amount" ? "border-red-400" : "border-[#E7DCF8]"}`}>
          <i className="ri-money-rupee-circle-line text-xl text-[#7132DD]" />
          <input id={`${isEdit ? "edit" : "add"}-amount`} type="number" name="amount" min="0" step="0.01" value={formData.amount} onChange={handleInput} placeholder="0.00" className="w-full min-w-0 bg-transparent py-3.5 text-sm text-[#4A1F99] outline-none placeholder:text-[#A49AB8]" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${isEdit ? "edit" : "add"}-date`} className="text-sm font-semibold text-[#4A1F99]">Date</label>
        <div className={`flex items-center gap-3 rounded-xl border bg-[#FCFAFF] px-4 transition-all duration-200 focus-within:border-[#7132DD] focus-within:ring-4 focus-within:ring-[#7132DD]/10 ${errorInput === "date" ? "border-red-400" : "border-[#E7DCF8]"}`}>
          <i className="ri-calendar-line text-xl text-[#7132DD]" />
          <input id={`${isEdit ? "edit" : "add"}-date`} type="date" name="date" value={formData.date} onChange={handleInput} className="w-full min-w-0 bg-transparent py-3.5 text-sm text-[#4A1F99] outline-none" />
        </div>
      </div>
    </div>

    <div className="flex flex-col-reverse gap-3 border-t border-[#E7DCF8] pt-5 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} className="rounded-xl border border-[#E7DCF8] px-5 py-3 text-sm font-semibold text-[#4A1F99] transition-all duration-200 hover:bg-[#F2EFFA] active:scale-[0.98]">Cancel</button>
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1F99] to-[#7132DD] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7132DD]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7132DD]/30 active:scale-[0.98]">
        <i className={isEdit ? "ri-save-line text-lg" : "ri-add-line text-lg"} />
        {isEdit ? "Save Changes" : "Add Expense"}
      </button>
    </div>
  </form>
);

const App = () => {
  const {
    expenses, addExpense, updateExpense,
    deleteExpense, deleteAllExpense
  } = useExpense();

  const [addModal, setAddmodal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorInput, setErrorInput] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
  });

  const handleInput = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrorInput((prev) => (
      prev === name ? null : prev
    ));

  };

  const validateForm = () => {
    const fields = [
      ["title", "Title Is Required"],
      ["description", "Description Is Required"],
      ["amount", "Amount Is Required"],
      ["date", "Date Is Required"],
    ];

    for (const [field, message] of fields) {
      if (!String(formData[field] ?? "").trim()) {
        toast.error(message);
        setErrorInput(field);
        return false;
      }
    }

    if (Number(formData.amount) < 0) {
      toast.error("Amount cannot be negative");
      setErrorInput("amount");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", amount: "", date: "" });
    setErrorInput(null);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddmodal(true);
  };

  // Add an expense
  const handleAdd = () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      id: nanoid(),
      createdAt: new Date(),
    };

    addExpense(payload);
    setAddmodal(false);
    resetForm();
    toast.success("Expense added successfully");
  };

  // Populate the edit form with the selected row.
  const openEditModal = (expense) => {
    setEditId(expense.id);
    setFormData({
      title: expense.title,
      description: expense.description,
      amount: String(expense.amount),
      date: expense.date,
    });
    setErrorInput(null);
    setEditModal(true);
  };

  // Update the selected expense.
  const handleEdit = () => {

    if (!editId || !validateForm()) return;

    updateExpense(editId, formData);
    setEditModal(false);
    resetForm();
    toast.success("Expense updated successfully");
  };

  // Delete one expense.
  const handleDelete = (id) => {
    deleteExpense(id);
    toast.success("Expense deleted successfully");
  };

  // Clear all expenses.
  const handleDeleteAll = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to delete");
      return;
    }

    deleteAllExpense();
    toast.success("All expenses deleted");
  };

  const closeModals = () => {
    setAddmodal(false);
    setEditModal(false);
    resetForm();
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F5FC] text-[#4A1F99]">
        {/* Decorative background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#E7DCF8]/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#E0E9FF]/70 blur-3xl" />
        </div>

        <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

          {/* Header */}
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3.5">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A1F99] to-[#7132DD] text-2xl text-white shadow-lg shadow-[#7132DD]/25">
                <i className="ri-wallet-3-line" />
              </div>

              <div>

                <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Expense Tracker<span className="text-[#7132DD]">.</span>
                </p>

                <p className="mt-1 text-sm text-[#887C9F]">
                  Manage your money, mindfully.
                </p>

              </div>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row">

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#4A1F99] to-[#7132DD] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7132DD]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7132DD]/30 active:scale-[0.98]"
              >
                <i className="ri-add-line text-xl" />
                Add Expense
              </button>

              {expenses.length > 0 &&
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7DCF8] bg-white/80 px-5 py-3.5 text-sm font-semibold text-[#8B4260] transition-all duration-200 hover:border-[#F4C8C1] hover:bg-[#FFE6E1] active:scale-[0.98]"
                >
                  <i className="ri-delete-bin-6-line text-lg" />
                  Delete All
                </button>
              }

            </div>

          </header>

          {/* Expense table */}
          <section className="overflow-hidden rounded-2xl border border-[#E7DCF8] bg-white shadow-sm">
            <div className="border-b border-[#F0EBF8] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-[#4A1F99] sm:text-xl">All Expenses</h2>
              <p className="mt-1 text-sm text-[#887C9F]">Manage and review your transactions.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#FCFAFF]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#887C9F]">Expense</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#887C9F]">Description</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#887C9F]">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#887C9F]">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#887C9F]">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EBF8]">
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="transition-colors duration-200 hover:bg-[#FCFAFF]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7DCF8] text-lg text-[#7132DD]">
                              <i className="ri-receipt-line" />
                            </div>
                            <span className="font-semibold text-[#4A1F99]">{expense.title}</span>
                          </div>
                        </td>
                        <td className="max-w-xs truncate px-6 py-4 text-sm text-[#887C9F]">{expense.description}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#887C9F]">
                          {new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-[#4A1F99]">
                          ₹{Number(expense.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => openEditModal(expense)} aria-label={`Edit ${expense.title}`} title="Edit expense" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E0E9FF] text-lg text-[#4A1F99] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#CCD9FF] active:scale-95">
                              <i className="ri-edit-2-line" />
                            </button>
                            <button type="button" onClick={() => handleDelete(expense.id)} aria-label={`Delete ${expense.title}`} title="Delete expense" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE6E1] text-lg text-[#B44747] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD3CA] active:scale-95">
                              <i className="ri-delete-bin-6-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center sm:py-20">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F2EFFA] text-4xl text-[#7132DD]">
                            <i className="ri-receipt-line" />
                          </div>
                          <h3 className="text-lg font-bold text-[#4A1F99]">No expenses yet</h3>
                          <p className="mt-2 text-sm leading-6 text-[#887C9F]">Your transactions will appear here once you start tracking your spending.</p>
                          <button type="button" onClick={openAddModal} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E7DCF8] px-4 py-2.5 text-sm font-bold text-[#4A1F99] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DCCAF6] active:scale-[0.98]">
                            <i className="ri-add-line text-lg" /> Add your first expense
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="py-6 text-center text-xs text-[#A49AB8]">
            Built By Mo. Sarfraj Shaikh
          </footer>
        </main>
      </div>

      {/* Add expense modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#21143A]/50 p-4 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]" onClick={(e) => { if (e.target === e.currentTarget) closeModals(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-expense-heading" className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-[#21143A]/20 animate-[modalIn_250ms_ease-out]">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#4A1F99] to-[#7132DD] px-6 py-6 sm:px-8">
              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[24px] border-white/10" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl text-white ring-1 ring-white/20"><i className="ri-add-circle-line" /></div>
                  <div>
                    <h2 id="add-expense-heading" className="text-xl font-bold text-white">Add Expense</h2>
                    <p className="mt-1 text-sm text-white/75">Enter your transaction details.</p>
                  </div>
                </div>
                <button type="button" onClick={closeModals} aria-label="Close add expense dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"><i className="ri-close-line text-2xl" /></button>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ExpenseForm formData={formData} handleInput={handleInput} errorInput={errorInput} onSubmit={handleAdd} onCancel={closeModals} />
            </div>
          </section>
        </div>
      )}

      {/* Edit expense modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#21143A]/50 p-4 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]" onClick={(e) => { if (e.target === e.currentTarget) closeModals(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-expense-heading" className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-[#21143A]/20 animate-[modalIn_250ms_ease-out]">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#4A1F99] to-[#7132DD] px-6 py-6 sm:px-8">
              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[24px] border-white/10" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl text-white ring-1 ring-white/20"><i className="ri-edit-2-line" /></div>
                  <div>
                    <h2 id="edit-expense-heading" className="text-xl font-bold text-white">Edit Expense</h2>
                    <p className="mt-1 text-sm text-white/75">Update your transaction details.</p>
                  </div>
                </div>
                <button type="button" onClick={closeModals} aria-label="Close edit expense dialog" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"><i className="ri-close-line text-2xl" /></button>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ExpenseForm formData={formData} handleInput={handleInput} errorInput={errorInput} isEdit onSubmit={handleEdit} onCancel={closeModals} />
            </div>
          </section>
        </div>
      )}

      <Toaster toastOptions={{ duration: 3000, style: { borderRadius: "12px", background: "#FCFAFF", color: "#4A1F99", border: "1px solid #E7DCF8", padding: "14px 16px" } }} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }
      `}</style>
    </>
  );
};

export default App;