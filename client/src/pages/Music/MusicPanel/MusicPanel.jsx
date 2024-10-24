import React, { useEffect, useState } from "react";
import cl from "./MusicPanel.module.css";
import TrackList from "./TrackList";
import TrackModal from "./TrackModal";
import axios from "axios";

const MusicPanel = ({ music }) => {
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [trackModalIsOpen, setTrackModalIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [trackData, setTrackData] = useState(null);

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
        if (music) {
            const fetchTrackData = async () => {
            try {
                const response = await axios.get(
                    "/api/record/" + music.id
                );
                setTrackData(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTrackData();
        }
    }, [music]);

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
            if (
                trackModalIsOpen &&
                event.target.closest(`.${cl.modalContent}`) === null
            ) {
                closeTrackModal();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [trackModalIsOpen]);

    if (!music) {
        return <></>;
    }

    return (
        <>
            <div className={cl.parent}>
                <div className={cl.div1}>
                    {music.record_name} - {getType(music.type_of_record)}
                </div>
                <div className={cl.div2}>
                    <img
                        className={cl.img}
                        src={music.path_to_cover}
                        alt="music"
                    ></img>
                </div>
                <div className={cl.div4}>
                    Дата выпуска - {music.year_of_publish}
                </div>
                {trackData && (
                    <TrackList
                        tracks={trackData.tracks}
                        onTrackClick={openTrackModal}
                    />
                )}
            </div>
            {(trackModalIsOpen || selectedTrack !== null) && (
                <TrackModal
                    track={selectedTrack}
                    onClose={closeTrackModal}
                    isClosing={isClosing}
                />
            )}
        </>
    );
};

export default MusicPanel;
