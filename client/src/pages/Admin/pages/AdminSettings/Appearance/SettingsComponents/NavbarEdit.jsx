import React, { useState, useEffect } from "react";
import axios from "axios";
import { CForm, CFormCheck, CButton } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavbarEdit = ({ api, id, label }) => {
    const [displayMode, setDisplayMode] = useState("auto");

    useEffect(() => {
        const fetchNavbarSettings = async () => {
            try {
                const response = await axios.get(`${api}/admin/navbar_settings`);
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
            await axios.post(`${api}/admin/save_navbar_settings`, { displayMode }, { withCredentials: true });
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
