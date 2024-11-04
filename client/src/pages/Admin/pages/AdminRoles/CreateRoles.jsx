import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CForm, CCol, CFormInput, CButton, CLink } from "@coreui/react";
import { AppSidebar, AppHeader, AppFooter } from "../../components";
import ApiContext from "../../../../ApiContext";

function CreateRole() {
    const api = useContext(ApiContext);
    const [roleName, setRoleName] = useState("");
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() !== false) {
            const data = {
                role_name: roleName,
            };
            try {
                const response = await axios.post(
                    `${api}/music_roles`,
                    data, { withCredentials: true }
                );
                alert("Роль успешно создана");
                navigate("/admin/roles");
            } catch (error) {
                alert("Произошла ошибка при добавлении роли");
            }
        }
    };

    return (
        <>
                <div className="body flex-grow-1 m-3">
                    <CButton
                        onClick={() => navigate("/admin/roles")} className="btn btn-primary mb-3">Назад</CButton>
                    <CForm
                        className="row g-3 needs-validation"
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <CCol md={8}>
                            <CFormInput
                                type="text"
                                feedbackValid="Всё хорошо!"
                                id="roleName"
                                label="Роль"
                                placeholder="Название роли"
                                required
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </CCol>
                        <CCol xs={8}>
                            <CButton color="primary" type="submit">
                                Сохранить
                            </CButton>
                        </CCol>
                    </CForm>
                </div>
        </>
    );
}

export default CreateRole;
