import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm } from "@coreui/react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FooterEdit = ({ api, id, label }) => {
    const [footerText, setFooterText] = useState("");

    useEffect(() => {
        const loadFooter = async () => {
            try {
                const response = await axios.get(`${api}/admin/footer`);
                setFooterText(response.data.FooterText);
            } catch (error) {
                toast.error("Ошибка при загрузке текста подвала: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };
        loadFooter();
    }, [api]);

    const handleSaveFooterText = async () => {
        try {
            await axios.post(
                `${api}/admin/save_footer`,
                {
                    footerText,
                },
                { withCredentials: true }
            );
            toast.success("Текст подвала успешно сохранен", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении текста подвала: " + error.response.data.error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
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
