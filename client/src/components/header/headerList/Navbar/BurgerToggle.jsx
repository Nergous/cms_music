import React from "react";

import cl from "./Navbar.module.css";

const BurgerToggle = ({ isOpen, setIsOpen }) => {
    return (
        <div
            className={`${cl.navbar__toggle} ${isOpen ? cl.change : ""}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={`${cl.bar} ${isOpen ? cl.bar1 : ""}`}></div>
            <div className={`${cl.bar} ${isOpen ? cl.bar2 : ""}`}></div>
            <div className={`${cl.bar} ${isOpen ? cl.bar3 : ""}`}></div>
        </div>
    );
};
export default BurgerToggle;
