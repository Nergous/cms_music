import React from "react";
import cl from "./Music.module.css";

const MusicButton = ({ music, handleMusicClick, variant = "default" }) => {
    if (variant === "image") {
        return (
            <button
                className={cl.music_image}
                onClick={() => handleMusicClick(music)}
                onMouseEnter={(e) => (e.target.style.color = "white")}
                onMouseLeave={(e) => (e.target.style.color = "transparent")}
                style={{
                    backgroundImage: `url(${music.path_to_cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    fontSize: "25px",
                    width: "400px",
                    height: "400px",
                    color: "transparent",
                }}>
                {music.record_name}
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
