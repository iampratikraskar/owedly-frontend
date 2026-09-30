import { AlertCircle } from "lucide-react";

function ErrorState({
    title = "Something went wrong",
    message = "We couldn't load this information.",
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <AlertCircle
                size={38}
                className="mx-auto text-red-500"
            />

            <h3 className="mt-4 font-semibold text-red-900">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-red-600">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Try Again
                </button>
            )}

        </div>
    );
}

export default ErrorState;