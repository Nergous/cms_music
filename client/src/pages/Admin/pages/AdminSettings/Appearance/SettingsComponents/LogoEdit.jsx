import React, { useState, useRef } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput, CImage } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoEdit = ({ api, id, label }) => {
    const [logo, setLogo] = useState(null);
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
            toast.success("Логотип успешно загружен", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setCurrentLogo("/uploads/logo/logo.png");
            logoInputRef.current.value = ""; // Очистка формы
            window.location.reload();
        } catch (error) {
            toast.error("Произошла ошибка при загрузке логотипа: " + error.response.data.error, {
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
            <h3>Изменить логотип</h3>
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
