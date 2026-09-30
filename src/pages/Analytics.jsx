import { useEffect, useState } from "react";
import AnalyticsSummary from "../components/AnalyticsSummary";
import SpendingByGroupChart from "../components/SpendingByGroupChart";
import SplitMethodChart from "../components/SplitMethodChart";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import MonthlySpendingChart from "../components/MonthlySpendingChart";
import analyticsService from "../services/analyticsService";
import { getApiErrorMessage } from "../utils/errorHandler";

const Analytics = () => {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await analyticsService.getAnalytics();

            setAnalytics(data);
        } catch (error) {
            setError(
                getApiErrorMessage(
                    error,
                    "Unable to load analytics."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <LoadingSpinner message="Loading analytics..." />
        );
    }

    if (error) {
        return (
            <ErrorState
                title="Unable to load analytics"
                message={error}
                onRetry={loadAnalytics}
            />
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Analytics
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Understand your spending and expense patterns.
                </p>
            </div>

            {/* Summary */}
            <AnalyticsSummary
                analytics={analytics}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <SpendingByGroupChart
                    data={analytics.spendingByGroup || []}
                />

                <SplitMethodChart
                    data={analytics.expensesBySplitMethod || []}
                />

                <div className="lg:col-span-2">
                    <MonthlySpendingChart
                        data={analytics.monthlySpending || []}
                    />
                </div>

            </div>

        </div>
    );
};

export default Analytics;