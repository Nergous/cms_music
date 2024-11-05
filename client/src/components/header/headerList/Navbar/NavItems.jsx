import React, { useState, useEffect, useContext } from "react";
import cl from "./Navbar.module.css";
import NavItem from "./NavItem";
import axios from "axios";
import ApiContext from "../../../../ApiContext";

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

    const api = useContext(ApiContext);
    const [fontColor, setFontColor] = useState("#000000");
    useEffect(() => {
        const fetchFontColor = async () => {
            try  {
                const res = await axios.get(`${api}/admin/font_colors`);
                setFontColor(res.data.FontColors.headerFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        }
        
        fetchFontColor();    
    }, [])
    
    return (
        <div className={`${cl.navbar__items} ${isOpen ? cl.active : ""}`}>
            {links.map((link) => (
               <NavItem key={link.name} link={link} setIsOpen={setIsOpen} color={fontColor} />
            ))}
        </div>
    );
};

export default NavItems;
