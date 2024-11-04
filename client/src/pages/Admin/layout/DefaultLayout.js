import React from "react";
import { AppHeader, AppSidebar, AppFooter } from "../components";

const DefaultLayout = ({ children }) => {
    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                {children}
                <AppFooter />
            </div>
        </>
    );
};

export default DefaultLayout;
