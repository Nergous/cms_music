import React, { useState, useEffect } from "react";
import axios from "axios";
import { CForm, CFormCheck, CButton } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MusicEdit = ({ api, id, label }) => {
    const [displayMode, setDisplayMode] = useState("default");

    useEffect(() => {
        const fetchNavbarSettings = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_music_display_mode`);
                setDisplayMode(response.data.displayMode);
            } catch (error) {
                toast.error("Ошибка при загрузке настроек: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };
        fetchNavbarSettings();
    }, [api]);

    const handleSaveSettings = async () => {
        try {
            await axios.post(`${api}/admin/save_music_display_mode`, { displayMode }, { withCredentials: true });
            toast.success("Настройки успешно сохранены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Ошибка при сохранении настроек: " + error.response.data.error, {
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
            <h3>Режим отображения музыкальных релизов</h3>
            <CForm style={{ margin: "30px 0" }}>
                <CFormCheck
                    type="radio"
                    id="default"
                    name="displayMode"
                    label="Отображение релизов кнопками"
                    checked={displayMode === "default"}
                    onChange={() => setDisplayMode("default")}
                />
                <CFormCheck
                    type="radio"
                    id="image"
                    name="image"
                    label="Отображение релизов обложками"
                    checked={displayMode === "image"}
                    onChange={() => setDisplayMode("image")}
                />
            </CForm>
            <CButton color="primary" onClick={handleSaveSettings}>
                Сохранить настройки
            </CButton>
        </div>
    );
};

export default MusicEdit;
