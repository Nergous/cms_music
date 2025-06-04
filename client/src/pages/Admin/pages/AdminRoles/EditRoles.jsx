import React, { useState, useEffect, useContext } from "react";
import { CForm, CCol, CFormInput, CButton } from "@coreui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

function EditRole() {
    const api = useContext(ApiContext);
    const [roleName, setRoleName] = useState("");
    const [validated, setValidated] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${api}/music_roles/${id}`);
                setRoleName(response.data.role_name);
            } catch (error) {
                toast.error("Произошла ошибка при получении роли: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };
        fetchData();
    }, [id, api]);

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
                await axios.put(`${api}/music_roles/${id}`, data, { withCredentials: true });
                toast.success("Роль успешно обновлена!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                toast.error("Произошла ошибка при обновлении роли: " + error.response.data.error, {
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
            <div className="body flex-grow-1 p-3">
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

export default EditRole;
