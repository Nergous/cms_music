import React, { useEffect, useState } from "react";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import CardsRoles from "./CardsRoles";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";
import { CAlert } from "@coreui/react";

const AdminRoles = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("/api/music_roles")
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                setError(error.message || "Произошла ошибка");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />

                {isLoading ? (
                    <>
                        <div
                            className="body flex-grow-1 d-flex align-items-center justify-content-center h-100"
                        >
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                        </div>
                    </>
                ) : error ? (
                    <CAlert color="danger" className="m-3">
                        {error}
                    </CAlert>
                ) : (
                    <>
                        <div className="body flex-grow-1">
                                    <Button
                                        variant="info"
                                        style={{ margin: "30px" }} 
                                    >
                                        <Link
                                            to="/admin/roles/create"
                                            className="text-decoration-none text-white"
                                        >
                                            Создать роль
                                        </Link>
                                    </Button>
                            <div
                                className="d-flex align-items-center flex-wrap justify-content-space-between"
                                
                            >
                                {items.map((item) => (
                                    <CardsRoles
                                        key={item.id}
                                        item={item}
                                    ></CardsRoles>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <AppFooter />
            </div>
        </>
    );
};

export default AdminRoles;
