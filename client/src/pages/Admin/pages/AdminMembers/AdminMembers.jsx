import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { CSpinner } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardsMembers from "../AdminMembers/CardsMembers";
import ApiContext from "../../../../ApiContext";

const AdminMembers = () => {
    const api = useContext(ApiContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Состояние для индикатора загрузки

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${api}/members`);
                setItems(response.data);
            } catch (error) {
                toast.error("Ошибка при загрузке участников: " + error.response.data.error, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } finally {
                setIsLoading(false); // Завершаем загрузку
            }
        };

        fetchMembers();
    }, [api]);

    return (
        <>
            <div className="body flex-grow-1">
                <Button variant="info" style={{ margin: "30px" }}>
                    <Link to="/admin/members/create" style={{ textDecoration: "none", color: "white" }}>
                        Добавить участника
                    </Link>
                </Button>
                {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                        <CSpinner color="primary" />
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                        }}>
                        {items.map((item) => (
                            <CardsMembers key={item.id} item={item} />
                        ))}
                    </div>
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

export default AdminMembers;
