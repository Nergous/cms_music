import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormInput, CFormTextarea } from "@coreui/react";

const DescriptionEdit = ({ api, id, label }) => {
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionSuccess, setDescriptionSuccess] = useState("");

    useEffect(() => {
        const loadDescription = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_description`);
                setDescription(response.data.description);
            } catch (error) {
                setDescriptionError("Ошибка при загрузке описания");
                setTimeout(() => setDescriptionError(""), 3000);
            }
        };

        loadDescription();
    }, [api]);

    const handleSave = async (event) => {
        event.preventDefault();

        if (!description) {
            setDescriptionError("Пожалуйста, введите описание");
            setTimeout(() => setDescriptionError(""), 3000);
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
            setDescriptionSuccess("Описание успешно сохранено");
            setDescriptionError("");
            setTimeout(() => setDescriptionSuccess(""), 3000);
        } catch (error) {
            setDescriptionError(error.response.data.message);
            setDescriptionSuccess("");
            setTimeout(() => setDescriptionError(""), 3000);
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {descriptionError && (
                <CAlert color="danger" dismissible onClose={() => setDescriptionError("")}>
                    {descriptionError}
                </CAlert>
            )}
            {descriptionSuccess && (
                <CAlert color="success" dismissible onClose={() => setDescriptionSuccess("")}>
                    {descriptionSuccess}
                </CAlert>
            )}

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