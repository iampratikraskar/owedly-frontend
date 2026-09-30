import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    CircleDollarSign,
    Search,
} from "lucide-react";

import settlementService from "../services/settlementService";
import SettlementSummary from "../components/SettlementSummary";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getApiErrorMessage } from "../utils/errorHandler";

function Settlements() {

    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadSettlements();
    }, []);

    const loadSettlements = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await settlementService.getAllSettlements();

            setSettlements(data);
        } catch (error) {
            console.error(
                "Failed to load settlements:",
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to load settlements."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredSettlements = useMemo(() => {

        const searchText = search
            .trim()
            .toLowerCase();

        if (!searchText) {
            return settlements;
        }

        return settlements.filter((settlement) => {

            const fromName =
                settlement.fromUserName?.toLowerCase() || "";

            const toName =
                settlement.toUserName?.toLowerCase() || "";

            const groupName =
                settlement.groupName?.toLowerCase() || "";

            return (
                fromName.includes(searchText) ||
                toName.includes(searchText) ||
                groupName.includes(searchText)
            );
        });

    }, [settlements, search]);

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    Debt Management
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                    Settlements
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    See who needs to pay whom and simplify
                    outstanding debts.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <LoadingSpinner message="Calculating settlements..." />
            )}

            {/* Error */}
            {!loading && error && (
                <ErrorState
                    title="Unable to load settlements"
                    message={error}
                    onRetry={loadSettlements}
                />
            )}

            {!loading && !error && (
                <>
                    {/* Summary */}
                    <SettlementSummary
                        settlements={settlements}
                    />

                    {/* Search */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by person or group..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Count */}
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredSettlements.length}
                        </span>{" "}
                        settlement
                        {filteredSettlements.length !== 1
                            ? "s"
                            : ""}
                    </p>

                    {/* Empty */}
                    {filteredSettlements.length === 0 && (
                        <EmptyState
                            title="All settled up"
                            message="There are no outstanding settlements matching your search."
                        />
                    )}

                    {/* Settlement Cards */}
                    <div className="space-y-4">
                        {filteredSettlements.map(
                            (settlement, index) => (
                                <article
                                    key={`${settlement.groupId}-${settlement.fromUserId}-${settlement.toUserId}-${index}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                        {/* Transfer */}
                                        <div className="flex items-center gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <CircleDollarSign
                                                    size={21}
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-slate-900">
                                                        {settlement.fromUserName}
                                                    </span>

                                                    <ArrowRight
                                                        size={17}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="font-semibold text-slate-900">
                                                        {settlement.toUserName}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-indigo-600">
                                                    {settlement.groupName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="md:text-right">
                                            <p className="text-xl font-bold text-slate-900">
                                                {formatAmount(
                                                    settlement.amount
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Suggested settlement
                                            </p>
                                        </div>

                                    </div>

                                </article>
                            )
                        )}
                    </div>
                </>
            )}

        </div>
    );
}

export default Settlements;