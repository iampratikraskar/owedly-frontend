import {
    CircleDollarSign,
    Receipt,
    Users,
    ArrowUpRight,
} from "lucide-react";

function GroupSummary({ expenses, balances, members }) {

    const totalSpending = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );

    const totalOutstanding = balances.reduce(
        (total, balance) => {
            const netBalance = Number(
                balance.netBalance || 0
            );

            return total + (netBalance > 0 ? netBalance : 0);
        },
        0
    );

    const cards = [
        {
            title: "Total Spending",
            value: `₹${totalSpending.toFixed(2)}`,
            description: "Total recorded expenses",
            icon: CircleDollarSign,
        },
        {
            title: "Expenses",
            value: expenses.length,
            description: "Recorded in this group",
            icon: Receipt,
        },
        {
            title: "Members",
            value: members.length,
            description: "People in this group",
            icon: Users,
        },
        {
            title: "Outstanding",
            value: `₹${totalOutstanding.toFixed(2)}`,
            description: "Amount yet to be settled",
            icon: ArrowUpRight,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {card.title}
                                </p>

                                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                    {card.value}
                                </p>
                            </div>

                            <div className="rounded-lg bg-indigo-50 p-2.5">
                                <Icon
                                    size={20}
                                    className="text-indigo-600"
                                />
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                            {card.description}
                        </p>

                    </div>
                );
            })}

        </div>
    );
}

export default GroupSummary;