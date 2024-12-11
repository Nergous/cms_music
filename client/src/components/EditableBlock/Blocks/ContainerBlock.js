// src/components/Blocks/ContainerBlock.js
import React, { useState } from 'react';
import BlockInterface from '../BlockInterface';
import { CRow, CCol, CButton } from '@coreui/react';
import Sidebar from '../../Sidebar/Sidebar'; // Импортируем компонент Sidebar
import blocks from '../../EditableBlock/Blocks'; // Импортируем объект блоков

class ContainerBlock extends BlockInterface {
    render({ edit: editBlock, delete: deleteBlock }) {
        return <ContainerBlockComponent id={this.id} content={this.content} onEdit={editBlock} onDelete={deleteBlock} />;
    }
}

const ContainerBlockComponent = ({ id, content, onEdit, onDelete }) => {
    const [blocksState, setBlocksState] = useState(content || []);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);

    const handleAddBlock = (index) => {
        setSelectedBlockIndex(index);
        setShowSidebar(true);
    };

    const handleBlockSelect = (blockType) => {
        const newBlock = { id: Date.now(), type: blockType, content: '' }; // Пример нового блока
        const newBlocks = [...blocksState];
        newBlocks.splice(selectedBlockIndex, 0, newBlock);
        setBlocksState(newBlocks);
        onEdit(id, newBlocks);
        setShowSidebar(false);
    };

    const handleDeleteBlock = (blockId) => {
        const newBlocks = blocksState.filter(block => block.id !== blockId);
        setBlocksState(newBlocks);
        onEdit(id, newBlocks);
    };

    const handleChildBlockEdit = (childBlockId, newContent) => {
        const newBlocks = blocksState.map(block => {
            if (block.id === childBlockId) {
                return { ...block, content: newContent };
            }
            return block;
        });
        setBlocksState(newBlocks);
        onEdit(id, newBlocks);
    };

    const renderBlock = (block) => {
        const BlockComponent = blocks[block.type];
        if (BlockComponent) {
            return new BlockComponent(block.id, block.type, block.content).render({
                edit: handleChildBlockEdit,
                delete: handleDeleteBlock,
            });
        }
        return null;
    };

    return (
        <CRow>
            <CCol>
                <div className="border p-3">
                    <CRow>
                        {blocksState.map((block, index) => (
                            <CCol key={block.id} xs={6}>
                                {renderBlock(block)}
                            </CCol>
                        ))}
                        {blocksState.length < 2 && (
                            <CCol xs={6}>
                                <CButton color="success" onClick={() => handleAddBlock(blocksState.length)}>+</CButton>
                            </CCol>
                        )}
                    </CRow>
                    <div className="mt-3">
                        <CButton color="secondary" onClick={() => onDelete(id)}>Удалить контейнер</CButton>
                    </div>
                </div>
                <Sidebar
                    show={showSidebar}
                    onClose={() => setShowSidebar(false)}
                    onSelectBlock={handleBlockSelect}
                    currentBlockType="ContainerBlock"
                />
            </CCol>
        </CRow>
    );
};

export default ContainerBlock;