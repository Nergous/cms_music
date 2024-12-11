import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ColorEdit = ({ api, id, label }) => {
    const [colors, setColors] = useState({
        headerColor: "#000000",
        backgroundColor: "#ffffff",
        footerColor: "#000000",
    });

    useEffect(() => {
        const loadColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/colors`);
                setColors(response.data.Colors);
            } catch (error) {
                toast.error("Ошибка при загрузке цветов: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
            toast.success("Цвета успешно сохранены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении цветов: " + error.response.data.error, {
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
            setColors({
                headerColor: "#ffffff",
                backgroundColor: "#000000",
                footerColor: "#ffffff",
            });
            toast.success("Цвета успешно восстановлены в стандартные значения", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сбросе цветов: " + error.response.data.error, {
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
