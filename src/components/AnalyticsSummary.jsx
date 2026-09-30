import {
    Wallet,
    Receipt,
    Calculator,
} from "lucide-react";

const AnalyticsSummary = ({ analytics }) => {

    const cards = [
        {
            title: "Total Spending",
            value: `₹${Number(
                analytics?.totalSpending || 0
            ).toFixed(2)}`,
            icon: Wallet,
        },
        {
            title: "Total Expenses",
            value: analytics?.totalExpenses || 0,
            icon: Receipt,
        },
        {
            title: "Average Expense",
            value: `₹${Number(
                analytics?.averageExpense || 0
            ).toFixed(2)}`,
            icon: Calculator,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {cards.map((card) => {

                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {card.title}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {card.value}
                                </p>
                            </div>

                            <div className="rounded-lg bg-indigo-50 p-3">
                                <Icon
                                    size={22}
                                    className="text-indigo-600"
                                />
                            </div>

                        </div>
                    </div>
                );
            })}

        </div>
    );
};

export default AnalyticsSummary;