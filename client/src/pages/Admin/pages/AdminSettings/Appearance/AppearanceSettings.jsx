import React, { useContext } from "react";
import { LogoEdit, CarouselEdit, MainText, FooterEdit } from "./SettingsComponents";


const AppeareanceSettings = ({api}) => {
    return (
        <>
            <h1>Настройки внешнего вида</h1>
            <MainText api={api} />
            <FooterEdit api={api} />
            <CarouselEdit api={api} />
            <LogoEdit api={api} />
        </>
    );
};

export default AppeareanceSettings;