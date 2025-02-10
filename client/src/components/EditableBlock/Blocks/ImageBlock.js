import React, { useState, useContext } from "react";
import BlockInterface from "../BlockInterface";
import axios from "axios";
import { CRow, CCol, CButton, CAlert, CForm, CFormInput, CFormSelect } from "@coreui/react";
import ImageUploader from "react-images-upload"; // Библиотека для загрузки изображений
import ApiContext from "../../../ApiContext";

class ImageBlock extends BlockInterface {
    render({ edit: editBlock, delete: deleteBlock }) {
        return <ImageBlockComponent id={this.id} content={this.content} onEdit={editBlock} onDelete={deleteBlock} />;
    }
}

const ImageBlockComponent = ({ id, content, onEdit, onDelete }) => {
    const api = useContext(ApiContext);

    // Состояния для управления компонентом
    const [imagePath, setImagePath] = useState(content.image || null); // Путь к изображению
    const [width, setWidth] = useState(content.width || 100); // Ширина изображения в процентах
    const [height, setHeight] = useState(content.height || 100); // Высота изображения в процентах
    const [altText, setAltText] = useState(content.alt || ""); // Альтернативный текст
    const [textAlign, setTextAlign] = useState(content.align || "center"); // Центрирование изображения
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Загрузка изображения
    const handleImageUpload = async (files) => {
        if (files.length > 0) {
            const formData = new FormData();
            formData.append("file", files[0]);

            try {
                const response = await axios.post(`${api}/admin/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                setImagePath(response.data.path); // Получаем путь к файлу от сервера
                setError("");
            } catch (err) {
                setError("Ошибка при загрузке изображения.");
                console.error(err);
            }
        }
    };

    // Сохранение блока
    const handleSave = () => {
        if (!imagePath) {
            setError("Пожалуйста, выберите изображение.");
            return;
        }
        
        onEdit(id, { image: imagePath, width, height, alt: altText, align: textAlign }); // Сохраняем выравнивание
        setError("");
        setSuccess("Изображение успешно сохранено");
        setTimeout(() => setSuccess(""), 3000);
    };


    // Удаление блока
    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <CRow>
            <CCol>
                <div className="border p-3">
                    {error && <CAlert color="danger">{error}</CAlert>}
                    {success && <CAlert color="success">{success}</CAlert>}

                    {/* Загрузка изображения */}
                    <div>
                        <label style={{ display: "block", marginBottom: "8px" }}>Загрузить изображение</label>
                        <ImageUploader
                            withIcon={true}
                            withPreview={true}
                            singleImage={true}
                            buttonText="Выбрать изображение"
                            onChange={handleImageUpload}
                            imgExtension={[".jpg", ".jpeg", ".png", ".gif"]}
                            maxFileSize={5242880} // 5MB
                        />
                    </div>

                    {imagePath && (
                        <div>
                            {/* Настройка ширины */}
                            <label style={{ display: "block", marginBottom: "8px" }}>Ширина (%)</label>
                            <CFormInput
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                min={1}
                                max={100}
                                style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
                            />

                            {/* Настройка высоты */}
                            <label style={{ display: "block", marginBottom: "8px" }}>Высота (%)</label>
                            <CFormInput
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                min={1}
                                max={100}
                                style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
                            />

                            {/* Альтернативный текст */}
                            <label style={{ display: "block", marginBottom: "8px" }}>Альтернативный текст</label>
                            <CFormInput
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
                            />

                            {/* Выбор центрирования */}
                            <label style={{ display: "block", marginBottom: "8px" }}>Центрирование</label>
                            <CFormSelect
                                value={textAlign}
                                onChange={(e) => setTextAlign(e.target.value)}
                                style={{ width: "100%", padding: "8px", marginBottom: "16px" }}>
                                <option value="left">Слева</option>
                                <option value="center">По центру</option>
                                <option value="right">Справа</option>
                            </CFormSelect>

                            {/* Предпросмотр изображения */}
                            <div
                                style={{
                                    textAlign: textAlign, // Применяем выбранное выравнивание
                                    marginTop: "16px",
                                }}>
                                <img
                                    src={imagePath}
                                    alt={altText}
                                    style={{
                                        width: `${width}%`,
                                        height: `${height}%`,
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Кнопки управления */}
                    <div className="mt-3">
                        <CButton color="primary" onClick={handleSave} disabled={!imagePath}>
                            Сохранить
                        </CButton>
                        <CButton color="secondary" onClick={handleDelete} className="ml-2">
                            Удалить
                        </CButton>
                    </div>
                </div>
            </CCol>
        </CRow>
    );
};

export default ImageBlock;
