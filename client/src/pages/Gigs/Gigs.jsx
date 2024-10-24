import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Gig from "./GIg/Gig";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import cl from "./Gigs.module.css";

const Gigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGig, setSelectedGig] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const response = await axios.get("/api/gigs");
                setGigs(response.data);
            } catch (error) {
                console.error("Error fetching gigs:", error);
            } finally {
                setLoading(false);
            }
        };

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
        return <Spinner />;
    }

    return (
        <div className={cl.gig__outer}>
            <h1 className={cl.gig__title}>Выступления</h1>
            {gigs.length > 0 ? (
                <>
                    {gigs.map((gig) => (
                        <button
                            className={cl.gig__panel}
                            key={gig.id}
                            onClick={() => handleGigClick(gig)}
                        >
                            {gig.title}
                        </button>
                    ))}
                    <Modal visible={modal} setVisible={setModal}>
                        <Gig gig={selectedGig} />
                    </Modal>
                </>
            ) : (
                <h1 className={cl.gig__title}>Пока что нет выступлений</h1>
            )}
        </div>
    );
};

export default Gigs;
