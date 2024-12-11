import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardsMusic from "./CardsMusic";
import ApiContext from "../../../../ApiContext";

const AdminMusic = () => {
    const api = useContext(ApiContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await axios.get(`${api}/record`);
                setItems(response.data);
            } catch (error) {
                toast.error("Ошибка при загрузке музыки: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMusic();
    }, [api]);

    return (
        <>
            <div className="body flex-grow-1">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <Button variant="info" style={{ margin: "30px" }}>
                            <Link className="text-decoration-none text-light" to="/admin/music/create">
                                Создать альбом
                            </Link>
                        </Button>

                        <div className="d-flex flex-wrap justify-content-space-between">
                            {items.map((item) => (
                                <CardsMusic key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>

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

export default AdminMusic;
