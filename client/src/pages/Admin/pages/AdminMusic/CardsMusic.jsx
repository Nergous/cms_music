import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/esm/CardBody";
import CardImg from "react-bootstrap/esm/CardImg";
import axios from "axios";
import { Link } from "react-router-dom";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

const CardsMusic = ({ item }) => {
    const api = useContext(ApiContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Состояние для модального окна подтверждения

    const handleDelete = async () => {
        setShowConfirmModal(true); // Открываем модальное окно подтверждения
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${api}/record/${item.id}`, { withCredentials: true });
            toast.success("Релиз успешно удален!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error("Ошибка при удалении релиза: " + error.response.data.error, {
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
                    <Card.Title>{item.record_name}</Card.Title>
                    <hr />
                    <CardBody>Дата выпуска: {item.year_of_publish}</CardBody>
                    <CardBody>Тип релиза: {item.type_of_record}</CardBody>
                    <CardImg src={item.path_to_cover} alt="Card image cap" style={{ width: "250px" }} />
                    <div style={{ marginTop: "30px" }}>
                        <Link to={`/admin/music/${item.id}/edit`}>
                            <Button style={{ marginRight: "10px", color: "white" }} variant="info">
                                Редактировать
                            </Button>
                        </Link>
                        <Button style={{ marginRight: "10px", color: "white" }} variant="danger" onClick={handleDelete}>
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
                    Вы уверены, что хотите удалить релиз <strong>{item.record_name}</strong>? Это действие нельзя отменить.
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

export default CardsMusic;
