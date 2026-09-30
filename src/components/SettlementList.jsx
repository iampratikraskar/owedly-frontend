import { ArrowRight, CheckCircle2 } from "lucide-react";

function SettlementList({ settlements, loading, error }) {

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                    Calculating settlement plan...
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

    if (!settlements || settlements.length === 0) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">

                <div className="flex items-start gap-3">

                    <CheckCircle2
                        size={22}
                        className="mt-0.5 text-emerald-600"
                    />

                    <div>
                        <p className="font-semibold text-emerald-800">
                            Everyone is settled up
                        </p>

                        <p className="mt-1 text-sm text-emerald-700">
                            There are no outstanding payments in this group.
                        </p>
                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="space-y-3">

            {settlements.map((settlement, index) => (

                <div
                    key={`${settlement.fromUserId}-${settlement.toUserId}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Payment flow */}
                        <div className="flex min-w-0 items-center gap-3">

                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                    {settlement.fromUserName}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Pays
                                </p>
                            </div>

                            <ArrowRight
                                size={20}
                                className="shrink-0 text-slate-400"
                            />

                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                    {settlement.toUserName}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Receives
                                </p>
                            </div>

                        </div>


                        {/* Amount */}
                        <div className="text-left sm:text-right">

                            <p className="text-xl font-bold text-indigo-600">
                                ₹{Number(
                                    settlement.amount || 0
                                ).toFixed(2)}
                            </p>

                            <p className="text-xs text-slate-500">
                                settlement
                            </p>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default SettlementList;