import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {

    const {
        isAuthenticated,
        loading,
    } = useAuth();

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">

                <div className="text-center">

                    <div className="text-xl font-semibold text-gray-800">
                        Loading Owedly...
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Checking your session
                    </p>

                </div>

            </div>
        );
    }

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;