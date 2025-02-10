import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { LogoEdit, CarouselEdit, FooterEdit, FontEdit, ColorEdit, FontColorEdit, IconColorEdit, NavbarEdit, MusicEdit } from "./SettingsComponents";
import { CButton } from "@coreui/react";

const AppeareanceSettings = forwardRef(({ api }, ref) => {
    return (
        <div ref={ref}>
            <h1 style={{ marginTop: "30px" }}>Настройки внешнего вида</h1>
            <h2 style={{ marginTop: "30px" }}></h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/admin/editor">
                    <CButton color="primary" style={{ width: "1000px" }}>
                        Визуальный редактор
                    </CButton>
                </Link>
            </div>

            <FooterEdit id="footerEdit" label="Подвал" api={api} />
            <CarouselEdit id="carouselEdit" label="Фото-Карусель" api={api} />
            <LogoEdit id="logoEdit" label="Логотип" api={api} />
            <FontEdit id="fontEdit" label="Шрифт" api={api} />
            <ColorEdit id="colorEdit" label="Цвета" api={api} />
            <FontColorEdit id="fontColorEdit" label="Цвета шрифта" api={api} />
            <IconColorEdit id="iconColorEdit" label="Цвета иконок" api={api} />
            <NavbarEdit id="navbarEdit" label="Вид навигационной панели" api={api} />
            <MusicEdit id="musicEdit" label="Вид карточки музыки" api={api} />
        </div>
    );
});

export default AppeareanceSettings;
