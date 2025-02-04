import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal";
import MusicPanel from "./MusicPanel/MusicPanel";
import Spinner from "../../components/Spinner/Spinner";
import MusicButton from "./MusicButton";
import cl from "./Music.module.css";
import ApiContext from "../../ApiContext";

const Music = () => {
    const apiUrl = useContext(ApiContext);
    const [musicList, setMusicList] = useState([]);
    const [fontColor, setFontColor] = useState("#000000");
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [containerType, setContainerType] = useState("image"); // Тип контейнера (button или image)

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await axios.get(`${apiUrl}/record`);
                setMusicList(response.data);

                // Предположим, что тип контейнера приходит как поле в ответе сервера
                if (response.data && response.data.containerType) {
                    setContainerType(response.data.containerType || "image");
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchFontColor = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/font_colors`);
                setFontColor(res.data.FontColors.mainFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        };

        fetchFontColor();
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
        return <Spinner color={fontColor} />;
    }

    if (error) {
        return (
            <div style={{ color: fontColor }} className={cl.error}>
                Ошибка при загрузке данных: {error.message}
            </div>
        );
    }

    return (
        <div className={cl.music__container}>
            {/* Заголовок остается независимым */}
            <h1 style={{ color: fontColor }} className={cl.music__title}>
                Музыка
            </h1>

            {/* Контейнер для кнопок */}
            <div className={`${cl.music_buttons_container} ${containerType === "image" ? cl["image-grid"] : ""}`}>
                {musicList.length > 0 ? (
                    musicList.map((music) => (
                        <MusicButton
                            key={music.id}
                            variant={containerType} // Используем тип контейнера для определения варианта
                            music={music}
                            handleMusicClick={handleMusicClick}
                        />
                    ))
                ) : (
                    <h1 style={{ color: fontColor, textAlign: "center" }}>Пока что здесь ничего нет</h1>
                )}
            </div>

            {selectedMusic && (
                <Modal visible={modal} setVisible={setModal}>
                    <MusicPanel id={selectedMusic.id} />
                </Modal>
            )}
        </div>
    );
};

export default Music;
