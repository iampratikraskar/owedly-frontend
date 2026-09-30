import {
    CalendarDays,
    Loader2,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";

import expenseService from "../services/expenseService";

function EditExpenseModal({
    expense,
    members,
    onClose,
    onUpdated,
}) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [splitMethod, setSplitMethod] = useState("EQUAL");

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [splitValues, setSplitValues] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!expense) {
            return;
        }

        setDescription(expense.description || "");
        setAmount(expense.amount || "");
        setCategoryId(expense.categoryId || "");
        setSplitMethod(expense.splitMethod || "EQUAL");

        if (expense.expenseDate) {
            setExpenseDate(
                expense.expenseDate.substring(0, 10)
            );
        } else {
            setExpenseDate("");
        }

        const existingMembers =
            expense.splits?.map(
                (split) => Number(split.userId)
            ) || [];

        setSelectedMembers(existingMembers);

        const existingValues = {};

        expense.splits?.forEach((split) => {
            const userId = Number(split.userId);

            if (expense.splitMethod === "EXACT") {
                existingValues[userId] =
                    split.shareAmount ?? "";
            }

            if (expense.splitMethod === "PERCENTAGE") {
                existingValues[userId] =
                    split.percentage ?? "";
            }
        });

        setSplitValues(existingValues);
        setError("");

    }, [expense]);

    const toggleMember = (userId) => {
        const id = Number(userId);

        setSelectedMembers((current) => {

            if (current.includes(id)) {
                return current.filter(
                    (memberId) => memberId !== id
                );
            }

            return [...current, id];
        });

        setSplitValues((current) => {
            const updated = { ...current };

            if (selectedMembers.includes(id)) {
                delete updated[id];
            } else {
                updated[id] = "";
            }

            return updated;
        });
    };

    const updateSplitValue = (userId, value) => {
        setSplitValues((current) => ({
            ...current,
            [userId]: value,
        }));
    };

    const buildSplits = () => {
        return selectedMembers.map((userId) => {

            if (splitMethod === "EQUAL") {
                return {
                    userId: Number(userId),
                };
            }

            if (splitMethod === "EXACT") {
                return {
                    userId: Number(userId),
                    shareAmount: Number(
                        splitValues[userId] || 0
                    ),
                };
            }

            return {
                userId: Number(userId),
                percentage: Number(
                    splitValues[userId] || 0
                ),
            };
        });
    };

    const validateForm = () => {

        if (!description.trim()) {
            return "Expense description is required.";
        }

        const numericAmount = Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return "Expense amount must be greater than zero.";
        }

        if (selectedMembers.length === 0) {
            return "Select at least one participant.";
        }

        if (splitMethod === "EXACT") {

            const total = selectedMembers.reduce(
                (sum, userId) =>
                    sum +
                    Number(
                        splitValues[userId] || 0
                    ),
                0
            );

            if (
                Math.abs(total - numericAmount) >
                0.01
            ) {
                return `Exact split total must equal ₹${numericAmount.toFixed(
                    2
                )}.`;
            }
        }

        if (splitMethod === "PERCENTAGE") {

            const total = selectedMembers.reduce(
                (sum, userId) =>
                    sum +
                    Number(
                        splitValues[userId] || 0
                    ),
                0
            );

            if (Math.abs(total - 100) > 0.01) {
                return "Percentage split must total 100%.";
            }
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = {
                description: description.trim(),

                amount: Number(amount),

                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),

                expenseDate: expenseDate
                    ? `${expenseDate}T00:00:00`
                    : null,

                splitMethod,

                splits: buildSplits(),
            };

            // Update existing expense
            const updatedExpense =
                await expenseService.updateExpense(
                    expense.id,
                    data
                );

            // Send updated expense to parent component
            onUpdated?.(updatedExpense);

            // Close modal after successful update
            onClose?.();

        } catch (error) {
            console.error(
                "Failed to update expense:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update expense."
            );

        } finally {
            setLoading(false);
        }
    };

    if (!expense) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Edit Expense
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the expense details and split.
                        </p>
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

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            maxLength={200}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Amount + Date */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Amount
                            </label>

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                                <CalendarDays size={15} />
                                Date
                            </label>

                            <input
                                type="date"
                                value={expenseDate}
                                onChange={(e) =>
                                    setExpenseDate(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                    </div>

                    {/* Split Method */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Split Method
                        </label>

                        <select
                            value={splitMethod}
                            onChange={(e) => {
                                setSplitMethod(
                                    e.target.value
                                );

                                setSplitValues({});
                            }}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
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

                    {/* Members */}
                    <div>

                        <div className="mb-3">
                            <p className="text-sm font-medium text-slate-700">
                                Participants
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Select who should share this expense.
                            </p>
                        </div>

                        <div className="space-y-2">

                            {members.map((member) => {

                                const userId =
                                    Number(member.userId);

                                const selected =
                                    selectedMembers.includes(
                                        userId
                                    );

                                return (
                                    <div
                                        key={userId}
                                        className={`rounded-xl border p-3 transition ${
                                            selected
                                                ? "border-indigo-200 bg-indigo-50/50"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    toggleMember(
                                                        userId
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />

                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                {member.userName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "?"}
                                            </div>

                                            <span className="flex-1 text-sm font-medium text-slate-700">
                                                {member.userName ||
                                                    `User ${userId}`}
                                            </span>

                                            {selected &&
                                                splitMethod !==
                                                    "EQUAL" && (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            splitValues[
                                                                userId
                                                            ] ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            updateSplitValue(
                                                                userId,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            splitMethod ===
                                                            "EXACT"
                                                                ? "Amount"
                                                                : "%"
                                                        }
                                                        className="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                    />
                                                )}

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditExpenseModal;