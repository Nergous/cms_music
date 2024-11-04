import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import HTMLReactParser from "html-react-parser/lib/index";
import CarouselMy from "../../components/Carousel/CarouselMy";
import ApiContext from "../../ApiContext";

import cl from "./Main.module.css";

const Main = () => {
    const apiUrl = useContext(ApiContext);

    const [hasImages, setHasImages] = useState(false);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/admin/images`
                );

                setHasImages(response.data.length > 0);
                setImages(response.data);
            } catch (error) {
                
                setHasImages(false);
            }
        };

        const fetchText = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/admin/load`
                );
                setText(response.data.MainText);
            } catch (error) {
                
            }
        };

        fetchImages();
        fetchText();
    }, []);

    return (
        <>
            <div>{hasImages && <CarouselMy imgs={images} />}</div>
            <div className={cl.text}>{HTMLReactParser(text)}</div>
        </>
    );
};

export default Main;
