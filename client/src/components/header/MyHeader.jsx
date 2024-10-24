import React from "react";

import cl from "./MyHeader.module.css";
import BandLogo from "./headerList/BandLogo/BandLogo";
import Navbar from "./headerList/Navbar/Navbar";

const MyHeader = () => {
    return (
        <header className={cl.head__class}>
            <div className={cl.col2__head}>
                <BandLogo />
            </div>
            <div className={cl.col3__head}>
                <Navbar />
            </div>
        </header>
    );
};

export default MyHeader;
