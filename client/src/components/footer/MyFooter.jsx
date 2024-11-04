import React, { useState, useEffect, useContext } from "react";
import HtmlReactParser from "html-react-parser";
import axios from "axios";
import { FaVk, FaYoutube, FaEnvelope } from "react-icons/fa";

import ApiContext from "../../ApiContext";
import cl from "./MyFooter.module.css";

const MyFooter = () => {
    const [footerText, setFooterText] = useState("");
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

        loadFooter();
        loadSocials();

        // get current year
        setYear(new Date().getFullYear());
    }, [apiUrl]);

    return (
        <footer className={cl.footer}>
            <div className={cl.footer_text_left}>{HtmlReactParser(footerText)}</div>
            <div className={cl.footer_text_right}>
                {year}
                <div className={cl.social_icons}>
                    {socialLinks.vk_link && (
                        <a href={socialLinks.vk_link} target="_blank" rel="noopener noreferrer">
                            <FaVk />
                        </a>
                    )}
                    {socialLinks.youtube_link && (
                        <a href={socialLinks.youtube_link} target="_blank" rel="noopener noreferrer">
                            <FaYoutube />
                        </a>
                    )}
                    {socialLinks.email_link && (
                        <a href={socialLinks.email_link} target="_blank" rel="noopener noreferrer">
                            <FaEnvelope />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default MyFooter;