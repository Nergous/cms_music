import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import "./scss/style.scss";

import AdminMusic from "./pages/AdminMusic/AdminMusic";
import CreateMusic from "./pages/AdminMusic/CreateMusic";
import EditMusic from "./pages/AdminMusic/EditMusic";

import AdminMembers from "./pages/AdminMembers/AdminMembers";
import CreateMembers from "./pages/AdminMembers/CreateMembers";
import EditMembers from "./pages/AdminMembers/EditMembers";

import AdminGigs from "./pages/AdminGigs/AdminGigs";
import CreateGigs from "./pages/AdminGigs/CreateGigs";
import EditGigs from "./pages/AdminGigs/EditGigs";

import AdminRoles from "./pages/AdminRoles/AdminRoles";
import CreateRoles from "./pages/AdminRoles/CreateRoles";
import EditRoles from "./pages/AdminRoles/EditRoles";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const checkAuthenticate = async () => {
        await axios
            .get("/api/admin/checkAuth", {
                withCredentials: true,
            })
            .then((response) => {
                if (response.data.success) {
                    setIsAuthenticated(true);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsAuthenticated(false);
                setIsLoading(false);
            });
    };
    useEffect(() => {
        checkAuthenticate();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Routes>
                {isAuthenticated && (
                    <>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/music" element={<AdminMusic />} />
                        <Route path="/music/*" element={<AdminMusic />} />
                        <Route path="/music/create" element={<CreateMusic />} />
                        <Route path="/music/:id/edit" element={<EditMusic />} />

                        <Route path="/members/*" element={<AdminMembers />} />
                        <Route
                            path="/members/create"
                            element={<CreateMembers />}
                        />
                        <Route
                            path="/members/:id/edit"
                            element={<EditMembers />}
                        />

                        <Route path="/gigs/*" element={<AdminGigs />} />
                        <Route path="/gigs/create" element={<CreateGigs />} />
                        <Route path="/gigs/:id/edit" element={<EditGigs />} />

                        <Route path="/roles/*" element={<AdminRoles />} />
                        <Route path="/roles/:id/edit" element={<EditRoles />} />
                        <Route path="/roles/create" element={<CreateRoles />} />

                        <Route path="/*" element={<Navigate to="/admin" />} />
                    </>
                )}
                {!isAuthenticated && (
                    <Route path="/*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </>
    );
};

export default Admin;
