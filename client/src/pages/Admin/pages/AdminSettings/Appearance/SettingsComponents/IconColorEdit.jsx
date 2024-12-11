import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IconColorEdit = ({ api, id, label }) => {
    const [iconColors, setIconColors] = useState({
        vkColor: "#000000",
        youtubeColor: "#000000",
        emailColor: "#000000",
    });

    useEffect(() => {
        const loadIconColors = async () => {
            try {
                const response = await axios.get(`${api}/admin/icon_colors`);
                setIconColors(response.data.IconColors);
            } catch (error) {
                toast.error("Ошибка при загрузке цветов иконок: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
            toast.success("Цвета иконок успешно сохранены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сохранении цветов иконок: " + error.response.data.error, {
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
        setIconColors({
            ...iconColors,
            [name]: value,
        });
    };

    const defaultColor = async () => {
        try {
            await axios.post(
                `${api}/admin/save_icon_colors`,
                {
                    IconColors: {
                        vkColor: "#000000",
                        youtubeColor: "#000000",
                        emailColor: "#000000",
                    },
                },
                { withCredentials: true }
            );
            setIconColors({
                vkColor: "#000000",
                youtubeColor: "#000000",
                emailColor: "#000000",
            });
            toast.success("Цвета иконок успешно сброшены на значения по умолчанию", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при сбросе цветов иконок: " + error.response.data.error, {
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
