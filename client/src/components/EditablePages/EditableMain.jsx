// src/components/EditablePages/EditableMain.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ApiContext from "../../ApiContext";
import MyHeader from "../../components/header/MyHeader";
import MyFooter from "../../components/footer/MyFooter";
import Sidebar from "../Sidebar/Sidebar";
import blocks from "../EditableBlock/Blocks";

const EditableMain = ({
    structure,
    onBlockChange,
    showAddBlock,
    setShowAddBlock,
    selectedBlockType,
    setSelectedBlockType,
    addBlock,
    handleBlockAdd,
}) => {
    const apiUrl = useContext(ApiContext);

    const [hasImages, setHasImages] = useState(false);
    const [images, setImages] = useState([]);
    const [text, setText] = useState("");
    const [fontColor, setFontColor] = useState("#000000");
    const [color, setColor] = useState("#FFFFFF");
    const [editableBlocks, setEditableBlocks] = useState(structure);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchImages = async () => {
                    const response = await axios.get(`${apiUrl}/admin/images`);
                    setHasImages(response.data.length > 0);
                    setImages(response.data);
                };

                const fetchText = async () => {
                    const response = await axios.get(`${apiUrl}/admin/load`);
                    setText(response.data.MainText);
                };

                const fetchFontColor = async () => {
                    const res = await axios.get(`${apiUrl}/admin/font_colors`);
                    setFontColor(res.data.FontColors.mainFontColor);
                };

                const fetchColor = async () => {
                    const response = await axios.get(`${apiUrl}/admin/colors`);
                    setColor(response.data.Colors.backgroundColor);
                };

                await Promise.all([fetchImages(), fetchText(), fetchFontColor(), fetchColor()]);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    useEffect(() => {
        setEditableBlocks(structure);
    }, [structure]);

    const handleBlockChange = (updatedBlocks) => {
        setEditableBlocks(updatedBlocks);
        onBlockChange(updatedBlocks);
    };

    const deleteBlock = (blockId) => {
        handleBlockChange(editableBlocks.filter((block) => block.id !== blockId));
    };

    const editBlock = (blockId, newContent) => {
        handleBlockChange(editableBlocks.map((block) => (block.id === blockId ? { ...block, content: newContent } : block)));
    };

    const addNewBlock = (blockType) => {
        const newBlock = {
            id: Date.now(),
            type: blockType,
            content: "",
        };
        setEditableBlocks([...editableBlocks, newBlock]);
        handleBlockAdd(newBlock); // Сохраняем новый блок в pageStructure
        setShowAddBlock(false);
        setSelectedBlockType(blockType);
    };

    const renderBlock = (block) => {
        const BlockComponent = blocks[block.type];
        if (BlockComponent) {
            return new BlockComponent(block.id, block.type, block.content).render({
                edit: editBlock,
                delete: deleteBlock,
            });
        }
        return null;
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <MyHeader />
            <div style={{ backgroundColor: color, color: fontColor }} className="main__part">
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "800px", margin: "0 auto" }}>
                    {editableBlocks.map((block) => (
                        <div key={block.id} style={{ marginBottom: "20px" }}>{renderBlock(block)}</div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <button onClick={() => setShowAddBlock(!showAddBlock)}>+</button>
                </div>
                <Sidebar show={showAddBlock} onClose={() => setShowAddBlock(false)} onSelectBlock={addNewBlock} />
            </div>
            <MyFooter />
        </>
    );
};

export default EditableMain;