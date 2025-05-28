import React, { useEffect, useState, useContext } from "react";
import cl from "./MusicPanel.module.css";
import TrackList from "./TrackList";
import TrackModal from "./TrackModal";
import axios from "axios";
import ApiContext from "../../../ApiContext";
import Spinner from "../../../components/Spinner/Spinner";

const MusicPanel = ({ id }) => {
    const apiUrl = useContext(ApiContext);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [trackModalIsOpen, setTrackModalIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getType = (type) => {
        if (type === "single") {
            return "Сингл";
        } else if (type === "EP") {
            return "EP";
        } else if (type === "album") {
            return "Альбом";
        }
    };

    useEffect(() => {
        if (trackModalIsOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [trackModalIsOpen]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/record/` + id);
                setRecordData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const openTrackModal = (track) => {
        setSelectedTrack(track);
        setTrackModalIsOpen(true);
        setIsClosing(false);
    };

    const closeTrackModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setTrackModalIsOpen(false);
            setSelectedTrack(null);
            setIsClosing(false);
        }, 300); // Продолжительность совпадает с временем анимации
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (trackModalIsOpen && event.target.closest(`.${cl.modalContent}`) === null) {
                closeTrackModal();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [trackModalIsOpen]);

    const formatReleaseDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (!id) {
        return <></>;
    }

    return (
        <>
            {isLoading ? (
                <Spinner color={"#f1f1f1"} />
            ) : (
                <>
                    <div className={cl.parent}>
                        <div className={cl.div1}>
                            {recordData.record_name} - {getType(recordData.type_of_record)}
                        </div>
                        <div className={cl.div2}>
                            <img className={cl.img} src={recordData.path_to_cover} alt="music"></img>
                        </div>
                        <div className={cl.div4}>Дата выпуска - {formatReleaseDate(recordData.year_of_publish)}</div>
                        {recordData.tracks && <TrackList tracks={recordData.tracks} onTrackClick={openTrackModal} />}
                    </div>
                    {(trackModalIsOpen || selectedTrack !== null) && (
                        <TrackModal track={selectedTrack} onClose={closeTrackModal} isClosing={isClosing} />
                    )}
                </>
            )}
        </>
    );
};

export default MusicPanel;
