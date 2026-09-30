import { useEffect, useState } from "react";

import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CircleDollarSign,
    Receipt,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";
import RecentExpenses from "../components/RecentExpenses";


function Dashboard() {

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await dashboardService.getDashboardData();

            setDashboard(data);

        } catch (err) {

            console.error(
                "Failed to load dashboard:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };


    // -----------------------------
    // Loading State
    // -----------------------------

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-300
                            border-t-indigo-600
                        "
                    />

                    <p className="text-sm text-slate-500">
                        Loading your dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // -----------------------------
    // Error State
    // -----------------------------

    if (error) {

        return (
            <div className="mx-auto max-w-6xl">

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-6
                    "
                >

                    <p className="font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="
                            mt-3
                            text-sm
                            font-medium
                            text-red-700
                            underline
                            transition
                            hover:text-red-900
                        "
                    >
                        Try again
                    </button>

                </div>

            </div>
        );
    }


    // -----------------------------
    // Empty State
    // -----------------------------

    if (!dashboard) {
        return null;
    }


    // -----------------------------
    // Dashboard Values
    // -----------------------------

    const totalGroups =
        Number(dashboard.totalGroups || 0);

    const totalExpenses =
        Number(dashboard.totalExpenses || 0);

    const totalSpending =
        Number(dashboard.totalSpending || 0);

    const netBalance =
        Number(dashboard.netBalance || 0);

    const recentExpenses =
        dashboard.recentExpenses || [];


    const isPositive =
        netBalance > 0;

    const isNegative =
        netBalance < 0;


    // -----------------------------
    // Summary Cards
    // -----------------------------

    const cards = [

        {
            title: "Total Groups",

            value: totalGroups,

            description: "Groups you're part of",

            icon: Users,
        },

        {
            title: "Total Expenses",

            value: totalExpenses,

            description: "Expenses across your groups",

            icon: Receipt,
        },

        {
            title: "Total Spending",

            value: `₹${totalSpending.toFixed(2)}`,

            description: "Total group spending",

            icon: CircleDollarSign,
        },

        {
            title: "Net Balance",

            value:
                `${isPositive
                    ? "+"
                    : isNegative
                        ? "-"
                        : ""
                }₹${Math.abs(netBalance).toFixed(2)}`,

            description:
                isPositive
                    ? "You should receive"
                    : isNegative
                        ? "You should pay"
                        : "You're settled up",

            icon:
                isPositive
                    ? ArrowUpRight
                    : ArrowDownRight,
        },

    ];


    return (

        <div className="mx-auto max-w-6xl space-y-8">

            {/* =====================================
                Welcome Section
            ====================================== */}

            <section>

                <p className="text-sm font-medium text-indigo-600">
                    Welcome back
                </p>

                <h1
                    className="
                        mt-1
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        sm:text-3xl
                    "
                >
                    {user?.name || "there"} 👋
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Here's an overview of your shared expenses.
                </p>

            </section>


            {/* =====================================
                Summary Cards
            ====================================== */}

            <section>

                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {cards.map((card) => {

                        const Icon = card.icon;

                        return (

                            <div
                                key={card.title}
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-sm
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:shadow-md
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            {card.title}
                                        </p>

                                        <p
                                            className="
                                                mt-2
                                                text-2xl
                                                font-bold
                                                tracking-tight
                                                text-slate-900
                                            "
                                        >
                                            {card.value}
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-lg
                                            bg-indigo-50
                                            p-2.5
                                        "
                                    >

                                        <Icon
                                            size={20}
                                            className="text-indigo-600"
                                        />

                                    </div>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    {card.description}
                                </p>

                            </div>

                        );

                    })}

                </div>

            </section>


            {/* =====================================
                Quick Actions
            ====================================== */}

            <section>

                <div className="mb-4">

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                        "
                    >
                        Quick actions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your shared expenses.
                    </p>

                </div>


                <div className="grid gap-4 sm:grid-cols-2">

                    {/* Groups */}

                    <Link
                        to="/groups"
                        className="
                            group
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-indigo-200
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-50
                            "
                        >

                            <Users
                                size={22}
                                className="text-indigo-600"
                            />

                        </div>


                        <h3
                            className="
                                mt-4
                                font-semibold
                                text-slate-900
                            "
                        >
                            Manage Groups
                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            View your groups and manage members.
                        </p>


                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-1
                                text-sm
                                font-medium
                                text-indigo-600
                            "
                        >
                            Open Groups

                            <ArrowRight
                                size={15}
                                className="
                                    transition-transform
                                    group-hover:translate-x-1
                                "
                            />

                        </div>

                    </Link>


                    {/* Expenses */}

                    <Link
                        to="/expenses"
                        className="
                            group
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-indigo-200
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-50
                            "
                        >

                            <Receipt
                                size={22}
                                className="text-indigo-600"
                            />

                        </div>


                        <h3
                            className="
                                mt-4
                                font-semibold
                                text-slate-900
                            "
                        >
                            View Expenses
                        </h3>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Review your recent shared expenses.
                        </p>


                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-1
                                text-sm
                                font-medium
                                text-indigo-600
                            "
                        >
                            View Expenses

                            <ArrowRight
                                size={15}
                                className="
                                    transition-transform
                                    group-hover:translate-x-1
                                "
                            />

                        </div>

                    </Link>

                </div>

            </section>


            {/* =====================================
                Recent Expenses
            ====================================== */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-end
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                            "
                        >
                            Recent Expenses
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            The latest activity across your groups.
                        </p>

                    </div>


                    <Link
                        to="/expenses"
                        className="
                            hidden
                            items-center
                            gap-1
                            text-sm
                            font-medium
                            text-indigo-600
                            transition
                            hover:text-indigo-700
                            sm:inline-flex
                        "
                    >
                        View all

                        <ArrowRight size={16} />

                    </Link>

                </div>


                <RecentExpenses
                    expenses={recentExpenses}
                />

            </section>

        </div>

    );
}

export default Dashboard;