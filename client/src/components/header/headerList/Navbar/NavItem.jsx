import React from "react";
import cl from "./Navbar.module.css";
import { Link } from "react-router-dom";

const NavItem = ({ link, setIsOpen }) => {
    return (
        <Link
            className={cl.navbar__item__main}
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
        >
            {link.name}
        </Link>
    );
};
export default NavItem;