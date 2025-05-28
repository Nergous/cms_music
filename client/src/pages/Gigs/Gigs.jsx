import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import Gig from "./GIg/Gig";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import cl from "./Gigs.module.css";
import ApiContext from "../../ApiContext";

const Gigs = () => {
    const apiUrl = useContext(ApiContext);

    const [fontColor, setFontColor] = useState("#000000");
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGig, setSelectedGig] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/gigs`);
                setGigs(response.data);
            } catch (error) {
                console.error("Error fetching gigs:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFontColor = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/font_colors`);
                setFontColor(response.data.FontColors.mainFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        }

        fetchFontColor();
        fetchGigs();
    }, []);

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal]);

    const handleGigClick = useCallback((gig) => {
        setSelectedGig(gig);
        setModal(true);
    }, []);

    if (loading) {
        return <Spinner color={fontColor}  />;
    }

    return (
        <div className={cl.gig__outer}>
            <h1 style={{ color: fontColor }} className={cl.gig__title}>Выступления</h1>
            {gigs.length > 0 ? (
                <div className={cl.gig_block}>
                    {gigs.map((gig) => (
                        <Gig gig={gig} key={gig.id} index={gigs.indexOf(gig)} />
                    ))}
                </div>
            ) : (
                <h1 style={{ color: fontColor }} className={cl.gig__title}>Пока что нет выступлений</h1>
            )}
        </div>
    );
};

export default Gigs;
