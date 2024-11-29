// src/components/VisualEditor/VisualEditor.js
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EditableMain from "../../../../components/EditablePages/EditableMain";
import ApiContext from "../../../../ApiContext";
import { CContainer, CRow, CCol, CButton, CAlert } from '@coreui/react';

const VisualEditor = ({ page }) => {
    const api = useContext(ApiContext);
    const [pageStructure, setPageStructure] = useState([]);
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [selectedBlockType, setSelectedBlockType] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        axios
            .get(`${api}/admin/load_page/${page}`)
            .then((response) => {
                setPageStructure(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке страницы:", error);
            });
    }, [page, api]);

    const handleBlockChange = (updatedBlocks) => {
        setPageStructure(updatedBlocks);
    };

    const savePageStructure = () => {
        axios
            .post(
                `${api}/admin/save_page`,
                {
                    pageName: page,
                    page: pageStructure,
                },
                {
                    withCredentials: true,
                }
            )
            .then(() => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            })
            .catch((error) => {
                console.error("Ошибка при сохранении страницы:", error);
            });
    };

    const addBlock = (blockType) => {
        setSelectedBlockType(blockType);
        setShowAddBlock(true);
    };

    const handleBlockAdd = (newBlock) => {
        setPageStructure([...pageStructure, newBlock]);
        setShowAddBlock(false);
        setSelectedBlockType(null);
    };

    return (
        <CContainer fluid>
            <CRow className="mb-4">
                <CCol>
                    <h1 style={{ marginTop: "30px" }}>Визуальный редактор для страницы {page}</h1>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <Link to="/admin/settings">
                        <CButton color="secondary">Назад</CButton>
                    </Link>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <EditableMain
                        structure={pageStructure}
                        onBlockChange={handleBlockChange}
                        showAddBlock={showAddBlock}
                        setShowAddBlock={setShowAddBlock}
                        selectedBlockType={selectedBlockType}
                        setSelectedBlockType={setSelectedBlockType}
                        addBlock={addBlock}
                        handleBlockAdd={handleBlockAdd}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CButton color="primary" onClick={savePageStructure}>
                        Сохранить страницу
                    </CButton>
                </CCol>
            </CRow>
            {saveSuccess && (
                <CRow>
                    <CCol>
                        <CAlert color="success">Страница успешно сохранена</CAlert>
                    </CCol>
                </CRow>
            )}
        </CContainer>
    );
};

export default VisualEditor;