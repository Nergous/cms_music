// src/components/Sidebar/Sidebar.js
import React, { useState, useEffect } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import blocks from "../EditableBlock/Blocks";
import './Sidebar.css'; // Импортируем CSS для анимаций

const Sidebar = ({ show, onClose, onSelectBlock }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (show) {
            setIsAnimating(true);
        }
    }, [show]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => onClose(), 300); // Ждем завершения анимации
    };

    if (!show && !isAnimating) return null;

    const blockTypes = Object.keys(blocks).map((key) => ({
        type: key,
        label: blocks[key].label || key,
    }));

    return (
        <CModal
            visible={show || isAnimating}
            onClose={handleClose}
            size="lg"
            alignment="center"
            className={isAnimating ? 'modal-fade-in' : 'modal-fade-out'} // Добавляем классы для анимаций
        >
            <CModalHeader onClose={handleClose}>
                <CModalTitle>Выберите тип блока</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {blockTypes.map((block) => (
                    <CButton
                        key={block.type}
                        color="primary"
                        className="m-2"
                        onClick={() => onSelectBlock(block.type)}
                    >
                        {block.label}
                    </CButton>
                ))}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>
                    Закрыть
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default Sidebar;