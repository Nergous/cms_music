import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ApiContext from "../../../../ApiContext";

const CardsGigs = ({ item }) => {
    const api = useContext(ApiContext);
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Вы уверены что хотите удалить этот gig?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(`${api}/gigs/${item.id}`, {
                withCredentials: true,
            });
            alert("Выступление успешно удалено");
            window.location.reload();
        } catch (error) {
            alert("Произошла ошибка при удалении выступления");
        }
    };
    return (
        <Card
            style={{
                flex: "1 0 20%",
                margin: "10px",
                padding: "20px",
                width: "18rem",
            }}>
            <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <hr></hr>
                <Card.Text>
                    Место: {item.place}
                    <br />
                    Ссылка на соц. сети:{" "}
                    <a href={item.link_to_social}>{item.link_to_social}</a>
                </Card.Text>
                <Card.Img
                    variant="top"
                    src={item.path_to_poster}
                    style={{ width: "300px" }}
                />
                <div style={{ marginTop: "30px" }}>
                    <Link to={`/admin/gigs/${item.id}/edit`}>
                        <Button
                            style={{ marginRight: "10px" }}
                            variant="info">
                            Редактировать
                        </Button>
                    </Link>
                    <Button
                        style={{ marginRight: "10px" }}
                        variant="danger"
                        onClick={handleDelete}>
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardsGigs;
