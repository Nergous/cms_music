import React, { useState, useRef } from "react";
import axios from "axios";

import { CButton, CAlert, CForm, CFormInput, CImage } from "@coreui/react";

const LogoEdit = ({api}) => {
    const [logo, setLogo] = useState(null);
    const [logoError, setLogoError] = useState("");
    const [logoSuccess, setLogoSuccess] = useState("");

    const [currentLogo, setCurrentLogo] = useState("/uploads/logo/logo.png");

    const logoInputRef = useRef(null);

    const handleLogoChange = (event) => {
        setLogo(event.target.files[0]);
    };

    const handleUploadLogo = async () => {
        const formData = new FormData();
        formData.append("logo", logo);
        try {
            await axios.post(`${api}/admin/upload_logo`, formData, {
                withCredentials: true,
            });
            setLogoSuccess("Логотип успешно загружен");
            setLogoError("");
            setCurrentLogo("/uploads/logo/logo.png");
            logoInputRef.current.value = ""; // Очистка формы
            window.location.reload();
        } catch (error) {
            setLogoError(error.response.data);
            setLogoSuccess("");
        }
    };

    return (
        <div style={{ margin: "30px 0" }}>
            {logoError && (
                <CAlert color="danger" dismissible onClose={() => setLogoError("")}>
                    {logoError}
                </CAlert>
            )}
            {logoSuccess && (
                <CAlert color="success" dismissible onClose={() => setLogoSuccess("")}>
                    {logoSuccess}
                </CAlert>
            )}
            <h3>Загрузить логотип</h3>
            <CForm style={{ margin: "30px 0" }}>
                <CFormInput type="file" onChange={handleLogoChange} ref={logoInputRef} />
            </CForm>
            <CButton color="primary" onClick={handleUploadLogo} disabled={!logo}>
                Загрузить логотип
            </CButton>
            <CImage src={currentLogo} alt="Логотип" style={{ maxWidth: "200px" }} />
        </div>
    );
};

export default LogoEdit;
