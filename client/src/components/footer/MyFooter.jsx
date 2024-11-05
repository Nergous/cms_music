import React, { useState, useEffect, useContext } from "react";
import HtmlReactParser from "html-react-parser";
import axios from "axios";
import { FaVk, FaYoutube, FaEnvelope } from "react-icons/fa";

import ApiContext from "../../ApiContext";
import cl from "./MyFooter.module.css";

const MyFooter = () => {
    const [colors, setColors] = useState("#ffffff");
    const [fontColor, setFontColor] = useState("#ffffff");
    const [footerText, setFooterText] = useState("");
    const [iconColor, setIconColor] = useState({
        vkColor: "#ffffff",
        youtubeColor: "#ffffff",
        emailColor: "#ffffff",
    });
    const [year, setYear] = useState("");
    const [socialLinks, setSocialLinks] = useState({
        vk_link: "",
        youtube_link: "",
        email_link: "",
    });

    const apiUrl = useContext(ApiContext);

    useEffect(() => {
        const loadFooter = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/footer`);
                setFooterText(response.data.FooterText);
            } catch (error) {
                setFooterText("Ошибка при загрузке текста подвала");
            }
        };

        const loadSocials = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/socials`);
                setSocialLinks(response.data.Socials);
            } catch (error) {
                console.error("Ошибка при загрузке социальных сетей", error);
            }
        };

        const loadColors = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/colors`);
                setColors(response.data.Colors.footerColor);
            } catch (error) {
                setColors("#ffffff");
            }
        };

        const fetchFontColor = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/font_colors`);
                setFontColor(res.data.FontColors.footerFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        };

        const fetchIconColor = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/icon_colors`);
                setIconColor(res.data.IconColors);
            } catch (error) {
                setIconColor({ vkColor: "#ffffff", youtubeColor: "#ffffff", emailColor: "#ffffff" });
            }
        };

        fetchIconColor();
        fetchFontColor();
        loadFooter();
        loadSocials();
        loadColors();

        setYear(new Date().getFullYear());
    }, [apiUrl]);

    return (
        <footer style={{ backgroundColor: colors, color: fontColor }} className={cl.footer}>
            <div className={cl.footer_text_left}>{HtmlReactParser(footerText)}</div>
            <div className={cl.footer_text_right}>
                {year}
                <div className={cl.social_icons}>
                    {socialLinks.vk_link && (
                        <a href={socialLinks.vk_link} target="_blank" rel="noopener noreferrer">
                            <FaVk color={iconColor.vkColor} />
                        </a>
                    )}
                    {socialLinks.youtube_link && (
                        <a href={socialLinks.youtube_link} target="_blank" rel="noopener noreferrer">
                            <FaYoutube color={iconColor.youtubeColor} />
                        </a>
                    )}
                    {socialLinks.email_link && (
                        <a href={socialLinks.email_link} target="_blank" rel="noopener noreferrer">
                            <FaEnvelope color={iconColor.emailColor} />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default MyFooter;
