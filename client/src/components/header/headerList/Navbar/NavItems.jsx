import React, { useState, useEffect, useContext } from "react";
import cl from "./Navbar.module.css";
import NavItem from "./NavItem";
import axios from "axios";
import ApiContext from "../../../../ApiContext";

const NavItems = ({ isOpen, setIsOpen, displayMode }) => {
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

    const api = useContext(ApiContext);
    const [fontColor, setFontColor] = useState("#000000");

    useEffect(() => {
        const fetchFontColor = async () => {
            try {
                const res = await axios.get(`${api}/admin/font_colors`);
                setFontColor(res.data.FontColors.headerFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        };

        fetchFontColor();
    }, [api]);

    const getNavItemsClassName = () => {
        let className = cl.navbar__items;
        if (isOpen) {
            className += ` ${cl.active}`;
        }
        if (displayMode === "alwaysBurger") {
            className += ` ${cl.alwaysBurger}`;
        } else if (displayMode === "alwaysFull") {
            className += ` ${cl.alwaysFull}`;
        }
        return className;
    };

    return (
        <div className={getNavItemsClassName()}>
            {links.map((link) => (
                <NavItem key={link.name} link={link} setIsOpen={setIsOpen} color={fontColor} />
            ))}
        </div>
    );
};

export default NavItems;