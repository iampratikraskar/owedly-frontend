import {
    PlusCircle,
    UserPlus,
    Receipt,
    Pencil,
    Trash2,
    CheckCircle,
    Activity,
} from "lucide-react";

const ACTIVITY_CONFIG = {
    GROUP_CREATED: {
        icon: PlusCircle,
        color: "text-green-600",
        bg: "bg-green-50",
    },

    MEMBER_ADDED: {
        icon: UserPlus,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },

    EXPENSE_CREATED: {
        icon: Receipt,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },

    EXPENSE_UPDATED: {
        icon: Pencil,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },

    EXPENSE_DELETED: {
        icon: Trash2,
        color: "text-red-600",
        bg: "bg-red-50",
    },

    SETTLEMENT_RECORDED: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
};

function formatActivityDate(date) {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getActivityConfig(activityType) {
    return (
        ACTIVITY_CONFIG[activityType] || {
            icon: Activity,
            color: "text-gray-600",
            bg: "bg-gray-50",
        }
    );
}

export default function ActivityTimeline({
    activities = [],
    loading = false,
    error = "",
    onRetry,
    emptyMessage = "No activity yet.",
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                    <span>Loading activity...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-red-800">
                            Unable to load activity
                        </h3>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>

                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!activities.length) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                <Activity className="mx-auto h-8 w-8 text-gray-400" />

                <p className="mt-3 text-sm text-gray-500">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {activities.map((activity, index) => {
                const config = getActivityConfig(
                    activity.activityType
                );

                const Icon = config.icon;

                return (
                    <div
                        key={activity.id}
                        className="relative flex gap-4"
                    >
                        {/* Timeline line */}
                        {index < activities.length - 1 && (
                            <div className="absolute left-5 top-11 h-full w-px bg-gray-200" />
                        )}

                        {/* Icon */}
                        <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                        >
                            <Icon
                                className={`h-5 w-5 ${config.color}`}
                            />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 pb-6">
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.message}
                                        </p>

                                        {activity.groupName && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Group:{" "}
                                                {activity.groupName}
                                            </p>
                                        )}
                                    </div>

                                    <span className="shrink-0 text-xs text-gray-400">
                                        {formatActivityDate(
                                            activity.createdAt
                                        )}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {activity.userName && (
                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                            {activity.userName}
                                        </span>
                                    )}

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                                    >
                                        {activity.activityType
                                            ?.replaceAll("_", " ")
                                            .toLowerCase()
                                            .replace(
                                                /\b\w/g,
                                                (char) =>
                                                    char.toUpperCase()
                                            )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}