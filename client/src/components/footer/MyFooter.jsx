import React from "react";
import cl from "./MyFooter.module.css";

const MyFooter = () => {
    return (
        <footer className={cl.footer}>
            <div className={cl.footer_text_left}>
                Сделано на основе CMS_for_musician by{" "}
                <a href="https://github.com/Nergous">Nergous</a>
            </div>
            <div className={cl.footer_text_right}>2024</div>
        </footer>
    );
};

export default MyFooter;
