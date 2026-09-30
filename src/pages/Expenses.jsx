import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Filter,
    Receipt,
    Search,
    UserRound,
} from "lucide-react";

import expenseService from "../services/expenseService";
import { getApiErrorMessage } from "../utils/errorHandler";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [groupFilter, setGroupFilter] = useState("ALL");
    const [splitFilter, setSplitFilter] = useState("ALL");

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await expenseService.getAllExpenses();

            setExpenses(data);
        } catch (error) {
            console.error("Failed to load expenses:", error);

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to load expenses."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const groups = useMemo(() => {
        const uniqueGroups = new Map();

        expenses.forEach((expense) => {
            if (expense.groupId) {
                uniqueGroups.set(
                    expense.groupId,
                    expense.groupName
                );
            }
        });

        return Array.from(uniqueGroups.entries());
    }, [expenses]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                expense.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                expense.paidByName
                    ?.toLowerCase()
                    .includes(searchText) ||
                expense.groupName
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesGroup =
                groupFilter === "ALL" ||
                String(expense.groupId) === groupFilter;

            const matchesSplit =
                splitFilter === "ALL" ||
                expense.splitMethod === splitFilter;

            return (
                matchesSearch &&
                matchesGroup &&
                matchesSplit
            );
        });
    }, [expenses, search, groupFilter, splitFilter]);

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "No date";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    Expense Management
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                    Expenses
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View and manage expenses across your groups.
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Group Filter */}
                    <div className="relative">
                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={groupFilter}
                            onChange={(e) =>
                                setGroupFilter(e.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="ALL">
                                All Groups
                            </option>

                            {groups.map(([id, name]) => (
                                <option
                                    key={id}
                                    value={String(id)}
                                >
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Split Filter */}
                    <div>
                        <select
                            value={splitFilter}
                            onChange={(e) =>
                                setSplitFilter(e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="ALL">
                                All Split Methods
                            </option>

                            <option value="EQUAL">
                                Equal
                            </option>

                            <option value="EXACT">
                                Exact
                            </option>

                            <option value="PERCENTAGE">
                                Percentage
                            </option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Result Count */}
            {!loading && !error && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredExpenses.length}
                        </span>{" "}
                        expense
                        {filteredExpenses.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <LoadingSpinner message="Loading expenses..." />
            )}

            {/* Error */}
            {!loading && error && (
                <ErrorState
                    title="Unable to load expenses"
                    message={error}
                    onRetry={loadExpenses}
                />
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                filteredExpenses.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <Receipt
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No expenses found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}

            {/* Expense List */}
            {!loading &&
                !error &&
                filteredExpenses.length > 0 && (
                    <div className="space-y-4">
                        {filteredExpenses.map((expense) => (
                            <article
                                key={`${expense.groupId}-${expense.id}`}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                    {/* Left */}
                                    <div className="flex min-w-0 gap-4">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Receipt size={21} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-slate-900">
                                                {expense.description}
                                            </h3>

                                            <p className="mt-1 text-sm text-indigo-600">
                                                {expense.groupName}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                                                <span className="flex items-center gap-1">
                                                    <UserRound size={14} />
                                                    {expense.paidByName ||
                                                        "Unknown"}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <CalendarDays size={14} />
                                                    {formatDate(
                                                        expense.expenseDate
                                                    )}
                                                </span>

                                                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                                                    {expense.splitMethod}
                                                </span>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="md:text-right">
                                        <p className="text-xl font-bold text-slate-900">
                                            {formatAmount(
                                                expense.amount
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Total expense
                                        </p>
                                    </div>

                                </div>
                            </article>
                        ))}
                    </div>
                )}

        </div>
    );
}

export default Expenses;