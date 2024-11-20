import React from "react";
import cl from "./Navbar.module.css";

const BurgerToggle = ({ isOpen, setIsOpen, displayMode }) => {
    const getToggleClassName = () => {
        let className = cl.navbar__toggle;
        if (isOpen) {
            className += ` ${cl.change}`;
        }
        if (displayMode === "alwaysBurger") {
            className += ` ${cl.alwaysBurger}`;
        } else if (displayMode === "alwaysFull") {
            className += ` ${cl.alwaysFull}`;
        }
        return className;
    };

    return (
        <div
            className={getToggleClassName()}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={`${cl.bar} ${isOpen ? cl.bar1 : ""}`}></div>
            <div className={`${cl.bar} ${isOpen ? cl.bar2 : ""}`}></div>
            <div className={`${cl.bar} ${isOpen ? cl.bar3 : ""}`}></div>
        </div>
    );
};

export default BurgerToggle;