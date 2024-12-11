import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CButton, CForm, CFormInput, CImage } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CarouselEdit = ({ api, id, label }) => {
    const [files, setFiles] = useState(null);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await axios.get(`${api}/admin/images`);
                setImages(response.data);
            } catch (error) {
                toast.error("Ошибка при загрузке изображений: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        loadImages();
    }, [api]);

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
            toast.success("Файлы успешно загружены", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            const response = await axios.get(`${api}/admin/images`);
            setImages(response.data);
            fileInputRef.current.value = ""; // Очистка формы
        } catch (error) {
            toast.error("Произошла ошибка при загрузке файлов: " + error.response.data.error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleDeleteImage = async (filename) => {
        try {
            await axios.delete(`${api}/admin/images/${filename}`, {
                withCredentials: true,
            });
            toast.success("Файл успешно удален", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Обновляем список изображений
            const response = await axios.get(`${api}/admin/images`);
            setImages(response.data);
        } catch (error) {
            toast.error("Произошла ошибка при удалении файла: " + error.response.data.error, {
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
