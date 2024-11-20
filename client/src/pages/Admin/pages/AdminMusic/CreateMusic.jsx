import React, { useEffect, useState, useContext } from "react";
import {
    CForm,
    CFormInput,
    CCol,
    CButton,
    CFormSelect,
    CListGroupItem,
    CListGroup,
    CFormLabel,
    CAlert,
    CImage,
} from "@coreui/react";
import { AppSidebar, AppHeader, AppFooter } from "../../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiContext from "../../../../ApiContext";

const CreateMusic = () => {
    const api = useContext(ApiContext);
    const [recordName, setRecordName] = useState("");
    const [recordType, setRecordType] = useState("");
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [members, setMembers] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const [critError, setCritError] = useState(null);

    const navigate = useNavigate();

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${api}/members`);
            setMembers(response.data);
        } catch (error) {
            setCritError(error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleRecordNameChange = (e) => {
        setRecordName(e.target.value);
    };

    const handleTrackChange = (index, field, value) => {
        const newTracks = [...tracks];
        newTracks[index][field] = value;
        setTracks(newTracks);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            setCover(file);
            setCoverPreview(URL.createObjectURL(file));
            setError(null);
        } else {
            setError(
                "Неверный формат файла. Пожалуйста, выберите изображение в формате JPEG, JPG или PNG."
            );
        }
    };

    const handleReleaseYearChange = (e) => {
        setReleaseYear(e.target.value);
    };

    const addTrack = () => {
        if (recordType === "single" && tracks.length >= 1) return;

        setTracks([
            ...tracks,
            {
                name: "",
                file: null,
                author: "",
                participants: [],
                selectedParticipant: "",
                audioPreview: null,
            },
        ]);
    };

    const addParticipant = (index) => {
        const newTracks = [...tracks];
        const { selectedParticipant } = newTracks[index];
        if (
            selectedParticipant &&
            !newTracks[index].participants.includes(selectedParticipant)
        ) {
            newTracks[index].participants.push(selectedParticipant);
            newTracks[index].selectedParticipant = "";
            setTracks(newTracks);
        }
    };

    const removeParticipant = (trackIndex, participantIndex) => {
        const newTracks = [...tracks];
        newTracks[trackIndex].participants.splice(participantIndex, 1);
        setTracks(newTracks);
    };

    const handleParticipantChange = (trackIndex, value) => {
        const newTracks = [...tracks];
        newTracks[trackIndex].selectedParticipant = value;
        setTracks(newTracks);
    };

    const getAvailableMembers = (trackIndex) => {
        const selectedMembers = tracks[trackIndex].participants.filter(Boolean);
        return members.filter(
            (member) => !selectedMembers.includes(member.name_of_member)
        );
    };

    const isAddParticipantButtonDisabled = (trackIndex) => {
        return getAvailableMembers(trackIndex).length === 0;
    };

    const handleRecordTypeChange = (e) => {
        const newRecordType = e.target.value;
        setRecordType(newRecordType);

        if (newRecordType === "single") {
            setTracks([
                {
                    name: "",
                    file: null,
                    author: "",
                    participants: [],
                    selectedParticipant: "",
                    audioPreview: null,
                },
            ]);
        } else {
            setTracks([]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
        }

        setValidated(true);

        if (form.checkValidity() !== false) {
            // Prepare form data
            const formData = new FormData();
            formData.append("recordName", recordName);
            formData.append("recordType", recordType);
            formData.append("cover", cover);
            formData.append("releaseYear", releaseYear);
            // Convert tracks to include member IDs and author ID
            const tracksWithIds = tracks.map((track) => {
                return {
                    ...track,
                    participants: track.participants.map((participantName) => {
                        const member = members.find(
                            (member) =>
                                member.name_of_member === participantName
                        );
                        return member ? member.id : null;
                    }),
                    author:
                        members.find(
                            (member) => member.name_of_member === track.author
                        )?.id || null,
                    file: track.file,
                };
            });
            formData.append("tracks", JSON.stringify(tracksWithIds));

            tracksWithIds.forEach((track, index) => {
                if (track.file) {
                    if (
                        track.file.type === "audio/mpeg" ||
                        track.file.type === "audio/wav"
                    ) {
                        formData.append(`trackFiles`, track.file);
                    } else {
                        setError(
                            "Неверный формат файла. Пожалуйста, загрузите файл в формате MP3 или WAV."
                        );
                        return;
                    }
                }
            });

            try {
                const response = await axios.post(`${api}/record`, formData, {
                    withCredentials: true,
                });
                alert("Релиз успешно добавлен");
                navigate("/admin/music");
            } catch (error) {
                alert("Произошла ошибка при добавлении релиза");
            }
        }
    };

    return (
        <>
            <div
                className="body flex-grow-1"
                style={{ margin: "30px" }}>
                <CButton
                    onClick={() => navigate("/admin/music")}
                    color="primary"
                    style={{ marginBottom: "30px" }}>
                    Назад
                </CButton>
                {error ? <CAlert color="danger">{error}</CAlert> : null}
                {critError ? (
                    <CAlert color="danger">{critError}</CAlert>
                ) : (
                    <CForm
                        className="row g-3 needs-validation"
                        validated={validated}
                        onSubmit={handleSubmit}>
                        <CCol md={8}>
                            <CFormInput
                                type="text"
                                feedbackValid="Всё хорошо!"
                                id="record_name"
                                label="Название альбома"
                                placeholder="Альбом"
                                required
                                onChange={handleRecordNameChange}
                            />
                        </CCol>
                        <CCol md={8}>
                            <CFormSelect
                                feedbackValid="Всё хорошо!"
                                id="record_type"
                                label="Тип записи"
                                value={recordType}
                                onChange={handleRecordTypeChange}
                                required>
                                <option value="">Выберите тип записи</option>
                                <option value="EP">EP</option>
                                <option value="single">single</option>
                                <option value="album">album</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={8}>
                            <CFormInput
                                type="file"
                                feedbackInvalid="Invalid file type."
                                id="cover"
                                label="Обложка"
                                required
                                onChange={handleCoverChange}
                            />
                            {coverPreview && (
                                <CImage
                                    className="mt-3"
                                    src={coverPreview}
                                    alt="Cover Preview"
                                    style={{ maxWidth: "200px" }}
                                />
                            )}
                        </CCol>
                        <CCol md={8}>
                            <CFormInput
                                type="date"
                                placeholder="01.01.2001"
                                feedbackValid="Всё хорошо!"
                                id="release_year"
                                label="Год выпуска"
                                required
                                onChange={handleReleaseYearChange}
                            />
                        </CCol>
                        <CCol xs={8}>
                            {(recordType !== "single" ||
                                tracks.length === 0) && (
                                <CButton
                                    color="primary"
                                    type="button"
                                    onClick={addTrack}>
                                    Добавить трек
                                </CButton>
                            )}
                        </CCol>
                        {tracks.map((track, trackIndex) => (
                            <div
                                key={trackIndex}
                                className="row g-3">
                                <CCol md={8}>
                                    <CFormInput
                                        type="text"
                                        placeholder="Название трека"
                                        feedbackValid="Всё хорошо!"
                                        value={track.name}
                                        label={`Название трека ${
                                            trackIndex + 1
                                        }`}
                                        onChange={(e) =>
                                            handleTrackChange(
                                                trackIndex,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </CCol>
                                <CCol md={8}>
                                    <CFormInput
                                        type="file"
                                        feedbackInvalid="Invalid file type."
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // check mime types of file
                                            if (
                                                file &&
                                                file.type !== "audio/mpeg"
                                            ) {
                                                handleTrackChange(
                                                    trackIndex,
                                                    "file",
                                                    null
                                                );
                                                handleTrackChange(
                                                    trackIndex,
                                                    "audioPreview",
                                                    null
                                                );
                                                setError(
                                                    "Неверный формат файла. Пожалуйста, выберите аудиофайл в формате MP3."
                                                );
                                                return;
                                            }
                                            if (file) {
                                                setError(null);
                                                handleTrackChange(
                                                    trackIndex,
                                                    "file",
                                                    file
                                                );
                                                handleTrackChange(
                                                    trackIndex,
                                                    "audioPreview",
                                                    URL.createObjectURL(file)
                                                );
                                            }
                                        }}
                                        required
                                    />
                                    {track.audioPreview && (
                                        <audio
                                            className="mt-3"
                                            controls
                                            src={track.audioPreview}>
                                            Your browser does not support the
                                            audio element.
                                        </audio>
                                    )}
                                </CCol>
                                <CCol md={8}>
                                    <CFormSelect
                                        feedbackValid="Всё хорошо!"
                                        value={track.author}
                                        onChange={(e) =>
                                            handleTrackChange(
                                                trackIndex,
                                                "author",
                                                e.target.value
                                            )
                                        }
                                        required>
                                        <option value="">
                                            Выберите автора слов
                                        </option>
                                        {members.map((member) => (
                                            <option
                                                key={member.id}
                                                value={member.name_of_member}>
                                                {member.name_of_member}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                {track.participants.length > 0 && (
                                    <CCol md={8}>
                                        <CFormLabel>Авторы музыки</CFormLabel>
                                        <CListGroup>
                                            {track.participants.map(
                                                (
                                                    participant,
                                                    participantIndex
                                                ) => (
                                                    <CListGroupItem
                                                        key={participantIndex}>
                                                        {participant}
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            className="float-end"
                                                            onClick={() =>
                                                                removeParticipant(
                                                                    trackIndex,
                                                                    participantIndex
                                                                )
                                                            }>
                                                            Удалить
                                                        </CButton>
                                                    </CListGroupItem>
                                                )
                                            )}
                                        </CListGroup>
                                    </CCol>
                                )}
                                <CCol xs={8}>
                                    <CCol md={4}>
                                        <CFormSelect
                                            feedbackValid="Всё хорошо!"
                                            value={track.selectedParticipant}
                                            onChange={(e) =>
                                                handleParticipantChange(
                                                    trackIndex,
                                                    e.target.value
                                                )
                                            }>
                                            <option value="">
                                                Выберите участника
                                                (необязательно)
                                            </option>
                                            {getAvailableMembers(
                                                trackIndex
                                            ).map((member) => (
                                                <option
                                                    key={member.id}
                                                    value={
                                                        member.name_of_member
                                                    }>
                                                    {member.name_of_member}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CButton
                                        color="success"
                                        type="button"
                                        style={{
                                            marginTop: "20px",
                                            color: "white",
                                        }}
                                        onClick={() =>
                                            addParticipant(trackIndex)
                                        }
                                        disabled={isAddParticipantButtonDisabled(
                                            trackIndex
                                        )}>
                                        Добавить участника записи
                                    </CButton>
                                </CCol>
                            </div>
                        ))}
                        <CCol xs={12}>
                            {error ? (
                                <CButton
                                    color="primary"
                                    disabled
                                    type="submit">
                                    Сохранить
                                </CButton>
                            ) : (
                                <CButton
                                    color="primary"
                                    type="submit">
                                    Сохранить
                                </CButton>
                            )}
                        </CCol>
                    </CForm>
                )}
            </div>
        </>
    );
};

export default CreateMusic;
