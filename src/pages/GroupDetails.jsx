import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import groupService from "../services/groupService";
import expenseService from "../services/expenseService";
import AddMemberModal from "../components/AddMemberModal";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/AddExpenseModal";
import balanceService from "../services/balanceService";
import BalanceList from "../components/BalanceList";
import settlementService from "../services/settlementService";
import SettlementList from "../components/SettlementList";
import GroupSummary from "../components/GroupSummary";
import DeleteExpenseModal from "../components/DeleteExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";
import ActivityTimeline from "../components/ActivityTimeline";
import activityService from "../services/activityService";

function GroupDetails() {

    const { groupId } = useParams();

    const [group, setGroup] = useState(null);

    const [expenses, setExpenses] = useState([]);

    const [balances, setBalances] = useState([]);
    const [balanceLoading, setBalanceLoading] = useState(true);
    const [balanceError, setBalanceError] = useState("");

    const [settlements, setSettlements] = useState([]);
    const [settlementLoading, setSettlementLoading] = useState(true);
    const [settlementError, setSettlementError] = useState("");

    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    // =========================================================
    // ACTIVITY STATE
    // =========================================================

    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState("");

    const [loading, setLoading] = useState(true);
    const [expenseLoading, setExpenseLoading] = useState(true);

    const [error, setError] = useState("");
    const [expenseError, setExpenseError] = useState("");

    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);

    // =========================================================
    // LOAD GROUP DATA
    // =========================================================

    useEffect(() => {
        loadGroup();
        loadExpenses();
        loadBalances();
        loadSettlements();
        loadActivities();
    }, [groupId]);

    // =========================================================
    // EDIT EXPENSE
    // =========================================================

    const handleEditExpense = (expense) => {
        setExpenseToEdit(expense);
    };

    // =========================================================
    // DELETE EXPENSE
    // =========================================================

    const handleDeleteExpense = (expense) => {
        setExpenseToDelete(expense);
    };

    const handleExpenseDeleted = async () => {

        setExpenseToDelete(null);

        await Promise.all([
            loadGroup(),
            loadExpenses(),
            loadBalances(),
            loadSettlements(),
            loadActivities(),
        ]);
    };

    // =========================================================
    // UPDATE EXPENSE
    // =========================================================

    const handleExpenseUpdated = async () => {

        setExpenseToEdit(null);

        await Promise.all([
            loadGroup(),
            loadExpenses(),
            loadBalances(),
            loadSettlements(),
            loadActivities(),
        ]);
    };

    // =========================================================
    // LOAD ACTIVITIES
    // =========================================================

    const loadActivities = async () => {

        try {

            setActivityLoading(true);
            setActivityError("");

            const data =
                await activityService.getGroupActivities(
                    groupId
                );

            setActivities(data);

        } catch (err) {

            console.error(
                "Failed to load activities:",
                err
            );

            setActivityError(
                err.response?.data?.message ||
                "Unable to load group activity."
            );

        } finally {

            setActivityLoading(false);
        }
    };

    // =========================================================
    // LOAD SETTLEMENTS
    // =========================================================

    const loadSettlements = async () => {

        try {

            setSettlementLoading(true);
            setSettlementError("");

            const data =
                await settlementService.getSettlementPlan(
                    groupId
                );

            setSettlements(data);

        } catch (err) {

            console.error(
                "Failed to load settlements:",
                err
            );

            setSettlementError(
                err.response?.data?.message ||
                "Unable to load settlement plan."
            );

        } finally {

            setSettlementLoading(false);
        }
    };

    // =========================================================
    // LOAD BALANCES
    // =========================================================

    const loadBalances = async () => {

        try {

            setBalanceLoading(true);
            setBalanceError("");

            const data =
                await balanceService.getGroupBalances(
                    groupId
                );

            setBalances(data);

        } catch (err) {

            console.error(
                "Failed to load balances:",
                err
            );

            setBalanceError(
                err.response?.data?.message ||
                "Unable to load balances."
            );

        } finally {

            setBalanceLoading(false);
        }
    };

    // =========================================================
    // LOAD GROUP
    // =========================================================

    const loadGroup = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await groupService.getGroup(groupId);

            setGroup(data);

        } catch (err) {

            console.error(
                "Failed to load group:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load group."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOAD EXPENSES
    // =========================================================

    const loadExpenses = async () => {

        try {

            setExpenseLoading(true);
            setExpenseError("");

            const data =
                await expenseService.getGroupExpenses(
                    groupId
                );

            setExpenses(data);

        } catch (err) {

            console.error(
                "Failed to load expenses:",
                err
            );

            setExpenseError(
                err.response?.data?.message ||
                "Unable to load expenses."
            );

        } finally {

            setExpenseLoading(false);
        }
    };

    // =========================================================
    // MEMBER ADDED
    // =========================================================

    const handleMemberAdded = (updatedGroup) => {

        setGroup(updatedGroup);

        // Refresh activity after member is added
        loadActivities();
    };

    // =========================================================
    // EXPENSE CREATED
    // =========================================================

    const handleExpenseCreated = (createdExpense) => {

        setExpenses((currentExpenses) => [
            createdExpense,
            ...currentExpenses,
        ]);

        loadBalances();
        loadSettlements();
        loadActivities();
    };

    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading group...
                </p>
            </div>
        );
    }

    // =========================================================
    // ERROR STATE
    // =========================================================

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-600">
                    {error}
                </p>
            </div>
        );
    }

    if (!group) {
        return null;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <Link
                        to="/groups"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Groups
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-900">
                        {group.name}
                    </h1>

                    {group.description && (
                        <p className="mt-1 text-sm text-slate-500">
                            {group.description}
                        </p>
                    )}

                </div>

                {/* Summary */}
                <GroupSummary
                    expenses={expenses}
                    balances={balances}
                    members={group.members || []}
                />

                <button
                    type="button"
                    onClick={() => setShowAddMember(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Add Member
                </button>

            </div>

            {/* =================================================
                MEMBERS
            ================================================= */}

            <section>

                <div className="mb-3 flex items-center justify-between">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Members
                    </h2>

                    <span className="text-sm text-slate-500">
                        {group.members?.length || 0} members
                    </span>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    {group.members?.length > 0 ? (

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {group.members.map((member) => (

                                <div
                                    key={member.userId}
                                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                                >

                                    <p className="font-medium text-slate-900">
                                        {member.userName}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        User ID: {member.userId}
                                    </p>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-sm text-slate-500">
                            No members found.
                        </p>

                    )}

                </div>

            </section>

            {/* =================================================
                EXPENSES
            ================================================= */}

            <section>

                <div className="mb-3 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Expenses
                        </h2>

                        <p className="text-sm text-slate-500">
                            Track expenses shared by the group.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddExpense(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add Expense
                    </button>

                </div>

                <ExpenseList
                    expenses={expenses}
                    loading={expenseLoading}
                    error={expenseError}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                />

            </section>

            {/* =================================================
                BALANCES
            ================================================= */}

            <section>

                <div className="mb-3">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Balances
                    </h2>

                    <p className="text-sm text-slate-500">
                        See who owes money and who should receive money.
                    </p>

                </div>

                <BalanceList
                    balances={balances}
                    loading={balanceLoading}
                    error={balanceError}
                />

            </section>

            {/* =================================================
                SETTLEMENT PLAN
            ================================================= */}

            <section>

                <div className="mb-3">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Settlement Plan
                    </h2>

                    <p className="text-sm text-slate-500">
                        Simplified payments to settle the group's outstanding balances.
                    </p>

                </div>

                <SettlementList
                    settlements={settlements}
                    loading={settlementLoading}
                    error={settlementError}
                />

            </section>

            {/* =================================================
                ACTIVITY
            ================================================= */}

            <section className="mt-8">

                <div className="mb-4">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Activity
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Recent activity in this group.
                    </p>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                    <ActivityTimeline
                        activities={activities}
                        loading={activityLoading}
                        error={activityError}
                        onRetry={loadActivities}
                        emptyMessage="No activity has been recorded for this group yet."
                    />

                </div>

            </section>

            {/* =================================================
                ADD MEMBER MODAL
            ================================================= */}

            {showAddMember && (
                <AddMemberModal
                    groupId={groupId}
                    onClose={() => setShowAddMember(false)}
                    onMemberAdded={handleMemberAdded}
                />
            )}

            {/* =================================================
                ADD EXPENSE MODAL
            ================================================= */}

            {showAddExpense && (
                <AddExpenseModal
                    groupId={groupId}
                    members={group.members || []}
                    onClose={() => setShowAddExpense(false)}
                    onExpenseCreated={handleExpenseCreated}
                />
            )}

            {/* =================================================
                EDIT EXPENSE MODAL
            ================================================= */}

            {expenseToEdit && (
                <EditExpenseModal
                    expense={expenseToEdit}
                    members={group.members || []}
                    onClose={() => setExpenseToEdit(null)}
                    onUpdated={handleExpenseUpdated}
                />
            )}

            {/* =================================================
                DELETE EXPENSE MODAL
            ================================================= */}

            {expenseToDelete && (
                <DeleteExpenseModal
                    expense={expenseToDelete}
                    onClose={() => setExpenseToDelete(null)}
                    onDeleted={handleExpenseDeleted}
                />
            )}

        </div>
    );
}

export default GroupDetails;