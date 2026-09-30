import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="md:ml-64">

                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>

                <main>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;