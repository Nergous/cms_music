import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import cl from "./Gig.module.css";
import ApiContext from "../../../ApiContext";

const Gig = ({ gig, index }) => {
    const api = useContext(ApiContext);
    const [gigData, setGigData] = useState(null);
    const [posterLoaded, setPosterLoaded] = useState(false);
    const [animate, setAnimate] = useState(false);

    const formatDate = (dateString) => {
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
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
                    const response = await axios.get(`${api}/gigs/${gig.id}`);
                    setGigData(response.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchMembers();

            const img = new Image();
            img.src = gig.path_to_poster;
            img.onload = () => {
                setPosterLoaded(true);
                setTimeout(() => setAnimate(true), 10); // Плавный запуск анимации
            };
        }
    }, [gig, api]);

    if (!gig) return null;

    const statusMap = {
        soon: { text: "Уже скоро", color: "#007bff", emoji: "⏳" },
        completed: { text: "Завершен", color: "#28a745", emoji: "✅" },
        canceled: { text: "Отменен", color: "#dc3545", emoji: "❌" },
    };

    const status = statusMap[gig.gig_status] || {};

    return (
        <div className={`${cl.gig__page} ${animate ? cl.animateIn : ""}`}
            style={animate ? { animationDelay: `${index * 0.1}s` } : {opacity: 0}}>
            <h1 className={cl.title}>{gig.title}</h1>

            <div className={cl.gig__content}>
                <div className={cl.data_left}>
                    <img className={cl.gig__poster} src={gig.path_to_poster} alt="poster" />
                </div>

                <div className={cl.data_right}>
                    {gig.gig_status && (
                        <div className={cl.status} style={{ backgroundColor: status.color + "22", color: status.color }} title={status.text}>
                            <span className={cl.status_emoji}>{status.emoji}</span>
                            <span>{status.text}</span>
                        </div>
                    )}

                    <p className={cl.place}>{gig.place}</p>
                    <p className={cl.date}>{formatDate(gig.date_of_gig)}</p>

                    {gigData?.members?.length > 0 && (
                        <>
                            <h3>Участники</h3>
                            <ul className={cl.list}>
                                {gigData.members.map((gm) => (
                                    <li key={gm.id}>{gm.name_of_member}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    <a href={gig.link_to_social} className={cl.social_button} target="_blank" rel="noopener noreferrer">
                        Ссылка на соц. сети
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Gig;
