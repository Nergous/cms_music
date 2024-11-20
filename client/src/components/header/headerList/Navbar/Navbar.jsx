import React, { useState, useEffect, useContext } from "react";
import cl from "./Navbar.module.css";
import BurgerToggle from "./BurgerToggle";
import NavItems from "./NavItems";
import axios from "axios";
import ApiContext from "../../../../ApiContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState("auto");
    const api = useContext(ApiContext);

    useEffect(() => {
        const fetchNavbarSettings = async () => {
            try {
                const response = await axios.get(`${api}/admin/navbar_settings`);
                setDisplayMode(response.data.displayMode);
            } catch (error) {
                setDisplayMode("auto");
            }
        };
        fetchNavbarSettings();
    }, [api]);

    const shouldShowBurger = () => {
        if (displayMode === "alwaysBurger") return true;
        if (displayMode === "alwaysFull") return false;
        return window.innerWidth <= 900; // Default breakpoint for auto mode
    };

    return (
        <div className={cl.navbar__main}>
            {shouldShowBurger() && <BurgerToggle isOpen={isOpen} setIsOpen={setIsOpen} displayMode={displayMode} />}
            <NavItems isOpen={isOpen} setIsOpen={setIsOpen} displayMode={displayMode} />
        </div>
    );
};

export default Navbar;