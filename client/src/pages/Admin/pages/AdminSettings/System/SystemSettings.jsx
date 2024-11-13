import React, { forwardRef } from "react";
import { CredentialsEdit, SocialsEdit, FaviconEdit, DescriptionEdit, TitleEdit } from "./SettingsComponents";

const SystemSettings = forwardRef(({ api }, ref) => {
    return (
        <div ref={ref}>
            <h1 style={{ marginTop: "30px" }}>Настройки системы</h1>
            <CredentialsEdit id="credentialsEdit" label="Учетные данные" api={api} />
            <SocialsEdit id="socialsEdit" label="Социальные сети" api={api} />
            <FaviconEdit id="faviconEdit" label="Фавикон" api={api} />
            <DescriptionEdit id="descriptionEdit" label="Описание страницы (мета тег)" api={api} />
            <TitleEdit id="titleEdit" label="Заголовок сайта" api={api} />
        </div>
    );
});

export default SystemSettings;