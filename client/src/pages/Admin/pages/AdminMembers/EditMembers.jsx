import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CForm, CCol, CFormInput, CButton, CFormSelect, CListGroup, CListGroupItem, CFormCheck, CFormLabel } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

function EditMembers() {
    const api = useContext(ApiContext);
    const { id } = useParams();
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [description, setDescription] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [validated, setValidated] = useState(false);
    const [isNotMember, setIsNotMember] = useState(false);
    const navigate = useNavigate();

    const fetchRoles = async (music_roles) => {
        try {
            const response = await axios.get(`${api}/music_roles`);
            const data = response.data;
            const availableRoles = data.filter((role) => !music_roles.some((r) => r.id === role.id));
            setRoles(availableRoles);
        } catch (error) {
            toast.error("Ошибка при загрузке ролей: " + error.response.data.error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await axios.get(`${api}/members/${id}`);
                const member = response.data;
                setName(member.name_of_member);
                setNickname(member.nickname);
                setDescription(member.description);
                setDateStart(member.date_start);
                setDateEnd(member.date_end || "");
                setImg(member.path_to_photo);
                setImgPreview(member.path_to_photo); // Устанавливаем URL-адрес изображения для предпросмотра
                setIsNotMember(!member.is_member);
                setSelectedRoles(member.music_roles);
                await fetchRoles(member.music_roles);
            } catch (error) {
                toast.error("Ошибка при загрузке участника: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        fetchMember();
    }, [id, api]);

    const handleAddRole = () => {
        const roleToAdd = roles.find((role) => role.id == selectedRole);
        setSelectedRoles([...selectedRoles, roleToAdd]);
        setRoles(roles.filter((role) => role.id !== roleToAdd.id));
        setSelectedRole("");
    };

    const handleRemoveRole = (roleToRemove) => {
        setSelectedRoles(selectedRoles.filter((role) => role.id !== roleToRemove.id));
        setRoles([...roles, roleToRemove]);
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        setImg(file);

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImgPreview(null);
            toast.error("Пожалуйста, выберите файл изображения.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        if (isNotMember) {
            const data = {
                name_of_member: name,
                description: description,
                is_member: 0,
            };

            try {
                await axios.put(`${api}/members/${id}`, data, {
                    withCredentials: true,
                });
                toast.success("Участник успешно обновлен!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => navigate("/admin/members"), 3000);
            } catch (error) {
                toast.error("Произошла ошибка при обновлении участника: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } else {
            if (form.checkValidity() !== false) {
                const formData = new FormData();
                formData.append("name_of_member", name);
                formData.append("nickname", nickname);
                formData.append("description", description);
                formData.append("date_start", dateStart);
                formData.append("date_end", dateEnd);
                formData.append("img", img);
                formData.append("is_member", 1);

                selectedRoles.forEach((role) => {
                    formData.append("roles[]", role.id);
                });

                try {
                    await axios.put(`${api}/members/${id}`, formData, { withCredentials: true });
                    toast.success("Участник успешно обновлен!", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    setTimeout(() => navigate("/admin/members"), 3000);
                } catch (error) {
                    toast.error("Произошла ошибка при обновлении участника: " + error.response.data.error, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
        }
    };

    return (
        <>
            <div className="body flex-grow-1" style={{ margin: "30px" }}>
                <CButton onClick={() => navigate("/admin/members")} color="primary">
                    Назад
                </CButton>
                <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                    <CCol md={8}>
                        <CFormInput
                            type="text"
                            feedbackValid="Всё в порядке!"
                            id="name_of_member"
                            label="Имя"
                            placeholder="Имя"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CFormCheck
                            type="checkbox"
                            id="isNotMember"
                            label="Не является участником"
                            checked={isNotMember}
                            onChange={(e) => setIsNotMember(e.target.checked)}
                        />
                    </CCol>
                    {isNotMember && (
                        <CCol md={8}>
                            <CFormInput
                                type="text"
                                placeholder="Ссылка на человека (группу)"
                                feedbackValid="Всё в порядке!"
                                id="description"
                                label="Ссылка на человека (группу)"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </CCol>
                    )}

                    {!isNotMember && (
                        <CCol md={8}>
                            <CFormInput
                                type="text"
                                placeholder="Описание"
                                feedbackValid="Всё в порядке!"
                                id="description"
                                label="Описание"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </CCol>
                    )}

                    {!isNotMember && (
                        <>
                            <CCol md={8}>
                                <CFormInput
                                    type="text"
                                    placeholder="Прозвище"
                                    feedbackValid="Всё в порядке!"
                                    id="nickname"
                                    label="Сценическое прозвище (необязательно)"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </CCol>
                            <CCol md={8}>
                                <CFormInput
                                    type="date"
                                    placeholder="01.01.2001"
                                    feedbackValid="Всё в порядке!"
                                    id="date_start"
                                    label="Дата вступления"
                                    required
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                />
                            </CCol>
                            <CCol md={8}>
                                <CFormInput
                                    type="date"
                                    placeholder="01.01.2001"
                                    feedbackValid="Всё в порядке!"
                                    id="date_end"
                                    label="Дата окончания (необязательно)"
                                    value={dateEnd}
                                    onChange={(e) => setDateEnd(e.target.value)}
                                />
                            </CCol>
                            {roles.length > 0 && (
                                <>
                                    <CCol md={8}>
                                        <CFormSelect id="role" label="Роль" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                            <option value="">Выберите роль</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.role_name}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={8}>
                                        <CButton color="primary" onClick={handleAddRole} disabled={!selectedRole}>
                                            Добавить роль
                                        </CButton>
                                    </CCol>
                                </>
                            )}
                            {selectedRoles.length > 0 && (
                                <CCol md={8}>
                                    <CListGroup>
                                        {selectedRoles.map((role) => {
                                            return (
                                                <CListGroupItem key={role.id}>
                                                    {role.role_name}
                                                    <CButton color="danger" size="sm" className="float-end" onClick={() => handleRemoveRole(role)}>
                                                        Удалить
                                                    </CButton>
                                                </CListGroupItem>
                                            );
                                        })}
                                    </CListGroup>
                                </CCol>
                            )}
                            <CCol md={8}>
                                <CFormLabel htmlFor="path_to_photo">Фото</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="path_to_photo"
                                    feedbackInvalid="Неверный формат файла"
                                    aria-label="file example"
                                    onChange={handleImgChange}
                                />
                            </CCol>
                            {imgPreview && (
                                <CCol md={8}>
                                    <p>Предварительный просмотр фото:</p>
                                    <img src={imgPreview.replace("..", "")} alt="Preview" style={{ maxHeight: "400px" }} />
                                </CCol>
                            )}
                        </>
                    )}
                    {(selectedRoles.length > 0 || isNotMember === true) && (
                        <CCol xs={8}>
                            <CButton color="primary" type="submit">
                                Обновить
                            </CButton>
                        </CCol>
                    )}
                    {roles.length === 0 && selectedRoles.length === 0 && (
                        <CCol xs={8}>
                            <p className="text-danger">Нет доступных ролей</p>
                        </CCol>
                    )}
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

export default EditMembers;
