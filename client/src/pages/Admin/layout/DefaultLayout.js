import React from "react";
import { AppHeader, AppSidebar, AppFooter } from "../components";

const DefaultLayout = ({ children }) => {
    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="flex-grow-1" style={{ overflowY: "auto", position: "relative" }}>
                    {children}
                </div>
                <AppFooter />
            </div>
        </>
    );
};

export default DefaultLayout;