import React from "react";
import { CredentialsEdit, SocialsEdit } from "./SettingsComponents";

const SystemSettings = ({api}) => {
    return (
        <>
            <h1>Настройки системы</h1>
            <CredentialsEdit api={api} />
            <SocialsEdit api={api} />
        </>
    );
};

export default SystemSettings;
