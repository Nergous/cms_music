import React, { useState, useEffect } from "react";
import cl from "./Members.module.css"; // или "../Members.module.css", если нужно

const MemberButton = ({ member, isHovered, onClick, onMouseEnter, onMouseLeave, index }) => {
    const [posterLoaded, setPosterLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = member.path_to_photo;
        img.onload = () => {
            setPosterLoaded(true);
        };
    }, [member.path_to_photo]);

    return (
        <div
            className={`${cl.member} ${posterLoaded ? cl.animateIn : cl.preload}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                backgroundImage: `url(${member.path_to_photo})`,
                animationDelay: `${index * 0.1}s`,
            }}>
            <span>{member.name_of_member}</span>
        </div>
    );
};

export default MemberButton;
