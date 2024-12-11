import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormTextarea } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TitleEdit = ({ api, id, label }) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        const loadTitle = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_title`);
                setTitle(response.data.title);
            } catch (error) {
                toast.error("Ошибка при загрузке заголовка: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        loadTitle();
    }, [api]);

    const handleSave = async (event) => {
        event.preventDefault();

        if (!title) {
            toast.error("Пожалуйста, введите заголовок", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            await axios.post(`${api}/admin/save_title`, { title }, { withCredentials: true });
            toast.success("Заголовок успешно сохранен", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении заголовка: " + error.response.data.error, {
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
            <h3>Редактирование заголовка сайта</h3>
            <CForm style={{ margin: "30px 0" }} onSubmit={handleSave}>
                <CFormTextarea label="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: "30px" }} />
                <CButton color="primary" type="submit">
                    Сохранить
                </CButton>
            </CForm>
        </div>
    );
};

export default TitleEdit;
