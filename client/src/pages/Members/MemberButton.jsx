import React, { useState, useEffect } from "react";
import cl from "./Members.module.css"; // или "../Members.module.css", если нужно

const MemberButton = ({ member, isHovered, onClick, onMouseEnter, onMouseLeave, index }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = member.path_to_photo;
        img.onload = () => {
            setTimeout(() => setAnimate(true), 10);
        };
    }, [member.path_to_photo]);

    if (!animate) return null;

    return (
        <div
            className={`${cl.member} ${cl.animateIn}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                backgroundImage: `url(${member.path_to_photo})`,
                animationDelay: `${index * 100}ms`,
            }}>
            <span>{member.name}</span>
        </div>
    );
};

export default MemberButton;
