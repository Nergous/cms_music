import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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

import DefaultLayout from "./layout/DefaultLayout";

import AdminSettings from "./pages/AdminSettings/AdminSettings";

import ApiContext from "../../ApiContext";

const Admin = () => {
    const apiUrl = useContext(ApiContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const checkAuthenticate = async () => {
        await axios
            .get(`${apiUrl}/admin/checkAuth`, {
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
                        <Route path="/" element={<DefaultLayout><AdminDashboard /></DefaultLayout>} />
                        <Route path="/music" element={<DefaultLayout><AdminMusic /></DefaultLayout>} />
                        <Route path="/music/*" element={<DefaultLayout><AdminMusic /></DefaultLayout>} />
                        <Route path="/music/create" element={<DefaultLayout><CreateMusic /></DefaultLayout>} />
                        <Route path="/music/:id/edit" element={<DefaultLayout><EditMusic /></DefaultLayout>} />
                        <Route path="/settings" element={<DefaultLayout><AdminSettings /></DefaultLayout>} />

                        <Route path="/members/*" element={<DefaultLayout><AdminMembers /></DefaultLayout>} />
                        <Route path="/members/create" element={<DefaultLayout><CreateMembers /></DefaultLayout>} />
                        <Route path="/members/:id/edit" element={<DefaultLayout><EditMembers /></DefaultLayout>} />

                        <Route path="/gigs/*" element={<DefaultLayout><AdminGigs /></DefaultLayout>} />
                        <Route path="/gigs/create" element={<DefaultLayout><CreateGigs /></DefaultLayout>} />
                        <Route path="/gigs/:id/edit" element={<DefaultLayout><EditGigs /></DefaultLayout>} />

                        <Route path="/roles/*" element={<DefaultLayout><AdminRoles /></DefaultLayout>} />
                        <Route path="/roles/:id/edit" element={<DefaultLayout><EditRoles /></DefaultLayout>} />
                        <Route path="/roles/create" element={<DefaultLayout><CreateRoles /></DefaultLayout>} />

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
