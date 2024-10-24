import React from "react";
import cl from "./Members.module.css";

const MemberButton = React.memo(
    ({ member, isHovered, onClick, onMouseEnter, onMouseLeave }) => (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cl.member}
            style={{
                color: isHovered ? "white" : "transparent",
                backgroundImage: `url(${member.path_to_photo})`,
                backgroundColor: isHovered
                    ? "rgba(0, 0, 0, 0.5)"
                    : "transparent",
                backgroundBlendMode: isHovered ? "overlay" : "normal",
                backgroundPosition: "center",
                fontSize: "25px",
            }}
        >
            {member.name_of_member}
        </button>
    )
);

export default MemberButton;
