// src/pages/Main/Main.jsx
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import HTMLReactParser from "html-react-parser/lib/index";
import CarouselMy from "../../components/Carousel/CarouselMy";
import ApiContext from "../../ApiContext";
import { loadBlockTypes } from "../../utils/loadBlockTypes";
import cl from "./Main.module.css";
import AnimatedBlock from "../../components/AnimatedBlock/AnimatedBlock";

const Main = ({ pageName }) => {
    const apiUrl = useContext(ApiContext);

    const [hasImages, setHasImages] = useState(false);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [fontColor, setFontColor] = useState("#000000");
    const [pageStructure, setPageStructure] = useState([]);
    const blockTypes = loadBlockTypes();
    const blockComponents = useRef({});

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
        fetchPageStructure();
    }, [apiUrl, pageName]);

    const renderBlock = useCallback(
        (block, index) => {
            if (Object.keys(blockTypes).length === 0) return null;
            const BlockComponent = blockTypes[block.type]?.component;
            if (BlockComponent) {
                if (!blockComponents.current[BlockComponent]) {
                    blockComponents.current[BlockComponent] = React.lazy(() => import(`../../components/Blocks/${BlockComponent}`));
                }
                const Block = blockComponents.current[BlockComponent];
                return (
                    <AnimatedBlock delay={index + 1 * 100} key={block.id}>
                        <React.Suspense fallback={<div>Загрузка...</div>}>
                            <Block id={block.id} content={block.content} />
                        </React.Suspense>
                    </AnimatedBlock>
                );
            }
            return null;
        },
        [blockTypes]
    );

    return (
        <div style={{ maxWidth: "80%", margin: "0 auto" }}>
            <div>
                {hasImages && (
                    <AnimatedBlock delay={0}>
                        <CarouselMy imgs={images} />
                    </AnimatedBlock>
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>{pageStructure.map((block, i) => renderBlock(block, i))}</div>
        </div>
    );
};

export default Main;
