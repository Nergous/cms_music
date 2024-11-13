import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormInput } from "@coreui/react";

const FontColorEdit = ({api, id, label}) => {
    const [fontColors, setFontColors] = useState({
        mainFontColor: "#ffffff",
        headerFontColor: "#ffffff",
        footerFontColor: "#ffffff",
    });
    const [colorError, setColorError] = useState("");
    const [colorSuccess, setColorSuccess] = useState("");

    useEffect(() => {
        const loadFontColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/font_colors`);
                setFontColors(response.data.FontColors);
            } catch (error) {
                setColorError(error.response.data.message);
            }
        };

        loadFontColors();
    }, [api]);

    const handleSave = async () => {
        try {
            await axios.post(
                `${api}/admin/save_font_colors`,
                {
                    FontColors: fontColors,
                },
                { withCredentials: true }
            );
            setColorSuccess("Цвета шрифтов успешно сохранены");
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
        setFontColors({
            ...fontColors,
            [name]: value,
        });
    };

    const defaultColors = async () => {
        try {
            await axios.post(
                `${api}/admin/save_font_colors`,
                {
                    FontColors: {
                        mainFontColor: "#ffffff",
                        headerFontColor: "#000000",
                        footerFontColor: "#000000",
                    },
                },
                { withCredentials: true }
            );
            setColorSuccess("Цвета шрифтов успешно восстановлены в стандартные значения");
            setFontColors({
                mainFontColor: "#ffffff",
                headerFontColor: "#000000",
                footerFontColor: "#000000",
            });
            setColorError("");
            setTimeout(() => setColorSuccess(""), 3000); // Скрыть сообщение об успехе через 3 секунды
        } catch (error) {
            setColorError(error.response.data.message);
            setColorSuccess("");
            setTimeout(() => setColorError(""), 3000); // Скрыть сообщение об ошибке через 3 секунды
        }
    };

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

            <h3>Изменение цветов шрифтов</h3>
            <CForm style={{ margin: "30px 0" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="mainFontColor">Цвет основного шрифта:</label>
                    <CFormInput type="color" id="mainFontColor" name="mainFontColor" value={fontColors.mainFontColor} onChange={handleColorChange} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="headerFontColor">Цвет шрифта в шапке:</label>
                    <CFormInput
                        type="color"
                        id="headerFontColor"
                        name="headerFontColor"
                        value={fontColors.headerFontColor}
                        onChange={handleColorChange}
                    />
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label htmlFor="footerFontColor">Цвет шрифта в подвале:</label>
                    <CFormInput
                        type="color"
                        id="footerFontColor"
                        name="footerFontColor"
                        value={fontColors.footerFontColor}
                        onChange={handleColorChange}
                    />
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

export default FontColorEdit;
