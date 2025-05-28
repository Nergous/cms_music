import React from "react";
import cl from "./Music.module.css";

const MusicButton = ({ music, handleMusicClick, variant = "default" }) => {
    if (variant === "image") {
        return (
            <button
                className={cl.music_image}
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
