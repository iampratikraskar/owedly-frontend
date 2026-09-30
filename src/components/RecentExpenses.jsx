import {
    ArrowRight,
    CalendarDays,
    Receipt,
} from "lucide-react";

import { Link } from "react-router-dom";

function RecentExpenses({ expenses }) {

    if (!expenses || expenses.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <Receipt
                        size={20}
                        className="text-slate-500"
                    />
                </div>

                <p className="mt-3 font-medium text-slate-700">
                    No recent expenses
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Expenses from your groups will appear here.
                </p>

            </div>
        );
    }

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="divide-y divide-slate-100">

                {expenses.map((expense) => (

                    <Link
                        key={expense.id}
                        to={`/groups/${expense.groupId}`}
                        className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
                    >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                            <Receipt
                                size={19}
                                className="text-indigo-600"
                            />
                        </div>


                        <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-slate-800">
                                {expense.description}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                                <span>
                                    {expense.groupName}
                                </span>

                                <span className="text-slate-300">
                                    •
                                </span>

                                <span>
                                    Paid by {expense.paidByName}
                                </span>

                                <span className="hidden text-slate-300 sm:inline">
                                    •
                                </span>

                                <span className="inline-flex items-center gap-1">
                                    <CalendarDays size={12} />
                                    {formatDate(
                                        expense.expenseDate
                                    )}
                                </span>

                            </div>

                        </div>


                        <div className="shrink-0 text-right">

                            <p className="text-sm font-bold text-slate-900">
                                ₹{Number(
                                    expense.amount || 0
                                ).toFixed(2)}
                            </p>

                            <p className="mt-1 text-xs text-indigo-600">
                                {expense.splitMethod}
                            </p>

                        </div>


                        <ArrowRight
                            size={17}
                            className="hidden shrink-0 text-slate-400 sm:block"
                        />

                    </Link>

                ))}

            </div>

        </div>
    );
}

export default RecentExpenses;