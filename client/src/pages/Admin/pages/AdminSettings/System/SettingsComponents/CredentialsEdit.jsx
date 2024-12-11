import React, { useState } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CredentialsEdit = ({ api, id, label }) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleUpdateCredentials = async () => {
        try {
            await axios.post(
                `${api}/admin/update_credentials`,
                {
                    login,
                    password,
                },
                { withCredentials: true }
            );
            toast.success("Логин и пароль успешно обновлены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Произошла ошибка при обновлении данных: " + error.response.data.error, {
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
            <h3>Изменить логин и пароль</h3>
            <CForm style={{ margin: "30px 0" }}>
                <CFormInput type="text" placeholder="Новый логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                <CFormInput
                    type="password"
                    autoComplete="off"
                    placeholder="Новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </CForm>
            <CButton color="primary" onClick={handleUpdateCredentials} disabled={!login || !password}>
                Обновить логин и пароль
            </CButton>
        </div>
    );
};

export default CredentialsEdit;
