import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import CardsMusic from "./CardsMusic";
import Spinner from "react-bootstrap/Spinner";
import { CAlert } from "@coreui/react";
import ApiContext from "../../../../ApiContext";

const AdminMusic = () => {
    const api = useContext(ApiContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${api}/record`)
            .then((response) => {
                setItems(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    return (
        <>
            <div className="body flex-grow-1">
                {error && (
                    <CAlert color="danger">
                        Произошла ошибка: {error.message}
                    </CAlert>
                )}
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner
                            animation="border"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <Button
                            variant="info"
                            style={{ margin: "30px" }}>
                            <Link
                                className="text-decoration-none text-light"
                                to="/admin/music/create">
                                Создать альбом
                            </Link>
                        </Button>

                        <div className="d-flex flex-wrap justify-content-space-between">
                            {items.map((item) => (
                                <CardsMusic
                                    key={item.id}
                                    item={item}></CardsMusic>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AdminMusic;
