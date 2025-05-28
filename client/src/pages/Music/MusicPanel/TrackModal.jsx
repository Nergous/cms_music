import React, { useState, useRef, useEffect } from "react";
import CloseButton from "react-bootstrap/esm/CloseButton";
import cl from "./MusicPanel.module.css";
import MemberLink from "../../../components/MemberLink/MemberLink";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { MdSpeed } from "react-icons/md";

const TrackModal = ({ track, onClose, isClosing }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showLyrics, setShowLyrics] = useState(false);

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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            audio.playbackRate = playbackRate;
            const updateTime = () => setCurrentTime(audio.currentTime);
            const updateDuration = () => setDuration(audio.duration);
            const handleEnd = () => setIsPlaying(false);

            audio.addEventListener("timeupdate", updateTime);
            audio.addEventListener("loadedmetadata", updateDuration);
            audio.addEventListener("ended", handleEnd);

            return () => {
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("loadedmetadata", updateDuration);
                audio.removeEventListener("ended", handleEnd);
            };
        }
    }, [volume, playbackRate]);

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = e.target.value;
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleRateChange = (e) => {
        setPlaybackRate(parseFloat(e.target.value));
    };

    

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
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

                {track.track_lyrics && (
                    <button className={cl.lyricsButton} onClick={() => setShowLyrics(!showLyrics)}>
                        {showLyrics ? "Скрыть текст" : "Показать текст"}
                    </button>
                )}

                {showLyrics && (
                    <div className={cl.lyricsContainer}>
                        <pre className={cl.lyricsText}>{track.track_lyrics}</pre>
                    </div>
                )}

                <div className={cl.customAudioPlayer}>
                    <audio ref={audioRef} src={track?.path_to_file} type="audio/mpeg" />

                    <button className={`${cl.playButton} ${isPlaying ? cl.playing : ""}`} onClick={togglePlayback}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>

                    <div className={cl.progressContainer}>
                        <div className={cl.progressBarWrapper}>
                            <div className={cl.progressFill} style={{ width: `${progressPercent}%` }}></div>
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleProgressChange}
                                className={cl.progressBar}
                                style={{
                                    background: `linear-gradient(to right, #007bff ${progressPercent}%, #ccc ${progressPercent}%)`,
                                }}
                            />
                        </div>
                        <span className={cl.timeInfo}>
                            {formatTime(currentTime)} / {duration ? formatTime(duration) : "0:00"}
                        </span>
                    </div>

                    <div className={cl.volumeControl}>
                        <FaVolumeUp />
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className={cl.volumeSlider} />
                    </div>

                    <div className={cl.speedControl}>
                        <MdSpeed />
                        <select value={playbackRate} onChange={handleRateChange}>
                            <option value="0.5">0.5x</option>
                            <option value="1">1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackModal;
