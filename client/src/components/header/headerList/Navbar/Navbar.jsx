import React, { useState } from "react";
import cl from "./Navbar.module.css";

import BurgerToggle from "./BurgerToggle";
import NavItems from "./NavItems";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cl.navbar__main}>
            <BurgerToggle isOpen={isOpen} setIsOpen={setIsOpen} />
            <NavItems isOpen={isOpen} setIsOpen={setIsOpen} />
            
        </div>
    );
};

export default Navbar;
