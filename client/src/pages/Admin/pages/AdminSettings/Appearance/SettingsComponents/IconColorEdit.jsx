import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormInput } from "@coreui/react";

const IconColorEdit = ({api, id, label}) => {
    const [iconColors, setIconColors] = useState({
        vkColor: "#000000",
        youtubeColor: "#000000",
        emailColor: "#000000",
    });
    const [colorError, setColorError] = useState("");
    const [colorSuccess, setColorSuccess] = useState("");

    useEffect(() => {
        const loadIconColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/icon_colors`);
                setIconColors(response.data.IconColors);
            } catch (error) {
                setColorError(error.response.data.message);
            }
        };

        loadIconColors();
    }, [api]);

    const handleSave = async () => {
        try {
            await axios.post(
                `${api}/admin/save_icon_colors`,
                {
                    IconColors: iconColors,
                },
                { withCredentials: true }
            );
            setColorSuccess("Цвета иконок успешно сохранены");
            setColorError("");
            setTimeout(() => setColorSuccess(""), 3000); // Скрыть сообщение об успехе через 3 секунды
        } catch (error) {
            setColorError(error.response.data.message);
            setColorSuccess("");
            setTimeout(() => setColorError(""), 3000); // Скрыть сообщение об ошибке через 3 секунды
        }
    };

    const handleColorChange = (event) => {
        const { name, value } = event.target;
        setIconColors({
            ...iconColors,
            [name]: value,
        });
    };

    const defaultColor = async () => {
        try {
            await axios.post(`${api}/admin/save_icon_colors`, {
                IconColors: {
                    vkColor: "#000000",
                    youtubeColor: "#000000",
                    emailColor: "#000000",
                },
            }, { withCredentials: true });
            setColorSuccess("Цвета иконок успешно сброшены на значения по умолчанию");
            setIconColors({
                vkColor: "#000000",
                youtubeColor: "#000000",
                emailColor: "#000000",
            })
            setColorError("");
            setTimeout(() => setColorSuccess(""), 3000); // Скрыть сообщение об успехе через 3 секунды
        } catch (error) {
            setColorError(error.response.data.message);
            setColorSuccess("");
            setTimeout(() => setColorError(""), 3000); // Скрыть сообщение об ошибке через 3 секунды
        }
    }

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {colorError && (
                <CAlert color="danger" dismissible onClose={() => setColorError("")}>
                    {colorError}
                </CAlert>
            )}
            {colorSuccess && (
                <CAlert color="success" dismissible onClose={() => setColorSuccess("")}>
                    {colorSuccess}
                </CAlert>
            )}

            <h3>Изменение цветов иконок социальных сетей</h3>
            <CForm style={{ margin: "30px 0" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="vkColor">Цвет иконки ВКонтакте:</label>
                    <CFormInput type="color" id="vkColor" name="vkColor" value={iconColors.vkColor} onChange={handleColorChange} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="youtubeColor">Цвет иконки YouTube:</label>
                    <CFormInput type="color" id="youtubeColor" name="youtubeColor" value={iconColors.youtubeColor} onChange={handleColorChange} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="emailColor">Цвет иконки почты:</label>
                    <CFormInput type="color" id="emailColor" name="emailColor" value={iconColors.emailColor} onChange={handleColorChange} />
                </div>
            </CForm>
            <div style={{ display: "inline-block" }}>
                <CButton color="primary" onClick={handleSave}>
                    Сохранить
                </CButton>
                <CButton color="secondary" style={{ marginLeft: "10px" }} onClick={defaultColor}>
                    Сбросить
                </CButton>
                
            </div>
        </div>
    );
};

export default IconColorEdit;
