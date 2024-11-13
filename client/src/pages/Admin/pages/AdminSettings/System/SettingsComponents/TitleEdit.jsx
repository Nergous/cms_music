import React, {useState, useEffect} from "react";
import axios from "axios";
import {CButton, CAlert, CForm, CFormTextarea} from "@coreui/react";


const TitleEdit = ({api, id, label}) => {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [titleSuccess, setTitleSuccess] = useState("");

    useEffect(() => {
        const loadTitle = async () => {
            try {
                const response = await axios.get(`${api}/admin/get_title`);
                setTitle(response.data.title);
            } catch (error) {
                setTitleError("Ошибка при загрузке заголовка");
                setTimeout(() => setTitleError(""), 3000);
            }
        };

        loadTitle();
    }, [api]);

    const handleSave = async (event) => {
        event.preventDefault();

        if (!title) {
            setTitleError("Пожалуйста, введите заголовок");
            setTimeout(() => setTitleError(""), 3000);
            return;
        }

        try {
            await axios.post(
                `${api}/admin/save_title`,
                { title },
                { withCredentials: true }
            );
            setTitleSuccess("Заголовок успешно сохранен");
            setTitleError("");
            setTimeout(() => setTitleSuccess(""), 3000);
        } catch (error) {
            setTitleError(error.response.data.message);
            setTitleSuccess("");
            setTimeout(() => setTitleError(""), 3000);
        }
    };

    return (
        <div id={id} label={label} style={{ margin: "30px 0" }}>
            {titleError && (
                <CAlert color="danger" dismissible onClose={() => setTitleError("")}>
                    {titleError}
                </CAlert>
            )}
            {titleSuccess && (
                <CAlert color="success" dismissible onClose={() => setTitleSuccess("")}>
                    {titleSuccess}
                </CAlert>
            )}

            <h3>Редактирование заголовка сайта</h3>
            <CForm style={{ margin: "30px 0" }} onSubmit={handleSave}>
                <CFormTextarea
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginBottom: "30px" }}
                />
                <CButton color="primary" type="submit">
                    Сохранить
                </CButton>
            </CForm>
        </div>
    );
};

export default TitleEdit;