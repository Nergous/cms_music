import React from "react";
import cl from "./Navbar.module.css";
import NavItem from "./NavItem";

const NavItems = ({ isOpen, setIsOpen }) => {
    const links = [
        {
            name: "Главная",
            path: "/",
        },
        {
            name: "Участники",
            path: "/members",
        },
        {
            name: "Музыка",
            path: "/music",
        },
        {
            name: "Выступления",
            path: "/gigs",
        },
    ];
    return (
        <div className={`${cl.navbar__items} ${isOpen ? cl.active : ""}`}>
            {links.map((link) => (
               <NavItem key={link.name} link={link} setIsOpen={setIsOpen} />
            ))}
        </div>
    );
};

export default NavItems;
