import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiContext from "../../../../ApiContext";

const CardsGigs = ({ item }) => {
    const api = useContext(ApiContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Состояние для модального окна

    const handleDelete = async () => {
        setShowConfirmModal(true); // Открываем модальное окно подтверждения
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${api}/gigs/${item.id}`, {
                withCredentials: true,
            });
            toast.success("Выступление успешно удалено!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            toast.error("Произошла ошибка при удалении выступления", {
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
                    <Card.Title>{item.title}</Card.Title>
                    <hr />
                    <Card.Text>
                        Место: {item.place}
                        <br />
                        Ссылка на соц. сети:{" "}
                        <a href={item.link_to_social} target="_blank" rel="noopener noreferrer">
                            {item.link_to_social}
                        </a>
                    </Card.Text>
                    <Card.Img variant="top" src={item.path_to_poster} style={{ width: "300px" }} />
                    <div style={{ marginTop: "30px" }}>
                        <Link to={`/admin/gigs/${item.id}/edit`}>
                            <Button style={{ marginRight: "10px" }} variant="info">
                                Редактировать
                            </Button>
                        </Link>
                        <Button style={{ marginRight: "10px" }} variant="danger" onClick={handleDelete}>
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
                <CModalBody>Вы уверены, что хотите удалить это выступление? Это действие нельзя отменить.</CModalBody>
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

export default CardsGigs;
