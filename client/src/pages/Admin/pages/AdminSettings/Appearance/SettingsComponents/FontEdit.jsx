import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CAlert, CForm, CFormSelect, CFormInput } from "@coreui/react";

const FontEdit = ({api, id, label}) => {
    const [font, setFont] = useState("");
    const [fonts, setFonts] = useState(["Arial", "Times New Roman", "Courier New", "Verdana"]);
    const [newFont, setNewFont] = useState("");
    const [isAddingNewFont, setIsAddingNewFont] = useState(false);
    const [fontError, setFontError] = useState("");
    const [fontSuccess, setFontSuccess] = useState("");

    useEffect(() => {
        const loadFont = async () => {
            try {
                const response = await axios.get(`${api}/admin/font`);
                if (response.data.Font.available_fonts) {
                    setFonts(response.data.Font.available_fonts);
                }
                setFont(response.data.Font.selected_font);
            } catch (error) {
                setFontError(error.response.data);
            }
        };

        loadFont();
    }, [api]);

    const handleSave = async (event) => {
        try {
            await axios.post(
                `${api}/admin/save_font`,
                {
                    fonts: {
                        available_fonts: fonts,
                        selected_font: font,
                    },
                },
                { withCredentials: true }
            );
            setFontSuccess("Шрифт успешно сохранен");
            setFontError("");
            setTimeout(() => setFontSuccess(""), 3000); // Скрыть сообщение об успехе через 5 секунд
        } catch (error) {
            setFontError(error.response.data.message);
            setFontSuccess("");
            setTimeout(() => setFontError(""), 3000); // Скрыть сообщение об ошибке через 5 секунд
        }
    };

    const handleFontChange = (event) => {
        setFont(event.target.value);
    };

    const handleAddFont = () => {
        if (newFont && !fonts.includes(newFont)) {
            setFonts([...fonts, newFont]);
            setFont(newFont);
            setNewFont("");
            setIsAddingNewFont(false);
            handleSave();
        }
    };

    const handleAddNewFontClick = () => {
        setIsAddingNewFont(true);
    };

    const handleDeleteFont = async (fontToDelete) => {
        const updatedFonts = fonts.filter((font) => font !== fontToDelete);
        setFonts(updatedFonts);
        setFont(updatedFonts[0] || ""); // Выбираем первый шрифт из оставшихся или пустую строку

        try {
            await axios.delete(`${api}/admin/delete_font`, {
                data: { font: fontToDelete },
                withCredentials: true,
            });
            setFontSuccess("Шрифт успешно удален");
            setFontError("");
            setTimeout(() => setFontSuccess(""), 3000); // Скрыть сообщение об успехе через 5 секунд
        } catch (error) {
            setFontError(error.response.data.message);
            setFontSuccess("");
            setTimeout(() => setFontError(""), 3000); // Скрыть сообщение об ошибке через 5 секунд
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {fontError && (
                <CAlert color="danger" dismissible onClose={() => setFontError("")}>
                    {fontError}
                </CAlert>
            )}
            {fontSuccess && (
                <CAlert color="success" dismissible onClose={() => setFontSuccess("")}>
                    {fontSuccess}
                </CAlert>
            )}

            <h3>Изменение шрифта</h3>
            {isAddingNewFont ? (
                <CForm style={{ margin: "30px 0" }}>
                    <CFormInput type="text" value={newFont} onChange={(e) => setNewFont(e.target.value)} placeholder="Введите новый шрифт" />
                    <CButton color="primary" style={{ marginTop: "10px" }} onClick={handleAddFont}>
                        Сохранить
                    </CButton>
                </CForm>
            ) : (
                <>
                    <CForm style={{ margin: "30px 0" }}>
                        <CFormSelect value={font} onChange={handleFontChange} aria-label="Выберите шрифт">
                            <option value="">Выберите шрифт</option>
                            {fonts &&
                                fonts.map((font, index) => (
                                    <option key={index} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                        </CFormSelect>
                    </CForm>
                    <CButton color="primary" onClick={handleSave}>
                        Сохранить
                    </CButton>
                    <CButton color="secondary" style={{ marginLeft: "10px" }} onClick={handleAddNewFontClick}>
                        Добавить новый шрифт
                    </CButton>
                    <CButton color="danger" disabled={!font} style={{ marginLeft: "10px" }} onClick={() => handleDeleteFont(font)}>
                        Удалить шрифт
                    </CButton>
                </>
            )}
        </div>
    );
};

export default FontEdit;