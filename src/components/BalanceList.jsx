function BalanceList({ balances, loading, error }) {

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                    Calculating balances...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-600">
                    {error}
                </p>
            </div>
        );
    }

    if (!balances || balances.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                    No balance information available.
                </p>
            </div>
        );
    }

    const formatAmount = (amount) => {
        return `₹${Math.abs(Number(amount || 0)).toFixed(2)}`;
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="divide-y divide-slate-100">

                {balances.map((balance) => {

                    const netBalance = Number(
                        balance.netBalance || 0
                    );

                    const isPositive = netBalance > 0;
                    const isNegative = netBalance < 0;

                    return (
                        <div
                            key={balance.userId}
                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >

                            {/* User */}
                            <div>
                                <p className="font-semibold text-slate-900">
                                    {balance.userName}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

                                    <span>
                                        Paid:{" "}
                                        <span className="font-medium text-slate-700">
                                            ₹{Number(
                                                balance.totalPaid || 0
                                            ).toFixed(2)}
                                        </span>
                                    </span>

                                    <span>
                                        Share:{" "}
                                        <span className="font-medium text-slate-700">
                                            ₹{Number(
                                                balance.totalShare || 0
                                            ).toFixed(2)}
                                        </span>
                                    </span>

                                </div>
                            </div>


                            {/* Net balance */}
                            <div className="text-left sm:text-right">

                                <p
                                    className={`text-lg font-bold ${
                                        isPositive
                                            ? "text-emerald-600"
                                            : isNegative
                                            ? "text-red-600"
                                            : "text-slate-600"
                                    }`}
                                >
                                    {isPositive && "+"}
                                    {isNegative && "-"}
                                    {formatAmount(netBalance)}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {isPositive
                                        ? "You should receive"
                                        : isNegative
                                        ? "You should pay"
                                        : "Settled up"}
                                </p>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default BalanceList;