import React, { useState, useEffect } from "react";
import cl from "./AnimatedBlock.module.css";

const AnimatedBlock = ({ children, delay = 0 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`${cl.block} ${visible ? cl.animateIn : cl.preload}`}>
            {children}
        </div>
    );
};

export default AnimatedBlock;