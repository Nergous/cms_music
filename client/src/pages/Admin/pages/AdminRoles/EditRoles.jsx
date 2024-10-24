import React, { useState, useEffect } from "react";
import { CForm, CCol, CFormInput, CLink, CButton } from "@coreui/react";
import axios from "axios";
import { AppSidebar, AppHeader, AppFooter } from "../../components";
import { useNavigate, useParams } from "react-router-dom";

function EditRole() {
    const [roleName, setRoleName] = useState("");
    const [validated, setValidated] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `/api/music_roles/${id}`
                );
                setRoleName(response.data.role_name);
                console.log(response.data.role_name);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

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
                const response = await axios.put(
                    `/api/music_roles/${id}`,
                    data, { withCredentials: true }
                );
                navigate("/admin/roles");
                alert("Роль успешно обновлена");
            } catch (error) {
                alert("Произошла ошибка при обновлении роли");
            }
        }
    };

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1 p-3" >
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
                                value={roleName}
                                placeholder="Название роли"
                                required
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </CCol>
                        <CCol xs={8}>
                            <CButton color="primary" type="submit">
                                Обновить
                            </CButton>
                        </CCol>
                    </CForm>
                </div>
                <AppFooter />
            </div>
        </>
    );
}

export default EditRole;
