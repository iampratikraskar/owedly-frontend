import {
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";

import { useState } from "react";

import expenseService from "../services/expenseService";

function DeleteExpenseModal({
    expense,
    onClose,
    onDeleted,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!expense) {
        return null;
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError("");

            await expenseService.deleteExpense(
                expense.id
            );

            onDeleted();

        } catch (error) {
            console.error(
                "Delete expense failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete this expense."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        >

            <div
                className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
            >

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 p-5">

                    <div className="flex gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Delete expense?
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                This action cannot be undone.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* Expense Information */}
                <div className="p-5">

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <div className="flex items-center justify-between gap-4">

                            <div className="min-w-0">

                                <p className="truncate font-medium text-slate-900">
                                    {expense.description}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Paid by{" "}
                                    {expense.paidByName ||
                                        "Unknown"}
                                </p>

                            </div>

                            <p className="shrink-0 font-bold text-slate-900">
                                ₹
                                {Number(
                                    expense.amount || 0
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        Deleting this expense will remove its
                        split information and recalculate the
                        group's balances and settlement plan.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading && (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        )}

                        {loading
                            ? "Deleting..."
                            : "Delete Expense"}

                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeleteExpenseModal;