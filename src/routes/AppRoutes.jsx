import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import Expenses from "../pages/Expenses";
import Settlements from "../pages/Settlements";
import Analytics from "../pages/Analytics";
import CreateGroup from "../pages/CreateGroup";
import GroupDetails from "../pages/GroupDetails";
import Activity from "../pages/Activity";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {

    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

            </Route>

            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/groups"
                    element={
                        <MainLayout>
                            <Groups />
                        </MainLayout>
                    }
                />

                <Route
                    path="/expenses"
                    element={
                        <MainLayout>
                            <Expenses />
                        </MainLayout>
                    }
                />

                <Route
                    path="/settlements"
                    element={
                        <MainLayout>
                            <Settlements />
                        </MainLayout>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <MainLayout>
                            <Analytics />
                        </MainLayout>
                    }
                />

                <Route
                    path="/groups/create"
                    element={
                        <MainLayout>
                            <CreateGroup />
                        </MainLayout>
                    }
                />

                <Route
                    path="/groups/:groupId"
                    element={
                        <MainLayout>
                            <GroupDetails />
                        </MainLayout>
                    }
                />

                <Route 
                    path="/activity" 
                    element={<Activity />} 
                />

            </Route>

        </Routes>
    );
}

export default AppRoutes;