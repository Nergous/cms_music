import React from "react";
import Members from "../../pages/Members/Members";
import Music from "../../pages/Music/Music";
import Gigs from "../../pages/Gigs/Gigs";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "../../pages/Main/Main";
import Admin from "../../pages/Admin/Admin";
import AdminAuth from "../../pages/Admin/AdminAuth";

const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Main pageName={"main"} />}></Route>
                <Route path="/members" element={<Members pageName={"members"} />}></Route>
                <Route path="/music" element={<Music />}></Route>
                <Route path="/gigs" element={<Gigs />}></Route>
                <Route path="/admin" element={<Admin />}></Route>
                <Route path="/login" element={<AdminAuth />} />
            </Routes>
        </>
    );
};

export default AppRouter;
