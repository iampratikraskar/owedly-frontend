import { useCallback, useEffect, useState } from "react";
import { Activity as ActivityIcon, RefreshCw } from "lucide-react";

import activityService from "../services/activityService";
import ActivityTimeline from "../components/ActivityTimeline";
import { getApiErrorMessage } from "../utils/errorHandler";

export default function Activity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadActivities = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await activityService.getMyActivities(50);

            setActivities(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load activities:", err);

            setError(
                getApiErrorMessage(
                    err,
                    "Unable to load activity history."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <ActivityIcon className="h-5 w-5 text-indigo-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Activity History
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track your recent activity on Owedly.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={loadActivities}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />

                    Refresh
                </button>
            </div>

            {/* Activity list */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <ActivityTimeline
                    activities={activities}
                    loading={loading}
                    error={error}
                    onRetry={loadActivities}
                    emptyMessage="No activity has been recorded yet."
                />
            </div>
        </div>
    );
}