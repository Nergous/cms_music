import React, { useState, useEffect } from "react";
import axios from "axios";
import { CForm, CFormCheck, CButton, CAlert } from "@coreui/react";

const NavbarEdit = ({ api, id, label }) => {
    const [displayMode, setDisplayMode] = useState("auto");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchNavbarSettings = async () => {
            try {
                const response = await axios.get(`${api}/admin/navbar_settings`);
                setDisplayMode(response.data.displayMode);
            } catch (error) {
                setError("Ошибка при загрузке настроек");
            }
        };
        fetchNavbarSettings();
    }, [api]);

    const handleSaveSettings = async () => {
        try {
            await axios.post(`${api}/admin/save_navbar_settings`, { displayMode }, { withCredentials: true });
            setSuccess("Настройки успешно сохранены");
            setError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError("Ошибка при сохранении настроек");
            setSuccess("");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {error && (
                <CAlert color="danger" dismissible onClose={() => setError("")}>
                    {error}
                </CAlert>
            )}
            {success && (
                <CAlert color="success" dismissible onClose={() => setSuccess("")}>
                    {success}
                </CAlert>
            )}
            <h3>Режим отображения навигационной панели</h3>
            <CForm style={{ margin: "30px 0" }}>
                <CFormCheck
                    type="radio"
                    id="auto"
                    name="displayMode"
                    label="Автоматический режим (бургер-меню на маленьких экранах)"
                    checked={displayMode === "auto"}
                    onChange={() => setDisplayMode("auto")}
                />
                <CFormCheck
                    type="radio"
                    id="alwaysBurger"
                    name="displayMode"
                    label="Всегда бургер-меню"
                    checked={displayMode === "alwaysBurger"}
                    onChange={() => setDisplayMode("alwaysBurger")}
                />
            </CForm>
            <CButton color="primary" onClick={handleSaveSettings}>
                Сохранить настройки
            </CButton>
        </div>
    );
};

export default NavbarEdit;
