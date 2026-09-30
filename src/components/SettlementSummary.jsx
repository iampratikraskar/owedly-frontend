import {
    ArrowDownLeft,
    ArrowUpRight,
    CircleDollarSign,
} from "lucide-react";

function SettlementSummary({ settlements }) {

    const totalAmount = settlements.reduce(
        (total, settlement) =>
            total + Number(settlement.amount || 0),
        0
    );

    const cards = [
        {
            title: "Pending Transfers",
            value: settlements.length,
            description: "Transfers to settle",
            icon: ArrowUpRight,
        },
        {
            title: "Total Amount",
            value: `₹${totalAmount.toFixed(2)}`,
            description: "Across all groups",
            icon: CircleDollarSign,
        },
        {
            title: "Groups",
            value: new Set(
                settlements.map(
                    (settlement) => settlement.groupId
                )
            ).size,
            description: "With pending transfers",
            icon: ArrowDownLeft,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {card.title}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {card.value}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {card.description}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SettlementSummary;