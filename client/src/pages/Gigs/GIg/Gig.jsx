import React, { useEffect, useState } from "react";
import axios from "axios";
import cl from "./Gig.module.css";

const Gig = ({ gig }) => {
    const [gigData, setGigData] = useState(null);

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
        if (gig) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(
                        "/api/gigs/" + gig.id
                    );
                    setGigData(response.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchMembers();
        }
    }, [gig]);

    if (!gig) {
        return <></>;
    }

    return (
        <div className={cl.gig__page}>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2} className={cl.title}>
                            {gig.title}
                        </td>
                    </tr>
                    <tr>
                        <td className={cl.data_left}>
                            <img
                                className={cl.gig__poster}
                                src={gig.path_to_poster}
                                alt="poster"
                            />
                        </td>
                        <td className={cl.data_right}>
                            <p>{gig.place}</p>
                            <p>{formatDate(gig.date_of_gig)}</p>
                            {gig.gig_status === "soon" && (
                                <h2 style={{ color: "blue" }}>Уже скоро</h2>
                            )}
                            {gig.gig_status === "completed" && (
                                <h2 style={{ color: "green" }}>Завершен</h2>
                            )}
                            {gig.gig_status === "canceled" && (
                                <h2 style={{ color: "red" }}>Отменен</h2>
                            )}
                            <p>
                                <a href={gig.link_to_social}>
                                    Ссылка на соц. сети
                                </a>
                            </p>
                            {gigData && gigData.members && (
                                <>
                                    <h3>Участники</h3>
                                    <ul className={cl.list}>
                                        {gigData.members.map((gm) => (
                                            <li key={gm.id}>
                                                {gm.name_of_member}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Gig;
