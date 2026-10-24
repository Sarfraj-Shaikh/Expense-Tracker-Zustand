import { create } from "zustand";
import { persist } from "zustand/middleware";

const useExpense = create(persist((set) => ({

    expenses: [],

    addExpense: (data) => set((state) => ({
        expenses: [...state.expenses, data],
    })),

    updateExpense: (id, updatedData) => set((state) => ({
        expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedData } : expense
        ),
    })),

    deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
    })),

    deleteAllExpense: (data) => set((state) => ({
        expenses: [],
    })),

}), { name: "myExpenses" }));

export default useExpense;