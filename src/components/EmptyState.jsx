import { Inbox } from "lucide-react";

function EmptyState({
    title = "Nothing here yet",
    message = "There is no data to display.",
    actionLabel,
    onAction,
}) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

            <Inbox
                size={40}
                className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    {actionLabel}
                </button>
            )}

        </div>
    );
}

export default EmptyState;