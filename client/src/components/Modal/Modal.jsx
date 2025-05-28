import React from "react";
import cl from "./Modal.module.css";
import CloseButton from "react-bootstrap/esm/CloseButton";

const MyModal = ({ children, visible, setVisible }) => {

    
    const rootClasses = [cl.myModal];
    if (visible) {
        rootClasses.push(cl.active);
    }
    return (
        <>
            <div
                className={rootClasses.join(" ")}
                onClick={() => setVisible(false)}
            >
                <div
                    className={cl.myModalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CloseButton onClick={() => setVisible(false)} style={{ paddingLeft: "20px", paddingTop: "20px" }} />
                    {children}
                </div>
            </div>
        </>
    );
};

export default MyModal;
