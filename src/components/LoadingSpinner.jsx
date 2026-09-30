function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="mt-4 text-sm text-slate-500">
                {message}
            </p>
        </div>
    );
}

export default LoadingSpinner;