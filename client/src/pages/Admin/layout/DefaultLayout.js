import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AppSidebar, AppFooter, AppHeader } from "../components/index";
import { useNavigate } from "react-router-dom";

import { CForm, CFormInput, CButton, CImage, CAlert } from "@coreui/react";

const DefaultLayout = () => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState(null);
    const [logo, setLogo] = useState(null);
    const [currentLogo, setCurrentLogo] = useState("/uploads/logo/logo.png");
    const [images, setImages] = useState([]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [textError, setTextError] = useState("");
    const [textSuccess, setTextSuccess] = useState("");
    const [filesError, setFilesError] = useState("");
    const [filesSuccess, setFilesSuccess] = useState("");
    const [logoError, setLogoError] = useState("");
    const [logoSuccess, setLogoSuccess] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const [credentialsSuccess, setCredentialsSuccess] = useState("");
    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadText = async () => {
            try {
                const response = await axios.get(
                    "/api/admin/load"
                );
                setText(response.data.trimRight());
            } catch (error) {
                setTextError("Ошибка при загрузке текста");
            }
        };
        const loadImages = async () => {
            try {
                const response = await axios.get(
                    "/api/admin/images"
                );
                setImages(response.data);
            } catch (error) {
                setFilesError("Ошибка при загрузке изображений");
            }
        };

        loadText();
        loadImages();
    }, []);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleSave = async (event) => {
        try {
            await axios.post(
                "/api/admin/save",
                {
                    text,
                },
                { withCredentials: true }
            );
            setTextSuccess("Текст успешно сохранен");
            setTextError("");
        } catch (error) {
            setTextError(error.response.data.message);
            setTextSuccess("");
        }
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleLogoChange = (event) => {
        setLogo(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        try {
            await axios.post(
                "/api/admin/upload_files",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                },
            );
            setFilesSuccess("Файлы успешно загружены");
            setFilesError("");
            const response = await axios.get(
                "/api/admin/images"
            );
            setImages(response.data);
            fileInputRef.current.value = ""; // Очистка формы
        } catch (error) {
            setFilesError(error.response.data);
            setFilesSuccess("");
        }
    };

    const handleUploadLogo = async () => {
        const formData = new FormData();
        formData.append("logo", logo);
        try {
            await axios.post(
                "/api/admin/upload_logo",
                formData,
                {
                    withCredentials: true,
                }
            );
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

    const handleDeleteImage = async (filename) => {
        try {
            await axios.delete(
                `/api/admin/images/${filename}`,
                { withCredentials: true }
            );
            setFilesSuccess("Файл успешно удален");
            setFilesError("");
            // Обновляем список изображений
            const response = await axios.get(
                "/api/admin/images"
            );
            setImages(response.data);
        } catch (error) {
            setFilesError(error.response.data.message);
            setFilesSuccess("");
        }
    };

    const handleUpdateCredentials = async () => {
        try {
            await axios.post("/api/admin/update_credentials", {
                login,
                password,
            }, { withCredentials: true });
            setCredentialsSuccess("Логин и пароль успешно обновлены");
            setCredentialsError("");
            navigate("/admin");
        } catch (error) {
            console.log(error);
            setCredentialsError(error.response.data);
            setCredentialsSuccess("");
        }
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1" style={{ margin: "30px" }}>
                    {textError && (
                        <CAlert
                            color="danger"
                            dismissible
                            onClose={() => setTextError("")}
                        >
                            {textError}
                        </CAlert>
                    )}
                    {textSuccess && (
                        <CAlert
                            color="success"
                            dismissible
                            onClose={() => setTextSuccess("")}
                        >
                            {textSuccess}
                        </CAlert>
                    )}
                    <h3>Текст на главной странице</h3>
                    <CForm style={{ margin: "30px 0" }}>
                        <textarea
                            ref={textAreaRef}
                            id="exampleFormControlTextarea1"
                            style={{
                                resize: "none",
                                overflow: "hidden",
                                width: "100%",
                            }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CForm>
                    <CButton color="primary" onClick={handleSave}>
                        Сохранить
                    </CButton>
                    <div style={{ margin: "30px 0" }}>
                        {filesError && (
                            <CAlert
                                color="danger"
                                dismissible
                                onClose={() => setFilesError("")}
                            >
                                {filesError}
                            </CAlert>
                        )}
                        {filesSuccess && (
                            <CAlert
                                color="success"
                                dismissible
                                onClose={() => setFilesSuccess("")}
                            >
                                {filesSuccess}
                            </CAlert>
                        )}
                        <h3>Фото карусель</h3>
                        <CForm style={{ margin: "30px 0" }}>
                            <CFormInput
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </CForm>
                        <CButton
                            color="primary"
                            onClick={handleUpload}
                            disabled={!files}
                        >
                            Загрузить файлы
                        </CButton>
                        <div style={{ margin: "30px 0" }}>
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        margin: "10px",
                                    }}
                                >
                                    <CImage
                                        src={`/uploads/carousel/${image}`}
                                        alt={image}
                                        style={{ maxWidth: "200px" }}
                                    />
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        style={{
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                        }}
                                        onClick={() => handleDeleteImage(image)}
                                    >
                                        Удалить
                                    </CButton>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        {credentialsError && (
                            <CAlert
                                color="danger"
                                dismissible
                                onClose={() => setCredentialsError("")}
                            >
                                {credentialsError}
                            </CAlert>
                        )}
                        {credentialsSuccess && (
                            <CAlert
                                color="success"
                                dismissible
                                onClose={() => setCredentialsSuccess("")}
                            >
                                {credentialsSuccess}
                            </CAlert>
                        )}
                        <h3>Изменить логин и пароль</h3>
                        <CForm style={{ margin: "30px 0" }}>
                            <CFormInput
                                type="text"
                                placeholder="Новый логин"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                            <CFormInput
                                type="password"
                                autoComplete="off"
                                placeholder="Новый пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </CForm>
                        <CButton
                            color="primary"
                            onClick={handleUpdateCredentials}
                            disabled={!login || !password}
                        >
                            Обновить логин и пароль
                        </CButton>
                    </div>
                    <div style={{ margin: "30px 0" }}>
                        {logoError && (
                            <CAlert
                                color="danger"
                                dismissible
                                onClose={() => setLogoError("")}
                            >
                                {logoError}
                            </CAlert>
                        )}
                        {logoSuccess && (
                            <CAlert
                                color="success"
                                dismissible
                                onClose={() => setLogoSuccess("")}
                            >
                                {logoSuccess}
                            </CAlert>
                        )}
                        <h3>Загрузить логотип</h3>
                        <CForm style={{ margin: "30px 0" }}>
                            <CFormInput
                                type="file"
                                onChange={handleLogoChange}
                                ref={logoInputRef}
                            />
                        </CForm>
                        <CButton
                            color="primary"
                            onClick={handleUploadLogo}
                            disabled={!logo}
                        >
                            Загрузить логотип
                        </CButton>
                        <CImage
                            src={currentLogo}
                            alt="Логотип"
                            style={{ maxWidth: "200px" }}
                        />
                    </div>
                </div>
                <AppFooter />
            </div>
        </div>
    );
};

export default DefaultLayout;
