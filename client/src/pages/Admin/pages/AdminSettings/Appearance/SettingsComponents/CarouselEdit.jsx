import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { CButton, CAlert, CForm, CFormInput, CImage } from "@coreui/react";

const CarouselEdit = ({api}) => {
    const [files, setFiles] = useState(null);
    const [images, setImages] = useState([]);
    const [filesError, setFilesError] = useState("");
    const [filesSuccess, setFilesSuccess] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await axios.get(`${api}/admin/images`);
                setImages(response.data);
            } catch (error) {
                setFilesError("Ошибка при загрузке изображений");
            }
        };

        loadImages();
    }, []);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        try {
            await axios.post(`${api}/admin/upload_files`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            setFilesSuccess("Файлы успешно загружены");
            setFilesError("");
            const response = await axios.get(`${api}/admin/images`);
            setImages(response.data);
            fileInputRef.current.value = ""; // Очистка формы
        } catch (error) {
            setFilesError(error.response.data);
            setFilesSuccess("");
        }
    };

    const handleDeleteImage = async (filename) => {
        try {
            await axios.delete(`${api}/admin/images/${filename}`, {
                withCredentials: true,
            });
            setFilesSuccess("Файл успешно удален");
            setFilesError("");
            // Обновляем список изображений
            const response = await axios.get(`${api}/admin/images`);
            setImages(response.data);
        } catch (error) {
            setFilesError(error.response.data.message);
            setFilesSuccess("");
        }
    };

    return (
        <div style={{ margin: "30px 0" }}>
            {filesError && (
                <CAlert color="danger" dismissible onClose={() => setFilesError("")}>
                    {filesError}
                </CAlert>
            )}
            {filesSuccess && (
                <CAlert color="success" dismissible onClose={() => setFilesSuccess("")}>
                    {filesSuccess}
                </CAlert>
            )}
            <h3>Фото карусель</h3>
            <CForm style={{ margin: "30px 0" }}>
                <CFormInput type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
            </CForm>
            <CButton color="primary" onClick={handleUpload} disabled={!files}>
                Загрузить файлы
            </CButton>
            <div style={{ margin: "30px 0" }}>
                {images.length > 0 &&
                    images.map((image, index) => (
                        <div
                            key={index}
                            style={{
                                position: "relative",
                                display: "inline-block",
                                margin: "10px",
                            }}>
                            <CImage src={`/uploads/carousel/${image}`} alt={image} style={{ maxWidth: "200px" }} />
                            <CButton
                                color="danger"
                                size="sm"
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                }}
                                onClick={() => handleDeleteImage(image)}>
                                Удалить
                            </CButton>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CarouselEdit;
