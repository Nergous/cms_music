import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormInput } from "@coreui/react";

const ColorEdit = ({api, id, label}) => {
    const [colors, setColors] = useState({
        headerColor: "#000000",
        backgroundColor: "#ffffff",
        footerColor: "#000000",
    });
    const [colorError, setColorError] = useState("");
    const [colorSuccess, setColorSuccess] = useState("");

    useEffect(() => {
        const loadColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/colors`);
                setColors(response.data.Colors);
            } catch (error) {
                setColorError(error.response.data.message);
            }
        };

        loadColors();
    }, [api]);

    const handleSave = async () => {
        try {
            await axios.post(
                `${api}/admin/save_colors`,
                {
                    Colors: colors,
                },
                { withCredentials: true }
            );
            setColorSuccess("Цвета успешно сохранены");
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
        setColors({
            ...colors,
            [name]: value,
        });
    };

    const defaultColors = async () => {
        try {
            await axios.post(
                `${api}/admin/save_colors`,
                {
                    Colors: {
                        headerColor: "#ffffff",
                        backgroundColor: "#000000",
                        footerColor: "#ffffff",
                    },
                },
                { withCredentials: true }
            );
            setColorSuccess("Цвета успешно восстановлены в стандартные значения");
            setColors({
                headerColor: "#ffffff",
                backgroundColor: "#000000",
                footerColor: "#ffffff",
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

            <h3>Изменение цветов</h3>
            <CForm style={{ margin: "30px 0" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="headerColor">Цвет шапки:</label>
                    <CFormInput type="color" id="headerColor" name="headerColor" value={colors.headerColor} onChange={handleColorChange} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="backgroundColor">Цвет фона:</label>
                    <CFormInput
                        type="color"
                        id="backgroundColor"
                        name="backgroundColor"
                        value={colors.backgroundColor}
                        onChange={handleColorChange}
                    />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="footerColor">Цвет подвала:</label>
                    <CFormInput type="color" id="footerColor" name="footerColor" value={colors.footerColor} onChange={handleColorChange} />
                </div>
            </CForm>
            <div style={{ marginTop: "20px", display: "inline-block" }}>
                <CButton color="primary" onClick={handleSave}>
                    Сохранить
                </CButton>
                <CButton color="secondary" style={{ marginLeft: "10px" }} onClick={defaultColors}>
                    Сбросить
                </CButton>
            </div>
        </div>
    );
};

export default ColorEdit;
