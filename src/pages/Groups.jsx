import { useEffect, useState } from "react";
import {
    CalendarDays,
    Plus,
    Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import groupService from "../services/groupService";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function Groups() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await groupService.getMyGroups();

            console.log("Groups API response:", data);

            /*
             * Backend normally returns:
             *
             * [
             *   {
             *      id: 1,
             *      name: "Goa Trip",
             *      description: "...",
             *      members: [...]
             *   }
             * ]
             *
             * This also safely handles an accidental
             * wrapped response such as { content: [...] }.
             */
            if (Array.isArray(data)) {
                setGroups(data);
            } else if (Array.isArray(data?.content)) {
                setGroups(data.content);
            } else {
                setGroups([]);
            }

        } catch (error) {
            console.error(
                "Failed to load groups:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your groups."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Group Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                        Groups
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your shared expense groups.
                    </p>
                </div>

                <Link
                    to="/groups/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                >
                    <Plus size={18} />
                    Create Group
                </Link>

            </div>

            {/* Loading */}
            {loading && (
                <LoadingSpinner
                    message="Loading your groups..."
                />
            )}

            {/* Error */}
            {!loading && error && (
                <ErrorState
                    title="Unable to load groups"
                    message={error}
                    onRetry={loadGroups}
                />
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                groups.length === 0 && (
                    <EmptyState
                        title="No groups yet"
                        message="Create your first group to start splitting expenses with friends, family, or teammates."
                        actionLabel="Create Group"
                        onAction={() =>
                            navigate("/groups/create")
                        }
                    />
                )}

            {/* Groups */}
            {!loading &&
                !error &&
                groups.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                        {groups.map((group) => (

                            <Link
                                key={group.id}
                                to={`/groups/${group.id}`}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                            >

                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                                            <Users size={21} />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="truncate font-semibold text-slate-900">
                                                {group.name ||
                                                    "Unnamed Group"}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Group #{group.id}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Description */}
                                <p className="mt-4 min-h-10 text-sm leading-5 text-slate-500">
                                    {group.description ||
                                        "No description provided."}
                                </p>

                                {/* Footer */}
                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Users size={14} />

                                        <span>
                                            {group.members?.length ?? 0}{" "}
                                            {group.members?.length === 1
                                                ? "member"
                                                : "members"}
                                        </span>
                                    </div>

                                    {group.createdAt && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <CalendarDays size={14} />

                                            <span>
                                                {new Date(
                                                    group.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    )}

                                </div>

                                {/* View */}
                                <div className="mt-4 text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                                    View group →
                                </div>

                            </Link>

                        ))}

                    </div>
                )}

        </div>
    );
}

export default Groups;