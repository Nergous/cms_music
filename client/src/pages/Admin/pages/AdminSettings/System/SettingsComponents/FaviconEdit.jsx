import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormInput, CImage } from "@coreui/react";

const FaviconSettings = ({ api, id, label }) => {
    const [faviconFile, setFaviconFile] = useState(null);
    const [faviconUrl, setFaviconUrl] = useState("");
    const [faviconError, setFaviconError] = useState("");
    const [faviconSuccess, setFaviconSuccess] = useState("");

    useEffect(() => {
        const loadFavicon = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_favicon`);
                setFaviconUrl(response.data.faviconUrl);
            } catch (error) {
                setFaviconError("Ошибка при загрузке фавикона");
                setTimeout(() => setFaviconError(""), 3000);
            }
        };

        loadFavicon();
    }, [api]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFaviconFile(file);

        // Создаем URL для предварительного просмотра файла
        if (file) {
            const url = URL.createObjectURL(file);
            setFaviconUrl(url);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (!faviconFile) {
            setFaviconError("Пожалуйста, выберите файл");
            setTimeout(() => setFaviconError(""), 3000);
            return;
        }

        const formData = new FormData();
        formData.append("favicon", faviconFile);

        try {
            await axios.post(
                `${api}/admin/save_favicon`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            setFaviconSuccess("Фавикон успешно сохранен");
            setFaviconError("");
            setTimeout(() => setFaviconSuccess(""), 3000);
        } catch (error) {
            setFaviconError(error.response.data);
            setFaviconSuccess("");
            setTimeout(() => setFaviconError(""), 3000);
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {faviconError && (
                <CAlert color="danger" dismissible onClose={() => setFaviconError("")}>
                    {faviconError}
                </CAlert>
            )}
            {faviconSuccess && (
                <CAlert color="success" dismissible onClose={() => setFaviconSuccess("")}>
                    {faviconSuccess}
                </CAlert>
            )}

            <h3>Настройка фавикона</h3>
            <CForm style={{ margin: "30px 0" }} onSubmit={handleSave}>
                <CFormInput
                    type="file"
                    label="Загрузить фавикон"
                    onChange={handleFileChange}
                    style={{ marginBottom: "30px" }}
                />
                {faviconUrl && (
                    <div style={{ marginBottom: "30px" }}>
                        <CImage src={faviconUrl} alt="Favicon Preview" style={{ width: "32px", height: "32px" }} />
                    </div>
                )}
                <CButton color="primary" type="submit">
                    Сохранить
                </CButton>
            </CForm>
        </div>
    );
};

export default FaviconSettings;