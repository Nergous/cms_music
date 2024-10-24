import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";

const CardsRoles = ({ item }) => {
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Вы уверены что хотите удалить эту роль?"
        );
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`/api/music_roles/${item.id}`, {
                withCredentials: true,
            });
            alert("Роль успешно удалена");
            window.location.reload(true);
        } catch (error) {
            console.error("Ошибка при удалении роли:", error);
        }
    };

    return (
        <Card
            key={item.id}
            className="flex-fill m-2 p-3"
            style={{
                width: "18rem",
            }}
        >
            <Card.Body>
                <Card.Title>{item.role_name}</Card.Title>
                <hr />
                <div className="mt-3">
                    <Link to={`/admin/roles/${item.id}/edit`}>
                        <Button className="m-2" variant="info">
                            Редактировать
                        </Button>
                    </Link>
                    <Button
                        className="m-2"
                        variant="danger"
                        onClick={handleDelete}
                    >
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};
export default CardsRoles;
