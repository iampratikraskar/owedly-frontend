import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    Receipt,
    Users,
    X,
} from "lucide-react";
// import { Activity } from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Groups",
            path: "/groups",
            icon: Users,
        },
        {
            name: "Expenses",
            path: "/expenses",
            icon: Receipt,
        },
        {
            name: "Settlements",
            path: "/settlements",
            icon: CreditCard,
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: BarChart3,
        },
        // {
        //     label: "Activity",
        //     path: "/activity",
        //     icon: Activity,
        // },
    ];

    return (
        <>
            {/* Mobile overlay */}

            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                />
            )}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    h-screen
                    w-64
                    bg-white
                    border-r
                    border-gray-200
                    transform
                    transition-transform
                    duration-200
                    md:translate-x-0
                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* Logo */}

                <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">

                    <span className="text-xl font-bold text-indigo-600">
                        Owedly
                    </span>

                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Navigation */}

                <nav className="p-4 space-y-1">

                    {navigation.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    transition
                                    ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                    `
                                }
                            >

                                <Icon size={19} />

                                {item.name}

                            </NavLink>
                        );
                    })}

                </nav>

            </aside>
        </>
    );
}

export default Sidebar;