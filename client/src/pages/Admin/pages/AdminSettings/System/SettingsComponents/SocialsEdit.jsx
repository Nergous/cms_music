import React, { useState, useEffect } from "react";
import axios from "axios";
import { CForm, CFormInput, CFormCheck, CAlert, CButton } from "@coreui/react";

const SocialsEdit = ({api, id, label}) => {
    const [vkLink, setVkLink] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [emailLink, setEmailLink] = useState("");
    const [vkChecked, setVkChecked] = useState(false);
    const [youtubeChecked, setYoutubeChecked] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadSocials = async () => {
            try {
                const response = await axios.get(`${api}/admin/socials`);
                const { vk_link, youtube_link, email_link } = response.data.Socials;
                setVkLink(vk_link);
                setYoutubeLink(youtube_link);
                setEmailLink(email_link.replace("mailto:", "")); // Убираем mailto: при загрузке
                setVkChecked(!!vk_link);
                setYoutubeChecked(!!youtube_link);
                setEmailChecked(!!email_link);
            } catch (error) {
                setError(error.response.data);
            } finally {
                setLoading(false);
            }
        };

        loadSocials();
    }, [api]);

    const handleSaveSocials = async () => {
        try {
            // Проверка ссылок
            const vkRegex = /^https:\/\/vk\.com\//;
            const youtubeRegex = /^https:\/\/www\.youtube\.com\//;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (vkChecked && !vkRegex.test(vkLink)) {
                setError("Ссылка на Вконтакте должна начинаться с https://vk.com/");
                return;
            }

            if (youtubeChecked && !youtubeRegex.test(youtubeLink)) {
                setError("Ссылка на Ютуб должна начинаться с https://www.youtube.com/");
                return;
            }

            if (emailChecked && !emailRegex.test(emailLink)) {
                setError("Неверный формат почты");
                return;
            }

            await axios.post(
                `${api}/admin/save_socials`,
                {
                    socials: {
                        vk_link: vkChecked ? vkLink : "",
                        youtube_link: youtubeChecked ? youtubeLink : "",
                        email_link: emailChecked ? `mailto:${emailLink}` : "", // Добавляем mailto: перед отправкой
                    },
                },
                { withCredentials: true }
            );
            setSuccess("Настройки социальных сетей успешно сохранены");
            setError("");
        } catch (error) {
            setError(error.response.data.message);
            setSuccess("");
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div id={id} label={label}>
            {error && (
                <CAlert color="danger" dismissible onClose={() => setError("")}>
                    {error}
                </CAlert>
            )}
            {success && (
                <CAlert color="success" dismissible onClose={() => setSuccess("")}>
                    {success}
                </CAlert>
            )}
            <h3>Настройки социальных сетей</h3>
            <CForm style={{ margin: "30px 0" }}>
                <div>
                    <CFormCheck
                        type="checkbox"
                        id="vkCheckbox"
                        name="socialCheckbox"
                        value="vk"
                        checked={vkChecked}
                        onChange={(e) => setVkChecked(e.target.checked)}
                    />
                    <label htmlFor="vkCheckbox" style={{ marginLeft: "10px" }}>
                        Вконтакте
                    </label>
                    <CFormInput
                        type="text"
                        placeholder="Ссылка на Вконтакте"
                        value={vkLink}
                        onChange={(e) => setVkLink(e.target.value)}
                        style={{ marginLeft: "10px" }}
                        disabled={!vkChecked}
                    />
                </div>
                <div>
                    <CFormCheck
                        type="checkbox"
                        id="youtubeCheckbox"
                        name="socialCheckbox"
                        value="youtube"
                        checked={youtubeChecked}
                        onChange={(e) => setYoutubeChecked(e.target.checked)}
                    />
                    <label htmlFor="youtubeCheckbox" style={{ marginLeft: "10px" }}>
                        Ютуб
                    </label>
                    <CFormInput
                        type="text"
                        placeholder="Ссылка на Ютуб"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        style={{ marginLeft: "10px" }}
                        disabled={!youtubeChecked}
                    />
                </div>
                <div>
                    <CFormCheck
                        type="checkbox"
                        id="emailCheckbox"
                        name="socialCheckbox"
                        value="email"
                        checked={emailChecked}
                        onChange={(e) => setEmailChecked(e.target.checked)}
                    />
                    <label htmlFor="emailCheckbox" style={{ marginLeft: "10px" }}>
                        Почта
                    </label>
                    <CFormInput
                        type="text"
                        placeholder="Ссылка на почту"
                        value={emailLink}
                        onChange={(e) => setEmailLink(e.target.value)}
                        style={{ marginLeft: "10px" }}
                        disabled={!emailChecked}
                    />
                </div>
            </CForm>
            <CButton color="primary" onClick={handleSaveSocials}>
                Сохранить настройки
            </CButton>
        </div>
    );
};

export default SocialsEdit;