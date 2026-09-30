import { LogOut, Menu, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">

            {/* Left */}
            <div className="flex items-center gap-3">

                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div className="text-xl font-bold text-indigo-600">
                    Owedly
                </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

                <div className="hidden sm:flex items-center gap-2">

                    <UserCircle
                        size={24}
                        className="text-gray-500"
                    />

                    <div className="text-sm">

                        <p className="font-medium text-gray-800">
                            {user?.name || "User"}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user?.email}
                        </p>

                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                    <LogOut size={18} />

                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>

            </div>

        </header>
    );
}

export default Navbar;