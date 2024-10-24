import React from "react";
import cl from "./Music.module.css";

const MusicButton = ({ music, handleMusicClick }) => {
    return (
        <>
            <button
                className={cl.music}
                onClick={() => handleMusicClick(music)}
                title={music.record_name}
                key={music.id}
            >
                {music.record_name}
            </button>
        </>
    );
};

export default MusicButton;
