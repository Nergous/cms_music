import React, { useState, useRef, useEffect } from "react";
import CloseButton from "react-bootstrap/esm/CloseButton";
import cl from "./MusicPanel.module.css";
import MemberLink from "../../../components/MemberLink/MemberLink";

const TrackModal = ({ track, onClose, isClosing }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false); // State to toggle lyrics visibility

    // Function to toggle playback
    const togglePlayback = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audio.paused) {
                audio.play();
                setIsPlaying(true);
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        }
    };

    // Format time for progress display
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    // Update state on audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
            audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
            audio.addEventListener("ended", () => setIsPlaying(false));
        }

        return () => {
            if (audio) {
                audio.removeEventListener("timeupdate", () => {});
                audio.removeEventListener("loadedmetadata", () => {});
                audio.removeEventListener("ended", () => {});
            }
        };
    }, []);

    // Handle progress bar change
    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = e.target.value;
        }
    };

    return (
        <>
            <div className={`${cl.modal} ${isClosing ? cl.closing : cl.active}`}>
                <div className={cl.modalContent}>
                    <CloseButton onClick={onClose} />
                    <h2>{track.track_name}</h2>
                    {track.lyrics_author && (
                        <p>
                            Автор слов: <MemberLink member={track.lyrics_authored} />
                        </p>
                    )}
                    {track.authors.length > 0 && (
                        <p>
                            Авторы музыки:{" "}
                            {track.authors.map((author, index) => (
                                <span key={index}>
                                    <MemberLink member={author} />
                                    {index < track.authors.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                    )}

                    {/* Button to show/hide lyrics */}
                    {track.track_lyrics && (
                        <button className={cl.lyricsButton} onClick={() => setShowLyrics(!showLyrics)}>
                            {showLyrics ? "Скрыть текст" : "Показать текст"}
                        </button>
                    )}

                    {/* Display lyrics if showLyrics is true */}
                    {showLyrics && (
                        <div className={cl.lyricsContainer}>
                            <pre className={cl.lyricsText}>{track.track_lyrics}</pre>
                        </div>
                    )}

                    {/* Custom audio player */}
                    <div className={cl.customAudioPlayer}>
                        <audio ref={audioRef} src={track?.path_to_file} type="audio/mpeg" />

                        {/* Play/Pause button */}
                        <button className={cl.playButton} onClick={togglePlayback}>
                            {isPlaying ? "⏸" : "▶"}
                        </button>

                        {/* Progress bar and time info */}
                        <div className={cl.progressContainer}>
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleProgressChange}
                                className={cl.progressBar}
                            />
                            <span className={cl.timeInfo}>
                                {formatTime(currentTime)} / {duration ? formatTime(duration) : "0:00"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackModal;
