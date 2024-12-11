import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput, CFormTextarea } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DescriptionEdit = ({ api, id, label }) => {
    const [description, setDescription] = useState("");

    useEffect(() => {
        const loadDescription = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_description`);
                setDescription(response.data.description);
            } catch (error) {
                toast.error("Ошибка при загрузке описания: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        loadDescription();
    }, [api]);

    const handleSave = async (event) => {
        event.preventDefault();

        if (!description) {
            toast.error("Пожалуйста, введите описание", {
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
            await axios.post(
                `${api}/admin/save_description`,
                { description },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            toast.success("Описание успешно сохранено", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении описания: " + error.response.data.error, {
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
            <h3>Редактирование описания страницы</h3>
            <CForm style={{ margin: "30px 0" }} onSubmit={handleSave}>
                <CFormTextarea
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginBottom: "30px" }}
                />
                <CButton color="primary" type="submit">
                    Сохранить
                </CButton>
            </CForm>
        </div>
    );
};

export default DescriptionEdit;
