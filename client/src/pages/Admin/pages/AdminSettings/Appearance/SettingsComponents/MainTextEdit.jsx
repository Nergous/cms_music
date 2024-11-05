import React, { useState, useEffect } from "react";
import axios from "axios";

import { CButton, CAlert, CForm } from "@coreui/react";

import ReactQuill from "react-quill-new";

const MainText = ({api}) => {
    const [text, setText] = useState("");
    const [textError, setTextError] = useState("");
    const [textSuccess, setTextSuccess] = useState("");

    useEffect(() => {
        const loadText = async () => {
            try {
                const response = await axios.get(`${api}/admin/load`);
                setText(response.data.MainText);
            } catch (error) {
                setTextError("Ошибка при загрузке текста");
                setTimeout(() => setTextError(""), 3000);
            }
        };

        loadText();
    }, []);

    const handleSave = async (event) => {
        try {
            await axios.post(
                `${api}/admin/save`,
                {
                    text,
                },
                { withCredentials: true }
            );
            setTextSuccess("Текст успешно сохранен");
            setTextError("");
            setTimeout(() => setTextSuccess(""), 3000);
        } catch (error) {
            setTextError(error.response.data.message);
            setTextSuccess("");
            setTimeout(() => setTextError(""), 3000);
        }
    };

    return (
        <div style={{ margin: "30px 0" }}>
            {textError && (
                <CAlert color="danger" dismissible onClose={() => setTextError("")}>
                    {textError}
                </CAlert>
            )}
            {textSuccess && (
                <CAlert color="success" dismissible onClose={() => setTextSuccess("")}>
                    {textSuccess}
                </CAlert>
            )}

            <h3>Текст на главной странице</h3>
            <CForm style={{ margin: "30px 0" }}>
                <ReactQuill
                    theme="snow"
                    style={{
                        marginBottom: "30px",
                    }}
                    value={text}
                    onChange={setText}
                />
            </CForm>
            <CButton color="primary" onClick={handleSave}>
                Сохранить
            </CButton>
        </div>
    );
};

export default MainText;
