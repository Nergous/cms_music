import React, { useEffect, useState, useContext } from "react";
import CardsRoles from "./CardsRoles";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";
import ApiContext from "../../../../ApiContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRoles = () => {
    const api = useContext(ApiContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${api}/music_roles`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                toast.error("Ошибка при загрузке ролей: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [api]);

    return (
        <>
            <div className="body flex-grow-1">
                {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <Button variant="info" style={{ margin: "30px" }}>
                            <Link to="/admin/roles/create" className="text-decoration-none text-white">
                                Создать роль
                            </Link>
                        </Button>
                        <div className="d-flex align-items-center flex-wrap justify-content-space-between">
                            {items.map((item) => (
                                <CardsRoles key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
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

export default AdminRoles;
