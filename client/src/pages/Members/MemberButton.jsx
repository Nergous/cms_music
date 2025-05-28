import React, { useState, useEffect } from "react";
import cl from "./Members.module.css";

const MemberButton = React.memo(({ member, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = member.path_to_photo;
        img.onload = () => {
            setImageLoaded(true);
            setTimeout(() => setAnimate(true), 10); // Небольшая задержка, чтобы сработала анимация
        };
    }, [member.path_to_photo]);

    if (!imageLoaded) return null;

    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`${cl.member} ${animate ? cl.animateIn : ""}`}
            style={{
                backgroundImage: `url(${member.path_to_photo})`,
            }}>
            <span>{member.name_of_member}</span>
        </button>
    );
});

export default MemberButton;
