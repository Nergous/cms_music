import React, { useState, useEffect } from "react";
import cl from "./Music.module.css";

const MusicButton = ({ music, handleMusicClick, variant = "default" }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (variant === "image") {
            const img = new Image();
            img.src = music.path_to_cover;
            img.onload = () => {
                setImageLoaded(true);
                setTimeout(() => setAnimate(true), 10); // запуск анимации
            };
        }
    }, [music.path_to_cover, variant]);

    if (variant === "image") {
        if (!imageLoaded) return null;

        return (
            <button
                className={`${cl.music_image} ${animate ? cl.animateIn : ""}`}
                onClick={() => handleMusicClick(music)}
                style={{
                    backgroundImage: `url(${music.path_to_cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}>
                <span>{music.record_name}</span>
            </button>
        );
    }

    return (
        <button className={cl.music} onClick={() => handleMusicClick(music)} title={music.record_name} key={music.id}>
            {music.record_name}
        </button>
    );
};

export default MusicButton;
