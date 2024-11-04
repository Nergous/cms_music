import React, { useEffect, useState, useContext } from "react";
import {
    CForm,
    CFormInput,
    CCol,
    CButton,
    CFormSelect,
    CListGroup,
    CListGroupItem,
    CFormLabel,
    CAlert,
    CImage,
} from "@coreui/react";
import { AppSidebar, AppHeader, AppFooter } from "../../components";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ApiContext from "../../../../ApiContext";

const EditMusic = () => {
    const api = useContext(ApiContext);
    const [recordName, setRecordName] = useState("");
    const [recordType, setRecordType] = useState("");
    const [cover, setCover] = useState("");
    const [coverPreview, setCoverPreview] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [members, setMembers] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const [critError, setCritError] = useState(null);

    const { id } = useParams();

    const navigate = useNavigate();

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${api}/members`);
            setMembers(response.data);
        } catch (error) {
            setCritError(error.message);
        }
    };

    const fetchRecordDetails = async () => {
        try {
            const response = await axios.get(`${api}/record/${id}`);
            const recordData = response.data;
            setRecordName(recordData.record_name || "");
            setRecordType(recordData.type_of_record || "");
            setReleaseYear(recordData.year_of_publish || "");
            setTracks(recordData.tracks || []);
            setCover(recordData.path_to_cover || "");
            setCoverPreview(recordData.path_to_cover || "");
        } catch (error) {
            setCritError(error.message);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchRecordDetails();
    }, [id]);

    const handleRecordNameChange = (e) => setRecordName(e.target.value);

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

    const handleReleaseYearChange = (e) => setReleaseYear(e.target.value);

    const addTrack = () => {
        if (recordType === "single" && tracks.length >= 1) return;

        setTracks([
            ...tracks,
            {
                track_name: "",
                path_to_file: null,
                lyrics_author: "",
                authors: [],
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
            !newTracks[index].authors.some(
                (mem) => mem.id === selectedParticipant
            )
        ) {
            const participant = members.find(
                (member) => member.id == selectedParticipant
            );

            newTracks[index].authors.push(participant);
            newTracks[index].selectedParticipant = "";
            setTracks(newTracks);
        }
    };

    const removeParticipant = (trackIndex, participantIndex) => {
        const newTracks = [...tracks];
        newTracks[trackIndex].authors.splice(participantIndex, 1);
        setTracks(newTracks);
    };

    const handleParticipantChange = (trackIndex, value) => {
        const newTracks = [...tracks];
        newTracks[trackIndex].selectedParticipant = value;
        setTracks(newTracks);
    };

    const getAvailableMembers = (trackIndex) => {
        const selectedMembers = tracks[trackIndex].authors;
        return members.filter(
            (member) =>
                !selectedMembers.some(
                    (selectedPerson) => selectedPerson.id === member.id
                )
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
                    track_name: "",
                    path_to_file: null,
                    lyrics_author: "",
                    members: [],
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
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        if (form.checkValidity() !== false) {
            const formData = new FormData();
            formData.append("recordName", recordName);
            formData.append("recordType", recordType);
            formData.append("cover", cover);
            formData.append("releaseYear", releaseYear);

            formData.append("tracks", JSON.stringify(tracks));

            tracks.forEach((track, index) => {
                if (track.file) {
                    if (
                        track.file.type === "audio/mpeg" ||
                        track.file.type === "audio/wav"
                    ) {
                        formData.append(
                            `trackFiles`,
                            track.file,
                            `trackFiles_${index}.mp3`
                        );
                    } else {
                        setError(
                            "Неверный формат файла. Пожалуйста, загрузите файл в формате MP3 или WAV."
                        );
                        return;
                    }
                }
            });

            try {
                const response = await axios.put(
                    `${api}/record/${id}`,
                    formData,
                    { withCredentials: true }
                );
                alert("Релиз успешно обновлен");
                navigate("/admin/music");
            } catch (error) {
                setError(
                    "Произошла ошибка при обновлении релиза " + error.message
                );
            }
        }
    };

    return (
        <>
            <div className="body flex-grow-1 p-3">
                <CButton
                    className="mb-3"
                    onClick={() => navigate("/admin/music")}
                    color="primary">
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
                                feedbackValid="Looks good!"
                                id="record_name"
                                label="Название альбома"
                                placeholder="Альбом"
                                required
                                value={recordName}
                                onChange={handleRecordNameChange}
                            />
                        </CCol>
                        <CCol md={8}>
                            <CFormSelect
                                feedbackValid="Looks good!"
                                id="record_type"
                                label="Тип записи"
                                value={recordType}
                                onChange={handleRecordTypeChange}
                                required>
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
                                onChange={handleCoverChange}
                            />
                            {coverPreview && (
                                <CImage
                                    className="mt-3"
                                    src={coverPreview.replace("..", "")}
                                    alt="Cover Preview"
                                    style={{ maxWidth: "200px" }}
                                />
                            )}
                        </CCol>
                        <CCol md={8}>
                            <CFormInput
                                type="date"
                                placeholder="01.01.2001"
                                feedbackValid="Looks good!"
                                id="release_year"
                                label="Год выпуска"
                                required
                                value={releaseYear}
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
                                        feedbackValid="Looks good!"
                                        label={`Название трека ${
                                            trackIndex + 1
                                        }`}
                                        value={track.track_name}
                                        onChange={(e) =>
                                            handleTrackChange(
                                                trackIndex,
                                                "track_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </CCol>
                                <CCol md={8}>
                                    <CFormInput
                                        type="file"
                                        label="Файл трека"
                                        feedbackInvalid="Invalid file type."
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
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
                                    />
                                    {track.path_to_file &&
                                        !track.audioPreview && (
                                            <audio
                                                className="mt-3"
                                                controls
                                                src={track.path_to_file.replace(
                                                    "..",
                                                    ""
                                                )}>
                                                Your browser does not support
                                                the audio element.
                                            </audio>
                                        )}
                                    {track.audioPreview && (
                                        <audio
                                            className="mt-3"
                                            controls
                                            src={track.audioPreview.replace(
                                                "..",
                                                ""
                                            )}>
                                            Your browser does not support the
                                            audio element.
                                        </audio>
                                    )}
                                </CCol>
                                <CCol md={8}>
                                    <CFormSelect
                                        label="Автор слов"
                                        feedbackValid="Looks good!"
                                        value={track.lyrics_author || ""}
                                        onChange={(e) =>
                                            handleTrackChange(
                                                trackIndex,
                                                "lyrics_author",
                                                e.target.value
                                            )
                                        }
                                        required>
                                        {members.map((member) => (
                                            <option
                                                key={member.id}
                                                value={member.id}>
                                                {member.name_of_member}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                {track.authors && track.authors.length > 0 && (
                                    <CCol md={8}>
                                        <CFormLabel>Авторы музыки</CFormLabel>
                                        <CListGroup>
                                            {track.authors.map(
                                                (member, participantIndex) => (
                                                    <CListGroupItem
                                                        key={participantIndex}>
                                                        {member.name_of_member}
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
                                {getAvailableMembers(trackIndex).length > 0 && (
                                    <CCol xs={8}>
                                        <CCol md={8}>
                                            <CFormSelect
                                                feedbackValid="Looks good!"
                                                value={
                                                    track.selectedParticipant ||
                                                    ""
                                                }
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
                                                        value={member.id}>
                                                        {member.name_of_member}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                        <CButton
                                            color="success"
                                            type="button"
                                            className="mt-3 text-white"
                                            onClick={() =>
                                                addParticipant(trackIndex)
                                            }
                                            disabled={isAddParticipantButtonDisabled(
                                                trackIndex
                                            )}>
                                            Добавить участника записи
                                        </CButton>
                                    </CCol>
                                )}
                            </div>
                        ))}
                        <CCol xs={8}>
                            <CButton
                                color="primary"
                                type="submit">
                                Обновить
                            </CButton>
                        </CCol>
                    </CForm>
                )}
            </div>
        </>
    );
};

export default EditMusic;
