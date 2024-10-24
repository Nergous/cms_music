import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal";
import MusicPanel from "./MusicPanel/MusicPanel";
import Spinner from "../../components/Spinner/Spinner";
import MusicButton from "./MusicButton";
import cl from "./Music.module.css";

const Music = () => {
    const [musicList, setMusicList] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await axios.get(
                    "api/record"
                );
                setMusicList(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, []);
    
    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal]);


    const handleMusicClick = useCallback((music) => {
        setSelectedMusic(music);
        setModal(true);
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className={cl.error}>
                Ошибка при загрузке данных: {error.message}
            </div>
        );
    }

    return (
        <div className={cl.music__container}>
            <h1 className={cl.music__title}>Музыка</h1>
            {musicList.length > 0 ? (
                musicList.map((music) => (
                    <MusicButton
                        key={music.id}
                        music={music}
                        handleMusicClick={handleMusicClick}
                    />
                ))
            ) : (
                <h2 className={cl.music__title}>Пока что здесь ничего нет</h2>
            )}
            <Modal visible={modal} setVisible={setModal}>
                <MusicPanel music={selectedMusic} />
            </Modal>
        </div>
    );
};

export default Music;
