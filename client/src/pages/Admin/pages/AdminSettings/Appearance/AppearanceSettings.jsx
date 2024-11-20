import React, { forwardRef } from "react";
import { LogoEdit, CarouselEdit, MainText, FooterEdit, FontEdit, ColorEdit, FontColorEdit, IconColorEdit, NavbarEdit } from "./SettingsComponents";

const AppeareanceSettings = forwardRef(({ api }, ref) => {
    return (
        <div ref={ref}>
            <h1 style={{ marginTop: "30px" }}>Настройки внешнего вида</h1>
            <MainText id="mainText" label="Главный текст" api={api} />
            <FooterEdit id="footerEdit" label="Подвал" api={api} />
            <CarouselEdit id="carouselEdit" label="Фото-Карусель" api={api} />
            <LogoEdit id="logoEdit" label="Логотип" api={api} />
            <FontEdit id="fontEdit" label="Шрифт" api={api} />
            <ColorEdit id="colorEdit" label="Цвета" api={api} />
            <FontColorEdit id="fontColorEdit" label="Цвета шрифта" api={api} />
            <IconColorEdit id="iconColorEdit" label="Цвета иконок" api={api} />
            <NavbarEdit id="navbarEdit" label="Вид навигационной панели" api={api} />
        </div>
    );
});

export default AppeareanceSettings;
