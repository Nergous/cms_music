import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EditablePage from "../../../../components/EditablePages/EditablePage";
import ApiContext from "../../../../ApiContext";
import { CContainer, CRow, CCol, CButton, CAlert, CFormSelect, CSpinner } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify"; // Импортируем react-toastify
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили

const VisualEditor = () => {
    const api = useContext(ApiContext);
    const [pageStructure, setPageStructure] = useState([]);
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [selectedBlockType, setSelectedBlockType] = useState(null);
    const [selectedPage, setSelectedPage] = useState(""); // Состояние для выбранной страницы
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedPage) {
            return;
        }
        setIsLoading(true);
        axios
            .get(`${api}/admin/load_page/${selectedPage}`) // Используем выбранную страницу
            .then((response) => {
                setPageStructure(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке страницы:", error);
                toast.error("Ошибка при загрузке страницы. Пожалуйста, попробуйте позже.", {
                    position: "bottom-right",
                    autoClose: 5000, // Отображается дольше, чем сообщение об успехе
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [selectedPage, api]); // Зависим от выбранной страницы

    const handleBlockChange = (updatedBlocks) => {
        setPageStructure(updatedBlocks);
    };

    const savePageStructure = () => {
        console.log(pageStructure);
        axios
            .post(
                `${api}/admin/save_page`,
                {
                    pageName: selectedPage, // Используем выбранную страницу
                    page: pageStructure,
                },
                {
                    withCredentials: true,
                }
            )
            .then(() => {
                toast.success("Страница успешно сохранена!", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch((error) => {
                console.error("Ошибка при сохранении страницы:", error);
                toast.error("Ошибка при сохранении страницы. Пожалуйста, попробуйте позже.", {
                    position: "bottom-right",
                    autoClose: 5000, // Отображается дольше, чем сообщение об успехе
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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

    const handlePageChange = (event) => {
        setSelectedPage(event.target.value); // Обновляем выбранную страницу
    };

    return (
        <CContainer fluid>
            <CRow className="mb-4">
                <CCol>
                    <h1 style={{ marginTop: "30px" }}>Визуальный редактор для страницы {selectedPage}</h1>
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
                    <CFormSelect value={selectedPage} onChange={handlePageChange} aria-label="Выберите страницу">
                        <option value="">Выберите страницу</option>
                        <option value="main">Главная</option>
                        <option value="members">Участники</option>
                        <option value="music">Музыка</option>
                        <option value="gigs">Выступления</option>
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    {isLoading ? (
                        <CSpinner color="primary" />
                    ) : selectedPage ? (
                        <EditablePage
                            structure={pageStructure}
                            onBlockChange={handleBlockChange}
                            showAddBlock={showAddBlock}
                            setShowAddBlock={setShowAddBlock}
                            selectedBlockType={selectedBlockType}
                            setSelectedBlockType={setSelectedBlockType}
                            addBlock={addBlock}
                            handleBlockAdd={handleBlockAdd}
                            page={selectedPage} // Передаем выбранную страницу
                        />
                    ) : (
                        <CAlert color="info">Пожалуйста, выберите страницу для редактирования</CAlert>
                    )}
                </CCol>
            </CRow>
            <CRow className="mb-4">
                <CCol>
                    <CButton color="primary" onClick={savePageStructure}>
                        Сохранить страницу
                    </CButton>
                </CCol>
            </CRow>

            {/* Всплывающее окно */}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </CContainer>
    );
};

export default VisualEditor;