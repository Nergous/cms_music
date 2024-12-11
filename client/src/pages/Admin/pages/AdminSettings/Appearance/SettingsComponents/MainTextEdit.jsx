import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm } from "@coreui/react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainText = ({ api, id, label }) => {
    const [text, setText] = useState("");

    useEffect(() => {
        const loadText = async () => {
            try {
                const response = await axios.get(`${api}/admin/load`);
                setText(response.data.MainText);
            } catch (error) {
                toast.error("Ошибка при загрузке текста: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        loadText();
    }, [api]);

    const handleSave = async () => {
        try {
            await axios.post(
                `${api}/admin/save`,
                {
                    text,
                },
                { withCredentials: true }
            );
            toast.success("Текст успешно сохранен", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении текста: " + error.response.data.error, {
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
