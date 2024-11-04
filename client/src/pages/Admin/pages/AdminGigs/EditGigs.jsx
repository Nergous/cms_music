import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CForm, CCol, CFormInput, CButton, CFormSelect, CListGroup, CListGroupItem, CFormLabel, CAlert } from "@coreui/react";
import { AppSidebar, AppHeader, AppFooter } from "../../components";
import ApiContext from "../../../../ApiContext";

const EditGigs = () => {
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
    const [currentPoster, setCurrentPoster] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { id } = useParams();

    const getMembers = async (currentParticipants) => {
        try {
            const response = await axios.get(`${api}/members`);
            const data = response.data;
            const filteredParticipants = data.filter((member) => !currentParticipants.some((p) => p.id == member.id));

            setAvailableParticipants(filteredParticipants);
        } catch (error) {
            setError("Ошибка при загрузке участников");
        }
    };

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const response = await axios.get(`${api}/gigs/${id}`);
                const gig = response.data;
                setTitle(gig.title);
                setSocialLink(gig.link_to_social);
                setVenue(gig.place);
                setDate(gig.date_of_gig);
                setStatus(gig.gig_status);
                setPoster(gig.path_to_poster);
                setParticipants(gig.members);
                setCurrentPoster(gig.path_to_poster);
                await getMembers(gig.members);
            } catch (error) {
                setError("Ошибка при загрузке выступления");
            }
        };

        fetchGig();
    }, [id]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

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
                .put(`${api}/gigs/` + id, formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    alert("Выступление успешно обновлено");
                    navigate("/admin/gigs");
                })
                .catch((error) => {
                    alert(error.response.data.error);
                });
        }
    };

    return (
        <>
            <div className="body flex-grow-1" style={{ margin: "30px" }}>
                {error && <CAlert color="danger">{error}</CAlert>}
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
                            value={title}
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
                            value={socialLink}
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
                            value={venue}
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
                            value={date}
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
                            label="Добавить участника выступления">
                            <option value="">Выбрать участника</option>
                            {availableParticipants.map((participant) => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.name_of_member}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={8}>
                        <CButton color="primary" onClick={handleAddParticipant} disabled={!availableParticipants.length}>
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
                        <CFormInput type="file" feedbackValid="Всё хорошо!" id="poster" onChange={(e) => setPoster(e.target.files[0])} />
                    </CCol>

                    <CCol xs={8}>
                        <CButton color="primary" type="submit">
                            Обновить
                        </CButton>
                    </CCol>
                </CForm>
                {poster && (
                    <>
                        <h3 style={{ marginTop: "20px" }}>Текущая афиша:</h3>
                        <div style={{ marginTop: "20px" }}>
                            <img src={currentPoster.replace("..", "")} alt="Афиша" style={{ maxWidth: "300px", height: "auto" }} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default EditGigs;
