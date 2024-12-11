// src/pages/Main/Main.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import HTMLReactParser from "html-react-parser/lib/index";
import CarouselMy from "../../components/Carousel/CarouselMy";
import ApiContext from "../../ApiContext";
import { loadBlockTypes } from "../../utils/loadBlockTypes";
import cl from "./Main.module.css";

const Main = ({ pageName }) => {
    const apiUrl = useContext(ApiContext);

    const [hasImages, setHasImages] = useState(false);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [fontColor, setFontColor] = useState("#000000");
    const [pageStructure, setPageStructure] = useState([]);
    const blockTypes = loadBlockTypes();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/images`);
                setHasImages(response.data.length > 0);
                setImages(response.data);
            } catch (error) {
                setHasImages(false);
            }
        };

        const fetchText = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/load`);
                setText(response.data.MainText);
            } catch (error) {}
        };

        const fetchFontColor = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/font_colors`);
                setFontColor(res.data.FontColors.mainFontColor);
            } catch (error) {
                setFontColor("#000000");
            }
        };

        const fetchPageStructure = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/load_page/${pageName}`);
                setPageStructure(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке структуры страницы:", error);
            }
        };

        fetchFontColor();
        fetchImages();
        fetchText();
        fetchPageStructure();
    }, [apiUrl, pageName]);

    const renderBlock = (block) => {
        const BlockComponent = blockTypes[block.type]?.component;
        if (BlockComponent) {
            const Block = React.lazy(() => import(`../../components/Blocks/${BlockComponent}`));
            return (
                <React.Suspense fallback={<div>Загрузка...</div>}>
                    <Block id={block.id} content={block.content} />
                </React.Suspense>
            );
        }
        return null;
    };

    return (
        <div style={{maxWidth: "80%", margin: "0 auto"}}>
            <div>{hasImages && <CarouselMy imgs={images} />}</div>
            <div style={{ color: fontColor }} className={cl.text}>{HTMLReactParser(text)}</div>
            <div style={{ display: "flex", flexDirection: "column"}}>
                {pageStructure.map((block) => (
                    <div key={block.id} style={{ marginBottom: "20px" }}>
                        {renderBlock(block)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;