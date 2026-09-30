import {
    CalendarDays,
    Pencil,
    Receipt,
    Trash2,
    UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

function ExpenseList({
    expenses,
    loading,
    error,
    onEdit,
    onDelete,
}) {
    const { user } = useAuth();

    console.log("ExpenseList - current user:", user);
    console.log("ExpenseList - expenses:", expenses);

    if (loading) {
        return (
            <LoadingSpinner message="Loading expenses..." />
        );
    }

    if (error) {
        return (
            <ErrorState
                title="Unable to load expenses"
                message={error}
            />
        );
    }

    if (!expenses || expenses.length === 0) {
        return (
            <EmptyState
                title="No expenses yet"
                message="Add your first expense to start tracking shared spending in this group."
            />
        );
    }

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "No date";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(date);
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const canManageExpense = (expense) => {
        const payerId = expense?.paidBy;
        const currentUserId = user?.id;

        console.log("Expense ownership check:", {
            expenseId: expense?.id,
            payerId,
            currentUserId,
            canManage:
                payerId != null &&
                currentUserId != null &&
                String(payerId) === String(currentUserId),
        });

        return (
            payerId != null &&
            currentUserId != null &&
            String(payerId) === String(currentUserId)
        );
    };

    return (
        <div className="space-y-4">

            {expenses.map((expense) => {

                const canManage = canManageExpense(expense);

                return (
                    <article
                        key={expense.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >

                        {/* Expense Header */}
                        <div className="p-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                {/* Expense Information */}
                                <div className="flex min-w-0 gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                        <Receipt
                                            size={21}
                                            className="text-indigo-600"
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="truncate text-base font-semibold text-slate-900">
                                            {expense.description}
                                        </h3>

                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                                            <span className="inline-flex items-center gap-1">
                                                <UserRound size={13} />

                                                Paid by{" "}

                                                <span className="font-medium text-slate-700">
                                                    {expense.paidByName ||
                                                        "Unknown"}
                                                </span>
                                            </span>

                                            <span className="hidden text-slate-300 sm:inline">
                                                •
                                            </span>

                                            <span className="inline-flex items-center gap-1">
                                                <CalendarDays size={13} />

                                                {formatDate(
                                                    expense.expenseDate
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Amount + Actions */}
                                <div className="flex items-start justify-between gap-4 sm:justify-end">

                                    <div className="shrink-0 sm:text-right">

                                        <p className="text-xl font-bold tracking-tight text-slate-900">
                                            {formatAmount(
                                                expense.amount
                                            )}
                                        </p>

                                        <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                            {expense.splitMethod}
                                        </span>

                                    </div>

                                    {/* Edit / Delete */}
                                    {canManage && (
                                        <div className="flex items-center gap-1">

                                            <button
                                                type="button"
                                                title="Edit expense"
                                                aria-label="Edit expense"
                                                onClick={() =>
                                                    onEdit?.(expense)
                                                }
                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete expense"
                                                aria-label="Delete expense"
                                                onClick={() =>
                                                    onDelete?.(expense)
                                                }
                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* Split Section */}
                        {expense.splits?.length > 0 && (
                            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">

                                <div className="mb-3 flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Split
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {expense.splits.length}{" "}
                                        {expense.splits.length === 1
                                            ? "person"
                                            : "people"}
                                    </p>

                                </div>

                                <div className="space-y-2">

                                    {expense.splits.map((split) => (
                                        <div
                                            key={split.userId}
                                            className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
                                        >

                                            <div className="flex items-center gap-2.5">

                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                    {split.userName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "?"}
                                                </div>

                                                <span className="text-sm font-medium text-slate-700">
                                                    {split.userName ||
                                                        `User ${split.userId}`}
                                                </span>

                                            </div>

                                            <div className="text-right">

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {formatAmount(
                                                        split.shareAmount
                                                    )}
                                                </p>

                                                {split.percentage != null && (
                                                    <p className="text-xs text-slate-400">
                                                        {Number(
                                                            split.percentage
                                                        ).toFixed(2)}
                                                        %
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        )}

                    </article>
                );
            })}

        </div>
    );
}

export default ExpenseList;