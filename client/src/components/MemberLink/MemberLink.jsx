import React from "react";

const MemberLink = ({ member }) => {
    if (member.is_member) {
        return member.name_of_member;
    } else {
        return <a href={`${member.description}`}>{member.name_of_member}</a>;
    }
};

export default MemberLink;
