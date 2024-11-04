import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardImg from "react-bootstrap/CardImg";
import ApiContext from "../../../../ApiContext";

const CardsMembers = ({ item }) => {
    const api = useContext(ApiContext);
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Вы уверены что хотите удалить этого участника?");
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(`${api}/members/${item.id}`, { withCredentials: true });
            alert("Участник успешно удален");
            window.location.reload(true);
        } catch (error) {
            alert("Ошибка при удалении участника:", error);
        }
    };

    return (
        <Card
            style={{
                flex: "1 0 20%",
                margin: "10px",
                padding: "20px",
                width: "18rem",
            }}
        >
            <Card.Body>
                <Card.Title>{item.name_of_member}</Card.Title>
                <hr />
                <Card.Text>{item.description}</Card.Text>
                {item.path_to_photo !== "no img" ? (
                    <CardImg
                        variant="top"
                        src={item.path_to_photo}
                        style={{ height: "300px", width: "auto" }}
                    />
                ) : null}
                <div style={{ marginTop: "30px" }}>
                    <Link to={`/admin/members/${item.id}/edit`}>
                        <Button style={{ marginRight: "10px" }} variant="info">
                            Редактировать
                        </Button>
                    </Link>
                    <Button
                        style={{ marginRight: "10px" }}
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
export default CardsMembers;
