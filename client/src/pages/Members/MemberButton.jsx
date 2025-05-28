import React from "react";
import cl from "./Members.module.css";

const MemberButton = React.memo(({ member, isHovered, onClick, onMouseEnter, onMouseLeave }) => (
    <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cl.member}
        style={{
            backgroundImage: `url(${member.path_to_photo})`,
        }}>
        <span>{member.name_of_member}</span>
    </button>
));

export default MemberButton;
