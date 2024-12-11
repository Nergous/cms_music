import React, { useState, useContext } from "react";
import ApiContext from "../../../../ApiContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardsRoles = ({ item }) => {
    const api = useContext(ApiContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Состояние для модального окна подтверждения

    const handleDelete = async () => {
        setShowConfirmModal(true); // Открываем модальное окно подтверждения
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${api}/music_roles/${item.id}`, { withCredentials: true });
            toast.success("Роль успешно удалена!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => window.location.reload(true), 3000);
        } catch (error) {
            toast.error("Ошибка при удалении роли: " + error.response.data.error, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setShowConfirmModal(false); // Закрываем модальное окно
        }
    };

    return (
        <>
            <Card
                key={item.id}
                className="flex-fill m-2 p-3"
                style={{
                    width: "18rem",
                }}>
                <Card.Body>
                    <Card.Title>{item.role_name}</Card.Title>
                    <hr />
                    <div className="mt-3">
                        <Link to={`/admin/roles/${item.id}/edit`}>
                            <Button className="m-2" variant="info">
                                Редактировать
                            </Button>
                        </Link>
                        <Button className="m-2" variant="danger" onClick={handleDelete}>
                            Удалить
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Модальное окно подтверждения удаления */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <CModalHeader onClose={() => setShowConfirmModal(false)}>
                    <CModalTitle>Подтверждение удаления</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Вы уверены, что хотите удалить роль <strong>{item.role_name}</strong>? Это действие нельзя отменить.
                </CModalBody>
                <CModalFooter>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Удалить
                    </Button>
                </CModalFooter>
            </CModal>

            {/* Всплывающее окно для уведомлений */}
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
        </>
    );
};

export default CardsRoles;
