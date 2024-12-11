import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CForm, CCol, CFormInput, CButton } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
                await axios.post(`${api}/music_roles`, data, { withCredentials: true });
                toast.success("Роль успешно создана!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => navigate("/admin/roles"), 3000);
                
            } catch (error) {
                toast.error("Произошла ошибка при добавлении роли: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };

    return (
        <>
            <div className="body flex-grow-1 m-3">
                <CButton onClick={() => navigate("/admin/roles")} className="btn btn-primary mb-3">
                    Назад
                </CButton>
                <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
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

            {/* Всплывающее окно для уведомлений */}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default CreateRole;
