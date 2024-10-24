import React from "react";
import CloseButton from "react-bootstrap/esm/CloseButton";
import cl from "./MusicPanel.module.css";
import MemberLink from "../../../components/MemberLink/MemberLink";

const TrackModal = ({ track, onClose, isClosing }) => {
    return (
        <>
            <div className={`${cl.modal} ${isClosing ? cl.closing : cl.active}`}>
                <div className={cl.modalContent}>
                    <CloseButton onClick={onClose} />
                    <h2>{track.track_name}</h2>
                    {track.lyrics_author && (
                        <p>
                            Автор слов:{" "}
                            <MemberLink
                                member={track.lyrics_authored}
                            />
                        </p>
                    )}
                    {track.authors.length > 0 && (
                        <p>
                            Авторы музыки:{" "}
                            {track.authors.map((author, index) => (
                                <span key={index}>
                                    <MemberLink member={author} />
                                    {index < track.authors.length - 1
                                        ? ", "
                                        : ""}
                                </span>
                            ))}
                        </p>
                    )}
                    <audio className={cl.audio} controls>
                        <source
                            src={track?.path_to_file}
                            type="audio/mpeg"
                        ></source>
                    </audio>
                </div>
            </div>
        </>
    );
};

export default TrackModal;
