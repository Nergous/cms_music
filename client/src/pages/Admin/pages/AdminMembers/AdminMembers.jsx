import React, { useEffect, useState, useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { AppSidebar, AppFooter, AppHeader } from "../../components";
import CardsMembers from "../AdminMembers/CardsMembers";
import EditMembers from "../AdminMembers/EditMembers";
import ApiContext from "../../../../ApiContext";

const AdminMembers = () => {
    const api = useContext(ApiContext)
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`${api}/members`).then((response) => {
            setItems(response.data);
        });
    }, []);

    return (
        <>

                <div className="body flex-grow-1">
                    <Button variant="info" style={{ margin: "30px" }}>
                        <Link to="/admin/members/create" style={{ textDecoration: "none", color: "white" }}> Добавить участника </Link>
                    </Button>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            // margin: "20px",
                            flexWrap: "wrap",
                            // padding: "20px",
                        }}
                    >
                        {items.map((item) => (
                            <CardsMembers
                                key={item.id}
                                item={item}
                            ></CardsMembers>
                        ))}
                    </div>
                </div>
        </>
    );
};

export default AdminMembers;
