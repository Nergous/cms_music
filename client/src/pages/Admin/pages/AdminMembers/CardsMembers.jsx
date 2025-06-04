import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

const CardsMembers = ({ item }) => {
    const api = useContext(ApiContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Состояние для модального окна подтверждения

    const handleDelete = async () => {
        setShowConfirmModal(true); // Открываем модальное окно подтверждения
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${api}/members/${item.id}`, { withCredentials: true });
            toast.success("Участник успешно удален!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Ошибка при удалении участника: " + error.response.data.error, {
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
                style={{
                    flex: "1 0 20%",
                    margin: "10px",
                    padding: "20px",
                    width: "18rem",
                }}>
                <Card.Body>
                    <Card.Title>{item.name_of_member}</Card.Title>
                    <hr />
                    <Card.Text>{item.description}</Card.Text>
                    {item.path_to_photo !== "no img" ? (
                        <CardImg variant="top" src={item.path_to_photo} style={{ height: "300px", width: "auto" }} />
                    ) : null}
                    <div style={{ marginTop: "30px" }}>
                        <Link to={`/admin/members/${item.id}/edit`}>
                            <Button style={{ marginRight: "10px", color: "white", width: "100%" }} variant="info">
                                Редактировать
                            </Button>
                        </Link>
                        <Button style={{ marginRight: "10px", marginTop: "10px", color: "white", width: "100%" }} variant="danger" onClick={handleDelete}>
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
                    Вы уверены, что хотите удалить участника <strong>{item.name_of_member}</strong>? Это действие нельзя отменить.
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

export default CardsMembers;
