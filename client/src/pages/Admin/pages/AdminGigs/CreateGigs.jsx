import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CForm, CCol, CFormInput, CButton, CFormSelect, CListGroup, CListGroupItem, CFormLabel } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

const CreateGigs = () => {
    const api = useContext(ApiContext);
    const [validated, setValidated] = useState(false);
    const [title, setTitle] = useState("");
    const [socialLink, setSocialLink] = useState("");
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("soon");
    const [participants, setParticipants] = useState([]);
    const [selectedParticipantId, setSelectedParticipantId] = useState("");
    const [availableParticipants, setAvailableParticipants] = useState([]);
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const navigate = useNavigate();

    const getMembers = () => {
        axios
            .get(`${api}/members`)
            .then((response) => {
                setAvailableParticipants(response.data);
            })
            .catch((error) => {
                toast.error("Ошибка при загрузке участников: " + error.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
    };

    useEffect(() => {
        getMembers();
    }, []);

    const handleAddParticipant = () => {
        const selectedParticipant = availableParticipants.find((p) => p.id == selectedParticipantId);
        if (selectedParticipant) {
            setParticipants([...participants, selectedParticipant]);
            setAvailableParticipants(availableParticipants.filter((p) => p.id != selectedParticipantId));
            setSelectedParticipantId("");
        }
    };

    const handleRemoveParticipant = (participantId) => {
        const removedParticipant = participants.find((p) => p.id == participantId);
        if (removedParticipant) {
            setParticipants(participants.filter((p) => p.id != participantId));
            setAvailableParticipants([...availableParticipants, removedParticipant]);
        }
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        setPoster(file);

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPosterPreview(null);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(false);

        if (form.checkValidity() !== false) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("social_link", socialLink);
            formData.append("venue", venue);
            formData.append("date", date);
            formData.append("status", status);
            participants.forEach((participant, index) => {
                formData.append(`participants[${index}][id]`, participant.id);
            });
            formData.append("poster", poster);

            axios
                .post(`${api}/gigs`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    toast.success("Выступление успешно добавлено!", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                })
                .catch((error) => {
                    toast.error("Произошла ошибка при добавлении выступления: " + error.response.data.error, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                });
        }
    };

    return (
        <>
            <div className="body flex-grow-1" style={{ margin: "30px" }}>
                <CButton onClick={() => navigate("/admin/gigs")} className="mb-3" color="primary">
                    Назад
                </CButton>
                <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
                    <CCol md={8}>
                        <CFormInput
                            type="text"
                            feedbackValid="Всё хорошо!"
                            id="title"
                            label="Название выступления"
                            placeholder="Название выступления"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CFormInput
                            type="url"
                            feedbackValid="Всё хорошо!"
                            id="socialLink"
                            label="Ссылка на соц сети"
                            placeholder="Ссылка на соц сети"
                            required
                            onChange={(e) => setSocialLink(e.target.value)}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CFormInput
                            type="text"
                            feedbackValid="Всё хорошо!"
                            id="venue"
                            label="Место проведения"
                            placeholder="Место проведения"
                            required
                            onChange={(e) => setVenue(e.target.value)}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CFormInput
                            type="date"
                            feedbackValid="Всё хорошо!"
                            id="date"
                            label="Дата проведения"
                            placeholder="01.01.2001"
                            required
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </CCol>
                    <CCol md={8}>
                        <CFormSelect
                            feedbackValid="Всё хорошо!"
                            id="status"
                            label="Статус"
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}>
                            <option value="soon">Скоро</option>
                            <option value="completed">Завершен</option>
                            <option value="canceled">Отменен</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={8}>
                        <CFormSelect
                            value={selectedParticipantId}
                            onChange={(e) => setSelectedParticipantId(e.target.value)}
                            label="Добавить участника выступления (необязательно)">
                            <option value="">Выбрать участника</option>
                            {availableParticipants.map((participant) => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.name_of_member}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={8}>
                        <CButton color="primary" onClick={handleAddParticipant} disabled={!selectedParticipantId}>
                            Добавить участника
                        </CButton>
                    </CCol>
                    <CCol md={8}>
                        <CListGroup>
                            {participants.map((participant) => (
                                <CListGroupItem key={participant.id}>
                                    {participant.name_of_member}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="float-end"
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => handleRemoveParticipant(participant.id)}>
                                        Удалить
                                    </CButton>
                                </CListGroupItem>
                            ))}
                        </CListGroup>
                    </CCol>
                    <CCol md={8}>
                        <CFormLabel htmlFor="poster">Афиша</CFormLabel>
                        <CFormInput id="poster" required type="file" onChange={handlePosterChange} />
                    </CCol>
                    {posterPreview && (
                        <CCol md={8}>
                            <h3>Предварительный просмотр афиши:</h3>
                            <img src={posterPreview} alt="Афиша" style={{ maxWidth: "400px", height: "auto" }} />
                        </CCol>
                    )}
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
};

export default CreateGigs;
