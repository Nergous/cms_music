import React, { useEffect, useState } from "react";
import axios from "axios";
import cl from "./Member.module.css";

const Member = ({ member }) => {
    const [role, setRole] = useState([]);

    const formatDate = (dateString) => {
        const months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
        ];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const responseRoles = await axios.get(
                    "api/music_roles"
                );
                const responseMemberRoles = await axios.get(
                    `api/member_roles`
                );
                if (responseRoles.data && responseMemberRoles.data && member) {
                    const memberRole = responseMemberRoles.data.filter(
                        (rol) => rol.id_member === member.id
                    );
                    const memberRolesId = memberRole.map(
                        (role) => role.id_role
                    );
                    const filteredRoles = responseRoles.data.filter((role) =>
                        memberRolesId.includes(role.id)
                    );
                    setRole(filteredRoles);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoles();
    }, [member]);

    if (!member) {
        return <></>;
    }
    return (
        <div className={cl.member__page}>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2} className={cl.title}>
                            {member.name_of_member}
                        </td>
                    </tr>
                    <tr>
                        <td className={cl.data_left}>
                            <img
                                className={cl.member__img}
                                src={member.path_to_photo}
                                alt={member.name_of_member}
                            ></img>
                        </td>
                        <td className={cl.data_right}>
                            <p>{member.description}</p>
                            <hr />
                            <p style={{ textAlign: "left" }}>
                                <b>Роль в группе:</b>{" "}
                                {role.map((r) => r.role_name).join(", ")}
                            </p>
                            <p style={{ textAlign: "left" }}>
                                Участник группы с{" "}
                                {formatDate(member.date_start)}
                            </p>

                            {member.date_end && (
                                <p style={{ textAlign: "left" }}>
                                    Закончил:{" "}
                                    <b>{formatDate(member.date_end)}</b>
                                </p>
                            )}
                            {!member.date_end && (
                                <p style={{ textAlign: "left" }}>
                                    Является участником по сей день
                                </p>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Member;
