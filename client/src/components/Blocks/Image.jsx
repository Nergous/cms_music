import React from "react";

const Image = ({ content }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={content.image} alt={content.alt} style={{ display: "block", width: content.width + "%", height: content.height + "%" }} />
        </div>
    );
};

export default Image;
