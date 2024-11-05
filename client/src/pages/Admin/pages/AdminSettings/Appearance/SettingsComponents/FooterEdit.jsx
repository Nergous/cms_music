import React, { useState, useEffect } from "react";
import axios from "axios";

import { CButton, CAlert, CForm } from "@coreui/react";
import ReactQuill from "react-quill-new";

const FooterEdit = ({api}) => {
    const [footerText, setFooterText] = useState("");
    const [footerTextError, setFooterTextError] = useState("");
    const [footerTextSuccess, setFooterTextSuccess] = useState("");

    useEffect(() => {
        const loadFooter = async () => {
            try {
                const response = await axios.get(`${api}/admin/footer`);
                setFooterText(response.data.FooterText);
            } catch (error) {
                setFooterTextError("Ошибка при загрузке текста");
            }
        };
        loadFooter();
    }, []);

    const handleSaveFooterText = async (event) => {
        try {
            await axios.post(
                `${api}/admin/save_footer`,
                {
                    footerText,
                },
                { withCredentials: true }
            );
            setFooterTextSuccess("Текст успешно сохранен");
            setFooterTextError("");
            setTimeout(() => setFooterTextSuccess(""), 3000);
        } catch (error) {
            setFooterTextError(error.response.data.message);
            setFooterTextSuccess("");
            setTimeout(() => setFooterTextError(""), 3000);
        }
    };

    return (
        <div style={{ margin: "30px 0" }}>
            {footerTextError && (
                <CAlert color="danger" dismissible onClose={() => setFooterTextError("")}>
                    {footerTextError}
                </CAlert>
            )}
            {footerTextSuccess && (
                <CAlert color="success" dismissible onClose={() => setFooterTextSuccess("")}>
                    {footerTextSuccess}
                </CAlert>
            )}
            <h3>Текст подвала</h3>
            <CForm style={{ margin: "30px 0" }}>
                <ReactQuill
                    style={{
                        marginBottom: "30px",
                    }}
                    value={footerText}
                    onChange={setFooterText}
                />
            </CForm>
            <CButton color="primary" onClick={handleSaveFooterText}>
                Сохранить текст подвала
            </CButton>
        </div>
    );
};

export default FooterEdit;
