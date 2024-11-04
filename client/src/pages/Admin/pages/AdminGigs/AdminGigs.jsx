import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import CardsGigs from "./CardsGigs";
import ApiContext from "../../../../ApiContext";

const AdminGigs = () => {
    const api = useContext(ApiContext);
    const [items, setItems] = useState([]);
    const getItems = async () => {
        try {
            const response = await axios.get(`${api}/gigs`);
            setItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <div className="body flex-grow-1">
                <Button variant="info" style={{ margin: "30px" }}>
                    <Link to="/admin/gigs/create" style={{ textDecoration: "none", color: "white" }}>
                        Создать выступление
                    </Link>
                </Button>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // margin: "20px",
                        flexWrap: "wrap",
                        // padding: "20px",
                    }}>
                    {items.map((item) => (
                        <CardsGigs key={item.id} item={item}></CardsGigs>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminGigs;
