import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FontColorEdit = ({ api, id, label }) => {
    const [fontColors, setFontColors] = useState({
        mainFontColor: "#ffffff",
        headerFontColor: "#ffffff",
        footerFontColor: "#ffffff",
    });

    useEffect(() => {
        const loadFontColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/font_colors`);
                setFontColors(response.data.FontColors);
            } catch (error) {
                toast.error("Ошибка при загрузке цветов шрифтов: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
            toast.success("Цвета шрифтов успешно сохранены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении цветов шрифтов: " + error.response.data.error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
            setFontColors({
                mainFontColor: "#ffffff",
                headerFontColor: "#000000",
                footerFontColor: "#000000",
            });
            toast.success("Цвета шрифтов успешно восстановлены в стандартные значения", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сбросе цветов шрифтов: " + error.response.data.error, {
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
