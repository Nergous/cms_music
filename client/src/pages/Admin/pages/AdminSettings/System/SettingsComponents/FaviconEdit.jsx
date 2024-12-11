import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput, CImage } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FaviconSettings = ({ api, id, label }) => {
    const [faviconFile, setFaviconFile] = useState(null);
    const [faviconUrl, setFaviconUrl] = useState("");

    useEffect(() => {
        const loadFavicon = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_favicon`);
                setFaviconUrl(response.data.faviconUrl);
            } catch (error) {
                toast.error("Ошибка при загрузке фавикона: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
            toast.error("Пожалуйста, выберите файл", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
            toast.success("Фавикон успешно сохранен", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении фавикона: " + error.response.data.error, {
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