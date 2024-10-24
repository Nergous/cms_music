import React from "react";
import cl from "./MusicPanel.module.css";

const TrackList = ({ tracks, onTrackClick }) => {
    if (!tracks) {
        return <></>;
    }
    return (
        <>
            <div className={cl.div3}>
                {tracks &&
                    tracks.map((track) => (
                        <div
                            className={cl.tracks}
                            key={track.id}
                            onClick={() => onTrackClick(track)}
                        >
                            <p>{track.track_name}</p>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default TrackList;
