import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import expenseService from "../services/expenseService";

function AddExpenseModal({
    groupId,
    members,
    onClose,
    onExpenseCreated,
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

    // ---------------------------------------------------------
    // SELECT ALL GROUP MEMBERS BY DEFAULT
    // ---------------------------------------------------------
    useEffect(() => {
        setSelectedMembers(
            members?.map((member) => Number(member.userId)) || []
        );
    }, [members]);

    // ---------------------------------------------------------
    // CALCULATE SPLIT TOTAL
    // ---------------------------------------------------------
    const totalSplitValue = useMemo(() => {
        return selectedMembers.reduce((total, userId) => {
            return total + Number(splitValues[userId] || 0);
        }, 0);
    }, [selectedMembers, splitValues]);

    // ---------------------------------------------------------
    // TOGGLE MEMBER
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // UPDATE SPLIT VALUE
    // ---------------------------------------------------------
    const handleSplitValueChange = (userId, value) => {
        setSplitValues((current) => ({
            ...current,
            [userId]: value,
        }));
    };

    // ---------------------------------------------------------
    // VALIDATE FORM
    // ---------------------------------------------------------
    const validateForm = () => {
        if (!description.trim()) {
            return "Please enter an expense description.";
        }

        const numericAmount = Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return "Please enter a valid amount.";
        }

        if (selectedMembers.length === 0) {
            return "Select at least one participant.";
        }

        if (splitMethod === "EXACT") {
            if (
                Math.abs(
                    totalSplitValue - numericAmount
                ) > 0.01
            ) {
                return "Exact split amounts must equal the expense amount.";
            }
        }

        if (splitMethod === "PERCENTAGE") {
            if (
                Math.abs(
                    totalSplitValue - 100
                ) > 0.01
            ) {
                return "Percentage split must total 100%.";
            }
        }

        return null;
    };

    // ---------------------------------------------------------
    // BUILD SPLITS
    // ---------------------------------------------------------
    const buildSplits = () => {
        return selectedMembers.map((userId) => {
            const split = {
                userId: Number(userId),
            };

            if (splitMethod === "EXACT") {
                split.shareAmount = Number(
                    splitValues[userId] || 0
                );
            }

            if (splitMethod === "PERCENTAGE") {
                split.percentage = Number(
                    splitValues[userId] || 0
                );
            }

            return split;
        });
    };

    // ---------------------------------------------------------
    // SUBMIT
    // ---------------------------------------------------------
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const data = {
                description: description.trim(),

                amount: Number(amount),

                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),

                /*
                 * HTML date input gives:
                 * 2026-08-15
                 *
                 * Backend expects LocalDateTime:
                 * 2026-08-15T00:00:00
                 */
                expenseDate: expenseDate
                    ? `${expenseDate}T00:00:00`
                    : null,

                splitMethod,

                splits: buildSplits(),
            };

            console.log("Creating expense:", data);

            const createdExpense =
                await expenseService.createExpense(
                    groupId,
                    data
                );

            onExpenseCreated?.(createdExpense);

            onClose();

        } catch (err) {
            console.error(
                "Failed to create expense:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create expense."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Add Expense
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Record an expense shared with the group.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="sm:col-span-2">

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Description
                            </label>

                            <input
                                type="text"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Dinner at restaurant"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Amount
                            </label>

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(
                                        event.target.value
                                    )
                                }
                                placeholder="00.00"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Expense Date
                            </label>

                            <input
                                type="date"
                                value={expenseDate}
                                onChange={(event) =>
                                    setExpenseDate(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </div>

                    {/* Split Method */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Split Method
                        </label>

                        <div className="grid grid-cols-3 gap-2">

                            {[
                                "EQUAL",
                                "EXACT",
                                "PERCENTAGE",
                            ].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => {
                                        setSplitMethod(method);
                                        setSplitValues({});
                                    }}
                                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                                        splitMethod === method
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                    {method === "EQUAL"
                                        ? "Equal"
                                        : method === "EXACT"
                                            ? "Exact"
                                            : "Percentage"}
                                </button>
                            ))}

                        </div>

                    </div>

                    {/* Participants */}
                    <div>

                        <div className="mb-3 flex items-center justify-between">

                            <label className="text-sm font-medium text-slate-700">
                                Participants
                            </label>

                            <span className="text-xs text-slate-500">
                                {selectedMembers.length} selected
                            </span>

                        </div>

                        <div className="space-y-2">

                            {members?.map((member) => {

                                const userId =
                                    Number(member.userId);

                                const selected =
                                    selectedMembers.includes(
                                        userId
                                    );

                                return (
                                    <div
                                        key={userId}
                                        className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                                            selected
                                                ? "border-indigo-200 bg-indigo-50/50"
                                                : "border-slate-200"
                                        }`}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() =>
                                                toggleMember(
                                                    userId
                                                )
                                            }
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="text-sm font-medium text-slate-800">
                                                {member.userName}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                User ID: {userId}
                                            </p>

                                        </div>

                                        {selected &&
                                            splitMethod !== "EQUAL" && (

                                                <div className="flex items-center gap-2">

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            splitValues[
                                                                userId
                                                            ] || ""
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleSplitValueChange(
                                                                userId,
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="0"
                                                        className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                    />

                                                    <span className="text-sm font-medium text-slate-500">
                                                        {splitMethod ===
                                                        "PERCENTAGE"
                                                            ? "%"
                                                            : "₹"}
                                                    </span>

                                                </div>
                                            )}

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    {/* Split Summary */}
                    {splitMethod !== "EQUAL" && (
                        <div className="rounded-lg bg-slate-50 p-4">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-600">
                                    Split total
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {splitMethod === "PERCENTAGE"
                                        ? `${totalSplitValue.toFixed(2)}%`
                                        : `₹${totalSplitValue.toFixed(2)}`}
                                </span>

                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                {splitMethod === "PERCENTAGE"
                                    ? "Must equal 100%."
                                    : "Must equal the expense amount."}
                            </p>

                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Expense"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddExpenseModal;