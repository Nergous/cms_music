import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { CButton, CAlert, CForm, CFormInput } from "@coreui/react";

const CredentialsEdit = ({api}) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const [credentialsSuccess, setCredentialsSuccess] = useState("");

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
            setCredentialsSuccess("Логин и пароль успешно обновлены");
            setCredentialsError("");
        } catch (error) {
            setCredentialsError(error.response.data);
            setCredentialsSuccess("");
        }
    };

    return (
        <div style={{ margin: "30px 0" }}>
            {credentialsError && (
                <CAlert color="danger" dismissible onClose={() => setCredentialsError("")}>
                    {credentialsError}
                </CAlert>
            )}
            {credentialsSuccess && (
                <CAlert color="success" dismissible onClose={() => setCredentialsSuccess("")}>
                    {credentialsSuccess}
                </CAlert>
            )}
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