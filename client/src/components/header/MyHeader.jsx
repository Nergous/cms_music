import React, { useState, useEffect, useContext } from "react";

import cl from "./MyHeader.module.css";
import BandLogo from "./headerList/BandLogo/BandLogo";
import Navbar from "./headerList/Navbar/Navbar";

import ApiContext from "../../ApiContext";
import axios from "axios";

const MyHeader = () => {
    const api = useContext(ApiContext);
    const [color, setColor] = useState("#ffffff");
    const [fontColor, setFontColor] = useState("#000000");
    useEffect(() => {
        const fetchColor = async () => {
            try  {
                const res = await axios.get(`${api}/admin/colors`);
                setColor(res.data.Colors.headerColor);
            } catch (error) {
                setColor("#ffffff");
            }
        }

        
        fetchColor();
    }, [])
    return (
        <header style={{ backgroundColor: color }} className={cl.head__class}>
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
